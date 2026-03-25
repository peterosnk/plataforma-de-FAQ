from django.urls import path
from . import views

urlpatterns = [
    path('', views.faq_list, name='faq_list'),
    path('delete/<int:faq_id>/', views.faq_delete, name='faq_delete'),
    path('edit/<int:faq_id>/', views.faq_edit, name='faq_edit'),
    # API endpoints para o Dashboard
    path('api/stats/', views.dashboard_stats, name='dashboard_stats'),
    path('api/faqs/', views.faq_api_list, name='faq_api_list'),
    path('api/users/', views.user_api_list, name='user_api_list'),
]