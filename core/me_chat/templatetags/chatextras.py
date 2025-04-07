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



def get_random_rgb():
	high_values = [random.randint(200, 255) for _ in range(2)]
	low_value = random.randint(0, 100)

    # Randomly shuffle positions to avoid bias
	values = high_values + [low_value]
	random.shuffle(values)
	
	r, g, b = values
	return f"rgb({r}, {g}, {b})"

def get_random_rgb_in_range(min_val=0, max_val=255):
    random_value = lambda: random.randint(min_val, max_val)
    
    r, g, b = random_value(), random_value(), random_value()
    
    return f"rgb({r}, {g}, {b})"
