const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//  6 x 6 board
//  Wins at 4

function makeBoard(n) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push([]);
  }
  return array;
}


class Game {
  constructor(p1, p2) {
    this.board = makeBoard(6);
    this.player1 = p1;
    this.player2 = p2;
    this.currentTurn = p1;
  }

  addStone(x) {
    if (this.board[x].length === this.board.length) {
      return null;
    }

    const stone = this.currentTurn === this.player1 ? 'X' : 'O';
    this.board[x].push(stone);
  }

  checkBoardForWinner(x) {
    const stone = this.currentTurn === this.player1 ? 'X' : 'O';
    // Vertical
    let count = 0;
    let column = this.board[x];
    for (let i = column.length - 1;  i > column.length - 5; i++) {
      if (column[i] === stone) {
        count += 1;
      } else {
        break;
      }
    }

    if (count === 4) {
      return true;
    }

    // Check horizontal
    count = 0;
    let y = this.board[x].length - 1;
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[x][i] === stone) {
        count += 1;
      } else {
        count = 0;
      }

      if (count === 4) {
        return true;
      }
    }

    // Major Diagonal
    let [xCurr, yCurr] = (x - y) < 0 ? [0, y - x] : [x - y, 0];
    count = 0;
    while (xCurr < this.board.length && yCurr < this.board.length) {
      if (this.board[xCurr][yCurr] === stone) {
        count += 1;
      } else {
        count = 0;
      }

      if (count === 4) {
        return true;
      }
      xCurr += 1;
      yCurr += 1;
    }

    // Minor Diagonal
    [xCurr, yCurr] = (x + y - this.board.length + 1) >= 0 ? [x + y - this.board.length + 1, this.board.length- 1] : [0, x + y];

    count = 0;

    while (xCurr < this.board.length && yCurr >= 0) {
      if (this.board[xCurr][yCurr] === stone) {
        count += 1;
      } else {
        count = 0;
      }

      if (count === 4) {
        return true;
      }

      xCurr += 1;
      yCurr -= 1;
    }

    // If none, return false;
    return false;
  }

  askForStone(reasked) {
    const player = this.currentTurn;
    const callback = (answer) => {
      const colNum = parseInt(answer.trim());
      if (!isNaN(colNum) && colNum >= 0 && colNum < this.board.length && this.board[colNum].length < this.board.length) {
        this.addStone(colNum);
        this.printBoard();
        if (this.checkBoardForWinner(colNum)) {
          console.log(`${player.name} has won!`);
          process.exit(1);
        }

        this.flipTurn();
        this.askForStone();
      } else {
        this.askForStone(true);
      }
    };

    if (!reasked) {
      rl.question(`Please ${player.name}, enter the column num to place your stone: `, callback);
    } else {
      rl.question(`Please ${player.name}, re-enter the column num to place your stone correctly: `, callback);
    }
  }

  flipTurn() {
    if (this.currentTurn === this.player1) {
      this.currentTurn = this.player2;
    } else {
      this.currentTurn = this.player1;
    }
  }

  printBoard() {
    this.board.forEach((row, i) => {
      console.log(i, row);
    });
  }

  start() {
    this.askForStone();
  }
}

const p1 = { name: 'Alex' };
const p2 = { name: 'Gil' };

const game = new Game(p1, p2);

game.start();