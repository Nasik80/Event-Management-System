## Event Management System - Backend API

### Tech Stack
- Django, Django REST Framework
- JWT Auth via djangorestframework-simplejwt
- CORS via django-cors-headers
- Optional: Celery + Redis for async emails

### Setup
1. Create venv and install requirements
```
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

2. Run migrations
```
python event_management/manage.py migrate
```

3. Run server
```
python event_management/manage.py runserver
```

### API Base
- Base URL: `/api/`

### Auth
- POST `/api/auth/register/` — Create user + profile
- POST `/api/auth/token/` — Obtain JWT (username, password)
- POST `/api/auth/token/refresh/` — Refresh access token

### Events
- POST `/api/events/` — Create event (auth required)
- GET `/api/events/` — List public events (paginated)
- GET `/api/events/{id}/` — Retrieve event (public or permitted private)
- PUT/PATCH `/api/events/{id}/` — Update (organizer only)
- DELETE `/api/events/{id}/` — Delete (organizer only)

Filters on list: `?title=...&location=...&organizer=...`

### RSVP
- POST `/api/events/{event_id}/rsvp/` — RSVP (auth)
- PATCH `/api/events/{event_id}/rsvp/{user_id}/` — Update RSVP (self or organizer)

### Reviews
- POST `/api/events/{event_id}/reviews/` — Add review (auth)
- GET `/api/events/{event_id}/reviews/` — List reviews (paginated)

### Docs
- OpenAPI JSON: `/api/schema/`
- Swagger UI: `/api/docs/`

### CORS
- CORS_ALLOW_ALL_ORIGINS=True (dev). Adjust for production.

### Celery (Optional)
Configure Redis locally, then run Celery worker:
```
celery -A event_management worker -l info
```


