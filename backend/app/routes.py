from flask import Blueprint, request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import or_
from flask_mail import Message as Sendmail
from itsdangerous.url_safe import URLSafeTimedSerializer
from itsdangerous.exc import SignatureExpired, BadTimeSignature, BadSignature
from marshmallow import ValidationError

from app import db
from app import jwt
from app import mail
from app.models import User, Message
from app.schema import UserSchema, ChangePasswordSchema, MessageSchema

from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies, get_csrf_token
import os
import secrets

blueprint = Blueprint('blue_print', __name__)
urlsafe = URLSafeTimedSerializer(os.getenv("SECRET_KEY"))

# Callback for handling expired JWT tokens
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_data):
    response = jsonify({"msg": "Token has expired"})
    unset_jwt_cookies(response)
    return response, 401

# Route to check if a user is authenticated and to generate a csrf token (used for submission)
@blueprint.route('/auth_success', methods=['GET'])
@jwt_required()
def auth_success():
    try:
        access_token = request.cookies.get('access_token_cookie')

        get_csrf = get_csrf_token(access_token)
        return jsonify({'isauth': True, 'csrf_token': get_csrf}), 200
    except KeyError as e:
        return jsonify({'error': str(e)}), 500

# Route for user registration
@blueprint.route('/register', methods=['POST'])
def register_user():
    user_schema = UserSchema(only=("name", "username", "email", "password",))

    try:
        validated_input = user_schema.load(request.json)

        name = validated_input['name']
        username = validated_input['username']
        email = validated_input['email']
        password = validated_input['password']
   
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
        user = User(name=name, message_key=secrets.token_hex(5), username=username, email=email, password=hashed_password)

        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'User Registered.'}), 201

    except ValidationError as error:
        return jsonify(error.messages), 400

# Route for user login
@blueprint.route('/login', methods=['POST'])
def login_user():
    username = request.json.get('username')
    password = request.json.get('password')

    response = make_response(jsonify({'message': 'Login Successfully'}), 200)

    user_data = User.query.filter_by(username=username).first()
    if user_data and check_password_hash(user_data.password, password):
        access_token = create_access_token(identity=username)
        set_access_cookies(response, access_token)
        return response
    else:
        return jsonify({'message': '* Invalid Credentials.'}), 401

# Route for reset password request
@blueprint.route('/reset_request', methods=['POST'])
def reset_request():
    account = request.json.get('account')

    user = User.query.filter(or_(User.username==account, User.email==account)).first()

    if user:
       urltoken = urlsafe.dumps(user.username, salt='reset_pass')

       msg = Sendmail(
             subject="Forgot Password",
             sender=os.getenv("EMAIL_SENDER"),
             recipients=[user.email]
       )

       try:
           msg.body = f"To reset your password, click the following link: \n\nhttp://localhost:5173/reset-confirmation/{urltoken}\n\nFrom stealthmessage developer,\nThank you."
           mail.send(msg)
       except:
           return jsonify({'message': '* Connection problem.'}), 500

    return jsonify({'message': 'Reset request sent.'}), 200

# Route for reset password submission
@blueprint.route('/reset_confirmation/<token>', methods=['GET', 'PUT'])
def reset_password(token):
    try:
        reset_token = urlsafe.loads(token, salt='reset_pass', max_age=330)

        if request.method == 'PUT':
           user_schema = ChangePasswordSchema(only=("new_password",))

           try:
               validated_input = user_schema.load(request.json)

               new_password = validated_input['new_password']

               user = User.query.filter_by(username=reset_token).first()
               if user:
                  hashed_new_password = generate_password_hash(new_password, method='pbkdf2:sha256', salt_length=8)
            
                  user.password = hashed_new_password

                  db.session.add(user)
                  db.session.commit()
                
                  return jsonify({'message': 'Password reseted'}), 201
           except ValidationError as error:
               return jsonify(error.messages), 400
           
        return jsonify({'message': 'Reset confirmation'}), 200
    except (SignatureExpired and BadTimeSignature and BadSignature):
        return jsonify({'message': 'Token not found'}), 404

# Route for handling to send a secret messages
@blueprint.route('/secretkey/<secret>', methods=['GET', 'POST'])
def send_secret_message(secret):
    user_data = User.query.filter_by(message_key=secret).first()
    
    if user_data is None:
        return jsonify({'message': 'Key not found'}), 404

    if request.method == 'GET':
        return jsonify({'name': user_data.name}), 200
    
    elif request.method == 'POST':
        send_secret_message = request.json.get('secret_message')

        message = Message(secret_message=send_secret_message, read_key=secrets.token_hex(2), user_id=user_data.id)

        db.session.add(message)
        db.session.commit()

        return jsonify({'message': 'Message Sent.'}), 201

