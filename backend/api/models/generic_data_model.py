from django.db import models


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
