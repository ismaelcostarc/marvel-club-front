import style from "./style.module.css";

type ContainerProps = {
  children: React.ReactNode;
};

const Container: React.FunctionComponent<ContainerProps> = ({
  children,
}): JSX.Element => {
  return <div className={style.container}>{children}</div>;
};

export default Container;