# Route to get user data and their secret messages
@blueprint.route('/userdataprofile', methods=['GET'])
@jwt_required()
def user_data():
    current_user = get_jwt_identity()

    user_data = User.query.filter_by(username=current_user).first()
    
    try:
        user_schema = UserSchema()
        message_schema = MessageSchema(many=True)

        user = user_schema.dump(user_data)
        messages = message_schema.dump(user_data.message)
    except Exception as e:
        return jsonify({'message': 'Error occurred: %s' % str(e)}), 400

    return jsonify({'user_data': user, 'secret_messages': messages}), 200

# Route for handling messages (view, update, delete)
@blueprint.route('/message/<key>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def message(key):
    message = Message.query.filter_by(read_key=key).first()

    if message is None:
        return jsonify({'message': 'Key not found'}), 404

    if request.method == 'GET':
        return jsonify({'secret_message': message.secret_message}), 200

    elif request.method == 'PUT':
        has_read = request.json.get('has_read')

        message = Message.query.filter_by(read_key=key).first()
        message.has_read = has_read

        db.session.add(message)
        db.session.commit()

        return jsonify({'message': 'Message has been read.'}), 201
    
    elif request.method == 'DELETE':
        db.session.delete(message)
        db.session.commit()

        return jsonify({'message': 'Message deleted.'}), 200

# Route to change the user's name
@blueprint.route('/name_', methods=['PUT'])
@jwt_required()
def change_name():
    current_user = get_jwt_identity()

    user_schema = UserSchema(only=("name",))

    try:
        validated_input = user_schema.load(request.json)

        new_name = validated_input['name']

        user_data = User.query.filter_by(username=current_user).first()
        user_data.name = new_name

        db.session.add(user_data)
        db.session.commit()

        return jsonify({'message': 'Name Change Successful.'}), 201

    except ValidationError as error:
        return jsonify(error.messages), 400

# Route to change the user's username
@blueprint.route('/username_', methods=['PUT'])
@jwt_required()
def change_username():
    current_user = get_jwt_identity()

    user_schema = UserSchema(only=("username",))

    try:
        validated_input = user_schema.load(request.json)
      
        new_username = validated_input['username']

        user_data = User.query.filter_by(username=current_user).first()
        user_data.username = new_username

        db.session.add(user_data)
        db.session.commit()

        response = make_response(jsonify({'message': 'Username Change Successful.'}), 201)

        access_token = create_access_token(identity=new_username)
        set_access_cookies(response, access_token)

        return response

    except ValidationError as error:
        return jsonify(error.messages), 400

# Route to add (for old user who dont have an email - version 1.0) or change the user's email
@blueprint.route('/email_', methods=['PUT'])
@jwt_required()
def add_or_change_email():
    current_user = get_jwt_identity()

    user_schema = UserSchema(only=("email",))

    try:
        validated_input = user_schema.load(request.json)
      
        new_email = validated_input['email']

        user_data = User.query.filter_by(username=current_user).first()
        user_data.email = new_email

        db.session.add(user_data)
        db.session.commit()

        return jsonify({'message': 'Email Change Successful.'}), 201
    except ValidationError as error:
        return jsonify(error.messages), 400
    
# Route to change the user's password
@blueprint.route('/password_', methods=['PUT'])
@jwt_required()
def change_password():
    current_user = get_jwt_identity()

    user_schema = ChangePasswordSchema(only=("current_password", "new_password"))

    try:
        validated_input = user_schema.load(request.json)
      
        current_password = validated_input['current_password']
        new_password = validated_input['new_password']

        hashed_new_password = generate_password_hash(new_password, method='pbkdf2:sha256', salt_length=8)
        user_data = User.query.filter_by(username=current_user).first()

        if check_password_hash(user_data.password, current_password):
            user_data.password = hashed_new_password
   
            db.session.add(user_data)
            db.session.commit()

            return jsonify({'message': 'Password Change Successful.'}), 201
        else:
            return jsonify({'message': '* Invalid Password.'}), 401

    except ValidationError as error:
        return jsonify(error.messages), 400

# Route to delete a user's account
@blueprint.route('/deletion', methods=['POST'])
@jwt_required()
def delete_account():
    current_user = get_jwt_identity()

    password = request.json.get('password')

    user_data = User.query.filter_by(username=current_user).first()
    messages = Message.query.filter_by(user_id=user_data.id).all()

    if check_password_hash(user_data.password, password):
        for message in messages:
            db.session.delete(message)

        db.session.delete(user_data)
        db.session.commit()

        response = jsonify({'message': 'Account Deleted'})
        unset_jwt_cookies(response)

        return response
    else:
        return jsonify({'message': '* Invalid Password.'}), 401
       
# Route to log out the user
@blueprint.route('/logout', methods=['POST'])
@jwt_required()
def logout_user():
    response = jsonify({'message': 'Logout Successful'})
    
    unset_jwt_cookies(response)
    return response
