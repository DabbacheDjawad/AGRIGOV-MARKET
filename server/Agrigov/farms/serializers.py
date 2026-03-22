from rest_framework import serializers
from .models import Farm
from users.models import User


class FarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farm
        fields = "__all__"
        read_only_fields = ["farmer"]

    def create(self, validated_data):
        user = self.context["request"].user

        if user.role != User.ROLE_FARMER:
            raise serializers.ValidationError("Only farmers can create farms")

        return Farm.objects.create(farmer=user, **validated_data)