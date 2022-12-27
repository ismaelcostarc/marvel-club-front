import { CharacterType, ComicType } from "../../types";

export const getBookmarksByPage = (
  bookmarks: ComicType[] | CharacterType[],
  page: number,
  pageSize: number
): ComicType[] | CharacterType[] => {
  const firstIndex = pageSize * (page - 1);
  const lastIndex = firstIndex + pageSize;
  return bookmarks.slice(firstIndex, lastIndex);
};
