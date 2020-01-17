import React from 'react';
import { Reducers } from 'src/store';
import { connect } from 'react-redux';
import { CellComponent } from 'src/components/cell_component';
import { IStoneStatus } from 'src/interfaces';
import { BoardAction } from 'src/reducers/board_action';

const style = require('./board_component.scss');

const distributeState = ({ Board }: Reducers) => ({ Board });
type IProps = ReturnType<typeof distributeState>;

const getReverseStones = (x: number, y: number, dx: number, dy: number, turnStone: IStoneStatus, cells: IStoneStatus[][]) => {
  const reversedStone = (turnStone === 'black') ? 'white' : 'black';
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

/** 盤面全体を管理するコンテナコンポーネント */
const BoardComponent = (props: IProps) => {
  const { Board } = props;
  const { cells, blackIsNext } = Board;
  const turn = (blackIsNext) ? 'black' : 'white';

  const handleClick = React.useCallback((x: number, y: number) => {
    if (cells[y][x]) return;

    const targetStones = getReverseStones(x, y, 1, 0, turn, cells)
      .concat(getReverseStones(x, y, 1, -1, turn, cells))
      .concat(getReverseStones(x, y, 0, -1, turn, cells))
      .concat(getReverseStones(x, y, -1, -1, turn, cells))
      .concat(getReverseStones(x, y, -1, 0, turn, cells))
      .concat(getReverseStones(x, y, -1, 1, turn, cells))
      .concat(getReverseStones(x, y, 0, 1, turn, cells))
      .concat(getReverseStones(x, y, 1, 1, turn, cells));

    if (targetStones.length > 0) {
      BoardAction.add(x, y, turn);
      targetStones.map(m => BoardAction.add(m[0], m[1], turn));
      BoardAction.changeTurn();
    }
  }, [blackIsNext]);

  return (
    <div className={style.root}>
      <div>
        Turn:
        {turn}
      </div>
      <div className={style.board}>
        {cells.map((row, i) => row.map((stone, j) => (
          <CellComponent
            // 他に適切なキーがないため
            // eslint-disable-next-line react/no-array-index-key
            key={`${j}_${i}`}
            stone={stone as IStoneStatus}
            x={j}
            y={i}
            onClick={handleClick}
            blackIsNext={blackIsNext}
          />
        )))}
      </div>
    </div>
  );
};
export const BoardContainer = connect(distributeState)(BoardComponent);
