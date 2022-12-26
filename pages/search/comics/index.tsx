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

  const onSearch = async (value: string) => {
    try {
      const { data } = await axios.get(`${marvelURL}/comics`, {
        params: {
          ts,
          hash,
          apikey: marvelPublicKey,
          titleStartsWith: value,
          limit: pageSize,
        },
      });
      setTotal(data.data.total);
      setComics(data.data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredComics = (): ComicType[] => {
    const afterLastIndex = page * pageSize;
    const initialIndex = afterLastIndex - pageSize;
    const result = comics.slice(initialIndex, afterLastIndex);

    return result;
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
          onSearch={onSearch}
          enterButton
          size="large"
        />

        <BaseGrid>
          {filteredComics().map((comic: ComicType) => (
            <ComicCard
              title={comic.title}
              images={comic.images}
              starred
              key={comic.id}
            />
          ))}
        </BaseGrid>

        <Pagination
          total={total}
          onShowSizeChange={(_, size) => setPageSize(size)}
        />
      </Space>
    </BaseLayout>
  );
};

export default ComicsSearchPage;
