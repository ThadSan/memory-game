import {imageCollections} from './ImageCollection.js';
import {ApiService} from './ApiService.js';


export class Game {
  /**
   * @type {number} id identifiant de la partie en cours
   */
  #id;
  #cmp=0;
  #ref;
  #click = null;
  #pairesRestantes=0;
  #historiques=[ ] //va permettre de stocker  le replay
  #enReplay = false;
  #gameEnded=false;




  async endGame(won) {

    if (this.#gameEnded) return;
    this.#gameEnded = true;

    console.log(this.#id)
    clearInterval(this.#ref);

    document.querySelector('#end-screen').classList.remove('hidden') // permet d'afficher l'ecran de fin-partie
    document.querySelector('#end-message').textContent = won ? 'Bravo !' : 'Dommage !'; // permet de savoir si il a perdue au abandonner
    document.querySelector('#end-coups').textContent = this.#historiques.length / 2 + ' coups';  //permet d'afficher le nombre de coups
    document.querySelector('#end-time').textContent = 'temps'+ this.#cmp +'sec'; // permet d'afficher le temps


    try {
      const result = await ApiService.updateGameResult(this.#id, this.#pairesRestantes);
      console.log('Fin de partie:', result);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Erreur lors de la fin de la partie');
    }





  }

  /**
   * Start a new game.
   * @param {number} id - The game ID.
   */
  startGame(id,difficulty,collection,domManager) {
    this.#id = id;
    this.#historiques = [];
    this.#cmp = 0;
    this.#pairesRestantes = difficulty;
    this.#gameEnded = false;

    // Todo À commpléter
    const img = imageCollections[collection]
    const diff = img.slice(0, difficulty);
    const copie = diff.concat(diff)

    for (let i = copie.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copie[i], copie[j]] = [copie[j], copie[i]];
    }
    domManager.createCards(copie)
    this.#ref = setInterval(() => {
      this.#cmp++
      document.querySelector('#chrono').textContent = this.#cmp

    }, 1000);


    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        if (this.#enReplay) return;
        if (this.#click == null) {
          this.#historiques.push([...document.querySelectorAll('.card')].indexOf(card));
          this.#click = card
          card.classList.add('flip')
        } else if (card === this.#click) {
          return;
        } else {
          this.#historiques.push([...document.querySelectorAll('.card')].indexOf(card));
          if (this.#click.querySelector('.card-back img').src === card.querySelector('.card-back img').src) {
            card.classList.add('flip')
            this.#click = null
            this.#pairesRestantes--;
            if (this.#pairesRestantes === 0) this.endGame(true);
          } else {
            card.classList.add('flip')
            const firstCard = this.#click;
            this.#click = null;
            setTimeout(() => {
              card.classList.remove('flip')
              firstCard.classList.remove('flip')
            }, 1000)
          }
        }
      })
    })



  }

  //  Rejoue automatiquement la partie en simulant chaque clic avec 1s de délai
  replay() {
    document.querySelector('#abandon').classList.add('hidden');
    document.querySelector('#stop-replay').classList.remove('hidden');

    this.#enReplay = true;
    const cards = document.querySelectorAll('.card');
    const history = [...this.#historiques];
    let i = 0;

    const step = () => {
      if (i >= history.length) {
        this.#enReplay = false;
        document.querySelector('#abandon').classList.remove('hidden');
        document.querySelector('#stop-replay').classList.add('hidden');
        document.querySelector('#end-screen').classList.remove('hidden')
        return;
      }
      const card1 = cards[history[i]];
      const card2 = cards[history[i + 1]];
      card1.classList.add('flip');
      setTimeout(() => {
        card2.classList.add('flip');
        setTimeout(() => {
          if (card1.querySelector('.card-back img').src !== card2.querySelector('.card-back img').src) {
            card1.classList.remove('flip');
            card2.classList.remove('flip');
          }
          i += 2;
          setTimeout(step, 800);
        }, 800);
      }, 800);
    };
    setTimeout(step, 500);// On rajoute un délai de 0.5 sec car sinon la première carte se retourne avant même le début du replay
  }



}
