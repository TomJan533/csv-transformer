import os

from api.settings import INSTALLED_APPS

from ..settings import *

ROOT_URLCONF = "api.urls"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "csvdb",
        "USER": "csvuser",
        "PASSWORD": "csvpassword",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

DEBUG = False

MIGRATION_MODULES = {app: None for app in INSTALLED_APPS}

KAFKA_BROKER_URL = os.environ.get("KAFKA_BROKER_URL", "kafka:9092")
