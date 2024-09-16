import json
from datetime import datetime, timezone

from api.kafka_utils.producer import send_message


def log_user_action(action_description):
    # Produce message to Kafka instead of storing directly in DB
    message = {
        # "user": user.username,  # TODO: add user in future
        "action": action_description,
        "timestamp": str(datetime.now(timezone.utc)),  # Corrected usage
    }
    send_message("user_action_logs", json.dumps(message))
