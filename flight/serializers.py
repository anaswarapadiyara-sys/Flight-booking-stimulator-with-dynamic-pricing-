from rest_framework import serializers
from .models import User, Place, Week, Flight, Passenger, Ticket


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = '__all__'


class WeekSerializer(serializers.ModelSerializer):
    class Meta:
        model = Week
        fields = '__all__'


class FlightSerializer(serializers.ModelSerializer):
    origin = PlaceSerializer(read_only=True)
    destination = PlaceSerializer(read_only=True)
    depart_day = WeekSerializer(many=True, read_only=True)

    class Meta:
        model = Flight
        fields = '__all__'


class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = '__all__'


class TicketSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    passengers = PassengerSerializer(many=True, read_only=True)
    flight = FlightSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'