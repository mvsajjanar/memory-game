/*
 * Create a list that holds all of your cards
 */

var cardsArray = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor",
"fa fa-bolt", "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle",
"fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb",
"fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 
 /* Variables declaration */
 const container = document.querySelector('.container');
 const deck = document.createElement('ul'); /*For creating cards*/
 deck.className = "deck"; 
 restartButton = document.querySelector('.restart'); 
 starsList = document.querySelector(".stars"); /*List of Stars in the panel above deck*/
 stars = document.getElementsByClassName("panel"); /*List of Stars in the panel above deck*/
 moves = document.querySelector('.moves'); /*Count of number of moves*/
 let openedCards = []; /*To store cards which are open */
 let matchedCards = []; /*List of all matched pair of cards*/ 
 let modal = document.getElementById("myModal"); /*Modal for showing game completion*/
 let modalBtn = document.getElementsByClassName("close")[0]; /*Button for closing the Modal*/
 let playAgainBtn = document.getElementsByClassName("replay")[0]; /*Button for closing the Modal and reseting the game*/
 let hours = document.querySelector('.hours'); /*Timer */
 let minutes = document.querySelector('.minutes'); /*Timer */
 let seconds = document.querySelector('.seconds'); /*Timer */
 let nIntervId; /* Interval ID for stoping the timer*/
 var dupStarsList; /* Store the star rating to display in Modal*/
 
 
 /*Initialisation*/
 
 /*Begin the game with all 3 star rating*/
 stars[0].className = "panel fa fa-star checked";
 stars[1].className = "panel fa fa-star checked";
 stars[2].className = "panel fa fa-star checked";
 let timerOn = false; 
 let hrs = 0;
 let min = 0;
 let sec = 0;
 
 
 /* Display the cards for user to start the game*/
 shuffleAndDisplay();
 
 function shuffleAndDisplay() {
	shuffle(cardsArray);
	for(let i = 0; i < cardsArray.length; i++){
	const card = document.createElement('li');
	card.className = "card";
	card.innerHTML =`<i class="${cardsArray[i]}">`;
	deck.appendChild(card);
	}
	container.appendChild(deck);
 }
 
 
 
 
 
 /*Initialise counter and return an object to manipulate and access counter*/
 let counter = (function (){
	 let count = 0;
	 
	 return {
		incrementCnt: function(){
		 count += 1;
		 if (count === 18) {
			stars[2].className = "panel fa fa-star"; 
		 }
		 
		 else if (count === 24) {
			stars[1].className = "panel fa fa-star";  
		 }
		},
		
		getCnt: function(){
			return count;
		},
		
		clearCnt: function(){
			count = 0;
		}
		
	 }
 })();
 
 
 // Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 
 /*Event listener when a card is clicked*/
 deck.addEventListener("click", cardClicked);
 /*Event listener to reset the game when the reset button is clicked */
 restartButton.addEventListener("click", resetCards);
 
 
 
 function cardClicked(event){
	if (event.target.className === "card"){
		/*Start the timer*/
		if (!timerOn) {
			timerOn = true;
			startTimer();
		}
		/*Open the card clicked*/
		event.target.className = "card open show";
		/*Staore the card clicked for checking*/
		openedCards.push(event.target);
		/*If 2 cards are open then check whether they are matched or not*/
		if (openedCards.length === 2){
			/*Increment nuber of moves*/
			counter.incrementCnt();
			/*Show number of moves as 2 digits*/
			if (counter.getCnt() < 10) {
				moves.innerText = `0${counter.getCnt()} Moves`;
			}
			else {
				moves.innerText = `${counter.getCnt()} Moves`;
			}
			checkCards(openedCards);
			/*After checking the 2 cards, empty the temporary variable */
			openedCards = [];
		}
	}
	
	/*When all the cards are matched, open up the modal to congratulate the player*/
	if (matchedCards.length === 16) {
		yaay();
	}
 }
 
 function resetCards() {
	 /*Reset the timer to 00:00:00*/
	 if (timerOn) {
		timerOn = false;
		clearInterval(nIntervId);
	 }	
	 seconds.innerText = "00";
	 minutes.innerText = "00";
	 hours.innerText = "00";	
	 hrs = 0;
	 min = 0;
	 sec = 0;
	 
	 /*Reset counter*/
	 counter.clearCnt();
	 moves.innerText = "00 Moves";
	 
	 /*Empty matched cards array*/
	 matchedCards = [];
	 
	 /*Initialize star rating*/	
	 stars[0].className = "panel fa fa-star checked";
	 stars[1].className = "panel fa fa-star checked";
	 stars[2].className = "panel fa fa-star checked";
	 
	 
	 /*Shuffle cards and close all the cards*/
	 shuffle(cardsArray);	 
	 allCards = document.querySelectorAll('.card');
	 for(let i = 0; i < cardsArray.length; i++){
     allCards[i].className = "card";
	 allCards[i].innerHTML =`<i class="${cardsArray[i]}">`;
   }
 }
 
 /*Event listener on the close button to close the Modal*/
 modalBtn.onclick = function() {
  modal.style.display = "none";
}

