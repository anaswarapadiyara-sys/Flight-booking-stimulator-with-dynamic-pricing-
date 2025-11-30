

from django.contrib import admin
from django.urls import path, include
from django.contrib.staticfiles.storage import staticfiles_storage
from django.views.generic.base import RedirectView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include("flight.urls")),   # existing frontend URLs
    path('api/', include("flight.api_urls")),  #  NEW API ROUTES
    path('favicon.ico', RedirectView.as_view(url=staticfiles_storage.url('img/favicon.ico'))),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)