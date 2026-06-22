import { describe, expect, it } from 'vitest';
import {
  BLACK,
  EMPTY,
  WHITE,
  createInitialBoard,
  getFlips,
  getLegalMoves,
  getScore,
  playMove,
  resolveNextTurn,
  type Board,
  type Cell,
} from './othello';

function emptyBoard(): Cell[][] {
  return Array.from({ length: 8 }, () => Array<Cell>(8).fill(EMPTY));
}

describe('Othello rules', () => {
  it('creates the standard opening position', () => {
    const board = createInitialBoard();
    expect(getScore(board)).toEqual({ [BLACK]: 2, [WHITE]: 2 });
    expect(board[3][3]).toBe(WHITE);
    expect(board[3][4]).toBe(BLACK);
  });

  it('returns the four legal opening moves for black', () => {
    expect(getLegalMoves(createInitialBoard(), BLACK)).toEqual([
      { x: 3, y: 2 },
      { x: 2, y: 3 },
      { x: 5, y: 4 },
      { x: 4, y: 5 },
    ]);
  });

  it('flips bracketed stones without mutating the original board', () => {
    const board = createInitialBoard();
    const result = playMove(board, BLACK, { x: 2, y: 3 });
    expect(result?.board[3][2]).toBe(BLACK);
    expect(result?.board[3][3]).toBe(BLACK);
    expect(board[3][3]).toBe(WHITE);
    expect(result?.nextPlayer).toBe(WHITE);
  });

  it('collects stones in every bracketed direction', () => {
    const board = emptyBoard();
    const center = { x: 3, y: 3 };
    for (const [dx, dy] of [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ]) {
      board[center.y + dy][center.x + dx] = WHITE;
      board[center.y + dy * 2][center.x + dx * 2] = BLACK;
    }
    expect(getFlips(board, BLACK, center)).toHaveLength(8);
  });

  it('rejects occupied, out-of-range and non-capturing moves', () => {
    const board = createInitialBoard();
    expect(playMove(board, BLACK, { x: 3, y: 3 })).toBeNull();
    expect(playMove(board, BLACK, { x: -1, y: 0 })).toBeNull();
    expect(playMove(board, BLACK, { x: 0, y: 0 })).toBeNull();
  });

  it('passes when only the player who just moved has a legal move', () => {
    const board = emptyBoard();
    board[0][0] = BLACK;
    board[0][1] = WHITE;
    expect(resolveNextTurn(board, BLACK)).toEqual({
      nextPlayer: BLACK,
      passedPlayer: WHITE,
      gameOver: false,
    });
  });

  it('ends the game when neither player has a legal move', () => {
    const board: Board = Array.from({ length: 8 }, () => Array<Cell>(8).fill(BLACK));
    expect(resolveNextTurn(board, BLACK).gameOver).toBe(true);
  });
});
