from celery import shared_task

from api.kafka_utils.consumer import consume_messages


@shared_task
def run_kafka_consumer():
    consume_messages()
