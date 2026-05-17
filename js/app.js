import {DOMManager} from './DOMManager.js';
import {Game} from './Game.js';
import {ApiService} from './ApiService.js';
import {imageCollections} from './ImageCollection.js';

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
  game.endGame();
});
