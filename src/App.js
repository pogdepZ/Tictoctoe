import { useState } from "react";
import "./App.css";


function App() {

  function Square({ value, onSquareClick, isWinningSquare }) {
    return (
      <button
        className={"square" + (isWinningSquare ? " winning" : "")}
        onClick={onSquareClick}
      >
        {value}
      </button>
    );
  }

  function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
  
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
      onPlay(nextSquares);
    }

    const winnerInfo = calculateWinner(squares);
    const winner = winnerInfo ? winnerInfo.winner : null;
    const winningLine = winnerInfo ? winnerInfo.line : [];
    
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (!squares.includes(null)) {
      status = 'Result: Draw';
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }


    const renderSquare = (i) => {
      return (
        <Square
          key={i}
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
          isWinningSquare={winningLine.includes(i)}
        />
      );
    };
    const boardSize = 3;
    const boardRows = [];
    for (let row = 0; row < boardSize; row++) {
      const squaresInRow = [];
      for (let col = 0; col < boardSize; col++) {
        squaresInRow.push(renderSquare(row * boardSize + col));
      }
      boardRows.push(<div className="board-row" key={row}>{squaresInRow}</div>);
    }

    return (
      <>
        <div className="status">{status}</div>
        {boardRows}
      </>
    );
  }

  function Game() {
    const [history, setHistory] = useState([
      { squares: Array(9).fill(null), location: null }
    ]);
    const [currentMove, setCurrentMove] = useState(0);

    const [isAscending, setIsAscending] = useState(true);

    const xIsNext = currentMove % 2 === 0;
  
    const currentSquares = history[currentMove].squares;

    function handlePlay(nextSquares) {
      
      const prevSquares = history[currentMove].squares;
      let clickedIndex = -1;
      for (let i = 0; i < 9; i++) {
        if (prevSquares[i] !== nextSquares[i]) {
          clickedIndex = i;
          break;
        }
      }
      const location = clickedIndex !== -1
        ? { row: Math.floor(clickedIndex / 3), col: clickedIndex % 3 }
        : null;

  
      const nextHistoryData = { squares: nextSquares, location: location };

      const nextHistory = [...history.slice(0, currentMove + 1), nextHistoryData];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
      setCurrentMove(nextMove);
    }


    function toggleSortOrder() {
      setIsAscending(!isAscending);
    }

  
    const moves = history.map((step, move) => {
      const location = step.location;
      const locText = location ? ` (${location.row}, ${location.col})` : '';
      let description;

      if (move > 0) {
        description = 'Go to move #' + move + locText;
      } else {
        description = 'Go to game start';
      }


      if (move === currentMove) {
        const currentDesc = move > 0
          ? `You are at move #${move}${locText}`
          : 'You are at game start';
        return (
          <li key={move}>
            <span>{currentDesc}</span>
          </li>
        );
      }

      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    });


    const sortedMoves = isAscending ? moves : moves.slice().reverse();

    return (
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <button onClick={toggleSortOrder}>
            Sort {isAscending ? 'Descending' : 'Ascending'}
          </button>
          <ol>{sortedMoves}</ol>
        </div>
      </div>
    );
  }

 
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null; 
  }

  return (
    <div className="screen">
      <Game/>
    </div>
  );
}

export default App;