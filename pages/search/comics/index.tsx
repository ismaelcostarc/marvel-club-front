/* eslint-disable react-hooks/exhaustive-deps */
import { Input, Pagination, Row, Space, notification } from "antd";
import { useEffect, useState, useContext } from "react";
import { BookmarkType, ComicType } from "../../../types";
import { getImageUrl } from "../../../utils/comics";
import nookies, { destroyCookie } from "nookies";
import BookMarkContext from "../../../contexts/BoomarkContext";
import BaseCard from "../../../components/ui/BaseCard";
import BaseGrid from "../../../components/ui/BaseGrid";
import BaseHeader from "../../../components/ui/BaseHeader";
import BaseLayout from "../../../components/layout/BaseLayout";
import Image from "next/image";
import axios from "axios";
import md5 from "blueimp-md5";
import { isBookmarked, mark, markOff } from "../../../utils/bookmark";

type GetUserResponse = {
  name: string;
};

const { Search } = Input;

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

const ComicsSearchPage = ({
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
  const [comics, setComics] = useState<ComicType[] | []>([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const { bookmarkedComics, setBookmarkedComics } = useContext(BookMarkContext);

  useEffect(() => {
    if (search) fetchComics(0);
  }, [search]);

  useEffect(() => {
    const offset = pageSize * (page - 1);
    if (search) fetchComics(offset);
  }, [page, pageSize]);

  useEffect(() => {
    fetchBookmarkedComics();
  }, []);

  const fetchBookmarkedComics = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/comic/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const bookmarkedComics = data.map((bookmarkedComic: BookmarkType) => ({
        id: bookmarkedComic.id,
        code: +bookmarkedComic.code,
      }));
      setBookmarkedComics(bookmarkedComics);
    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  };

  const fetchComics = async (offset: number) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${marvelURL}/comics`, {
        params: {
          ts,
          hash,
          apikey: marvelPublicKey,
          titleStartsWith: search,
          limit: pageSize,
          offset,
        },
      });
      const results: ComicType = data.data.results;
      setTotal(data.data.total);
      setComics(results as any);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  };

  const markComic = (code: number) => {
    mark('comic', code, baseURL, token, setBookmarkedComics, bookmarkedComics, api);
  }

  const markOffComic = (code: number) => {
    markOff('comic', code, baseURL, token, setBookmarkedComics, bookmarkedComics, api);
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
        <BaseHeader>Comics Search</BaseHeader>
        <Search
          placeholder="Search your comics typing the initial characters"
          onSearch={setSearch}
          enterButton
          size="large"
          loading={loading}
        />

        {comics.length !== 0 ? (
          <>
            <BaseGrid>
              {comics.map((comic: ComicType) => (
                <BaseCard
                  title={comic.title}
                  imageUrl={getImageUrl(comic.images)}
                  width={150}
                  height={200}
                  id={comic.id}
                  starred={isBookmarked(comic, bookmarkedComics)}
                  key={comic.id}
                  openModal={() => {}}
                  mark={markComic}
                  markOff={markOffComic}
                />
              ))}
            </BaseGrid>
            <Pagination
              total={total}
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

export default ComicsSearchPage;
