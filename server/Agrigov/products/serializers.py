from rest_framework import serializers
from .models import Product, ProductImage
from categories.models import Category
from django.db import transaction
from reviews.serializer import ReviewSerializer
class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = ProductImage
        fields = ["id", "image"]
    def get_image(self, obj):
        return obj.image.url

from farms.models import Farm


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    farmer_name = serializers.CharField(source="farm.farmer.username", read_only=True)
    category = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=Category.objects.filter(is_active=True)
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "farmer_name",
            "description",
            "season",
            "unit_price",
            "stock",
            "in_stock",
            "category",
            "images",
            "average_rating",
            "review_count",
            "created_at",
        ]


class CreateProductSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    farm_id = serializers.IntegerField(write_only=True)

    category = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=Category.objects.filter(is_active=True)
    )

    class Meta:
        model = Product
        fields = [
            "title",
            "description",
            "season",
            "unit_price",
            "stock",
            "category",
            "farm_id",
            "images",
        ]

    def validate_farm_id(self, value):
        user = self.context["request"].user

        if not Farm.objects.filter(id=value, farmer=user).exists():
            raise serializers.ValidationError("Invalid farm or not yours")

        return value
    @transaction.atomic
    def create(self, validated_data):
        images = validated_data.pop("images", [])
        farm_id = validated_data.pop("farm_id")

        farm = Farm.objects.get(id=farm_id)

        product = Product.objects.create(
            farm=farm,
            **validated_data
        )

        for img in images:
            ProductImage.objects.create(
                product=product,
                image=img
            )

        return product

class UpdateProductSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    category = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=Category.objects.filter(is_active=True),
        required=False
    )

    class Meta:
        model = Product
        fields = [
            "title",
            "description",
            "season",
            "unit_price",
            "stock",
            "category",
            "images",
        ]

    @transaction.atomic
    def update(self, instance, validated_data):
        images = validated_data.pop("images", None)
        print(f"DEBUG: Validated Data: {validated_data}")
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if images is not None:
            for img in instance.images.all():
                img.image.delete(save=False)
                img.delete()

            for img in images:
                ProductImage.objects.create(product=instance, image=img)

        return instance