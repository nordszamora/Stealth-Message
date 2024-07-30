from . import db

class User(db.Model):
   id = db.Column(db.Integer, primary_key=True)
   name = db.Column(db.String(25), nullable=True)
   message_key = db.Column(db.String(10), unique=True, nullable=True)
   username = db.Column(db.String(15), unique=True, nullable=True)
   password = db.Column(db.String(255), nullable=True)
   message = db.relationship('Message', backref='user')

   def __repr__(self):
      return self.name

class Message(db.Model):
   id = db.Column(db.Integer, primary_key=True)
   secret_message = db.Column(db.Text, nullable=True)
   read_key = db.Column(db.String(4), unique=True, nullable=True)
   has_read = db.Column(db.Boolean, default=False, nullable=False)
   user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

   def __repr__(self):
      return self.secret_message 