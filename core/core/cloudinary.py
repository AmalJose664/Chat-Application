import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv
from os import getenv

load_dotenv()



cloudinary.config( 
    cloud_name =  getenv('CLOUD_NAME'),
    api_key =  getenv('API_KEY'),
    api_secret =  getenv('API_SECRET'),
    secure=True
)