from api.settings import INSTALLED_APPS

from ..settings import *

ROOT_URLCONF = "api.urls"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

DEBUG = False

MIGRATION_MODULES = {app: None for app in INSTALLED_APPS}
