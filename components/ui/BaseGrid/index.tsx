import style from "./style.module.css";

type BaseGridType = {
  children?: React.ReactNode | [React.ReactNode];
};

const BaseGrid = ({ children }: BaseGridType) => {
  return <div className={style.grid}>{children}</div>;
};

export default BaseGrid;
