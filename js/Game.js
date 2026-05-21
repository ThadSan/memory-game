import {imageCollections} from './ImageCollection.js';
import {ApiService} from './ApiService.js';

export class Game {
  #id;
  #pseudo;
  #difficulty;
  #cmp=0;
  #ref;
  #click = null;
  #pairesRestantes=0;
  #historiques=[]
  #enReplay = false;
  #gameEnded=false;

  async endGame(won) {
    if (this.#gameEnded) return;
    this.#gameEnded = true;

    clearInterval(this.#ref);

    document.querySelector('#end-screen').classList.remove('hidden')
    document.querySelector('#end-message').textContent = won ? 'Bravo !' : 'Dommage !';
    document.querySelector('#end-coups').textContent = this.#historiques.length / 2 + ' coups';
    document.querySelector('#end-time').textContent = 'Temps : '+ this.#cmp +' sec';

    if (won) {
      const scores = JSON.parse(localStorage.getItem('memory-scores') || '[]');
      scores.push({ name: this.#pseudo, difficulty: this.#difficulty, time: this.#cmp });
      localStorage.setItem('memory-scores', JSON.stringify(scores));
    }

    try {
      const result = await ApiService.updateGameResult(this.#id, this.#pairesRestantes);
      console.log('Fin de partie:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  startGame(id, pseudo, difficulty, collection, domManager) {
    this.#id = id;
    this.#pseudo = pseudo;
    this.#difficulty = difficulty;
    this.#historiques = [];
    this.#cmp = 0;
    this.#pairesRestantes = difficulty;
    this.#gameEnded = false;

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
    setTimeout(step, 500);
  }
}