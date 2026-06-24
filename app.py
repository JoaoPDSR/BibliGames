from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime

app = Flask(__name__)

# Configuração do banco de dados
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'games.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# Modelo de dados
class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    platform = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(4), nullable=True)
    rating = db.Column(db.Float, nullable=True)
    soundtrack = db.Column(db.Float, nullable=True)
    gameplay = db.Column(db.Float, nullable=True)
    story = db.Column(db.Float, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    logo = db.Column(db.LongText, nullable=True)  # Armazena imagem em Base64
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'platform': self.platform,
            'year': self.year,
            'rating': self.rating,
            'soundtrack': self.soundtrack,
            'gameplay': self.gameplay,
            'story': self.story,
            'notes': self.notes,
            'logo': self.logo,
            'created_at': self.created_at.isoformat()
        }

# Rotas da API

@app.route('/api/games', methods=['GET'])
def get_games():
    """Obtém todos os jogos ordenados por data de criação (mais recentes primeiro)"""
    games = Game.query.order_by(Game.created_at.desc()).all()
    return jsonify([game.to_dict() for game in games])

@app.route('/api/games', methods=['POST'])
def add_game():
    """Adiciona um novo jogo"""
    try:
        data = request.get_json()
        
        # Validação dos campos obrigatórios
        if not data.get('title') or not data.get('platform'):
            return jsonify({'error': 'Título e plataforma são obrigatórios'}), 400
        
        new_game = Game(
            title=data.get('title'),
            platform=data.get('platform'),
            year=data.get('year', ''),
            rating=data.get('rating'),
            soundtrack=data.get('soundtrack'),
            gameplay=data.get('gameplay'),
            story=data.get('story'),
            notes=data.get('notes', ''),
            logo=data.get('logo')
        )
        
        db.session.add(new_game)
        db.session.commit()
        
        return jsonify(new_game.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/games/<int:game_id>', methods=['DELETE'])
def delete_game(game_id):
    """Deleta um jogo específico"""
    try:
        game = Game.query.get(game_id)
        if not game:
            return jsonify({'error': 'Jogo não encontrado'}), 404
        
        db.session.delete(game)
        db.session.commit()
        
        return jsonify({'message': 'Jogo removido com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/games/clear', methods=['DELETE'])
def clear_games():
    """Limpa todos os jogos"""
    try:
        Game.query.delete()
        db.session.commit()
        return jsonify({'message': 'Todos os jogos foram removidos'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Verifica a saúde da API"""
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
