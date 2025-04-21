from django.contrib import admin

from .models import User

# Register your models here.

class CustomAdminPage(admin.ModelAdmin):
	exclude=('password',)

admin.site.register(User, CustomAdminPage)
