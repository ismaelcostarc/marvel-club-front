import { CharacterType, ComicType } from "./../../types/index";
import { NotificationInstance } from "antd/es/notification/interface";
import { Dispatch, SetStateAction } from "react";
import { BookmarkType } from "../../types";
import axios from "axios";

export const isBookmarked = (
  item: CharacterType | ComicType,
  bookmarkeds: BookmarkType[]
) => bookmarkeds.some((bookmarked) => bookmarked.code === item.id);

export const mark = async (
  type: 'comic' | 'character',
  code: number,
  baseURL: string,
  token: string,
  setBookmarkeds: Dispatch<SetStateAction<BookmarkType[]>>,
  bookmarkeds: BookmarkType[],
  api: NotificationInstance
) => {
  try {
    const { data } = await axios.post(
      `${baseURL}/${type}`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { id } = data;
    setBookmarkeds([...bookmarkeds, { code, id }]);
  } catch (err: any) {
    api.error({
      message: err.message,
      placement: "topRight",
    });
  }
};

export const markOff = async (
  type: 'comic' | 'character',
  code: number,
  baseURL: string,
  token: string,
  setBookmarkeds: Dispatch<SetStateAction<BookmarkType[]>>,
  bookmarkeds: BookmarkType[],
  api: NotificationInstance
) => {
  try {
    const { id } = bookmarkeds.find((bookmarked) => bookmarked.code === code)!;

    await axios.delete(`${baseURL}/${type}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setBookmarkeds(bookmarkeds.filter((bookmarked) => bookmarked.id !== id));
  } catch (err: any) {
    api.error({
      message: err.message,
      placement: "topRight",
    });
  }
};
