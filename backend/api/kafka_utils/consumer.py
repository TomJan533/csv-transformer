from django.conf import settings
from kafka import KafkaConsumer

consumer = KafkaConsumer(
    "your_topic",
    bootstrap_servers=settings.KAFKA_BROKER_URL,
    auto_offset_reset="earliest",
    group_id="your_group_id",
    value_deserializer=lambda v: v.decode("utf-8"),
)


def get_message():
    for message in consumer:
        return message.value
