from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    MyProductsView,
    CreateProductView,
    UpdateProductView,
    DeleteProductView,
)

urlpatterns = [
    # Public
    path("", ProductListView.as_view()),
    path("<int:pk>/", ProductDetailView.as_view()),

    # Farmer dashboard
    path("my/", MyProductsView.as_view()),
    path("create/", CreateProductView.as_view()),
    path("<int:pk>/update/", UpdateProductView.as_view()),
    path("<int:pk>/delete/", DeleteProductView.as_view()),
]