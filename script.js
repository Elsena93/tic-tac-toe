//Global variable

// Make object for board and its method with module pattern
const Board = (() => {

    let boardValue = [['0,0', '0,1', '0,2'],
                    ['1,0', '1,1', '1,2'],
                    ['2,0', '2,1', '2,2']];

    const getBoardValue = (a, b) => boardValue[a][b];

    const assignBoardValue = (a, b, playerSymbol) => boardValue[a][b] = playerSymbol;

    const resetBoardValue = () => {
        boardValue.forEach(rowBoard => {
            const rowIndex = boardValue.indexOf(rowBoard);
            rowBoard.forEach(columnBoard => {
                const columnIndex = rowBoard.indexOf(columnBoard);
                boardValue[rowIndex][columnIndex] = `${rowIndex},${columnIndex}`;
            });
        });
    }

    const assignBoardDisplay = function (a, b, playerSymbol) {
        const boardPosition = document.querySelector(`.pos-${a}${b}`);
        boardPosition.innerText = playerSymbol;
    };

    const resetBoardDisplay = () => {
        const gameBoard = document.querySelectorAll('.column');

        gameBoard.forEach(element => {
            element.innerText = '';
        });
    };

    // Check each winning combination horizontal, diagonal, vertical
    const checkWin = function (player) {

        const winCombination = {
            'horizontal-0' : (getBoardValue(0,0) === getBoardValue(0,1) &&
                                getBoardValue(0,0) === getBoardValue(0,2) &&
                                getBoardValue(0,1) === getBoardValue(0,2)),
            'horizontal-1' : (getBoardValue(1,0) === getBoardValue(1,1) &&
                                getBoardValue(1,0) === getBoardValue(1,2) &&
                                getBoardValue(1,1) === getBoardValue(1,2)),
            'horizontal-2' : (getBoardValue(2,0) === getBoardValue(2,1) &&
                                getBoardValue(2,0) === getBoardValue(2,2) &&
                                getBoardValue(2,1) === getBoardValue(2,2)),
            'vertical-0' : (getBoardValue(0,0) === getBoardValue(1,0) &&
                                getBoardValue(0,0) === getBoardValue(2,0) &&
                                getBoardValue(1,0) === getBoardValue(2,0)),
            'vertical-1' : (getBoardValue(0,1) === getBoardValue(1,1) &&
                                getBoardValue(0,1) === getBoardValue(2,1) &&
                                getBoardValue(1,1) === getBoardValue(2,1)),
            'vertical-2' : (getBoardValue(0,2) === getBoardValue(1,2) &&
                                getBoardValue(0,2) === getBoardValue(2,2) &&
                                getBoardValue(1,2) === getBoardValue(2,2)),
            'diagonal-1' : (getBoardValue(0,0) === getBoardValue(1,1) &&
                                getBoardValue(0,0) === getBoardValue(2,2) &&
                                getBoardValue(1,1) === getBoardValue(2,2)),
            'diagonal-2' : (getBoardValue(0,2) === getBoardValue(1,1) &&
                                getBoardValue(0,2) === getBoardValue(2,0) &&
                                getBoardValue(1,1) === getBoardValue(2,0)),
        }

        if (winCombination["horizontal-0"] || winCombination["horizontal-1"] || winCombination["horizontal-2"] ||
        winCombination["vertical-0"] || winCombination["vertical-1"] || winCombination["vertical-2"] ||
        winCombination["diagonal-1"] || winCombination["diagonal-2"]) {
            console.log(`${player.getName()} Win!`);
            Game.removeBoxesListener(); //Disable all boxes

        }
    }
    
    return {
        getBoardValue,
        assignBoardValue, resetBoardValue,
        assignBoardDisplay, resetBoardDisplay,
        checkWin,
    };
}
)();

// Make object for player and its method with factory pattern
const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {
        getName, getSymbol,
    };
}

// Make object for game-controller and its method with module pattern

const Game = (() => {
    const playerOne = Player('Player #1', 'X');
    const playerTwo = Player('Player #2', 'O');
    let currentTurn = 'none';

    const turnSign = document.querySelector('.turn');
    const updateTurnSign = (player) => turnSign.innerText = player.getName();

    const resetButton = document.querySelector('button');
    resetButton.addEventListener('click', resetClick);

    function resetClick () {
        if (currentTurn === 'none') {
            console.log('first player Start!');
            currentTurn = playerOne;
            updateTurnSign(currentTurn);
            resetButton.innerText = 'RESET';
        } else {
            console.log('RESET: first player Start!');
            currentTurn = playerOne;
            turnSign.innerHTML = playerOne.getName();
            Board.resetBoardValue();
            Board.resetBoardDisplay();
            addBoxesListener();
        };
    };

    //Function to add listener for all boxes
    const addBoxesListener = () => {
        const gameBoard = document.querySelectorAll(".column");
        gameBoard.forEach(element => {
            element.addEventListener('click', boardClick);
    });
    };

    //Populate listener for the first time
    addBoxesListener();

    //Function to add listener for all boxes
    const removeBoxesListener = () => {
        const gameBoard = document.querySelectorAll(".column");
        gameBoard.forEach(element => {
            element.removeEventListener('click', boardClick);
        });
    }

    //Function to disable a box in board if already filled by either player
    const disableBox = (element) => {
        element.removeEventListener('click', boardClick);
    }

    function boardClick(e) {

        const target = e.target;
        const targetData = e.target.dataset;
        
        if (currentTurn === 'none') {
            currentTurn = playerOne;
            Board.assignBoardValue(targetData['row'], targetData['column'], currentTurn.getSymbol());
            Board.assignBoardDisplay(targetData['row'], targetData['column'], currentTurn.getSymbol());
            Board.checkWin(currentTurn);
            disableBox(target);
            currentTurn = playerTwo;
            updateTurnSign(currentTurn);
        } else if (currentTurn === playerTwo) {
            Board.assignBoardValue(targetData['row'], targetData['column'], currentTurn.getSymbol());
            Board.assignBoardDisplay(targetData['row'], targetData['column'], currentTurn.getSymbol());
            Board.checkWin(currentTurn);
            disableBox(target);
            currentTurn = playerOne;
            updateTurnSign(currentTurn);
        } else {
            Board.assignBoardValue(targetData['row'], targetData['column'], currentTurn.getSymbol());
            Board.assignBoardDisplay(targetData['row'], targetData['column'], currentTurn.getSymbol());
            Board.checkWin(currentTurn);
            disableBox(target);
            currentTurn = playerTwo;
            updateTurnSign(currentTurn);
        }
    }

    return {
        removeBoxesListener
    };

})();


// Testing

// const testConstrutor = function () {
//     this.hello = () => console.log('hello');
//     this.hi = "Hi";
//     this.button = () => document.querySelector('button');
// }

// const test = new testConstrutor();

// const foo = (() => {
//     let count = 0;
    
//     const addCount = () => count += 1
//     const getCount = () => count

//     // if (count > 3) {
//     //     count = 0;
//     // }

//     return {
//         count, getCount, addCount
//     }
// })();