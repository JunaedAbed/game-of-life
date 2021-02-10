import React, { useCallback, useRef, useState } from "react";
import "./App.css";
import produce from "immer";

const numRows = 50;
const numCols = 50;

//for neighbors
const opts = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const genEmptyGrid = () => {
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    //set the array full with empty boxes
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return genEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  //technique to use the current value when using a callback
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    //simulate
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            //compute the number of neighbors
            let neighbors = 0;
            opts.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                //check if it is going out of bounce(for the corner boxes)
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              //fewer than 2 dies and more than 3 dies
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              //3 neighbors rule
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100); //recursive
  }, []);

  return (
    <>
      <button
        className="button"
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button className="button" onClick={() => setGrid(genEmptyGrid())}>
        clear
      </button>
      <button
        className="button"
        onClick={() => {
          const rows = [];

          for (let i = 0; i < numRows; i++) {
            //set the array full with empty boxes
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}
      >
        random
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          backgroundColor: "#ABD9F6",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "black" : undefined,
                border: "solid 1px black",
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
};

export default App;
