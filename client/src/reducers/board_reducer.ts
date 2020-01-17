import {
  IActionsConverter,
  IStoneStatus,
} from 'src/interfaces';


/** 座標 */
// interface ICoordinate {
//   x: number;
//   y: number;
// }

/** セル */
interface ICell {
  x: number;
  y: number;
  stone: IStoneStatus;
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

/**
   * アクションの種類ごとの状態変化を記載してください。
   * stateを更新する場合、必ず非破壊的してください。
   */
const reducer = (state = createInitialState(), action: IAction) => {
  switch (action.type) {
    case Type.ADD: {
      const { x, y, stone } = action;
      const c = state.cells.concat();
      c[y][x] = stone;
      return {
        ...state,
        cells: c,
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
