from django.urls import include, path
import collabs.views as views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('projects/<slug:title>/', views.project, name='project'),
    path('process/', views.process, name='process'),
    path('signup/', views.signup, name='signup'),
]