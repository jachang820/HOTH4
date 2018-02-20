from django.urls import include, path
import collabs.views as views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('projects/<slug:title>/', views.project, name='project'),
    path('process/', views.process, name='process'),
    path('signup/', views.signup, name='signup'),
    path('signup_redirect/', views.signup_redirect, name='signup_redirect'),
    path('ajax/email/', views.validate_email, name='validate_email'),
    path('ajax/photo/', views.validate_photo, name='validate_photo'),
    path('ajax/major/', views.validate_major, name='validate_major'),
    path('ajax/username/', views.validate_username, name='validate_username'),
    path('ajax/password/', views.validate_password, name='validate_password'),
]