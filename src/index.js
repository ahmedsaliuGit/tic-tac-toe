import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{ backgroundColor: props.bgColor ? "palegreen" : "" }}
    >
      {props.value}
    </button>
  );
}

function Board(props) {
  function renderSquares(start) {
    const elem = [];
    for (let i = start; i < start + 3; i++) {
      elem.push(
        <Square
          key={i}
          value={props.squares[i]}
          onClick={() => props.onClick(i)}
          bgColor={
            i === props.bgColor[i - start] &&
            props.squares[i] === props.squares[props.bgColor[i - start]]
          }
        />
      );
    }
    return elem;
  }

  function renderBoard() {
    const elems = [];
    let pos;
    for (let i = 0; i < 3; i++) {
      pos = i !== 0 ? i * 3 : i;
      elems.push(
        <div className="board-row" key={i}>
          {renderSquares(pos)}
        </div>
      );
    }

    return elems;
  }

  return <div>{renderBoard()}</div>;
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true,
      isDesc: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history.at(-1);
    const squares = current.squares.slice();
    if (calculateWinner(squares).length > 0 || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({ stepNumber: step, xIsNext: step % 2 === 0 });
  }

  handleSortClick() {
    this.setState({ isDesc: !this.state.isDesc });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move}` : "Go to game start";

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;

    if (this.state.isDesc) {
      sortMovesDesc(moves);
    }

    if (winner.length) {
      status = `Winner: ${current.squares[winner[0]]}`;
    } else if (checkNull(current.squares)) {
      status = `Draw: Nobody wins`;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            bgColor={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <p>
            <button onClick={() => this.handleSortClick()}>
              Sort in {this.state.isDesc ? "Ascending" : "Descending"} Order
            </button>
          </p>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return [];
}

function checkNull(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) return false;
  }

  return true;
}

function sortMovesDesc(moves) {
  return moves.sort((a, b) => {
    if (b.key < a.key) {
      return -1;
    }

    if (b.key > a.key) {
      return 1;
    }

    return 0;
  });
}
