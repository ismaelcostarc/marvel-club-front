import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import BookMarkContext from "../contexts/BoomarkContext";
import { BookmarkType } from "../types";

export default function App({ Component, pageProps }: AppProps) {
  const [bookmarkedComics, setBookmarkedComics] = useState<BookmarkType[]>([])
  const [bookmarkedCharacters, setBookmarkedCharacters] = useState<BookmarkType[]>([])

  return (
    <BookMarkContext.Provider value={{bookmarkedComics, setBookmarkedComics, bookmarkedCharacters, setBookmarkedCharacters}}>
      <Component {...pageProps} />
    </BookMarkContext.Provider>
  );
}
