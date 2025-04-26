"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.i18n import i18n_patterns
from django.views.generic import TemplateView
from django.views.i18n import set_language

from me_chat.views import begin_point



urlpatterns = [
	path('', begin_point),
	path('admin/', admin.site.urls),
	path('api/',include('me_chat.urls'),name='other'),
	path('default_api/',include('core.api.urls')),
	path('api/',include('account.urls')),
	path('api/',include('groups_chat.urls')),

	
]
urlpatterns += i18n_patterns(
    # This ensures the 'set_language' view is available
    path('set_language/', set_language, name='set_language'),
)
