from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from database import get_db
from models.user import User
from auth.jwt_handler import generate_tokens
from bson.objectid import ObjectId

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """User registration"""
    data = request.get_json()
    db = get_db()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    if db['users'].find_one({'email': data['email']}):
        return jsonify({'error': 'Email already registered'}), 409
    
    try:
        user_data = {
            'email': data['email'],
            'name': data.get('name', 'User'),
            'password': generate_password_hash(data['password']),
            'created_at': User.get_current_timestamp(),
            'updated_at': User.get_current_timestamp()
        }
        
        result = db['users'].insert_one(user_data)
        user_id = str(result.inserted_id)
        
        tokens = generate_tokens(identity=user_id)
        return jsonify({
            'message': 'Signup successful',
            'user': {
                'id': user_id,
                'email': user_data['email'],
                'name': user_data['name']
            },
            **tokens
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login"""
    data = request.get_json()
    db = get_db()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    user = db['users'].find_one({'email': data['email']})
    
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    tokens = generate_tokens(identity=str(user['_id']))
    return jsonify({
        'message': 'Login successful',
        'user': {
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name']
        },
        **tokens
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return jsonify({'access_token': access_token}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user info"""
    user_id = get_jwt_identity()
    db = get_db()
    
    try:
        user = db['users'].find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'created_at': user['created_at'].isoformat() if isinstance(user['created_at'], object) else user['created_at']
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user"""
    return jsonify({'message': 'Logout successful'}), 200