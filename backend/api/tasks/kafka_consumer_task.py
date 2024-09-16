import logging

from celery import shared_task

from api.kafka_utils.consumer import consume_logs, init_kafka_consumer_celery

logger = logging.getLogger(__name__)

from api.models import UserActionLog


@shared_task(bind=True)
def run_kafka_consumer(self):
    consumer = init_kafka_consumer_celery()
    consume_logs
    while True:
        for message in consumer:
            log_data = message.value
            # Process the message (you can add any necessary logic here)
            logger.info(f"Consumed message in Celery: {log_data}")
            obj = UserActionLog.objects.create(action="test")
            # obj = UserActionLog.objects.create(action=log_data['action'])
            logger.info(f"Created object in db: {obj}")
