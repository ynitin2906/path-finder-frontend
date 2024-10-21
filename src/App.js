import { useState } from "react";
import axios from "axios";

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
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/find-path`,
        {
          start: { x: start[0], y: start[1] },
          end: { x: endX, y: endY },
        }
      );
      setPath(response.data.path);
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                width: 20,
                height: 20,
                border: "1px solid black",
                backgroundColor:
                  start && start[0] === rowIndex && start[1] === colIndex
                    ? "green"
                    : end && end[0] === rowIndex && end[1] === colIndex
                    ? "red"
                    : path.some(([x, y]) => x === rowIndex && y === colIndex)
                    ? "lightblue"
                    : "white",
              }}
            />
          ))
        )}
      </div>
      <button onClick={resetGrid} disabled={!start && !end}>
        Reset Grid
      </button>
    </div>
  );
}

export default App;
