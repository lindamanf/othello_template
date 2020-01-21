import React from 'react';
import { IStoneStatus } from 'src/interfaces';
import { BoardAction } from 'src/reducers/board_action';

const style = require('./cell_component.scss');

interface IProps {
  stone: IStoneStatus;
  x: number;
  y: number;
}

/** オセロの石1つに対応するコンポーネントです */
export const CellComponent = (props: IProps) => {
  const {
    stone,
    x,
    y,
  } = props;

  const onClick = React.useCallback(() => {
    BoardAction.add(x, y);
  }, [stone]);

  return (
    <div className={style.cell} onClick={onClick}>
      {y}
      ,
      {x}
      <br />
      <span className={style[`cell_${stone}`]} />
    </div>
  );
};
