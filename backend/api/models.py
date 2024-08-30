import uuid

from django.core.exceptions import ValidationError
from django.db import models


class CSVFile(models.Model):
    file_name = models.CharField(max_length=255)
    file_hash = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name

    def save(self, *args, **kwargs):
        if CSVFile.objects.filter(file_hash=self.file_hash).exists():
            raise ValidationError("This file already exists.")

        super().save(*args, **kwargs)


class CSVRecord(models.Model):
    impression_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    impression_city = models.CharField(max_length=255, null=True, blank=True)
    posting_user_id = models.IntegerField(null=True, blank=True)
    post_id = models.IntegerField(null=True, blank=True)
    viewer_email = models.EmailField(null=True, blank=True)
    impression_country = models.CharField(max_length=255, null=True, blank=True)
    timestamp = models.DateTimeField(null=True, blank=True)
    device = models.CharField(max_length=50, null=True, blank=True)
    csv_file = models.ForeignKey(
        "CSVFile", on_delete=models.CASCADE, related_name="records"
    )

    def __str__(self):
        return f"{self.impression_id} - {self.viewer_email}"
