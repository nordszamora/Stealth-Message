from datetime import timedelta

class Config:
   SQLALCHEMY_DATABASE_URI = 'mysql://<user>:<pass>@<host>:<port>/<database>'
   SQLALCHEMY_TRACK_MODIFICATIONS = False
   SECRET_KEY = 's3cr3t'
   JWT_SECRET_KEY = 's3cr3t'
   JWT_TOKEN_LOCATION = ['cookies']
   JWT_ACCESS_COOKIE_PATH = '/'
   # JWT_COOKIE_SAMESITE = 'None'
   JWT_COOKIE_SECURE = False # Set True in production
   JWT_COOKIE_CSRF_PROTECT = False # Set True in production
   JWT_CSRF_IN_COOKIES = False 
   JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
