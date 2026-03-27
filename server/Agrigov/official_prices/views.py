from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone

from .models import OfficialPrice
from .serializers import OfficialPriceSerializer
from .permissions import IsAdmin, IsFarmer
from .services import get_active_price, validate_price
from categories.models import Category

from products.models import Product


# =========================
# PUBLIC
# =========================

class CurrentPriceView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        category_id = request.query_params.get('category')
        wilaya = request.query_params.get('wilaya', '')

        if not category_id:
            return Response({"error": "category is required"}, status=400)

        # ✅ Resolve to actual Category object first
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=404)

        price = get_active_price(category, wilaya)

        if not price:
            return Response({"error": "No active price found for this category"}, status=404)

        return Response(OfficialPriceSerializer(price).data)


# =========================
# ADMIN
# =========================

class OfficialPriceCreateView(generics.CreateAPIView):
    queryset = OfficialPrice.objects.all()
    serializer_class = OfficialPriceSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def perform_create(self, serializer):
        serializer.save(set_by=self.request.user)

class OfficialPriceUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = OfficialPrice.objects.all()
    serializer_class = OfficialPriceSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def perform_update(self, serializer):
        serializer.save(set_by=self.request.user)



