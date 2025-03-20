from django import template
import random, string
register = template.Library()

@register.filter(name='initials')
def initials(value):
	initials = ""
	for name in value.split(' '):
		if name and len(initials) < 3:
			initials += name[0].upper()
	
	return initials

@register.filter(name='random_text')
def random_text(number):
	rand_str = "".join(random.choices(string.ascii_letters + string.digits,k=number))
	return rand_str

