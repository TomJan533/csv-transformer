from __future__ import absolute_import, unicode_literals

import os

from celery import Celery
from celery.signals import worker_ready
from django.apps import apps

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "api.settings")
app = Celery("api")
app.config_from_object("django.conf:settings", namespace="CELERY")

# Ensure tasks are loaded after the Django apps are ready
app.autodiscover_tasks(lambda: [n.name for n in apps.get_app_configs()])


# Trigger Kafka consumer task when Celery worker is ready
@worker_ready.connect
def at_start(sender, **kwargs):
    # Automatically trigger Kafka consumer task when worker starts
    sender.app.send_task("api.tasks.kafka_consumer_task.run_kafka_consumer")
