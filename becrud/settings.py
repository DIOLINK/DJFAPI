INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # ---
    'corsheaders',  # <--- habilita CORS
    # ---
    'rest_framework',
    'rest_framework_simplejwt',
    'drf_spectacular',  # documentación swagger/openapi moderno
    'api',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # <--- debe ir lo más arriba posible
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'becrud.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'becrud.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sqlite3',
    }
}

LANGUAGE_CODE = 'es-ar'
TIME_ZONE = 'America/Argentina/Buenos_Aires'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'

SECRET_KEY = 'django-insecure-devsecretkeyforlocaldev'

DEBUG = True

ALLOWED_HOSTS = []

# --- CORS settings para desarrollo frontend ---
CORS_ALLOW_ALL_ORIGINS = True
# Cuando quieras mayor control usa:
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",
# ]

# --- Swagger/OpenAPI docs (drf-spectacular) ---
SPECTACULAR_SETTINGS = {
    'TITLE': 'DJFAPI Backend',
    'DESCRIPTION': 'API backend generado en Django/DRF, docs automáticas OpenAPI3 (swagger-ui/redoc)',
    'VERSION': '1.0.0',
}
