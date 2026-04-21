from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from .models import Reserva, CarrouselItem, LegalText
from datetime import datetime, timedelta

class ReservaTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('testuser', 't@e.com', 'testpass')
        self.admin = User.objects.create_superuser('admin', 'admin@e.com', 'adminpass')

    def test_create_reserva(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'fecha_hora': (datetime.now() + timedelta(days=1)).isoformat(),
            'paciente_id': self.user.id,
            'nota': 'test'
        }
        resp = self.client.post(reverse('reserva-list'), data)
        self.assertEqual(resp.status_code, 201)

    def test_confirmar_reserva(self):
        self.client.force_authenticate(user=self.user)
        res = Reserva.objects.create(paciente=self.user, fecha_hora=datetime.now() + timedelta(days=1))
        self.client.force_authenticate(user=self.admin)
        resp = self.client.post(reverse('reserva-confirmar', args=[res.id]))
        self.assertEqual(resp.status_code, 200)

class CarrouselTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.item = CarrouselItem.objects.create(imagen='test.png', texto='carr 1', orden=1, activo=True)

    def test_list_carrousel(self):
        resp = self.client.get(reverse('carrousel-list'))
        self.assertEqual(resp.status_code, 200)
        self.assertGreaterEqual(len(resp.json()), 1)

class LegalTextTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        LegalText.objects.create(titulo="Legal 1", contenido="Lorem", visible=True)

    def test_list_legal(self):
        resp = self.client.get(reverse('legaltext-list'))
        self.assertEqual(resp.status_code, 200)
        self.assertGreaterEqual(len(resp.json()), 1)

class GalleryViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_gallery_endpoint_exists(self):
        resp = self.client.get('/api/gallery/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn('images', data)
        self.assertIsInstance(data['images'], list)
        # Deben ser string o lista vacía
        for img in data['images']:
            self.assertIsInstance(img, str)

    def test_gallery_endpoint_empty(self):
        # Si cambias la view a images=[], este test lo valida también
        # Aquí solo comprobamos estructura
        resp = self.client.get('/api/gallery/')
        data = resp.json()
        self.assertTrue(isinstance(data['images'], list))
