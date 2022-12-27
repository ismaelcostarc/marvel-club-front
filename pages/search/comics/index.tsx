/* eslint-disable react-hooks/exhaustive-deps */
import { Pagination, Input, Space, Row, notification } from "antd";
import axios from "axios";
import nookies, { destroyCookie } from "nookies";
import { useEffect, useState } from "react";
import BaseLayout from "../../../components/layout/BaseLayout";
import BaseHeader from "../../../components/ui/BaseHeader";
import md5 from "blueimp-md5";
import { ComicType } from "../../../types";
import BaseGrid from "../../../components/ui/BaseGrid";
import BaseCard from "../../../components/ui/BaseCard";
import Image from "next/image";

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
  const [markedComics, setMarkedComics] = useState<number[]>([]);

  useEffect(() => {
    if (search) fetchComics(0);
  }, [search]);

  useEffect(() => {
    const offset = pageSize * (page - 1);
    if (search) fetchComics(offset);
  }, [page, pageSize]);

  const fetchComics = async (offset: number) => {
    try {
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
    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  };

  type imagesType = [] | [{ path: string; extension: string }];
  const getImageUrl = (images: imagesType): string => {
    const image = images[0];
    if (image) {
      return `${image.path}.${image.extension}`;
    } else {
      return "";
    }
  };

  const mark = async (id: number) => {
    try {
      await axios.post(
        `${baseURL}/comic`,
        {
          code: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMarkedComics([...markedComics, id]);
    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  };

  const markOff = async (id: number) => {
    try {

    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  };
  

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
                  starred={markedComics.includes(comic.id)}
                  key={comic.id}
                  openModal={() => {}}
                  mark={mark}
                  markOff={markOff}
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
