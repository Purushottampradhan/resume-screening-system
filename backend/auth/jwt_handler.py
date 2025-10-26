from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import timedelta

def generate_tokens(identity):
    """Generate access and refresh tokens"""
    access_token = create_access_token(identity=str(identity), expires_delta=timedelta(hours=1))
    refresh_token = create_refresh_token(identity=str(identity), expires_delta=timedelta(days=30))
    return {
        'access_token': access_token,
        'refresh_token': refresh_token
    }

def verify_token(token):
    """Verify JWT token"""
    from flask_jwt_extended import decode_token
    try:
        decoded = decode_token(token)
        return decoded
    except Exception as e:
        return None