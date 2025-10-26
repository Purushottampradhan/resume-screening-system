from pymongo import MongoClient
from config import Config
import os

class MongoDB:
    _instance = None
    _client = None
    _db = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDB, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._client is None:
            print("Config.MONGO_URI",Config.MONGO_URI)
            self._client = MongoClient(Config.MONGO_URI, tlsAllowInvalidCertificates=True)
            self._db = self._client['resume_screening']
            self._create_indexes()
    
    def _create_indexes(self):
        """Create necessary indexes"""
        self._db['users'].create_index('email', unique=True)
        self._db['resume_evaluations'].create_index('user_id')
        self._db['resume_evaluations'].create_index('created_at')
    
    @property
    def db(self):
        return self._db
    
    @property
    def client(self):
        return self._client
    
    def close(self):
        if self._client:
            self._client.close()
            self._client = None
            self._db = None

# Global MongoDB instance
mongo = MongoDB()

def init_db(app):
    """Initialize database connection"""
    @app.teardown_appcontext
    def close_db(error):
        pass

def get_db():
    """Get database instance"""
    return mongo.db