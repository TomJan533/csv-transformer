from rest_framework import serializers

from api.models import UserActionLog


class UserActionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActionLog
        fields = ["id", "action", "timestamp"]
