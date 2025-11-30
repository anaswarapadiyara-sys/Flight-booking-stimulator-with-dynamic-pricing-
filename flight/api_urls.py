from django.urls import path
from . import api_views

urlpatterns = [
    path("flights/", api_views.all_flights),
    path("search/", api_views.search_flights),
    path("register/", api_views.register_user),
    path("add-passenger/", api_views.add_passenger),
    path("book-ticket/", api_views.book_ticket),
    path("tickets/", api_views.get_tickets),
]