'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [passCount, setPassCount] = useState(0);
  const [board, setBoard] = useState([
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 2, 2, 1, 1, 1],
    [1, 1, 1, 2, 2, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const directions = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
  ];
  const placeable = (x: number, y: number, nowTurnColor: number, nowBoard: number[][]) => {
    if (nowBoard[y][x] !== 0) return false;

    for (const [dy, dx] of directions) {
      let n = 1;
      const ry = y + dy;
      const rx = x + dx;
      if (
        nowBoard[ry] !== undefined &&
        nowBoard[ry][rx] !== undefined &&
        nowBoard[ry][rx] === 3 - nowTurnColor
      ) {
        while (
          nowBoard[y + dy * (n + 1)] !== undefined &&
          nowBoard[y + dy * (n + 1)][x + dx * (n + 1)] !== undefined &&
          nowBoard[y + dy * (n + 1)][x + dx * (n + 1)] === 3 - nowTurnColor
        ) {
          n++;
        }
        if (
          nowBoard[y + dy * (n + 1)] !== undefined &&
          nowBoard[y + dy * (n + 1)][x + dx * (n + 1)] !== undefined &&
          nowBoard[y + dy * (n + 1)][x + dx * (n + 1)] === nowTurnColor
        ) {
          return true;
        }
      }
    }
    return false;
  };
  const getPlaceable = (nowTurnColor: number, nowBoard: number[][]) => {
    const placeablePositions: [number, number][] = [];

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (placeable(x, y, nowTurnColor, nowBoard)) {
          placeablePositions.push([x, y]);
        }
      }
    }

    return placeablePositions;
  };
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    const newBoard = structuredClone(board);
    if (board[y][x] !== 0) return;
    let flipped = false;
    for (const [dy, dx] of directions) {
      let n = 1;
      const ry = y + dy;
      const rx = x + dx;
      if (
        board[ry] !== undefined &&
        board[ry][rx] !== undefined &&
        board[ry][rx] === 3 - turnColor
      ) {
        while (
          board[y + dy * (n + 1)] !== undefined &&
          board[y + dy * (n + 1)][x + dx * (n + 1)] !== undefined &&
          board[y + dy * (n + 1)][x + dx * (n + 1)] === 3 - turnColor
        ) {
          n++;
        }
        if (
          board[y + dy * (n + 1)] !== undefined &&
          board[y + dy * (n + 1)][x + dx * (n + 1)] !== undefined &&
          board[y + dy * (n + 1)][x + dx * (n + 1)] === turnColor
        ) {
          newBoard[y][x] = turnColor;
          for (let i = 1; i <= n; i++) {
            newBoard[y + dy * i][x + dx * i] = turnColor;
          }
          flipped = true;
        }
      }
    }
    if (flipped) {
      setBoard(newBoard);
      setTurnColor(3 - turnColor);
    }
  };
  useEffect(() => {
    // レンダリング後に実行される
    if (getPlaceable(turnColor, board).length === 0) {
      setPassCount(passCount + 1);
      setTurnColor(3 - turnColor);
      if (passCount === 2) {
        alert('終了します');
      }
    } else {
      setPassCount(0);
    }
  });
  const whoseTurn = turnColor === 1 ? '黒' : '白';
  const oneBoard = board.flat();
  const blackCount = oneBoard.filter((board) => board === 1).length;
  const whiteCount = oneBoard.filter((board) => board === 2).length;
  console.log('黒:', blackCount);
  console.log('白:', whiteCount);
  return (
    <div className={styles.container}>
      <div>
        黒：{blackCount} 白：{whiteCount}
        <p>現在のターンは{whoseTurn}です</p>
      </div>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}

              {getPlaceable(turnColor, board).some(([px, py]) => px === x && py === y) && (
                <div
                  style={{
                    backgroundColor: 'gold',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                  }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
