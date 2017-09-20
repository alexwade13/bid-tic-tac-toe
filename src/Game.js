import React, { Component } from 'react';
import Board from './Board.js'

import './Game.css';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      xBid:1000,
      oBid:1000,
      xBank:100,
      oBank:100,
      oLastBid:0,
      xLastBid:0,
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      showBid:0,
      canMove:false
    };
  }

  handleClick(i) {
    if (this.state.canMove === false){
      return false;
    }
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      xBid:999,
      canMove:false
    });

  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }



  bid(isX){
    var {xBid, xBank, oBid, oBank} = this.state
    
    var xIsNext
    while(xBid > xBank){
      xBid = document.getElementById("bidX").value
    }

    while(oBid > oBank){
      oBid = document.getElementById("bidO").value
    }
    console.log(oBid,xBid)
    if (oBid > xBid){
      xIsNext = false
      xBank += parseInt(oBid)
      oBank -= parseInt(oBid)
    } else if (oBid < xBid) {
      xIsNext = true
      oBank += parseInt(xBid)
      xBank -= parseInt(xBid)
    } else {
      return false;
    }

    document.getElementById("bidX").value = null
    document.getElementById("bidO").value = null

    this.setState({xBank:xBank,oBank:oBank, xBid:1000,oBid:1000, xLastBid:xBid,oLastBid:oBid, xIsNext:xIsNext,canMove:true})
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    var { xBank,  oBank, oLastBid, xLastBid} = this.state
    console.log("rendering")
    
    const moves = history.map((step, move) => {
      const desc = move ? "Move #" + move : "Game start";
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div id="popupX">
          <div>Enter Password:</div>
          <input id="bidX" type="password"/>
        </div>

        <div id="popupO">
          <div>Enter Password:</div>
          <input id="bidO" type="password"/>
        </div>

        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>

        <div className="game-info">
          <div>{status}</div>
          <div>xBank:{xBank}</div>
          <div>oBank:{oBank}</div>
          <div>xLastBid:{xLastBid}</div>
          <div>oLastBid:{oLastBid}</div>
          <ol>{moves}</ol>
        </div>
        <h1 onClick={this.bid.bind(this)}>BID</h1>
      </div>
    );
  }
}

// ========================================


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;