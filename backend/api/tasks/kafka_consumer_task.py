import logging

from celery import shared_task

from api.kafka_utils.consumer import get_celery_consumer

logger = logging.getLogger(__name__)

import json

from api.models import UserActionLog


@shared_task(bind=True)
def run_kafka_consumer(self):
    consumer_wrapper = get_celery_consumer()
    consumer = consumer_wrapper.consume()
    while True:
        for message in consumer:
            log_data = message.value
            try:
                log_data = json.loads(log_data)
                logger.info(f"Consumed message in Celery: {log_data}")

                # Proceed only if log_data is a dictionary
                if isinstance(log_data, dict):
                    obj = UserActionLog.objects.create(
                        action=log_data["action"], timestamp=log_data["timestamp"]
                    )
                    logger.info(f"Created object in db: {obj}")
                else:
                    logger.error(f"Expected dictionary but got: {type(log_data)}")
            except json.JSONDecodeError as decode_error:
                logger.error(f"Failed to decode message: {decode_error}")
            except Exception as e:
                logger.error(f"Error while creating object in db: {e}")
