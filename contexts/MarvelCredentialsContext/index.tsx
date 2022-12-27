import { createContext, Dispatch, SetStateAction } from "react";

type credentialsType = {
  ts: string;
  hash: string;
  marvelPublicKey: string;
};

const initialValues = {
  credentials: {
    ts: "",
    hash: "",
    marvelPublicKey: "",
  },
  marvelURL: "",
  setCredentials: (() => {}) as Dispatch<SetStateAction<credentialsType>>,
  setMarvelURL: (() => {}) as Dispatch<SetStateAction<string>>,
};

const MarvelCredentialsContext = createContext(initialValues);

export default MarvelCredentialsContext;
