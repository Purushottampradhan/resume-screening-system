from datetime import datetime
from bson.objectid import ObjectId

class ResumeEvaluation:
    """Resume Evaluation model for MongoDB"""
    
    @staticmethod
    def create(db, user_id, filename, resume_text, scores):
        """Create resume evaluation record"""
        evaluation_data = {
            'user_id': ObjectId(user_id),
            'filename': filename,
            'resume_text': resume_text,
            'scores': {
                'ai_ml_match': scores['ai_ml_match'],
                'llm_match': scores['llm_match'],
                'python_match': scores['python_match'],
                'experience_match': scores['experience_match']
            },
            'overall_score': scores['overall_score'],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        result = db['resume_evaluations'].insert_one(evaluation_data)
        return str(result.inserted_id)
    
    @staticmethod
    def find_all_by_user(db, user_id):
        """Get all evaluations for a user"""
        try:
            evaluations = list(db['resume_evaluations'].find(
                {'user_id': ObjectId(user_id)}
            ).sort('created_at', -1))
            
            for eval in evaluations:
                eval['_id'] = str(eval['_id'])
                eval['user_id'] = str(eval['user_id'])
            
            return evaluations
        except Exception as e:
            print(f"Error finding evaluations: {e}")
            return []
    
    @staticmethod
    def find_by_id(db, evaluation_id, user_id):
        """Find evaluation by ID"""
        try:
            evaluation = db['resume_evaluations'].find_one({
                '_id': ObjectId(evaluation_id),
                'user_id': ObjectId(user_id)
            })
            
            if evaluation:
                evaluation['_id'] = str(evaluation['_id'])
                evaluation['user_id'] = str(evaluation['user_id'])
            
            return evaluation
        except:
            return None
    
    @staticmethod
    def delete_by_id(db, evaluation_id, user_id):
        """Delete evaluation"""
        try:
            result = db['resume_evaluations'].delete_one({
                '_id': ObjectId(evaluation_id),
                'user_id': ObjectId(user_id)
            })
            return result.deleted_count > 0
        except:
            return False
    
    @staticmethod
    def delete_batch(db, evaluation_ids, user_id):
        """Delete multiple evaluations"""
        try:
            object_ids = [ObjectId(id) for id in evaluation_ids]
            result = db['resume_evaluations'].delete_many({
                '_id': {'$in': object_ids},
                'user_id': ObjectId(user_id)
            })
            return result.deleted_count
        except:
            return 0
    
    @staticmethod
    def delete_all_by_user(db, user_id):
        """Delete all evaluations for user"""
        try:
            result = db['resume_evaluations'].delete_many({
                'user_id': ObjectId(user_id)
            })
            return result.deleted_count
        except:
            return 0
    
    @staticmethod
    def to_dict(evaluation):
        """Convert evaluation to dictionary"""
        return {
            'id': str(evaluation['_id']),
            'filename': evaluation['filename'],
            'scores': evaluation['scores'],
            'overall_score': evaluation['overall_score'],
            'created_at': evaluation['created_at'].isoformat(),
            'updated_at': evaluation['updated_at'].isoformat()
        }