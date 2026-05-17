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


  async endGame() {
    // Todo À compléter




    clearInterval(this.#ref);
    document.querySelector('.game-area').classList.add('hidden');
    document.querySelector('.setup-form').classList.remove('hidden');

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
    this.#cmp = 0;
    this.#pairesRestantes = difficulty;

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
        if (this.#click == null) {
          this.#click = card
          card.classList.add('flip')
        } else if (card === this.#click) {
          return;
        } else {
          if (this.#click.querySelector('.card-back img').src === card.querySelector('.card-back img').src) {
            card.classList.add('flip')
            this.#click = null
            this.#pairesRestantes--;
            if (this.#pairesRestantes === 0) this.endGame();
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


    // Todo À compléter


  }
}
