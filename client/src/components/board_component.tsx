import React from 'react';
import { Reducers } from 'src/store';
import { connect } from 'react-redux';
import { CellComponent } from 'src/components/cell_component';
import { IStoneStatus } from 'src/interfaces';

const style = require('./board_component.scss');

const distributeState = ({ Board }: Reducers) => ({ Board });
type IProps = ReturnType<typeof distributeState>;

/** 盤面全体を管理するコンテナコンポーネント */
const BoardComponent = (props: IProps) => {
  const { Board } = props;
  const { cells } = Board;

  return (
    <div className={style.root}>
      <div className={style.board}>
        {cells.map((row, i) => row.map((stone, j) => (
          <CellComponent
            // 他に適切なキーがないため
            // eslint-disable-next-line react/no-array-index-key
            key={`${j}_${i}`}
            stone={stone as IStoneStatus}
            x={j}
            y={i}
          />
        )))}
      </div>
    </div>
  );
};
export const BoardContainer = connect(distributeState)(BoardComponent);
