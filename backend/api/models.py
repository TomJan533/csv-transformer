from django.db import models


class CSVRecord(models.Model):
    data = models.JSONField()

    def __str__(self):
        return str(self.data)
