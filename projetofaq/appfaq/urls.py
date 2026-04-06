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
    path('api/users/update/<int:user_id>/', views.update_user_api, name='update_user_api'),
    path('api/users/create/', views.create_user_api, name='create_user_api'),
    path('api/faqs/create/', views.create_faq_api, name='create_faq_api'),
    path('api/faqs/update/<int:faq_id>/', views.update_faq_api, name='update_faq_api'),
    path('api/faqs/delete/<int:faq_id>/', views.delete_faq_api, name='delete_faq_api'),
    path('api/faqs/reorder/', views.reorder_faqs_api, name='reorder_faqs_api'),
    path('api/users/delete/<int:user_id>/', views.delete_user_api, name='delete_user_api'),
    path('api/faqs/all/', views.faq_api_list_all, name='faq_api_list_all'),
    # API de Auth
    path('api/login/', views.login_api, name='login_api'),
    path('api/register/', views.register_api, name='register_api'),
    path('api/chatbot/', views.chatbot_api, name='chatbot_api'),
]