import os
from flask import Flask, jsonify
from flask_cors import CORS
from player import AudioPlayer

app = Flask(__name__)

# O CORS é obrigatório para que o frontend (aberto no navegador via file:// ou outra porta) 
# não seja bloqueado ao tentar conversar com a API local
CORS(app)

# Resolve o caminho de forma absoluta a partir da localização de app.py
# Navegação: api -> backend -> software -> smart-jukebox -> audio -> music
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MUSIC_DIR = os.path.abspath(os.path.join(BASE_DIR, '../../../audio/music/'))

# Instancia o player na inicialização do servidor
player = AudioPlayer(music_dir=MUSIC_DIR)

@app.route('/songs', methods=['GET'])
def get_songs():
    return jsonify({"songs": player.get_songs()})

@app.route('/status', methods=['GET'])
def get_status():
    return jsonify(player.get_status())

@app.route('/play/<int:index>', methods=['POST'])
def play(index):
    success = player.play(index)
    if success:
        return jsonify({"status": "ok"}), 200
    return jsonify({"error": "Índice inválido ou erro no arquivo"}), 400

@app.route('/pause', methods=['POST'])
def pause():
    player.pause()
    return jsonify({"status": "ok"}), 200

@app.route('/resume', methods=['POST'])
def resume():
    player.resume()
    return jsonify({"status": "ok"}), 200

@app.route('/next', methods=['POST'])
def next_song():
    player.next()
    return jsonify({"status": "ok"}), 200

@app.route('/prev', methods=['POST'])
def prev_song():
    player.prev()
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    # host='0.0.0.0' permite que a API seja acessada de outros dispositivos na mesma rede, 
    # facilitando o teste via celular ou outro PC caso necessário.
    app.run(host='0.0.0.0', port=5000, debug=True)