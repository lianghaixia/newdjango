from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('sections/<int:num>', views.section, name='section'),
    path('infinite-scroll', views.infinite_scroll, name='infinite_scroll'),
    path('infinite-scroll-page', views.infinite_scroll_page, name='infinite_scroll_page'),
    path('addition_game', views.addition_game, name='addition_game'),
]