import re

class TextPreprocessor:
    """Text preprocessing utilities"""
    
    @staticmethod
    def clean_text(text):
        """Clean and normalize text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep some
        text = re.sub(r'[^a-zA-Z0-9\s\-+\.]', '', text)
        return text.strip()
    
    @staticmethod
    def tokenize(text):
        """Tokenize text into words"""
        return text.lower().split()
    
    @staticmethod
    def extract_emails(text):
        """Extract email addresses from text"""
        pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        return re.findall(pattern, text)
    
    @staticmethod
    def extract_phone_numbers(text):
        """Extract phone numbers from text"""
        pattern = r'[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}'
        return re.findall(pattern, text)