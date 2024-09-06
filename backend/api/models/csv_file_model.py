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
