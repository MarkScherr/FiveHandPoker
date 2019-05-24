remainingCards = 0
playerOneHand = [];
playerTwoHand = [];
playerOneHands = [];
playerTwoHands = [];
isPlayerTwoPlaying = true;
cardsPlaced = 0;

$(document).ready(function () {
  getDeck();
  $('#togBtn').click(function(){
    if(isPlayerTwoPlaying == true) {
      isPlayerTwoPlaying = false;
      clearBoard();
      getDeck();
    } else {
      isPlayerTwoPlaying = true;
        $("#playerTwoCard").show();
        clearBoard();
        getDeck();
    }
  });
});

function startGame(deckId) {

}
function getDeck() {
  deckId = "";
  $.ajax({
       type: 'GET',
       url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
       success: function(data, status) {
          deckId = data['deck_id'];
          remainingCards = data['remaining'];
          console.log(remainingCards);
          dealCards(deckId)
       },
       error: function() {
         alert('Cards did not load')
       }
   });
}

function dealCards(deckId) {
  console.log(deckId)
    $.ajax({
         type: 'GET',
         url: 'https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=12',
         success: function(data, status) {
            console.log(data);
            remainingCards = data['remaining'];
            $.each(data['cards'], function(index, card){
              cardValue = card['value'];
              cardSuit = card['suit'];
              cardImageImg = '<img id=\"' + cardValue + cardSuit + '\" src=\"' + card['image'] + '\">'
              if(index == 10) {
                if(isPlayerTwoPlaying){
                  $("#playerTwoCard").append(cardImageImg);
                  makeDraggableDroppable(cardValue, cardSuit);
                } else {
                    $("#playerTwoCard").hide();
                }
                playerTwoHand = [cardValue + cardSuit];

              } else if(index == 11) {
                $("#playerOneCard").append(cardImageImg);
                makeDraggableDroppable(cardValue, cardSuit);
                playerOneHand = [cardValue + cardSuit];

              } else if(index % 2 == 0) {
                $("#playerTwoRow").append(cardImageImg);
                makeDroppable(cardValue, cardSuit);
                playerTwoHand = [cardValue  + cardSuit];
                playerTwoHands.push(playerTwoHand);

              } else {
                $("#playerOneRow").append(cardImageImg);
                makeDroppable(cardValue, cardSuit);
                playerOneHand = [cardValue  + cardSuit];
                playerOneHands.push(playerOneHand);
                console.log(playerOneHands);
              }
            });
         },
         error: function() {
           alert('Cards did not load')
         }
     });

}

function dealHand(){
  $.ajax({
       type: 'GET',
       url: 'https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=2',
       success: function(data, status) {
          console.log(data);
          remainingCards = data['remaining'];
          $.each(data['cards'], function(index, card){
            cardValue = card['value'];
            cardSuit = card['suit'];
            marginLeft = ((remainingCards - 40)/2)*72;
            cardImageImg = '<img id=\"' + cardValue + cardSuit + '\" src=\"' + card['image'] + '\" style="margin-left:' + marginLeft + 'px">'
            if(index == 0) {
              if(isPlayerTwoPlaying){
                $("#playerTwoCard").append(cardImageImg);
                makeDraggableDroppable(cardValue, cardSuit);
              } else {
                  $("#playerTwoCard").hide();
              }
              playerTwoHand = [cardValue + cardSuit];

            } else {
              $("#playerOneCard").append(cardImageImg);
              makeDraggableDroppable(cardValue, cardSuit);
              playerOneHand = [cardValue + cardSuit];
            }
          });
       },
       error: function() {
         alert('Cards did not load')
       }
   });
}

function playGame() {
  if(remainingCards >= 2) {

    if(isPlayerTwoPlaying) {
      if(cardsPlaced == 2){
        if (confirm("Have you completed your turn?")) {
          cardsPlaced = 0;
          dealHand();
        } else {
          cardsPlaced = 1;
        }
      }
    } else {
      if(cardsPlaced == 1) {
        if (confirm("Have you completed your turn?")) {
          cardsPlaced = 0;
          dealHand();
        } else {
          cardsPlaced = 0;
        }
      }
    }
  }
}
function addToHand(card) {
  for(var i = 0 ; i < playerOneHands.length; i++ ) {
    for(var j = 0 ; j < playerOneHands[i].length; j++) {
      if(playerOneHands[i][j] == playerOneHand[0]) {
        playerOneHands[i].pop(playerOneHand[0])
      }
      if(playerOneHands[i][j] == card) {
        playerOneHands[i].push(playerOneHand[0]);
        cardsPlaced++;
        break;
      }
    }
  }
  if(isPlayerTwoPlaying) {
    for(var i = 0 ; i < playerTwoHands.length; i++ ) {
      for(var j = 0 ; j < playerTwoHands[i].length; j++) {
        if(playerTwoHands[i][j] == playerTwoHand[0]) {
          playerTwoHands[i].pop(playerTwoHand[0])
        }
        if(playerTwoHands[i][j] == card) {
          playerTwoHands[i].push(playerTwoHand[0]);
          cardsPlaced++;
          break;
        }
      }
    }
  }
  if((cardsPlaced == 2 && isPlayerTwoPlaying) ||
    (cardsPlaced >= 1)) {
    playGame();
  }
}

function makeUndroppable() {

}
function makeDroppable(value, suit) {
  $("#" + value + suit).droppable({
    drop: function(event, ui) {
      var position = $(event.toElement).position();
      var element = document.elementFromPoint(
        position.left,
        position.top
      );
      var draggableId = ui.draggable.attr("id");
      var droppableId = $(this).attr("id");

      addToHand(value+suit);
    }
  });
}

function clearBoard() {
  $("#playerOneRow").empty();
  $("#playerTwoRow").empty();
  $("#playerOneCard").empty();
  $("#playerTwoCard").empty();
}
function makeDraggableDroppable(value, suit) {
  $("#" + value + suit).draggable({ revert: "invalid" });
  makeDroppable(value,suit);
}
