from django.urls import path
from .views import (
    CurrentPriceView,
    OfficialPriceCreateView,
    OfficialPriceUpdateView,
    
)

urlpatterns = [
    path('current/', CurrentPriceView.as_view()),
    path('create/', OfficialPriceCreateView.as_view()),
    path('<int:pk>/', OfficialPriceUpdateView.as_view()), 
]