from rest_framework import serializers

from .models import CSVRecord


class CSVRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSVRecord
        fields = ["data"]
