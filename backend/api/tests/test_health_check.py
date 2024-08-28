from django.urls import reverse
from rest_framework.test import APITestCase


class HealthCheckAPITestCase(APITestCase):

    def test_health_check(self):
        """
        Ensure the health check endpoint returns a 200 status and 'healthy' message.
        """
        url = reverse("health-check")

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"status": "healthy"})

    def test_pre_commit(self):
        """
        test pre-commit
        """
        pass
