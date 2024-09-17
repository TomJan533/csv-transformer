# api/tests/test_health_check.py
import pytest
from django.urls import reverse
from rest_framework.test import APISimpleTestCase


@pytest.mark.unit
class HealthCheckAPITestCase(APISimpleTestCase):
    def test_health_check(self):
        """
        Ensure the health check endpoint returns a 200 status and a 'healthy' message.
        """
        url = reverse("health-check")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"status": "healthy"})
