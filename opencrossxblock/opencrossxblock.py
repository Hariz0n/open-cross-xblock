"""TO-DO: Write a description of what this XBlock is."""

from importlib.resources import files
from typing import TypedDict
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblock.fields import Integer, Scope, String, List
try: # pylint: disable=ungrouped-imports
    from xblock.utils.resources import ResourceLoader  # pylint: disable=ungrouped-imports
except ModuleNotFoundError:  # For backward compatibility with releases older than Quince.
    from xblockutils.resources import ResourceLoader


class QuestionType(TypedDict):
    question: str
    answer: str
    x: int
    y: int
    length: int


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
class OpenCrossXBlock(XBlock):
    loader = ResourceLoader(__name__)

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

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def get_data(self, data, suffix=''):
        return {}

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
