from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Flight, Ticket, Passenger, User
from .serializers import (
    FlightSerializer,
    TicketSerializer,
    PassengerSerializer,
    UserSerializer
)

# -----------------------------
# 1. Get all flights
# -----------------------------
@api_view(['GET'])
def all_flights(request):
    flights = Flight.objects.all()
    serializer = FlightSerializer(flights, many=True)
    return Response(serializer.data)


# -----------------------------
# 2. Search flights by origin, destination, date
# -----------------------------
@api_view(['GET'])
def search_flights(request):
    origin = request.GET.get('origin')
    destination = request.GET.get('destination')

    flights = Flight.objects.all()

    if origin:
        flights = flights.filter(origin__city__icontains=origin)

    if destination:
        flights = flights.filter(destination__city__icontains=destination)

    serializer = FlightSerializer(flights, many=True)
    return Response(serializer.data)


# -----------------------------
# 3. Register user
# -----------------------------
@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully!"})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# 4. Add passenger
# -----------------------------
@api_view(['POST'])
def add_passenger(request):
    serializer = PassengerSerializer(data=request.data)
    if serializer.is_valid():
        passenger = serializer.save()
        return Response({
            "message": "Passenger added!",
            "passenger_id": passenger.id
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# 5. Book ticket
# -----------------------------
@api_view(['POST'])
def book_ticket(request):
    serializer = TicketSerializer(data=request.data)
    if serializer.is_valid():
        ticket = serializer.save()
        return Response({
            "message": "Ticket booked!",
            "ticket_ref": ticket.ref_no
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# 6. Get all tickets
# -----------------------------
@api_view(['GET'])
def get_tickets(request):
    tickets = Ticket.objects.all()
    serializer = TicketSerializer(tickets, many=True)
    return Response(serializer.data)