from datetime import timedelta
from dotenv import load_dotenv
import os

load_dotenv()

class Config:
   SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
   SQLALCHEMY_TRACK_MODIFICATIONS = False
   SECRET_KEY = os.getenv("SECRET_KEY")
   JWT_SECRET_KEY = os.getenv("JWT_SECRET")
   JWT_TOKEN_LOCATION = ['cookies']
   JWT_ACCESS_COOKIE_PATH = '/'
   # JWT_COOKIE_SAMESITE = 'None'
   JWT_COOKIE_SECURE = False # Set True in production
   JWT_COOKIE_CSRF_PROTECT = True # Set True in production
   JWT_CSRF_IN_COOKIES = False 
   JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
   MAIL_SERVER = "smtp.sendgrid.net"
   MAIL_PORT = 587
   MAIL_USERNAME = 'apikey'
   MAIL_PASSWORD = os.getenv("SENDGRID_API_KEY")
   MAIL_USE_TLS = True
   MAIL_USE_SSL = False
   MAIL_DEFAULT_SENDER = 'fvckrev@hotmail.com'
