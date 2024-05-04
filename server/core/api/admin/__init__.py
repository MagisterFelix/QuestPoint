from django.contrib import admin
from django.contrib.auth.models import Group

from .achievement import AchievementAdmin
from .category import CategoryAdmin
from .feedback import FeedbackAdmin
from .message import MessageAdmin
from .quest import QuestAdmin
from .record import RecordAdmin
from .transaction import TransactionAdmin
from .trophy import TrophyAdmin
from .user import UserAdmin

admin.site.unregister(Group)
