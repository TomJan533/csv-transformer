from unittest.mock import patch
from rest_framework.test import APITestCase
from django.urls import reverse


class HealthCheckAPITestCase(APITestCase):

    def test_health_check(self):
        """
        Ensure the health check endpoint returns a 200 status and 'healthy' message.
        """
        url = reverse('health-check')
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"status": "healthy"})

