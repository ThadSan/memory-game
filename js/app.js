import {DOMManager} from './DOMManager.js';
import {Game} from './Game.js';
import {ApiService} from './ApiService.js';
import {imageCollections} from './ImageCollection.js';
import { toggleTheme, applyTheme, loadTheme } from './Theme.js';

applyTheme(loadTheme())
const domManager = new DOMManager();
const game = new Game();

document.querySelector('.game-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const pseudo = document.querySelector('#pseudo').value.trim();
  const difficulty = document.querySelector('#difficulty').value;
  const collection = document.querySelector('#collection').value;

  try {
    const data = await ApiService.createGame(pseudo, difficulty, collection);
    game.startGame(data.id, pseudo, difficulty, collection, domManager);
    document.querySelector('.setup-form').classList.add('hidden');
    document.querySelector('.leaderboard').classList.add('hidden');
    document.querySelector('.game-area').classList.remove('hidden');
  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Erreur lors de la création de la partie');
  }
});

document.querySelector('#abandon').addEventListener('click', () => {
  game.endGame(false);
});

document.querySelector('#themeToggle').addEventListener('click', () => {
  const theme = toggleTheme();
  document.querySelector('#themeToggle').textContent = theme === 'dark' ? '🌙' : '🌞';
});

document.querySelector('#btn-replay').addEventListener('click', () => {
  document.querySelector('#end-screen').classList.add('hidden');
  document.querySelectorAll('.card').forEach(card => card.classList.remove('flip'));
  game.replay();
});

document.querySelector('#btn-new-game').addEventListener('click', () => {
  document.querySelector('.game-area').classList.add('hidden');
  document.querySelector('#end-screen').classList.add('hidden');
  document.querySelector('.setup-form').classList.remove('hidden');
  document.querySelector('.leaderboard').classList.remove('hidden');
  refreshLeaderboard();
});

document.querySelector('#stop-replay').addEventListener('click', () => {
  document.querySelector('#stop-replay').classList.add('hidden');
  document.querySelector('#abandon').classList.remove('hidden');
  document.querySelector('.game-area').classList.add('hidden');
  document.querySelector('.setup-form').classList.remove('hidden');
  document.querySelector('.leaderboard').classList.remove('hidden');
});

function refreshLeaderboard() {
  const diff = parseInt(document.querySelector('#lb-difficulty').value);
  const scores = JSON.parse(localStorage.getItem('memory-scores') || '[]');
  const filtered = scores
    .filter(s => s.difficulty == diff)
    .sort((a, b) => a.time - b.time)
    .slice(0, 10);

  const medals = ['🥇', '🥈', '🥉'];
  document.querySelector('#lb-body').innerHTML = filtered.length
    ? filtered.map((s, i) => `
        <tr>
          <td class="lb-rank">${medals[i] ?? i + 1}</td>
          <td class="lb-name">${s.name}</td>
          <td class="lb-time">${s.time}s</td>
        </tr>`).join('')
    : '<tr><td colspan="3" class="lb-empty">Aucun temps pour ce niveau.</td></tr>';
}

document.querySelector('#lb-difficulty').addEventListener('change', refreshLeaderboard);
refreshLeaderboard();