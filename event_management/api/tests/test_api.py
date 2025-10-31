from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


class EventApiTests(APITestCase):
    def setUp(self):
        # register a user
        res = self.client.post('/api/auth/register/', {
            'username': 'alice', 'password': 'pass12345', 'full_name': 'Alice'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        # login
        res = self.client.post('/api/auth/token/', {'username': 'alice', 'password': 'pass12345'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.token = res.data['access']
        self.auth_headers = {'HTTP_AUTHORIZATION': f'Bearer {self.token}'}

    def test_create_and_list_event(self):
        payload = {
            'title': 'Public Meetup',
            'description': 'Desc',
            'location': 'City',
            'start_time': '2030-01-01T10:00:00Z',
            'end_time': '2030-01-01T12:00:00Z',
            'is_public': True,
        }
        res = self.client.post('/api/events/', payload, format='json', **self.auth_headers)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        list_res = self.client.get('/api/events/')
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(list_res.data['count'], 1)

    def test_rsvp_and_review(self):
        # create private event
        payload = {
            'title': 'Private',
            'description': 'Desc',
            'location': 'Secret',
            'start_time': '2030-01-01T10:00:00Z',
            'end_time': '2030-01-01T12:00:00Z',
            'is_public': False,
        }
        res = self.client.post('/api/events/', payload, format='json', **self.auth_headers)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        event_id = res.data['id']

        # RSVP
        res = self.client.post(f'/api/events/{event_id}/rsvp/', {'status': 'Going'}, format='json', **self.auth_headers)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # Review
        res = self.client.post(f'/api/events/{event_id}/reviews/', {'rating': 5, 'comment': 'Great!'}, format='json', **self.auth_headers)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # List reviews
        res = self.client.get(f'/api/events/{event_id}/reviews/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(res.data['count'], 1)


