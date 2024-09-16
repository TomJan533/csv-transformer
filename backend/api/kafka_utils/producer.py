import json
import logging
import threading  # For thread safety

from django.conf import settings
from kafka import KafkaProducer

logger = logging.getLogger(__name__)

# Global producer object
_kafka_producer = None
_kafka_lock = threading.Lock()


def init_kafka_producer():
    global _kafka_producer
    if _kafka_producer is None:
        with _kafka_lock:
            if _kafka_producer is None:  # Double-checked locking
                _kafka_producer = KafkaProducer(
                    bootstrap_servers=settings.KAFKA_BROKER_URL,
                    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                )
    return _kafka_producer


def send_message(topic, message):
    producer = init_kafka_producer()
    try:
        future = producer.send(topic, value=message)
        result = future.get(timeout=10)  # Wait for message to be sent
        logger.info(f"Message sent to {topic}: {message}")
    except Exception as e:
        logger.error(f"Error while sending message to Kafka: {e}")
    finally:
        producer.flush()
