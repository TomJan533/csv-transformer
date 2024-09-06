from rest_framework import serializers

from api.models import CSVFile


class CSVFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSVFile
        fields = ["id", "file_name", "file_hash", "created_at"]
