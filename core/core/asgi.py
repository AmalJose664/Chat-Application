import django
django.setup()

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
from django.core.asgi import get_asgi_application

from me_chat import routing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')


django_asgi_application=get_asgi_application()

class WebSocketNotFoundMiddleware:
    """Middleware to catch routing errors and return a proper 404 response."""
    
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        
        try:
            
            return await self.app(scope, receive, send)
        
        except ValueError as e:
            print("Error in Connecting")
            
            if "No route found for path" in str(e):
                print("No route found for path ",str(e))
                await send({
                    "type": "websocket.close",
                    "code": 4404  
                })
            else:
                print("Unknown Error Occurred........." ,str(e))
                raise e



application = ProtocolTypeRouter({
	'http':django_asgi_application,
	'websocket':WebSocketNotFoundMiddleware(
        	AllowedHostsOriginValidator(
				JWTAuthMiddlewareStack( URLRouter( routing.websockets_urlpatterns))
			))
})