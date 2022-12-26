import {
  Form,
  Pagination,
  Input,
  Space,
  Select,
  Col,
  Row,
  Typography,
} from "antd";
import axios from "axios";
import nookies, { destroyCookie } from "nookies";
import { useEffect, useState } from "react";
import BaseLayout from "../../../components/layout/BaseLayout";
import BaseHeader from "../../../components/ui/BaseHeader";
import md5 from "blueimp-md5";
import { ComicType } from "../../../types";
import BaseGrid from "../../../components/ui/BaseGrid";
import ComicCard from "../../../components/ui/ComicCard";

type GetUserResponse = {
  name: string;
};

const { Search } = Input;
const { Text } = Typography;

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
  const [comics, setComics] = useState<[ComicType] | []>([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchComics(0);
  }, [search]);

  useEffect(() => {
    const offset = pageSize * (page - 1);
    fetchComics(offset);
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BaseLayout
      name={name}
      pathname={pathname}
      baseURL={baseURL}
      tokenName={tokenName}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <BaseHeader>Comics Search</BaseHeader>
        <Search
          placeholder="Search your comics typing the initial characters"
          onSearch={setSearch}
          enterButton
          size="large"
        />

        <BaseGrid>
          {comics.map((comic: ComicType) => (
            <ComicCard
              title={comic.title}
              images={comic.images}
              id={comic.id}
              starred
              key={comic.id}
            />
          ))}
        </BaseGrid>

        <Pagination
          total={total}
          onShowSizeChange={(_, size) => setPageSize(size)}
          onChange={setPage}
        />
      </Space>
    </BaseLayout>
  );
};

export default ComicsSearchPage;
