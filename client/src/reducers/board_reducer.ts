import {
  IActionsConverter,
  IStoneStatus,
} from 'src/interfaces';

/** 座標 */
interface ICell {
  x: number;
  y: number;
}

const BOARD_SIZE = 8;

/** アクションの種類 */
class Type {
  static readonly ADD = Symbol('ADD');
  static readonly CHANGE_TURN = Symbol('CHANGE_TURN');
}

const initBoard = () => {
  const cells = [];

  for (let i = 0; i < BOARD_SIZE; i += 1) {
    const row = [] as IStoneStatus[];
    for (let j = 0; j < BOARD_SIZE; j += 1) {
      if ((i === 3 && j === 3) || (i === 4 && j === 4)) {
        row.push('black');
      } else if ((i === 3 && j === 4) || (i === 4 && j === 3)) {
        row.push('white');
      } else {
        row.push(null);
      }
    }

    cells.push(row);
  }

  return cells;
};

/** 初期状態 */
const createInitialState = () => ({
  cells: initBoard(),
  blackIsNext: true,
});

type IState = ReturnType<typeof createInitialState>;

/** 各アクション毎のパラメータ。IActionsConverterを経由して、定型的なオブジェクトの形に変換されます。 */
interface IActions {
  [Type.ADD]: ICell;
  [Type.CHANGE_TURN]: {};
}

type IAction = IActionsConverter<IActions>;

const getDirReverseStones = (x: number, y: number, dx: number, dy: number, isBlackTurn: boolean, cells: IStoneStatus[][]) => {
  const turnStone: IStoneStatus = (isBlackTurn) ? 'black' : 'white';
  const reversedStone: IStoneStatus = (isBlackTurn) ? 'white' : 'black';
  const targetStones = [];
  let tx = x;
  let ty = y;

  while (tx >= 0 && tx < 8 && ty >= 0 && ty < 8) {
    if (!cells[ty + dy]) {
      return [];
    }

    if (cells[ty + dy][tx + dx] === reversedStone) {
      tx += dx;
      ty += dy;
      targetStones.push([tx, ty]);
    } else if (cells[ty + dy][tx + dx] === turnStone) {
      return targetStones;
    } else {
      return [];
    }
  }

  return targetStones;
};

const getAllReverseStones = (x: number, y: number, cells: IStoneStatus[][], isBlackTurn: boolean) => {
  if (cells[y][x]) {
    return [];
  }

  return getDirReverseStones(x, y, 1, 0, isBlackTurn, cells)
    .concat(getDirReverseStones(x, y, 1, -1, isBlackTurn, cells))
    .concat(getDirReverseStones(x, y, 0, -1, isBlackTurn, cells))
    .concat(getDirReverseStones(x, y, -1, -1, isBlackTurn, cells))
    .concat(getDirReverseStones(x, y, -1, 0, isBlackTurn, cells))
    .concat(getDirReverseStones(x, y, -1, 1, isBlackTurn, cells))
    .concat(getDirReverseStones(x, y, 0, 1, isBlackTurn, cells))
    .concat(getDirReverseStones(x, y, 1, 1, isBlackTurn, cells));
};

/**
   * アクションの種類ごとの状態変化を記載してください。
   * stateを更新する場合、必ず非破壊的してください。
   */
const reducer = (state = createInitialState(), action: IAction) => {
  switch (action.type) {
    case Type.ADD: {
      const { x, y } = action;
      const reverseStones = getAllReverseStones(x, y, state.cells, state.blackIsNext);
      const c = state.cells.concat();
      const stone: IStoneStatus = (state.blackIsNext) ? 'black' : 'white';
      reverseStones.forEach(m => { c[m[1]][m[0]] = stone; });
      let nextTurn = state.blackIsNext;
      if (reverseStones.length > 0) {
        c[y][x] = stone;
        nextTurn = !state.blackIsNext;
      }
      return {
        ...state,
        cells: c,
        blackIsNext: nextTurn,
      };
    }
    case Type.CHANGE_TURN: {
      return {
        ...state,
        blackIsNext: (!state.blackIsNext),
      };
    }
  }
  return state;
};

export {
  reducer as BoardReducer,
  Type as BoardActionType,
  IState as BoardState,
};
