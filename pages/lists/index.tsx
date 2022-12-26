import axios from "axios";
import nookies, { destroyCookie } from "nookies";
import BaseLayout from "../../components/layout/BaseLayout";

type GetUserResponse = {
  name: string;
};

export async function getServerSideProps(context: any) {
  const cookies = nookies.get(context);
  const token = cookies?.MARVEL_CLUB_TOKEN;
  const baseURL = process.env.BASE_URL;
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
      props: { token, name, pathname, baseURL },
    };
  } catch (err) {
    destroyCookie(context, "MARVEL_CLUB_TOKEN");
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
}

const ListsPage = ({ token, name, pathname, baseURL }: any): JSX.Element => {
  return (
    <BaseLayout name={name} pathname={pathname} baseURL={baseURL}>
      <div>list</div>
    </BaseLayout>
  );
};

export default ListsPage;
