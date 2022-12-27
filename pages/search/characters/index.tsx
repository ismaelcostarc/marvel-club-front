/* eslint-disable react-hooks/exhaustive-deps */
import { Pagination, Input, Space, Row, notification } from "antd";
import axios from "axios";
import nookies, { destroyCookie } from "nookies";
import { useEffect, useState } from "react";
import BaseLayout from "../../../components/layout/BaseLayout";
import BaseHeader from "../../../components/ui/BaseHeader";
import md5 from "blueimp-md5";
import { CharacterType } from "../../../types";
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

const CharactersSearchPage = ({
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
  const [characters, setCharacters] = useState<[CharacterType] | []>([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchCharacters(0);
  }, [search]);

  useEffect(() => {
    const offset = pageSize * (page - 1);
    if (search) fetchCharacters(offset);
  }, [page, pageSize]);

  const fetchCharacters = async (offset: number) => {
    try {
      const { data } = await axios.get(`${marvelURL}/characters`, {
        params: {
          ts,
          hash,
          apikey: marvelPublicKey,
          nameStartsWith: search,
          limit: pageSize,
          offset,
        },
      });
      const results: CharacterType = data.data.results;
      setTotal(data.data.total);
      setCharacters(results as any);
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
        <BaseHeader>Characters Search</BaseHeader>
        <Search
          placeholder="Search your characters typing the initial characters"
          onSearch={setSearch}
          enterButton
          size="large"
        />

        {characters.length !== 0 ? (
          <>
            {" "}
            <BaseGrid>
              {characters.map((character: CharacterType) => (
                <BaseCard
                  title={character.name}
                  imageUrl={
                    character.thumbnail.path +
                    "." +
                    character.thumbnail.extension
                  }
                  id={character.id}
                  starred
                  width={180}
                  height={200}
                  key={character.id}
                  openModal={() => {}}
                  mark={() => {}}
                  markOff={() => {}}
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
          <>
            {" "}
            <Row justify={"center"} style={{ paddingTop: "10rem" }}>
              <Image
                src="/assets/thinking-bubble.png"
                width="200"
                height="200"
                alt="Thinking bubble"
              />
            </Row>
          </>
        )}
      </Space>
    </BaseLayout>
  );
};

export default CharactersSearchPage;
