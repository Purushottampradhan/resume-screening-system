import re
from datetime import datetime

class ResumeEvaluator:
    """Intelligent resume evaluation engine"""
    
    # Keywords for each category
    AI_ML_KEYWORDS = [
        'machine learning', 'ml', 'artificial intelligence', 'ai',
        'deep learning', 'neural network', 'tensorflow'
    ]
    
    LLM_KEYWORDS = [
        'llm', 'transformer',
        'langchain', 'huggingface',
        'fine-tuning',
        'generative ai', 'llama', 'gemini'
    ]
    
    PYTHON_KEYWORDS = [
        'python'
    ]
    
    @staticmethod
    def calculate_keyword_match(text, keywords):
        """Calculate match score based on keyword presence"""
        text_lower = text.lower()
        matches = sum(1 for keyword in keywords if keyword.lower() in text_lower)
        return min((matches / len(keywords)) * 100, 100) if keywords else 0
    
    @staticmethod
    def extract_years_of_experience(text):
        print("parsed text for experience extraction,text",text)
        """Extract years of experience from resume"""

        try:
            # Regex to capture date ranges like 07/2024 - Present or 05/2022 - 11/2023
            date_ranges = re.findall(r'(\d{2}/\d{4})\s*-\s*(Present|\d{2}/\d{4})', text, re.IGNORECASE)
            
            total_months = 0
            current_date = datetime.now()
            
            for start, end in date_ranges:
                # Convert start date
                start_month, start_year = map(int, start.split('/'))
                start_date = datetime(start_year, start_month, 1)
                
                # Convert end date or use current date if 'Present'
                if end.lower() == "present":
                    end_date = current_date
                else:
                    end_month, end_year = map(int, end.split('/'))
                    end_date = datetime(end_year, end_month, 1)
                
                # Calculate difference in months
                months = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)
                total_months += months
            
            # Convert total months to years
            total_years = total_months / 12
            return round(total_years, 2)
        except Exception as e:
            print(f"Error extracting experience: {e}")
            return 0
    
    @staticmethod
    def evaluate(resume_text):
        """
        Evaluate resume and return scores
        """
        # Calculate individual scores
        ai_ml_score = ResumeEvaluator.calculate_keyword_match(resume_text, ResumeEvaluator.AI_ML_KEYWORDS)
        llm_score = ResumeEvaluator.calculate_keyword_match(resume_text, ResumeEvaluator.LLM_KEYWORDS)
        python_score = ResumeEvaluator.calculate_keyword_match(resume_text, ResumeEvaluator.PYTHON_KEYWORDS)
        
        # Experience score
        years = ResumeEvaluator.extract_years_of_experience(resume_text)
        experience_score = 100 if years >= 5 else (years / 5) * 100
        
        # Overall score (weighted average)
        overall_score = (ai_ml_score * 0.3 + llm_score * 0.2 + 
                        python_score * 0.3 + experience_score * 0.2)
        
        return {
            'ai_ml_match': round(ai_ml_score, 2),
            'llm_match': round(llm_score, 2),
            'python_match': round(python_score, 2),
            'experience_match': round(experience_score, 2),
            'overall_score': round(overall_score, 2)
        }