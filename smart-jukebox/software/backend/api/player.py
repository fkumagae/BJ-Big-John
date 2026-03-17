import os
import pygame

class AudioPlayer:
    def __init__(self, music_dir):
        self.music_dir = music_dir
        self.songs = []
        self.current_index = -1
        self.is_playing = False
        self.is_paused = False
        
        # Inicializa o mixer de áudio do Pygame para processamento em background
        pygame.mixer.init()
        self._load_songs()

    def _load_songs(self):
        """Lê o diretório e carrega os arquivos .mp3 em ordem alfabética."""
        if not os.path.exists(self.music_dir):
            print(f"Aviso: Diretório de áudio não encontrado - {self.music_dir}")
            return
            
        for file in sorted(os.listdir(self.music_dir)):
            lower = file.lower()
            if lower.endswith(".mp3") or lower.endswith(".mp3.mpeg") or lower.endswith(".mpeg"):
                self.songs.append(file)
                
    def get_songs(self):
        """Retorna a lista de músicas formatada para o frontend."""
        return [{"index": i, "title": song} for i, song in enumerate(self.songs)]

    def get_status(self):
        """Retorna o estado atual mantido na memória."""
        current_song = self.songs[self.current_index] if 0 <= self.current_index < len(self.songs) else None
        return {
            "is_playing": self.is_playing,
            "is_paused": self.is_paused,
            "current_index": self.current_index,
            "current_song": current_song
        }

    def play(self, index):
        """Carrega e toca a música correspondente ao índice."""
        if 0 <= index < len(self.songs):
            song_path = os.path.join(self.music_dir, self.songs[index])
            try:
                # O pygame.mixer.music lida com um stream de áudio por vez (ideal para jukebox)
                pygame.mixer.music.load(song_path)
                pygame.mixer.music.play()
                
                self.current_index = index
                self.is_playing = True
                self.is_paused = False
                return True
            except Exception as e:
                print(f"Erro ao tocar arquivo de áudio: {e}")
                return False
        return False

    def pause(self):
        """Pausa a execução atual do mixer."""
        if self.is_playing and not self.is_paused:
            pygame.mixer.music.pause()
            self.is_paused = True
            return True
        return False

    def resume(self):
        """Retoma a execução do mixer de onde parou."""
        if self.is_playing and self.is_paused:
            pygame.mixer.music.unpause()
            self.is_paused = False
            return True
        return False

    def next(self):
        """Avança para a próxima música, retornando ao início se chegar ao fim da lista."""
        if not self.songs:
            return False
            
        next_index = (self.current_index + 1) % len(self.songs)
        return self.play(next_index)

    def prev(self):
        """Volta para a música anterior, indo para a última se estiver na primeira."""
        if not self.songs:
            return False
            
        prev_index = (self.current_index - 1) % len(self.songs)
        return self.play(prev_index)
