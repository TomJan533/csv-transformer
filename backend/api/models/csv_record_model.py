from django.db import models


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
