from django.conf import settings
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers=settings.KAFKA_BROKER_URL,
    value_serializer=lambda v: v.encode("utf-8"),
)


def send_message(topic, message):
    producer.send(topic, value=message)
    producer.flush()
