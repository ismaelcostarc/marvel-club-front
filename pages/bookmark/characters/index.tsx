/* eslint-disable react-hooks/exhaustive-deps */
import { Pagination, Row, Space, notification } from "antd";
import { useEffect, useState, useContext } from "react";
import { BookmarkType, CharacterType } from "../../../types";
import { getBookmarksByPage, isBookmarked, mark, markOff } from "../../../utils/bookmark";
import nookies, { destroyCookie } from "nookies";
import BookMarkContext from "../../../contexts/BoomarkContext";
import BaseCard from "../../../components/ui/BaseCard";
import BaseGrid from "../../../components/ui/BaseGrid";
import BaseHeader from "../../../components/ui/BaseHeader";
import BaseLayout from "../../../components/layout/BaseLayout";
import Image from "next/image";
import axios from "axios";
import md5 from "blueimp-md5";

type GetUserResponse = {
  name: string;
};

export async function getServerSideProps(context: any) {
  const cookies = nookies.get(context);
  const baseURL = process.env.BASE_URL;
  const marvelURL = process.env.MARVEL_URL;
  const marvelPublicKey = process.env.MARVEL_PUBLIC_KEY;
  const marvelPrivateKey = process.env.MARVEL_PRIVATE_KEY;
  const tokenName = process.env.TOKEN_NAME as string;
  const token = cookies[tokenName];
  const pathname = context.resolvedUrl;
  const ts = new Date().getTime();

  const hash = md5(`${ts}${marvelPrivateKey}${marvelPublicKey}`);

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  try {
    const { data } = await axios.get<GetUserResponse>(`${baseURL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const name = data.name;

    return {
      props: {
        token,
        name,
        pathname,
        baseURL,
        tokenName,
        marvelURL,
        marvelPublicKey,
        ts,
        hash,
      },
    };
  } catch (err) {
    destroyCookie(context, tokenName);
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
}

const BookmarkedCharactersPage = ({
  token,
  name,
  pathname,
  baseURL,
  tokenName,
  marvelURL,
  marvelPublicKey,
  ts,
  hash,
}: any): JSX.Element => {
  const [characters, setCharacters] = useState<CharacterType[] | []>([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [api, contextHolder] = notification.useNotification();
  const { bookmarkedCharacters, setBookmarkedCharacters } =
    useContext(BookMarkContext);
  const [bookmarkedCharactersByPage, setBookmarkedCharactersByPage] = useState<
    CharacterType[]
  >([]);

  useEffect(() => {
    fetchBookmarkedCharacters();
  }, []);

  useEffect(() => {
    fetchCharacters();
  }, [bookmarkedCharacters]);

  useEffect(() => {
    setBookmarkedCharactersByPage(
      getBookmarksByPage(characters, page, pageSize) as CharacterType[]
    );
  }, [characters]);

  useEffect(() => {
    setBookmarkedCharactersByPage(
      getBookmarksByPage(characters, page, pageSize) as CharacterType[]
    );
  }, [page, pageSize]);

  const fetchBookmarkedCharacters = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/character/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const bookmarkedCharacters = data.map(
        (bookmarkedCharacter: BookmarkType) => ({
          id: bookmarkedCharacter.id,
          code: +bookmarkedCharacter.code,
        })
      );
      setBookmarkedCharacters(bookmarkedCharacters);
    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  };

  const fetchCharacters = async () => {
    try {
      const newCharacters: CharacterType[] = await Promise.all(
        bookmarkedCharacters.map(async (bookmarkedCharacter: BookmarkType) => {
          const { data } = await axios.get(
            `${marvelURL}/characters/${bookmarkedCharacter.code}`,
            {
              params: {
                ts,
                hash,
                apikey: marvelPublicKey,
              },
            }
          );

          return data.data.results[0];
        })
      );

      setCharacters(newCharacters);
    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  };

  const markCharacter = (code: number) => {
    mark('character', code, baseURL, token, setBookmarkedCharacters, bookmarkedCharacters, api);
  }

  const markOffCharacter = (code: number) => {
    markOff('character', code, baseURL, token, setBookmarkedCharacters, bookmarkedCharacters, api);
  }

  return (
    <BaseLayout
      name={name}
      pathname={pathname}
      baseURL={baseURL}
      tokenName={tokenName}
    >
      {contextHolder}
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <BaseHeader>Bookmarked Characters</BaseHeader>

        {characters.length !== 0 ? (
          <>
            <BaseGrid>
              {bookmarkedCharactersByPage.map((character: CharacterType) => (
                <BaseCard
                  title={character.name}
                  imageUrl={
                    character.thumbnail.path +
                    "." +
                    character.thumbnail.extension
                  }
                  width={180}
                  height={200}
                  id={character.id}
                  starred={isBookmarked(character, bookmarkedCharacters)}
                  key={character.id}
                  openModal={() => {}}
                  mark={markCharacter}
                  markOff={markOffCharacter}
                />
              ))}
            </BaseGrid>
            <Pagination
              total={bookmarkedCharacters.length}
              onShowSizeChange={(_, size) => setPageSize(size)}
              onChange={setPage}
            />
          </>
        ) : (
          <Row justify={"center"} style={{ paddingTop: "10rem" }}>
            <Image
              src="/assets/thinking-bubble.png"
              width="200"
              height="200"
              alt="Thinking bubble"
            />
          </Row>
        )}
      </Space>
    </BaseLayout>
  );
};

export default BookmarkedCharactersPage;
