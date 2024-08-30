from rest_framework import serializers

from .models import CSVRecord


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
        # Override the create method if you need to customize object creation
        return super().create(validated_data)
