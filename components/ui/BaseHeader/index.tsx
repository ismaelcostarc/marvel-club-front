import { ReactNode } from "react";
import style from "./style.module.css";

const BaseHeader = ({ children }: { children: ReactNode }) => {
  return <div className={style.container}><h1>{children}</h1></div>;
};

export default BaseHeader;
