export const EMPTY = 0;
export const BLACK = 1;
export const WHITE = 2;
export const BOARD_SIZE = 8;

export type Cell = typeof EMPTY | Player;
export type Player = typeof BLACK | typeof WHITE;
export type Position = Readonly<{ x: number; y: number }>;
export type Board = ReadonlyArray<ReadonlyArray<Cell>>;

export type TurnResolution = {
  nextPlayer: Player;
  passedPlayer: Player | null;
  gameOver: boolean;
};

export type MoveResult = TurnResolution & {
  board: Board;
};

const DIRECTIONS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
] as const;

export function opponent(player: Player): Player {
  return player === BLACK ? WHITE : BLACK;
}

export function createInitialBoard(): Board {
  const board: Cell[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array<Cell>(BOARD_SIZE).fill(EMPTY),
  );

  board[3][3] = WHITE;
  board[3][4] = BLACK;
  board[4][3] = BLACK;
  board[4][4] = WHITE;

  return board;
}

function isInsideBoard(x: number, y: number): boolean {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

export function getFlips(board: Board, player: Player, position: Position): Position[] {
  const { x, y } = position;
  if (!isInsideBoard(x, y) || board[y][x] !== EMPTY) return [];

  const flips: Position[] = [];
  const otherPlayer = opponent(player);

  for (const [dx, dy] of DIRECTIONS) {
    const candidates: Position[] = [];
    let nextX = x + dx;
    let nextY = y + dy;

    while (isInsideBoard(nextX, nextY) && board[nextY][nextX] === otherPlayer) {
      candidates.push({ x: nextX, y: nextY });
      nextX += dx;
      nextY += dy;
    }

    if (candidates.length > 0 && isInsideBoard(nextX, nextY) && board[nextY][nextX] === player) {
      flips.push(...candidates);
    }
  }

  return flips;
}

export function getLegalMoves(board: Board, player: Player): Position[] {
  const moves: Position[] = [];

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      if (getFlips(board, player, { x, y }).length > 0) moves.push({ x, y });
    }
  }

  return moves;
}

export function resolveNextTurn(board: Board, playerWhoMoved: Player): TurnResolution {
  const otherPlayer = opponent(playerWhoMoved);
  if (getLegalMoves(board, otherPlayer).length > 0) {
    return { nextPlayer: otherPlayer, passedPlayer: null, gameOver: false };
  }
  if (getLegalMoves(board, playerWhoMoved).length > 0) {
    return { nextPlayer: playerWhoMoved, passedPlayer: otherPlayer, gameOver: false };
  }
  return { nextPlayer: otherPlayer, passedPlayer: null, gameOver: true };
}

export function playMove(board: Board, player: Player, position: Position): MoveResult | null {
  const flips = getFlips(board, player, position);
  if (flips.length === 0) return null;

  const nextBoard = board.map((row) => [...row]);
  nextBoard[position.y][position.x] = player;
  for (const flipped of flips) nextBoard[flipped.y][flipped.x] = player;

  return { board: nextBoard, ...resolveNextTurn(nextBoard, player) };
}

export function getScore(board: Board): Record<Player, number> {
  let black = 0;
  let white = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === BLACK) black += 1;
      if (cell === WHITE) white += 1;
    }
  }
  return { [BLACK]: black, [WHITE]: white };
}
