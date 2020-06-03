let DOMmanipulator = (function() {

    // start form manipulation variables
    let $vsPlayer = $("#vs-player");
    let $form = $("form");
    let $startPage = $(".start");
    let $playerOneName;
    let $playerTwoName;

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
        console.log($playerOneName);
        console.log($playerTwoName);
    });

    // return field clicked
    let symbol = "x";
    let $gameboard = $(".gameboard");

    $gameboard.click(function(e) {
        // field number storage
        let field = Number(e.target.classList[0]);
        console.log(field);
        console.log(e.target.textContent)

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
        }
    });

    events.on("endGame", function(winner) {
            if (winner == "playerOne") {
                $("h2").text(`Winner: ${$playerOneName}`);
            } else if (winner == "playerTwo") {
                $("h2").text(`Winner: ${$playerTwoName}`);
            }

    });

    $("#restart").click(function() {
        location.reload();
    })


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
        // push move to array of all moves on the board
        movesArr.push(field);
        // check if player didn't click at the same field again
        if (movesArr.length == 1 ||  movesArr[movesArr.length-2] != field) {
            console.log("You just clicked field number" + field);
            
            // push moves to players moves and change player
            if (symbol == "x") {
                playerTwoMoves.push(field);
                playerTwoMoves.sort();
                console.log(playerTwoMoves);
                symbol = "o";
            } else {
                playerOneMoves.push(field);
                playerOneMoves.sort();
                console.log(playerOneMoves);
                symbol = "x";
            }
        };


        // check if WIN!!
        if (movesArr.length == 5 || movesArr.length == 6) {
            winnerMoves.forEach(item => {
                if (JSON.stringify(item) == JSON.stringify(playerOneMoves)) {
                    playerOneWinAlert();
                } else if (JSON.stringify(item) == JSON.stringify(playerTwoMoves)) {
                    playerTwoWinAlert();
                }
            })
        } else if (movesArr.length == 7 || movesArr.length == 8) {
            // splice player moves so they have the same lenght
            let playerOneFirst = [...playerOneMoves];
            playerOneFirst.splice(3, 1);

            let playerTwoFirst = [...playerTwoMoves];
            playerTwoFirst.splice(3, 1);

            let playerOneLast = [...playerOneMoves];
            playerOneLast.splice(0, 1);

            let playerTwoLast = [...playerTwoMoves];
            playerTwoLast.splice(0, 1);

            winnerMoves.forEach(item => {
                if (JSON.stringify(item) == JSON.stringify(playerOneFirst)) {
                    playerOneWinAlert();
                } else if (JSON.stringify(item) == JSON.stringify(playerTwoFirst)) {
                    playerTwoWinAlert();
                } else if (JSON.stringify(item) == JSON.stringify(playerOneLast)) {
                    playerOneWinAlert();
                } else if (JSON.stringify(item) == JSON.stringify(playerTwoLast)) {
                    playerTwoWinAlert();
                }
            });
        } else if (movesArr.length == 9) {
            let playerOneFirst = [...playerOneMoves];
            playerOneFirst.splice(3, 2);
            
            let playerTwoFirst = [...playerTwoMoves];
            playerTwoFirst.splice(3, 2);

            let playerOneLast = [...playerOneMoves];
            playerOneLast.splice(0, 2);

            let playerTwoLast = [...playerTwoMoves];
            playerTwoLast.splice(0, 2);

            let playerOneMiddle = [...playerOneMoves];
            playerOneMiddle.splice(0, 1);
            playerOneMiddle.splice(3, 1);

            let playerTwoMiddle = [...playerOneMoves];
            playerTwoMiddle.splice(0, 1);
            playerTwoMiddle.splice(3, 1);

            winnerMoves.forEach(item => {
                if (JSON.stringify(item) == JSON.stringify(playerOneFirst)) {
                    playerOneWinAlert();
                } else if (JSON.stringify(item) == JSON.stringify(playerTwoFirst)) {
                    playerTwoWinAlert();
                } else if (JSON.stringify(item) == JSON.stringify(playerOneLast)) {
                    playerOneWinAlert();
                } else if (JSON.stringify(item) == JSON.stringify(playerTwoLast)) {
                    playerTwoWinAlert();
                } else if (JSON.stringify(item) == JSON.stringify(playerOneMiddle)) {
                    playerOneWinAlert();
                } else if (JSON.stringify(item) == JSON.stringify(playerTwoMiddle)) {
                    playerTwoWinAlert();
                }
            });
        }
    });
    
    function playerOneWinAlert() {
        setTimeout(function() {
            events.emit("endGame", "playerOne")
        }, 100);
    }

    function playerTwoWinAlert() {
        setTimeout(function() {
            events.emit("endGame", "playerTwo")
        }, 100);
    }

})()






