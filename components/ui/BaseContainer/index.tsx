import style from "./style.module.css";

type BaseBaseContainerProps = {
  children: React.ReactNode;
};

const BaseBaseContainer: React.FunctionComponent<BaseBaseContainerProps> = ({
  children,
}): JSX.Element => {
  return <div className={style.container}>{children}</div>;
};

export default BaseBaseContainer;
