import json
import threading  # To avoid race conditions

from django.conf import settings
from kafka import KafkaConsumer

# Global consumer object
_kafka_consumer = None
_kafka_lock = threading.Lock()


def init_kafka_consumer_backend():
    global _kafka_consumer
    if _kafka_consumer is None:
        with _kafka_lock:
            if _kafka_consumer is None:  # Double-check locking
                _kafka_consumer = KafkaConsumer(
                    "user_action_logs",
                    bootstrap_servers=settings.KAFKA_BROKER_URL,
                    auto_offset_reset="earliest",
                    group_id="backend_consumers",  # Backend-specific consumer group
                    value_deserializer=lambda v: json.loads(v.decode("utf-8")),
                    consumer_timeout_ms=5000,  # Set a timeout of 5 seconds
                )
    return _kafka_consumer


def init_kafka_consumer_celery():
    global _kafka_consumer
    if _kafka_consumer is None:
        with _kafka_lock:
            if _kafka_consumer is None:  # Double-check locking
                _kafka_consumer = KafkaConsumer(
                    "user_action_logs",
                    bootstrap_servers=settings.KAFKA_BROKER_URL,
                    auto_offset_reset="earliest",
                    group_id="celery_consumers",  # Celery-specific consumer group
                    value_deserializer=lambda v: json.loads(v.decode("utf-8")),
                    consumer_timeout_ms=5000,  # Set a timeout of 5 seconds
                )
    return _kafka_consumer


def get_message():
    consumer = init_kafka_consumer_backend()
    try:
        for message in consumer:
            return message.value
    except Exception as e:
        print(f"Error while consuming message: {e}")
        return None
