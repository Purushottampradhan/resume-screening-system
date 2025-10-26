from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
import os
from database import init_db
from auth.auth_routes import auth_bp
from routes.resume_routes import resume_bp

def create_app(config_name='development'):
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(
        app,
        resources={r"/api/*": {"origins": ["http://localhost:3000"]}},
        supports_credentials=True
    )
    
    jwt = JWTManager(app)
    
    # Create folders
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs('results', exist_ok=True)
    
    # Initialize database
    init_db(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(resume_bp)
    
    # Health check
    @app.route('/api/health', methods=['GET'])
    def health():
        return {'status': 'Backend is running'}, 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5002)