export class DOMManager {

  #bgAudio;
  #gameAudio;
  #flipAudio;
  #bgEnabled = false;
  #flipEnabled = true;
  #inGame = false;
  #flipBtn;
  #bgBtn;

  constructor() {
    this.#bgAudio = new Audio('assets/sounds/bg-music.mp3');
    this.#bgAudio.loop = true;
    this.#bgAudio.volume = 0.4;

    this.#gameAudio = new Audio('assets/sounds/game-music.mp3');
    this.#gameAudio.loop = true;
    this.#gameAudio.volume = 0.4;

    this.#flipAudio = new Audio('assets/sounds/card-flip.mp3');
    this.#flipAudio.volume = 0.8;

    this.#createBgMusicButton();
    this.#createFlipSoundButton();
  }

  #createBgMusicButton() {
    const btn = document.createElement('button');

    btn.title = 'Musique de fond';

    btn.style.cssText =
      'position:fixed;top:1rem;right:5rem;background:none;border:none;cursor:pointer;font-size:1.5rem;';

    btn.textContent = this.#bgEnabled ? '🎵' : '🔇';

    document.body.appendChild(btn);

    this.#bgBtn = btn;

    btn.addEventListener('click', () => {
      this.#bgEnabled = !this.#bgEnabled;

      if (this.#bgEnabled) {
        const active = this.#inGame
          ? this.#gameAudio
          : this.#bgAudio;

        active.play().catch(() => {});
      } else {
        this.#bgAudio.pause();
        this.#gameAudio.pause();
      }

      btn.textContent = this.#bgEnabled ? '🎵' : '🔇';
    });
  }

  #createFlipSoundButton() {
    const btn = document.createElement('button');

    btn.title = 'Son des cartes';

    btn.style.cssText =
      'position:fixed;top:1rem;right:8.5rem;background:none;border:none;cursor:pointer;font-size:1.5rem;display:none;';

    btn.textContent = '🃏';

    document.body.appendChild(btn);

    this.#flipBtn = btn;

    btn.addEventListener('click', () => {
      this.#flipEnabled = !this.#flipEnabled;
      btn.textContent = this.#flipEnabled ? '🃏' : '🔕';
    });
  }

  startGameMusic() {
    this.#inGame = true;

    // Stop musique menu
    this.#bgAudio.pause();
    this.#bgAudio.currentTime = 0;

    // Lance seulement si activé
    if (this.#bgEnabled) {
      this.#gameAudio.play().catch(() => {});
    }
  }

  stopGameMusic() {
    this.#inGame = false;

    this.#gameAudio.pause();
    this.#gameAudio.currentTime = 0;

    // Relance musique menu seulement si activé
    if (this.#bgEnabled) {
      this.#bgAudio.play().catch(() => {});
    }
  }

  playFlip() {
    if (!this.#flipEnabled) return;

    this.#flipAudio.currentTime = 0;
    this.#flipAudio.play().catch(() => {});
  }

  showFlipButton() {
    this.#flipBtn.style.display = '';
  }

  hideFlipButton() {
    this.#flipBtn.style.display = 'none';
  }

  createCards(images) {
    const gameBoard = document.querySelector('.game-board');

    gameBoard.innerHTML = '';

    images.forEach((image) => {
      const card = document.createElement('div');

      card.classList.add('card');

      card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="./assets/images/mask1.jpg" alt="hidden card">
        </div>

        <div class="card-back">
          <img src="${image.url}" alt="${image.name}">
        </div>
      </div>
      `;

      gameBoard.appendChild(card);
    });
  }
}