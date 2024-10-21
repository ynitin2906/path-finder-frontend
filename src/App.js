import { useState } from "react";
import axios from "axios";
import "./App.css"; // Ensure you import the updated CSS file

const GRID_SIZE = 20;

function App() {
  const [grid, setGrid] = useState(
    Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill(null))
  );
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);

  const handleCellClick = (x, y) => {
    if (!start) {
      setStart([x, y]);
    } else if (!end) {
      setEnd([x, y]);
      calculatePath(x, y); // Calculate path once end point is set
    }
  };

  const calculatePath = async (endX, endY) => {
    if (start) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/find-path`,
          {
            start: { x: start[0], y: start[1] },
            end: { x: endX, y: endY },
          }
        );
        setPath(response.data.path);
      } catch (error) {
        console.error("Error calculating path:", error);
      }
    }
  };

  const resetGrid = () => {
    setStart(null);
    setEnd(null);
    setPath([]);
  };

  return (
    <div>
      <h1>DFS Path Finder</h1>
      <div className="grid-container">
        <div className="grid">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`node ${
                  start && start[0] === rowIndex && start[1] === colIndex
                    ? "node-start"
                    : end && end[0] === rowIndex && end[1] === colIndex
                    ? "node-finish"
                    : path.some(([x, y]) => x === rowIndex && y === colIndex)
                    ? "node-shortest-path"
                    : ""
                }`}
              />
            ))
          )}
        </div>
      </div>
      <button onClick={resetGrid} disabled={!start && !end}>
        Reset Grid
      </button>
    </div>
  );
}

export default App;
