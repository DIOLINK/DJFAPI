from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from .models import Reserva
from datetime import datetime, timedelta

class ServerHealthTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('testuser', 't@e.com', 'testpass')

    def test_api_reservas_liveness(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('reserva-list'))
        self.assertIn(response.status_code, [200, 403])

    def test_create_reserva(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'fecha_hora': (datetime.now() + timedelta(days=1)).isoformat(),
            'paciente_id': self.user.id,
            'nota': 'test reserva'
        }
        response = self.client.post(reverse('reserva-list'), data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Reserva.objects.filter(paciente=self.user).exists())
