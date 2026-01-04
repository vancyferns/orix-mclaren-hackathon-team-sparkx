from datetime import datetime
from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    documents = db.relationship('Document', backref='owner', lazy=True)

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_hash = db.Column(db.String(64), unique=True, nullable=False)
    # FIX: Use datetime.utcnow (no parentheses) to pass the function itself
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    analysis = db.relationship('AnalysisHistory', backref='document', uselist=False, lazy=True)

class AnalysisHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    result_json = db.Column(db.JSON, nullable=False)
    # FIX: Same here
    created_at = db.Column(db.DateTime, default=datetime.utcnow)