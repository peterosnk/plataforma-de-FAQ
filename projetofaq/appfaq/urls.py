from django.urls import path
from . import views

urlpatterns = [
    path('', views.faq_list, name='faq_list'),
    path('delete/<int:faq_id>/', views.faq_delete, name='faq_delete'),
    path('edit/<int:faq_id>/', views.faq_edit, name='faq_edit'),
]