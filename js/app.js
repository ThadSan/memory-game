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


  // Todo À compléter
  const pseudo = document.querySelector('#pseudo').value.trim();
  const difficulty = document.querySelector('#difficulty').value;
  const collection = document.querySelector('#collection').value;

  try {
    // Todo Spécifier les paramètres de createGame()
    const data = await ApiService.createGame(pseudo, difficulty,collection);
    console.log('Success:', data, data.id);

    game.startGame(data.id,difficulty,collection, domManager);
    document.querySelector('.setup-form').classList.add('hidden')  ;
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
  console.log('clic thème');
  const theme = toggleTheme();
  document.querySelector('#themeToggle').textContent = theme === 'dark' ? '🌙' : '🌞';
});

// Lance le replay de la partie quand on clique sur "Revoir la partie"
document.querySelector('#btn-replay').addEventListener('click', () => {
  document.querySelector('#end-screen').classList.add('hidden');
  document.querySelectorAll('.card').forEach(card => card.classList.remove('flip'));
  game.replay();
});

// Retourne à l'accueil quand on clique sur "Nouvelle partie"
document.querySelector('#btn-new-game').addEventListener('click', () => {
  document.querySelector('.game-area').classList.add('hidden');
  document.querySelector('#end-screen').classList.add('hidden');
  document.querySelector('.setup-form').classList.remove('hidden');
});
// Arrête le replay et revient à l'accueil
document.querySelector('#stop-replay').addEventListener('click', () => {
  document.querySelector('#stop-replay').classList.add('hidden');
  document.querySelector('#abandon').classList.remove('hidden');
  document.querySelector('.game-area').classList.add('hidden');
  document.querySelector('.setup-form').classList.remove('hidden');
});
