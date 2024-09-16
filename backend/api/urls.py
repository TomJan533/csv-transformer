from django.contrib import admin
from django.urls import path

from api.views import (
    CSVEnrichmentView,
    CSVFileContentView,
    CSVFileListView,
    CSVUploadView,
    GetKafkaMessageView,
    HealthCheckAPIView,
    PublishMessageView,
    UserActionLogListView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health-check/", HealthCheckAPIView.as_view(), name="health-check"),
    path("api/upload-csv/", CSVUploadView.as_view(), name="upload-csv"),
    path("api/csv-files/", CSVFileListView.as_view(), name="csv-file-list"),
    path(
        "api/csv-files/<int:pk>/", CSVFileContentView.as_view(), name="csv-file-content"
    ),
    path("api/csv-enrichment/", CSVEnrichmentView.as_view(), name="csv-enrichment"),
    path("api/publish-message/", PublishMessageView.as_view(), name="publish-message"),
    path("api/get-message/", GetKafkaMessageView.as_view(), name="get-message"),
    path("api/logs/", UserActionLogListView.as_view(), name="user-action-logs"),
]
