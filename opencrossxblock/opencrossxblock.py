"""TO-DO: Write a description of what this XBlock is."""

from importlib.resources import files
from typing import TypedDict
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblock.fields import Integer, Scope, String, List, Float
try: # pylint: disable=ungrouped-imports
    from xblock.utils.resources import ResourceLoader  # pylint: disable=ungrouped-imports
except ModuleNotFoundError:  # For backward compatibility with releases older than Quince.
    from xblockutils.resources import ResourceLoader
from xblock.scorable import ScorableXBlockMixin, Score
from xblock.utils.studio_editable import StudioEditableXBlockMixin


class QuestionType(TypedDict):
    question: str
    answer: str
    x: int
    y: int
    length: int
    attempts: int
    max_attempts: int | None
    isCorrect: bool | None
    value: str | None


DEFAULT_HORIZONTAL = [
    QuestionType(
        question='Question one',
        answer='1',
        x=0,
        y=0,
        length=3
    ),
    QuestionType(
        question='Question two',
        answer='2',
        x=1,
        y=2,
        length=3
    ),
    QuestionType(
        question='Question three',
        answer='3',
        x=2,
        y=4,
        length=3
    )
]

DEFAULT_VERTICAL = [
    QuestionType(
        question='Question one',
        answer='1',
        x=1,
        y=0,
        length=3
    ),
    QuestionType(
        question='Question two',
        answer='2',
        x=2,
        y=2,
        length=3
    )
]


@XBlock.needs('settings')
@XBlock.needs('i18n')
@XBlock.needs('user')
class OpenCrossXBlock(ScorableXBlockMixin, StudioEditableXBlockMixin, XBlock):
    loader = ResourceLoader(__name__)

    # Настройка блока

    display_name = String(
        display_name="Название блока",
        scope=Scope.settings,
        default="Open DND XBlock",
        enforce_type=True,
    )

    weight = Float(
        display_name="Максимальное количество баллов",
        default=1.0,
        scope=Scope.settings,
        values={"min": 0},
    )

    score = Float(
        display_name="Rоличество баллов",
        default=0.0,
        scope=Scope.user_state,
        values={"min": 0},
    )

    has_score = True
    icon_class = 'problem'

    def has_submitted_answer(self):
        return True

    def max_score(self):
        return self.weight

    def get_score(self):
        return Score(raw_earned=self.score, raw_possible=self.weight)

    def set_score(self, score):
        self.score = score.raw_earned

    def calculate_score(self):
        correct = 0;
        total = len(self.vertical_questions) + len(self.horizontal_questions)

        for q1 in self.vertical_questions:
            if q1.get('isCorrect', False) == True:
                correct += 1

        for q2 in self.horizontal_questions:
            if q1.get('isCorrect', False) == True:
                correct += 1

        score = (correct / float(total)) * self.weight;


        return Score(raw_earned=self.score, raw_possible=self.weight)

    # Настройки задания

    title = String(display_name='Заголовок', scope=Scope.content, default='Задание')
    description = String(display_name='Описание', scope=Scope.content, default='Описание')

    horizontal_questions = List(display_name='Вопросы по горизонтали', scope=Scope.content, default=DEFAULT_HORIZONTAL)
    vertical_questions = List(display_name='Вопросы по вертикали', scope=Scope.content, default=DEFAULT_VERTICAL)

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        return files(__package__).joinpath(path).read_text(encoding="utf-8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the OpenDNDXBlock, shown to students
        when viewing courses.
        """
        fragment = Fragment()
        fragment.add_content(self.loader.render_django_template("static/html/opencrossxblock.html", context={
            "self": self,
            "script": self.resource_string("static/js/src/index.js"),
            "styles": self.resource_string("static/css/styles.css")
        }))
        fragment.add_javascript(self.resource_string("static/js/src/init.js"))
        fragment.initialize_js('OpenCrossXBlock')
        return fragment
    
    def getFilteredQuestions(self, questions):
        result = []

        for question in questions:
            qstn = dict(question)
            qstn.pop('answer')
            result.append(qstn)

        return result

    @XBlock.json_handler
    def getTask(self, data, suffix=''):
        return {
            'title': self.title,
            'description': self.description,
            'vertical': self.getFilteredQuestions(self.vertical_questions),
            'horizontal': self.getFilteredQuestions(self.horizontal_questions),
        }
    
    @XBlock.json_handler
    def check(self, data, suffix=''):
        questions = self.horizontal_questions if data['isHorizontal'] else self.vertical_questions

        answer = questions[data['index']]['answer']
        isCorrect = answer == data['value']
        questions[data['index']]['isCorrect'] = isCorrect
        questions[data['index']]['value'] = data['value']
        questions[data['index']]['attempts'] = (questions[data['index']].get('attempts', 0)) + 1

        self.rescore(only_if_higher=False)

        return {
            'isCorrect': isCorrect,
            'attempts': questions[data['index']]['attempts']
        }

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("OpenCrossXBlock",
             """<opencrossxblock/>
             """),
            ("Multiple OpenCrossXBlock",
             """<vertical_demo>
                <opencrossxblock/>
                <opencrossxblock/>
                <opencrossxblock/>
                </vertical_demo>
             """),
        ]
