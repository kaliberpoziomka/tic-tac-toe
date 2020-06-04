let DOMmanipulator = (function() {

    // start form manipulation variables
    let $vsPlayer = $("#vs-player");
    let $form = $("form");
    let $startPage = $(".start");
    let $playerOneName;
    let $playerTwoName;
    let $h2 = $("h2");

    // start form movements
    $vsPlayer.click(function() {
        if ($form[0].style.display == "none") {
            $form.slideDown(300);
        } else {
            $form.slideUp(300);
        }
    });

    // submit functions
    $form.on("submit", function(e) {
        e.preventDefault();
        // form slide up
        setTimeout(function() {$startPage.slideUp(1000)},500);
        // player names storage
        $playerOneName = $("#player-one")[0].value;
        $playerTwoName = $("#player-two")[0].value;
    });

    // return field clicked
    let symbol = "x";
    let $gameboard = $(".gameboard");
    // tis variable disables interactivity with gameboard when game is over
    let gameStatus = true;

    $h2.text(`Player: ${symbol}`);

    $gameboard.click(function(e) {
        if (gameStatus == true) {
            // field number storage
            let field = Number(e.target.classList[0]);

            // emit field umber to PubSub
            events.emit("fieldClicked", field);

            // check if field already has symbol and change symbol
            if (e.target.textContent == "") {
                $(`.${field}`).text(symbol);

                // field value test
                if (symbol == "x") {
                    symbol = "o";
                } else {
                    symbol = "x";
                }
                $h2.text(`Player: ${symbol}`);
            }
        }
    });
    

    events.on("endGame", function(winner) {
        if (winner == "playerOne") {
            $h2.text(`Winner: ${$playerOneName}`);
        } else if (winner == "playerTwo") {
            $h2.text(`Winner: ${$playerTwoName}`);
        } else if (winner == "tie") {
            $h2.text(`It's a Draw!`);
        }
        $h2.css({"color": "orange"});
        gameStatus = false;
    });

    $("#restart").click(function() {
        location.reload();
    })

    events.on("winnerFields", function(winnerFields) {
        winnerFields.forEach(field => {
            $(`.${field}`).css({"color": "orange"});
        })
    });

})()



let GameLogic = (function() {
    // array of all moves on the board
    let movesArr = [];
    // array of moves made by playerOne
    let playerOneMoves = [];
    // array of moves made by playerTwo
    let playerTwoMoves = [];
    // player that last made a move
    let symbol = "o";

    // winner moves arrays
    let winnerMoves = [
        [1,2,3],
        [4,5,6],
        [7,8,9],
        [1,4,7],
        [2,5,8],
        [3,6,9],
        [1,5,9],
        [3,5,7],
    ];
        
    

        // subscribe to the "fieldClicked" event from PubSub
    events.on("fieldClicked", function(field) {
        
        // check if player didn't click at the same field again
        if (movesArr.length == 1 ||  movesArr[movesArr.length-1] != field) {
            // push move to array of all moves on the board
            movesArr.push(field);
            console.log("movesArr is: "+movesArr);
            
            // push moves to players moves and change player
            if (symbol == "x") {
                playerTwoMoves.push(field);
                playerTwoMoves.sort();
                symbol = "o";
            } else {
                playerOneMoves.push(field);
                playerOneMoves.sort();
                symbol = "x";
            }
        };


        // check if WIN!!
        if (movesArr.length > 3) {
            // arrays to test against every array in winnerMoves
            let playerOneTestArr = [];
            let playerTwoTestArr = [];
            let playerWon = false;

            // test playerOneMoves and playerTwoMoves against every array in winnerMoves
            winnerMoves.forEach(item => {
                playerOneTestArr = [];
                playerTwoTestArr = [];
                
                // loop through every number in current array in winnerMoves
                for (let i = 0; i < item.length; i++) {
                    // if numbers are the same then push number from playerOneMoves to playerOneTestArr
                    for (let k = 0; k < playerOneMoves.length; k++) {
                        if (item[i] == playerOneMoves[k]) {
                            playerOneTestArr.push(playerOneMoves[k]);
                        }
                    }
                    // same as above but with player two
                    for (let j = 0; j < playerTwoMoves.length; j++) {
                        if (item[i] == playerTwoMoves[j]) {
                            playerTwoTestArr.push(playerTwoMoves[j]);
                        }
                    }
                }
                // if test array and winner array are the same then alert winner, you need to use 
                // JSON.stringify because thats the way you can compare two arrays
                if (JSON.stringify(playerOneTestArr) == JSON.stringify(item)) {
                    events.emit("winnerFields", playerOneTestArr);
                    playerOneWinAlert();
                    playerWon = true;
                } else if (JSON.stringify(playerTwoTestArr) == JSON.stringify(item)) {
                    events.emit("winnerFields", playerTwoTestArr);
                    playerTwoWinAlert();
                    playerWon = true;
                }

            });
            if (movesArr.length == 9 && playerWon == false) {
                tieAlert();
            }
        }
    });
    
    function playerOneWinAlert() {
        setTimeout(function() {
            events.emit("endGame", "playerOne");
        }, 1);
    }

    function playerTwoWinAlert() {
        setTimeout(function() {
            events.emit("endGame", "playerTwo");
        }, 1);
    }
    function tieAlert() {
        setTimeout(function() {
            events.emit("endGame", "tie");
        }, 1);
    }

})()






