from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_db
from models.resume_evaluation import ResumeEvaluation
from models.evaluator import ResumeEvaluator
from utils.pdf_extractor import extract_resume_text
from config import Config
import os

resume_bp = Blueprint('resume', __name__, url_prefix='/api/resumes')

@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resumes():
    """Upload and process multiple resumes"""
    user_id = get_jwt_identity()
    db = get_db()
    
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400
    
    files = request.files.getlist('files')
    results = []
    errors = []
    
    # Create uploads folder if it doesn't exist
    if not os.path.exists(Config.UPLOAD_FOLDER):
        os.makedirs(Config.UPLOAD_FOLDER)
    
    for file in files:
        if file and file.filename:
            try:
                filename = secure_filename(file.filename)
                file_ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
                
                if file_ext not in Config.ALLOWED_EXTENSIONS:
                    errors.append(f'{filename}: Invalid file type')
                    continue
                
                # Save temporarily
                file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
                file.save(file_path)
                
                # Extract text
                resume_text = extract_resume_text(file_path, file_ext)
                
                if not resume_text:
                    errors.append(f'{filename}: Could not extract text')
                    os.remove(file_path)
                    continue
                
                # Evaluate
                scores = ResumeEvaluator.evaluate(resume_text)
                
                # Save to MongoDB
                evaluation_id = ResumeEvaluation.create(
                    db, user_id, filename, resume_text, scores
                )
                
                results.append({
                    'id': evaluation_id,
                    'filename': filename,
                    'scores': scores
                })
                
                # Clean up
                os.remove(file_path)
                
            except Exception as e:
                errors.append(f'{file.filename}: {str(e)}')
    
    response = {'results': results}
    if errors:
        response['errors'] = errors
    
    return jsonify(response), 200 if results else 400

@resume_bp.route('', methods=['GET'])
@jwt_required()
def get_resumes():
    """Get all resumes for current user"""
    user_id = get_jwt_identity()
    db = get_db()
    
    evaluations = ResumeEvaluation.find_all_by_user(db, user_id)
    
    return jsonify({
        'resumes': [ResumeEvaluation.to_dict(eval) for eval in evaluations]
    }), 200

@resume_bp.route('/<resume_id>', methods=['GET'])
@jwt_required()
def get_resume(resume_id):
    """Get single resume"""
    user_id = get_jwt_identity()
    db = get_db()
    
    evaluation = ResumeEvaluation.find_by_id(db, resume_id, user_id)
    
    if not evaluation:
        return jsonify({'error': 'Resume not found'}), 404
    
    return jsonify(ResumeEvaluation.to_dict(evaluation)), 200

@resume_bp.route('/<resume_id>', methods=['DELETE'])
@jwt_required()
def delete_resume(resume_id):
    """Delete a resume"""
    user_id = get_jwt_identity()
    db = get_db()
    
    if not ResumeEvaluation.delete_by_id(db, resume_id, user_id):
        return jsonify({'error': 'Resume not found'}), 404
    
    return jsonify({'message': 'Resume deleted'}), 200

@resume_bp.route('/batch/delete', methods=['POST'])
@jwt_required()
def delete_batch():
    """Delete multiple resumes"""
    user_id = get_jwt_identity()
    db = get_db()
    data = request.get_json()
    resume_ids = data.get('resume_ids', [])
    
    deleted = ResumeEvaluation.delete_batch(db, resume_ids, user_id)
    
    return jsonify({'message': f'{deleted} resumes deleted'}), 200

@resume_bp.route('/clear-all', methods=['DELETE'])
@jwt_required()
def clear_all():
    """Clear all resumes for user"""
    user_id = get_jwt_identity()
    db = get_db()
    
    deleted = ResumeEvaluation.delete_all_by_user(db, user_id)
    
    return jsonify({'message': f'Cleared {deleted} resumes'}), 200