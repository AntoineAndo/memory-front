import _ from 'lodash';
import './index.css';


/*

TODO
- Timer
- Progress bar
- BDD

In progress
- mécanique de partie (début, victoire, etc...)


*/

class Game {

	constructor(){
		this.firstCard = undefined;
		this.gameID = this._generateGameID(10);

		this.cards = this._generateCards(5)
		this.pairNumber = 5;

		//récupération des éléments du DOM
		this.boardElement = document.getElementById("board");
		this.playButton = document.getElementById("playButton");
		this.restartButton = document.getElementById("restart")

	}

	initializeBoard(){

		//Réinitialisation de la board
		this.boardElement.innerHTML = "";
		this.restartButton.classList.add("hidden");
		this.playButton.classList.remove("hidden");

		this.canPlay = false;

		//Génération du HTML des cartes
		var cardsString = this.cards.reduce((accumulator, card) => {
			return accumulator += '<div class="card" pair="'+card.pair+'">'+card.number+'</div>'
		}, "")

		//Insertion des cartes dans le plateau
		this.boardElement.insertAdjacentHTML("beforeend", cardsString );


		this.boardElement.addEventListener("click", this._checkClick.bind(this) );
		this.playButton.addEventListener("click", this.startGame.bind(this));
		this.restartButton.addEventListener("click", this.restartGame.bind(this));

	}

	startGame(e){
		this.playButton.classList.add("hidden")
		//start timer
		this.canPlay = true;

		this.pairFound = 0;
	}

	restartGame(e){
		this.initializeBoard();
	}


	set setFirstCard(card){
		this.firstCard = card;
	}


	_checkClick(e){
		if(e.target.getAttribute("class") == "card"){

			if(!this.canPlay)
				return;

			//Si aucune carte n'a été sélectionnée
			if(this.firstCard == undefined){
				e.target.classList.add("selected");

				this.firstCard = {
					"element" 	: e.target,
					"pair"  	: e.target.getAttribute("pair"),
					"value" 	: e.target.innerHTML
				}
			}else{

				//Si l'utilisateur clique sur la même carte
				if(e.target.getAttribute('pair') == this.firstCard.pair && e.target.innerHTML == this.firstCard.value){
					//Si même carte
					return;

				}else if(e.target.innerHTML == this.firstCard.value && e.target.getAttribute('pair') != this.firstCard.pair){
					//Si bonne carte
					this.canPlay = false;
					this.pairFound += 1;

					e.target.classList.add("selected");

					//Les cartes restent affichées quelques secondes avant d'être retournées et grisées
					setTimeout(()=>{
						let card1 = document.getElementsByClassName('selected').item(0)
						card1.classList.remove("selected");
						card1.classList.add("hidden")

						let card2 = document.getElementsByClassName('selected').item(0)
						card2.classList.remove("selected");
						card2.classList.add("hidden")

						this.canPlay = true;

					}, 1000)

				}else {
					//Si mauvaise carte

					e.target.classList.add("selected");
					this.canPlay = false;

					//Les cartes restent affichées quelques secondes avant d'être retournées
					setTimeout(()=>{
						document.getElementsByClassName('selected').item(0).classList.remove("selected")
						document.getElementsByClassName('selected').item(0).classList.remove("selected")

						this.canPlay = true;
					}, 1000)

				}
				this.firstCard = undefined;
			}
		}

		if(this.pairFound == this.pairNumber){
			this._victory();
		}
	}

	_victory(){
		alert("Victoire");
		this.restartButton.classList.remove("hidden");
	}

	_generateGameID(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;

		for ( var i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	}

	_generateCards(cardsNb) {

		let cards = [];

		for(var i = 1; i<=cardsNb; i++){
			cards.push(new Card(i, "A"));
			cards.push(new Card(i, "B"));
		}

		//Mélange
		cards.sort(() => Math.random() - 0.5);

		return cards;
	}
}

class Card{

	constructor(number, pair){
		this.number = number;
		this.pair = pair;
	}

}


// Attendre le chargement du DOM
document.addEventListener('DOMContentLoaded', ()=>{
	const game = new Game();
	game.initializeBoard();
})
