from rest_framework import serializers

from .models import CSVFile, CSVRecord


class CSVRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSVRecord
        fields = [
            "impression_id",
            "impression_city",
            "posting_user_id",
            "post_id",
            "viewer_email",
            "impression_country",
            "timestamp",
            "device",
            "csv_file",
        ]
        read_only_fields = [
            "csv_file"
        ]  # The csv_file is automatically set in the view, so it's read-only

    def create(self, validated_data):
        return super().create(validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Assuming 'data' is a dictionary in the instance, normalize it
        if isinstance(instance.data, dict):
            representation.update(instance.data)

        return representation


class CSVFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSVFile
        fields = ["id", "file_name", "file_hash", "created_at"]
