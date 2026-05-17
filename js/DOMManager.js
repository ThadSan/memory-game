export class DOMManager {


  /**
   * Ajoute toutes les images d'une collection sur le gameBoard
   * @param {Image[]} images
   */
  createCards(images) {
    const gameBoard = document.querySelector('.game-board');


    gameBoard.innerHTML = '';

    images.forEach((image)=> {
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