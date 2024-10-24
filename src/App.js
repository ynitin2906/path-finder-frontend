import { useState } from "react";
import axios from "axios";
import "./App.css";

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
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCellClick = (x, y) => {
    if (!start) {
      setStart([x, y]);
    } else if (!end) {
      setEnd([x, y]);
    }
  };

  const calculatePath = async () => {
    if (start && end) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/find-path`,
          {
            start: { x: start[0], y: start[1] },
            end: { x: end[0], y: end[1] },
          }
        );

        const pathToAnimate = response.data.path;
        animatePath(pathToAnimate);
      } catch (error) {
        console.error("Error calculating path:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please select both a start and an end point.");
    }
  };

  const animatePath = (pathToAnimate) => {
    setPath([]);
    setAnimating(true);

    pathToAnimate.forEach((cell, index) => {
      if (animating) {
        setTimeout(() => {
          setPath((prevPath) => [...prevPath, cell]);
        }, index * 20);
      }
    });
  };

  const resetGrid = () => {
    setStart(null);
    setEnd(null);
    setPath([]);
    setAnimating(false);
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
      <div className="button-container">
        <div style={{ display: "flex", gap: "50px" }}>
          <button onClick={calculatePath} disabled={!start || !end || loading}>
            {loading ? "Calculating..." : "Calculate Path"}
          </button>
          <button onClick={resetGrid} disabled={(!start && !end) || loading}>
            Reset Grid
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
