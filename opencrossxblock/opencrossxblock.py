"""TO-DO: Write a description of what this XBlock is."""

from importlib.resources import files
from typing import TypedDict
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblock.fields import Integer, Scope, String, List, Float, Dict
try: # pylint: disable=ungrouped-imports
    from xblock.utils.resources import ResourceLoader  # pylint: disable=ungrouped-imports
except ModuleNotFoundError:  # For backward compatibility with releases older than Quince.
    from xblockutils.resources import ResourceLoader
from xblock.scorable import ScorableXBlockMixin, Score
from xblock.utils.studio_editable import StudioEditableXBlockMixin
from xblock.exceptions import JsonHandlerError


class QuestionType(TypedDict):
    question: str
    answer: str
    x: int
    y: int
    length: int
    max_attempts: int | None
    # TODO: remove
    attempts: int
    isCorrect: bool | None
    value: str | None


DEFAULT_HORIZONTAL = [
    QuestionType(
        question='Question one',
        answer='123',
        x=0,
        y=0,
        length=3,
        max_attempts=10
    ),
    QuestionType(
        question='Question two',
        answer='123',
        x=1,
        y=2,
        length=3,
        max_attempts=9
    ),
    QuestionType(
        question='Question three',
        answer='123',
        x=2,
        y=4,
        length=3,
        max_attempts=8
    )
]

DEFAULT_VERTICAL = [
    QuestionType(
        question='Question one',
        answer='231',
        x=1,
        y=0,
        length=3
    ),
    QuestionType(
        question='Question two',
        answer='231',
        x=2,
        y=2,
        length=3
    )
]

DEFAULT_PREV_ANSWERS = {
    'horizontal': {},
    'vertical': {}
}


@XBlock.needs('settings')
@XBlock.needs('i18n')
@XBlock.needs('user')
class OpenCrossXBlock(ScorableXBlockMixin, StudioEditableXBlockMixin, XBlock):
    loader = ResourceLoader(__name__)

    # Настройка блока

    display_name = String(
        display_name="Название блока",
        scope=Scope.settings,
        default="Open Cross XBlock",
        enforce_type=True,
    )

    weight = Float(
        display_name="Максимальное количество баллов",
        default=10.0,
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
        correct = 0
        total = len(self.vertical_questions) + len(self.horizontal_questions)
        
        print(self.previous_answers)

        for iq1, iq in enumerate(self.vertical_questions):
            prev_answer_q1 = (self.previous_answers['vertical'] or {}).get(str(iq1), {})
            
            if prev_answer_q1.get('isCorrect', False) == True:
                print('ver', iq1)
                correct += 1

        for iq2, q2 in enumerate(self.horizontal_questions):
            prev_answer_q2 = (self.previous_answers['horizontal'] or {}).get(str(iq2), {})

            if prev_answer_q2.get('isCorrect', False) == True:
                correct += 1

        print(correct, total)

        score = Score(raw_earned=(correct / float(total)) * self.weight, raw_possible=self.weight)
        self.set_score(score)

        return score

    # Настройки задания

    title = String(display_name='Заголовок', scope=Scope.content, default='Задание')
    description = String(display_name='Описание', scope=Scope.content, default='Описание')

    horizontal_questions = List(display_name='Вопросы по горизонтали', scope=Scope.content, default=DEFAULT_HORIZONTAL)
    vertical_questions = List(display_name='Вопросы по вертикали', scope=Scope.content, default=DEFAULT_VERTICAL)

    previous_answers = Dict(display_name='Последние ответы', scope=Scope.user_state, default=DEFAULT_PREV_ANSWERS)

    editable_fields = ('title', 'description', 'horizontal_questions', 'vertical_questions', 'weight')

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
    
    def getFilteredQuestions(self, questions, isHorizontal=None):
        result = []
        prev_answers = self.previous_answers['horizontal' if isHorizontal == True else 'vertical']

        for index, question in enumerate(questions):
            prev_answer = prev_answers.get(str(index))
            qstn = dict(question)
            qstn.pop('answer')

            if prev_answer is not None:
                qstn['attempts'] = prev_answer['attempts']
                qstn['isCorrect'] = prev_answer['isCorrect']
                qstn['value'] = prev_answer['value']

            result.append(qstn)

        return result

    @XBlock.json_handler
    def getTask(self, data, suffix=''):
        return {
            'title': self.title,
            'description': self.description,
            'vertical': self.getFilteredQuestions(self.vertical_questions),
            'horizontal': self.getFilteredQuestions(self.horizontal_questions, True),
        }
    
    @XBlock.json_handler
    def check(self, data, suffix=''):
        isHorizontal = data['isHorizontal'] == True

        questions = self.horizontal_questions if isHorizontal else self.vertical_questions
        question = questions[data['index']] or {}
        max_attempts = question.get('max_attempts', 0)

        previous_answers = self.previous_answers['horizontal' if isHorizontal else 'vertical']
        previous_answer = previous_answers.get(str(data['index']), {})

        isCorrect = question['answer'] == data['value']
        attempts = previous_answer.get('attempts', 0)

        if max_attempts != 0 and attempts >= max_attempts:
            raise JsonHandlerError(403, 'Max attempts exceeded')

        attempts += 1

        previous_answers[str(data['index'])] = {
            'isCorrect': isCorrect,
            'value': data['value'],
            'attempts': attempts
        }

        self.rescore(only_if_higher=False)

        return {
            'isCorrect': isCorrect,
            'attempts': attempts,
            'score': self.get_score()
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
