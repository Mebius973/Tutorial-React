import React from 'react';
import Square from './square';

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

export default Board;