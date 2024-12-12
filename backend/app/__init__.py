from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    jwt.init_app(app)
    db.init_app(app)
    mail.init_app(app)

    with app.app_context():
         db.create_all()

    migrate.init_app(app, db)

    from app.models import User
    from app.routes import blueprint
    CORS(blueprint, supports_credentials=True, resources={r"/api/v1/*": {"origins": "http://localhost:5173"}}) # Change this
    app.register_blueprint(blueprint, url_prefix='/api/v1')

    return app