/*Event listener on the play again button to close the Modal and reset the game*/
playAgainBtn.onclick = function() {
  modal.style.display = "none";
  resetCards();
}
 
 function checkCards(array){
	 /*If 2 cards are matched then store them in matched array and keep them opened else 
		 close the cards*/
	 if (array[0].firstChild.className === array[1].firstChild.className){
		matched(array);
	 }
	 else {
		 /*Stop listening until both the non matched are closed*/
		deck.removeEventListener("click", cardClicked); 
		notMatched(array);	
	 }
	 
	 return array;
 }
 
 function matched(array){
		array[0].className = "card match";
		array[1].className = "card match";
		matchedCards.push(array[0]);
		matchedCards.push(array[1]);
		return array;
	 
 }
 
 function notMatched(array) {
		/*add a class to the cards to show animation*/
	 	array[0].className = "card open show wrong";
		array[1].className = "card open show wrong";
		/*Wait until the animation completed and then close the cards*/
		setTimeout(function(){
			array[0].className = "card";
			array[1].className = "card";
			/*Start listening to open the cards again*/
			deck.addEventListener("click", cardClicked);
		}, 800);
		return array;
 }
 
 function yaay() {
	 /*Stop timer*/
	 clearInterval(nIntervId);
	 
	 /*Display greetings, Moves, Timing and rating in the Modal*/
	 message = document.querySelector('#winningMessage');
	 message.innerText = `Congratulations!!
	 Your Timing is: ${hours.innerText}:${minutes.innerText}:${seconds.innerText}
	 Moves: ${counter.getCnt()}
	 Rating:`;
	 
	 /*Get the star rating from panel and copy it to modal*/
	 dupStarsList = starsList.cloneNode(true);
	 message.appendChild(dupStarsList);
	 
	 modal.style.display = "block";
 }
 
 /*Timer function*/
 function startTimer() {
	nIntervId = setInterval(function() {
		 if(sec === 60) {
			 sec = 0;
			 min++;
		 }
		 
		 if(min === 60) {
			 min = 0;
			 hrs++;
		 }
		 
		 sec++
		 
		 if(sec < 10){
			 seconds.innerText = `0${sec}`;
		 }
		 else {
			 seconds.innerText = `${sec}`;
		 }
		 
		 if(min < 10){
			 minutes.innerText = `0${min}`;
		 }
		 else {
			 minutes.innerText = `${min}`;
		 }
		 
		 if(hrs < 10){
			 hours.innerText = `0${hrs}`;
		 }
		 else {
			 hours.innerText = `${hrs}`;
		 }
	 }, 1000)
 }
 
 
 
 
