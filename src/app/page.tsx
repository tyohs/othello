'use client';

import { useMemo, useState } from 'react';
import {
  BLACK,
  WHITE,
  createInitialBoard,
  getLegalMoves,
  getScore,
  playMove,
  type Board,
  type Player,
} from '../lib/othello';
import styles from './page.module.css';

type GameState = {
  board: Board;
  currentPlayer: Player;
  gameOver: boolean;
  message: string;
};

function initialGame(): GameState {
  return {
    board: createInitialBoard(),
    currentPlayer: BLACK,
    gameOver: false,
    message: '黒のターンです',
  };
}

function playerName(player: Player): string {
  return player === BLACK ? '黒' : '白';
}

export default function Home() {
  const [game, setGame] = useState<GameState>(initialGame);
  const legalMoves = useMemo(
    () => (game.gameOver ? [] : getLegalMoves(game.board, game.currentPlayer)),
    [game.board, game.currentPlayer, game.gameOver],
  );
  const legalMoveKeys = useMemo(
    () => new Set(legalMoves.map(({ x, y }) => `${x}-${y}`)),
    [legalMoves],
  );
  const score = useMemo(() => getScore(game.board), [game.board]);

  function handleMove(x: number, y: number): void {
    if (game.gameOver) return;
    const result = playMove(game.board, game.currentPlayer, { x, y });
    if (!result) return;

    if (result.gameOver) {
      const finalScore = getScore(result.board);
      const winner =
        finalScore[BLACK] === finalScore[WHITE]
          ? '引き分けです'
          : `${finalScore[BLACK] > finalScore[WHITE] ? '黒' : '白'}の勝ちです`;
      setGame({
        board: result.board,
        currentPlayer: result.nextPlayer,
        gameOver: true,
        message: `ゲーム終了：${winner}`,
      });
      return;
    }

    const passMessage = result.passedPlayer
      ? `${playerName(result.passedPlayer)}は置ける場所がないためパスしました。`
      : '';
    setGame({
      board: result.board,
      currentPlayer: result.nextPlayer,
      gameOver: false,
      message: `${passMessage}${playerName(result.nextPlayer)}のターンです`,
    });
  }

  return (
    <main className={styles.container}>
      <h1>Othello</h1>
      <div className={styles.score} aria-label="現在のスコア">
        <span>黒：{score[BLACK]}</span>
        <span>白：{score[WHITE]}</span>
      </div>
      <p className={styles.status} aria-live="polite">
        {game.message}
      </p>
      <div className={styles.board} role="grid" aria-label="オセロ盤">
        {game.board.map((row, y) =>
          row.map((color, x) => {
            const isLegal = legalMoveKeys.has(`${x}-${y}`);
            return (
              <button
                className={styles.cell}
                key={`${x}-${y}`}
                type="button"
                role="gridcell"
                aria-label={`${y + 1}行${x + 1}列${color === BLACK ? '、黒石' : color === WHITE ? '、白石' : isLegal ? '、置けます' : '、空き'}`}
                disabled={!isLegal || game.gameOver}
                onClick={() => handleMove(x, y)}
              >
                {color !== 0 ? (
                  <span
                    className={`${styles.stone} ${color === BLACK ? styles.black : styles.white}`}
                    aria-hidden="true"
                  />
                ) : null}
                {isLegal ? <span className={styles.marker} aria-hidden="true" /> : null}
              </button>
            );
          }),
        )}
      </div>
      <button className={styles.reset} type="button" onClick={() => setGame(initialGame())}>
        最初から遊ぶ
      </button>
    </main>
  );
}
