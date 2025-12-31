const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    return {
        getName,
        getMark
    }
}

const GameBoard = () => {
    let board = [];
    for (let i = 0; i < 9; i++) {
        board[i] = " ";
    }
    const getBoard = () => board;
    const setCell = (index, mark) => {
        if (index < 0 || index > 8) return false;
        if (board[index] !== " ") return false;
        board[index] = mark;
        return true;
    }
    const isFull = () => {
        let flag = false;
        for (let i = 0; i < 9; i++) {
            if (board[i] == " ") {
                flag = true;
                break;
            }
        }
        return !flag;
    }
    const reset = () => {
        for (let i = 0; i < 9; i++) {
            board[i] = " ";
        }
    }
    return {
        getBoard,
        setCell,
        isFull,
        reset
    }
}

const Game = (a, b) => {
    const gameBoard = GameBoard();
    const players = [a, b];
    let playerIndex = 0;
    let gameOver = false;

    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const getCurrentPlayer = () => {
        return players[playerIndex];
    };

    const switchPlayer = () => {
        playerIndex = (playerIndex + 1) % 2;
    };

    const checkWin = (mark) => {
        const currentBoard = gameBoard.getBoard();

        for (let i = 0; i < winningCombos.length; i++) {
            let win = true;

            for (let j = 0; j < 3; j++) {
                if (currentBoard[winningCombos[i][j]] !== mark) {
                    win = false;
                    break;
                }
            }

            if (win) return true;
        }
        return false;
    };

    const resetGame = () => {
        gameBoard.reset();
        playerIndex = 0;
        gameOver = false;
    };

    const playTurn = (index) => {
        if (gameOver) return "GAME_OVER";

        const success = gameBoard.setCell(
            index,
            getCurrentPlayer().getMark()
        );

        if (!success) return "INVALID_MOVE";

        if (checkWin(getCurrentPlayer().getMark())) {
            gameOver = true;
            return `WIN:${getCurrentPlayer().getName()}`;
        }

        if (gameBoard.isFull()) {
            gameOver = true;
            return "DRAW";
        }
        switchPlayer();
        return "CONTINUE";
    }
    const getBoard = () => gameBoard.getBoard();

    return {
        playTurn,
        getCurrentPlayer,
        getBoard,
        resetGame
    }
}
let game;
const start = document.querySelector(".btn");
const inputs = document.querySelectorAll(".input1");
const container = document.querySelector(".container");
const form = document.querySelector(".input");
const reset = document.querySelector(".reset");
const newBtn = document.querySelector(".new");
const status = document.querySelector(".status");
start.addEventListener("click", (e) => {
    e.preventDefault();
    const a = inputs[0].value;
    const b = inputs[1].value;
    const p1 = Player(a, "X");
    const p2 = Player(b, "O");
    status.textContent = `${a}' turn`;
    game = Game(p1, p2);
    form.classList.add("hidden");
    container.classList.remove("hidden");
    container.classList.remove("animate");
    void container.offsetWidth;
    container.classList.add("animate");
    status.classList.add("animate");
    container.style.animationDelay = "0.1s";
    status.style.animationDelay = "0.3s";
    reset.classList.remove("hidden");
    reset.style.animationDelay = "0.2s";
});

const boxes = document.querySelectorAll(".box");
status.classList.remove("hidden");
boxes.forEach((box, index) => {
    box.addEventListener("click", (e) => {
        e.preventDefault();
        if (!game) return;

        const player = game.getCurrentPlayer();
        const result = game.playTurn(index);
        const board = game.getBoard();

        boxes.forEach((b, i) => {
            b.textContent = board[i];
        });

        if (result === "CONTINUE") {
            const name = game.getCurrentPlayer().getName();

            if (name.endsWith('s')) {
                status.textContent = `${name}' turn`;
            } else {
                status.textContent = `${name}'s turn`;
            }
        }
        else if (result.startsWith("WIN")) {
            status.classList.remove("hidden");
            status.textContent = `${player.getName()} wins!`;
            newBtn.classList.remove("hidden");
        }
        else if (result === "DRAW") {
            status.classList.remove("hidden");
            status.textContent = "It's a draw!";
            newBtn.classList.remove("hidden");
        }
    });
});


reset.addEventListener("click", (e) => {
    e.preventDefault();
    if (!game) return;
    game.resetGame();
    boxes.forEach(box => box.textContent = "");
    status.textContent = "";
    status.classList.add("hidden");
    newBtn.classList.add("hidden");
});

newBtn.addEventListener("click", (e) => {
    e.preventDefault();
    boxes.forEach(box => box.textContent = "");
    form.classList.remove("hidden");
    newBtn.classList.add("hidden");
    status.classList.add("hidden");
    container.classList.add("hidden");
    reset.classList.add("hidden");
    game.resetGame();
})