from flask_marshmallow import Marshmallow
from marshmallow import fields, validates, ValidationError

from app.models import User
from app.models import Message

from . import create_app

ma = Marshmallow(create_app)

class UserSchema(ma.SQLAlchemySchema):
   class Meta:
      model = User
   
   id = ma.auto_field()
   name = fields.Str(required=True)
   message_key = fields.Str(required=False)
   username = fields.Str(required=True)
   email = fields.Str(required=True)
   password = fields.Str(required=True)

   @validates('name')
   def validate_name(self, value):
       if len(value) > 15:
          raise ValidationError('* Name must be atleast 15 characters long.')

   @validates('username')
   def validate_username(self, value):
       if len(value) < 4 or len(value) > 10:
          raise ValidationError('* Username must be between 4 or 10 characters long.')

       elif User.query.filter_by(username=value).first():
          raise ValidationError('* Username already taken.')
   
   @validates('email')
   def validate_email(self, value):
       if User.query.filter_by(email=value).first():
          raise ValidationError('* Email already taken')

   @validates('password')
   def validate_password(self, value):
       if len(value) < 8:
          raise ValidationError('* Password must be atleast 8 digits.')

class ChangePasswordSchema(ma.SQLAlchemySchema):
   class Meta:
      model = User

   current_password = fields.Str(required=True)
   new_password = fields.Str(required=True)

   @validates('new_password')
   def validate_password(self, value):
       if len(value) < 8:
          raise ValidationError('* Password must be atleast 8 digits.')

class MessageSchema(ma.SQLAlchemySchema):
   class Meta:
      model = Message
   
   id = ma.auto_field()
   secret_message = fields.Str(required=True)
   read_key = fields.Str(required=True)
   has_read = fields.Int(required=True)
   user_id = fields.Int(required=True)
