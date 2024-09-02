from django.contrib import admin
from django.urls import path
from api.views import (CSVFileContentView, CSVFileListView, CSVUploadView,
                       HealthCheckAPIView, CSVEnrichmentView)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health-check/", HealthCheckAPIView.as_view(), name="health-check"),
    path("api/upload-csv/", CSVUploadView.as_view(), name="upload-csv"),
    path("api/csv-files/", CSVFileListView.as_view(), name="csv-file-list"),
    path("api/csv-files/<int:pk>/", CSVFileContentView.as_view(), name="csv-file-content"),
    path("api/csv-enrichment/", CSVEnrichmentView.as_view(), name="csv-enrichment"),
]
