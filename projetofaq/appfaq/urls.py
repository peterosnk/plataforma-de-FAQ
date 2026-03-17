from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import UserRegistrationView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'faqs', views.FAQViewSet)

urlpatterns = [
    path('', views.faq_list, name='faq_list'),
    path('delete/<int:faq_id>/', views.faq_delete, name='faq_delete'),
    path('edit/<int:faq_id>/', views.faq_edit, name='faq_edit'),
    path('api/', include(router.urls)),
    path('api/register/', UserRegistrationView.as_view(), name='user-register'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
