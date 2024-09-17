import uuid
from datetime import datetime
from io import BytesIO
from unittest.mock import patch

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from api.models import CSVFile, CSVRecord


@pytest.mark.integration
@pytest.mark.django_db
@patch("api.kafka_utils.producer.KafkaProducer")
def test_csv_upload_and_cleanup(mock_kafka_producer):
    client = APIClient()

    # Create a mock CSV file with the required fields for CSVRecord
    csv_content = (
        "impression_id,impression_city,posting_user_id,post_id,viewer_email,impression_country,timestamp,device\n"
        f"{uuid.uuid4()},New York,1,1001,john@example.com,USA,{datetime.now().isoformat()},Desktop\n"
        f"{uuid.uuid4()},Los Angeles,2,1002,jane@example.com,USA,{datetime.now().isoformat()},Mobile"
    )
    mock_csv = csv_content.encode("utf-8")

    # Create an in-memory file object with the mock CSV content
    csv_file = BytesIO(mock_csv)
    csv_file.name = "test.csv"

    # URL for the CSV upload endpoint
    url = reverse("upload-csv")

    # Perform the file upload request
    response = client.post(url, {"file": csv_file}, format="multipart")

    # Check that the response status is 201 CREATED
    assert response.status_code == 201

    # Ensure the CSVFile object was created
    assert CSVFile.objects.filter(file_name="test.csv").exists()

    # Ensure CSVRecords were created, should be 2
    assert CSVRecord.objects.filter(csv_file__file_name="test.csv").count() == 2

    # Clean up: remove the CSVFile and related CSVRecords
    CSVFile.objects.filter(file_name="test.csv").delete()

    # Verify that the CSVFile and records were removed
    assert not CSVFile.objects.filter(file_name="test.csv").exists()
    assert CSVRecord.objects.filter(csv_file__file_name="test.csv").count() == 0
