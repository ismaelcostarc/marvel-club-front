import axios from "axios";
import nookies, { destroyCookie } from "nookies";
import BaseLayout from "../../components/layout/BaseLayout";

type GetUserResponse = {
  name: string;
};

export async function getServerSideProps(context: any) {
  const cookies = nookies.get(context);
  const baseURL = process.env.BASE_URL;
  const tokenName = process.env.TOKEN_NAME as string;
  const token = cookies[tokenName];
  const pathname = context.resolvedUrl;

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
      props: { token, name, pathname, baseURL, tokenName },
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

const ListsPage = ({ token, name, pathname, baseURL, tokenName }: any): JSX.Element => {
  return (
    <BaseLayout name={name} pathname={pathname} baseURL={baseURL} tokenName={tokenName}>
      <div>list</div>
    </BaseLayout>
  );
};

export default ListsPage;
