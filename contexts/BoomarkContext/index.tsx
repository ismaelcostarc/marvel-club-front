import { createContext, Dispatch, SetStateAction } from "react";
import { BookmarkType } from "../../types";

const initialValues = {
  bookmarkedComics: [] as BookmarkType[],
  bookmarkedCharacters: [] as BookmarkType[],
  setBookmarkedComics: (() => {}) as Dispatch<SetStateAction<BookmarkType[]>>,
  setBookmarkedCharacters: (() => {}) as Dispatch<SetStateAction<BookmarkType[]>>
}

const BookMarkContext = createContext(initialValues);

export default BookMarkContext;
