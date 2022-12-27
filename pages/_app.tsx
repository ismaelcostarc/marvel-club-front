import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import BookMarkContext from "../contexts/BoomarkContext";
import { BookmarkType } from "../types";
import MarvelCredentialsContext from "../contexts/MarvelCredentialsContext";

type credentialsType = {
  ts: string;
  hash: string;
  marvelPublicKey: string;
};

export default function App({ Component, pageProps }: AppProps) {
  const [bookmarkedComics, setBookmarkedComics] = useState<BookmarkType[]>([]);
  const [bookmarkedCharacters, setBookmarkedCharacters] = useState<
    BookmarkType[]
  >([]);
  const [marvelURL, setMarvelURL] = useState("");
  const [credentials, setCredentials] = useState<credentialsType>({
    ts: "",
    hash: "",
    marvelPublicKey: "",
  });

  return (
    <BookMarkContext.Provider
      value={{
        bookmarkedComics,
        setBookmarkedComics,
        bookmarkedCharacters,
        setBookmarkedCharacters,
      }}
    >
      <MarvelCredentialsContext.Provider
        value={{
          marvelURL,
          setMarvelURL,
          credentials,
          setCredentials,
        }}
      >
        <Component {...pageProps} />
      </MarvelCredentialsContext.Provider>
    </BookMarkContext.Provider>
  );
}
