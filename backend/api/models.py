from datetime import datetime

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify


class CSVFile(models.Model):
    file_name = models.CharField(max_length=255)
    file_hash = models.CharField(max_length=64, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name

    def save(self, *args, **kwargs):
        if (
            self.file_hash
            and CSVFile.objects.filter(file_hash=self.file_hash)
            .exclude(pk=self.pk)
            .exists()
        ):
            raise ValidationError("This file already exists.")

        super().save(*args, **kwargs)

    def copy(self, existing_file_id, action_id):
        # Retrieve the existing file
        existing_file = CSVFile.objects.get(pk=existing_file_id)

        # Create a new file with the copied name and None as the hash
        new_file_name = self._generate_unique_name(existing_file.file_name)
        new_file = CSVFile(file_name=new_file_name, file_hash=None)

        new_file.save()

        self._copy_records(existing_file, new_file)

        self.join(existing_file_id, action_id, new_file)

        return new_file

    def join(self, existing_file_id, action_id, new_file):
        # Fetch GenericData records related to the given action_id and file_id
        generic_data_records = GenericData.objects.filter(
            file_id=existing_file_id, action_id=action_id
        )

        if not generic_data_records:
            raise ValidationError(
                "No GenericData found for the given file_id and action_id."
            )

        # Create a map of data using the second_dropdown_value as the key
        data_map = {}
        for generic_data in generic_data_records:
            selected_column = generic_data.selected_column
            second_dropdown_value = generic_data.second_dropdown_value
            data_json = generic_data.data

            # Ensure data_json is a dictionary
            if not isinstance(data_json, dict):
                raise ValidationError("Data field in GenericData must be a dictionary.")

            # Update the data map with the generic data
            key = data_json.get(second_dropdown_value)
            if key is not None:
                data_map[key] = data_json

        # Update the records in the new file
        for record in CSVRecord.objects.filter(csv_file=existing_file_id):
            join_key = getattr(record, selected_column, None)
            if join_key is not None and join_key in data_map:
                record_data = record.data or {}
                additional_data = data_map[join_key]
                record_data.update(additional_data)
                record.data = record_data
                record.csv_file = new_file
                record.save()

    def _generate_unique_name(self, original_name):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        slugified_name = slugify(original_name)
        return f"{slugified_name}_{timestamp}"

    def _copy_records(self, original_file, new_file):
        for record in original_file.records.all():
            CSVRecord.objects.create(
                impression_id=record.impression_id,
                impression_city=record.impression_city,
                posting_user_id=record.posting_user_id,
                post_id=record.post_id,
                viewer_email=record.viewer_email,
                impression_country=record.impression_country,
                timestamp=record.timestamp,
                device=record.device,
                data=record.data,
                csv_file=new_file,
            )


class CSVRecord(models.Model):
    impression_id = models.UUIDField()
    impression_city = models.CharField(max_length=255, null=True, blank=True)
    posting_user_id = models.IntegerField(null=True, blank=True)
    post_id = models.IntegerField(null=True, blank=True)
    viewer_email = models.EmailField(null=True, blank=True)
    impression_country = models.CharField(max_length=255, null=True, blank=True)
    timestamp = models.DateTimeField(null=True, blank=True)
    device = models.CharField(max_length=50, null=True, blank=True)
    data = models.JSONField(null=True, blank=True)
    csv_file = models.ForeignKey(
        "CSVFile", on_delete=models.CASCADE, related_name="records"
    )

    def __str__(self):
        return f"{self.impression_id} - {self.viewer_email}"


class GenericData(models.Model):
    action_id = models.UUIDField()
    file_id = models.IntegerField(null=True, blank=True)
    selected_column = models.CharField(max_length=255)
    second_dropdown_value = models.CharField(max_length=255)
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["file_id"]),
        ]
