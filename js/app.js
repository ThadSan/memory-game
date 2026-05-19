import {DOMManager} from './DOMManager.js';                                                                                                                                                                     
import {Game} from './Game.js';            
import {ApiService} from './ApiService.js';
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
    game.startGame(data.id, difficulty, collection, domManager);             
    document.querySelector('.setup-form').classList.add('hidden');
    document.querySelector('.game-area').classList.remove('hidden');                                                                                                                                            
  } catch (error) {                                                 
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