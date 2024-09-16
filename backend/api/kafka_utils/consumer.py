import json
import threading  # To avoid race conditions
from abc import ABC, abstractmethod  # To define an interface

from django.conf import settings
from kafka import KafkaConsumer

# Global consumer objects and locks
_kafka_consumers = {}
_kafka_locks = {
    "backend": threading.Lock(),
    "celery": threading.Lock(),
}


# Interface (Abstraction)
class ConsumerInterface(ABC):
    @abstractmethod
    def consume(self):
        pass


# Kafka Consumer Wrapper implementing the interface
class KafkaConsumerWrapper(ConsumerInterface):
    def __init__(self, topic: str, group_id: str, timeout: int = 5000):
        self.consumer = KafkaConsumer(
            topic,
            bootstrap_servers=settings.KAFKA_BROKER_URL,
            auto_offset_reset="earliest",
            group_id=group_id,
            value_deserializer=lambda v: json.loads(v.decode("utf-8")),
            consumer_timeout_ms=timeout,
        )

    def consume(self):
        return self.consumer


# Function to initialize any consumer based on group_id and consumer_type
def init_consumer(topic: str, group_id: str, consumer_type: str):
    """
    Initialize and return a singleton Kafka consumer wrapped in a ConsumerInterface.

    :param topic: Kafka topic to consume
    :param group_id: Kafka consumer group ID
    :param consumer_type: 'backend' or 'celery' to distinguish consumer types
    :return: Kafka consumer wrapped in ConsumerInterface
    """
    global _kafka_consumers
    if consumer_type not in _kafka_consumers:
        with _kafka_locks[consumer_type]:
            if consumer_type not in _kafka_consumers:  # Double-check locking
                _kafka_consumers[consumer_type] = KafkaConsumerWrapper(
                    topic=topic, group_id=group_id
                )
    return _kafka_consumers[consumer_type]


def get_backend_consumer():
    """
    Initialize and return the Kafka consumer for backend.
    """
    return init_consumer(
        topic="user_action_logs", group_id="backend_consumers", consumer_type="backend"
    )


def get_celery_consumer():
    """
    Initialize and return the Kafka consumer for Celery.
    """
    return init_consumer(
        topic="user_action_logs", group_id="celery_consumers", consumer_type="celery"
    )


def get_message():
    """
    Retrieve a message from the backend Kafka consumer.
    """
    consumer_wrapper = get_backend_consumer()
    consumer = consumer_wrapper.consume()
    try:
        for message in consumer:
            return message.value
    except Exception as e:
        print(f"Error while consuming message: {e}")
        return None


def close_consumers():
    """
    Close the Kafka consumers gracefully.
    """
    global _kafka_consumers

    for consumer_type, consumer_wrapper in _kafka_consumers.items():
        if consumer_wrapper is not None:
            consumer_wrapper.consumer.close()
            _kafka_consumers[consumer_type] = None
