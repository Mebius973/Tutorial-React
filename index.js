import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
    {props.value}
    </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      key={i}
      />
      );
  }

  render() {
    var rows = [];
    for(var i = 0; i < 3; i++){
      var squares = [];
      for(var j = i * 3; j < i * 3 + 3; j++){
        squares.push(this.renderSquare(j));
      }
      rows.push(<div className="board-row" key={i}>{squares}</div>);
    }
    return (<div>{rows}</div>);
  }
}

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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move :
      'Go to game start';
      if(move == this.state.stepNumber){
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
            {findPlayedMove(history, move)}
          </li>
        );
      }
      else{
        return (
        <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
        {findPlayedMove(history, move)}
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
      <ol>{moves}</ol>
      </div>
      </div>
      );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
  );

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