import React, { Component } from 'react';
import Board from './Board.js'

import './Game.css';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      xBid:1000,
      oBid:1000,
      
      oLastBid:0,
      xLastBid:0,
      history: [
        {
          squares: Array(9).fill(null),
          xBank:100,
          oBank:100,
          xLastBid:0,
          oLastBid:0
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

    var { xBank, oBank, oLastBid, xLastBid} = this.state

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          xBank:xBank,
          oBank:oBank,
          xLastBid:xLastBid,
          oLastBid:oLastBid

        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      xBid:999,
      canMove:false
    });

  }

  jumpTo(step) {
    const history = this.state.history;
    const current = history[step];
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      oBank: current.oBank,
      xBank: current.xBank

    });
  }



  bid(isX){
    var xBid, xBank, oBid, oBank
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    
    var xIsNext
    
    
    xBid = document.getElementById("bidX").value    
    oBid = document.getElementById("bidO").value
    
    if (xBid > current.xBank) {
      return false  
    } else if (oBid > current.oBank){
      return false
    }
    
    console.log(oBid,xBid)
    if (oBid > xBid){
      xIsNext = false
      xBank = current.xBank + parseInt(oBid)
      oBank = current.oBank - parseInt(oBid)
    } else if (oBid < xBid) {
      xIsNext = true
      oBank = current.oBank + parseInt(xBid)
      xBank = current.xBank - parseInt(xBid)
    } else {
      return false;
    }
    console.log(oBank,xBank)
    document.getElementById("bidX").value = null
    document.getElementById("bidO").value = null

    this.setState({xBank:xBank,oBank:oBank, xBid:1000,oBid:1000, xLastBid:xBid,oLastBid:oBid, xIsNext:xIsNext,canMove:true})
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
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
          <div>Enter X Bid:</div>
          <input id="bidX" type="password"/>
        </div>

        <div id="popupO">
          <div>Enter O Bid:</div>
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
          <div>xBank:{current.xBank}</div>
          <div>oBank:{current.oBank}</div>
          <div>xLastBid:{current.xLastBid}</div>
          <div>oLastBid:{current.oLastBid}</div>
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