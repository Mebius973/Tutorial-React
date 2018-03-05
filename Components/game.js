import React from 'react';
import Board from './board';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      selectedMove: -1,
      xIsNext: true,
      reverseHistoric: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  sortHistoric(){
    this.setState({
      reverseHistoric: !this.state.reverseHistoric,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const reverseHistoric = this.state.reverseHistoric;
    const sortOrder = reverseHistoric ? 'Newest to Oldest' : 'Oldest to Newest' ;

    const moves = history.map((step, move) => {
      const moveNumber = reverseHistoric ? (history.length - move - 1) : move;
      const desc = moveNumber ?
      'Go to move #' + moveNumber :
      'Go to game start';
      if(moveNumber === this.state.stepNumber){
        return (
          <li key={moveNumber}>
            <button onClick={() => this.jumpTo(moveNumber)}><b>{desc}</b></button>
            {findPlayedMove(history, moveNumber)}
          </li>
        );
      }
      else{
        return (
        <li key={moveNumber}>
          <button onClick={() => this.jumpTo(moveNumber)}>{desc}</button>
          {findPlayedMove(history, moveNumber)}
        </li>
        );
      }
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
      <div className="game-board">
      <Board
      squares={current.squares}
      onClick={(i) => this.handleClick(i)}
      />
      </div>
      <div className="game-info">
      <div>{status}</div>
      <div>
        <p>Historic :</p>
        <button onClick={() => this.sortHistoric()}>Sort: {sortOrder}</button>
      </div>
        <ol reversed={reverseHistoric}>{moves}</ol>
      </div>
      </div>
      );
  }
}

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
      return squares[a];
    }
  }
  return null;
}

function findPlayedMove(history, move){
  if(move > 0){
    var prefix = " " + (move % 2 === 0 ? 'O' : 'X') + ' turn. Played: ';
    var result = "none";
    var currentState = history[move];
    var previousState = history[move - 1];
    for(var i = 0; i < currentState.squares.length; i++){
      if(currentState.squares[i] !== previousState.squares[i]){
        result = "(" + Math.trunc(i / 3) + "," + (i % 3) + ")";
      }
    }
    return prefix + result;
  }
  else{
    return '';
  }
}

export default Game;