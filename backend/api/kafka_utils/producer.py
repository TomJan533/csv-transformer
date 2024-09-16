import json
import logging
import threading  # For thread safety
from abc import ABC, abstractmethod  # To define an interface

from django.conf import settings
from kafka import KafkaProducer

logger = logging.getLogger(__name__)

# Global producer object and lock
_kafka_producer = None
_kafka_lock = threading.Lock()


# Interface (Abstraction)
class ProducerInterface(ABC):
    @abstractmethod
    def send(self, topic, message):
        pass


# Kafka Producer Wrapper implementing the interface
class KafkaProducerWrapper(ProducerInterface):
    def __init__(self):
        self.producer = KafkaProducer(
            bootstrap_servers=settings.KAFKA_BROKER_URL,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
        )

    def send(self, topic, message):
        future = self.producer.send(topic, value=message)
        result = future.get(timeout=10)  # Wait for message to be sent
        return result

    def flush(self):
        self.producer.flush()


# Singleton producer initializer
def init_kafka_producer():
    global _kafka_producer
    if _kafka_producer is None:
        with _kafka_lock:
            if _kafka_producer is None:  # Double-checked locking
                _kafka_producer = KafkaProducerWrapper()
    return _kafka_producer


def send_message(topic, message):
    """
    Send a message to the specified Kafka topic.
    """
    producer_wrapper = init_kafka_producer()
    try:
        result = producer_wrapper.send(topic, message)
        logger.info(f"Message sent to {topic}: {message}")
    except Exception as e:
        logger.error(f"Error while sending message to Kafka: {e}")
    finally:
        producer_wrapper.flush()
