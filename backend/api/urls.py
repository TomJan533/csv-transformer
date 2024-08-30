from django.contrib import admin
from django.urls import path

from api.views import CSVFileListView, CSVUploadView, HealthCheckAPIView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health-check/", HealthCheckAPIView.as_view(), name="health-check"),
    path("api/upload-csv/", CSVUploadView.as_view(), name="upload-csv"),
    path("api/csv-files/", CSVFileListView.as_view(), name="csv-file-list"),
]
