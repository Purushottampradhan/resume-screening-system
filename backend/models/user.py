from datetime import datetime
from bson.objectid import ObjectId

class User:
    """User model for MongoDB"""
    
    @staticmethod
    def get_current_timestamp():
        """Get current timestamp"""
        return datetime.utcnow()
    
    @staticmethod
    def create(db, email, name, password_hash):
        """Create new user"""
        user_data = {
            'email': email,
            'name': name,
            'password': password_hash,
            'created_at': User.get_current_timestamp(),
            'updated_at': User.get_current_timestamp()
        }
        result = db['users'].insert_one(user_data)
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_email(db, email):
        """Find user by email"""
        user = db['users'].find_one({'email': email})
        if user:
            user['_id'] = str(user['_id'])
        return user
    
    @staticmethod
    def find_by_id(db, user_id):
        """Find user by ID"""
        try:
            user = db['users'].find_one({'_id': ObjectId(user_id)})
            if user:
                user['_id'] = str(user['_id'])
            return user
        except:
            return None
    
    @staticmethod
    def to_dict(user):
        """Convert user to dictionary"""
        return {
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'created_at': user['created_at']
        }