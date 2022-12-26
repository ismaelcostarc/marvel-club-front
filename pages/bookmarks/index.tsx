import { NextPageContext } from "next/types";
import nookies from "nookies";
import BaseLayout from "../../components/layout/BaseLayout";
import axios from "axios";

type GetUserResponse = {
  name: string
};

export async function getServerSideProps(context: any) {
  const cookies = nookies.get(context);
  const token = cookies.MARVEL_CLUB_TOKEN;
  const baseURL = process.env.BASE_URL;
  const pathname = context.resolvedUrl;

  const { data } = await axios.get<GetUserResponse>(`${baseURL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const name = data.name;

  return {
    props: { token, name, pathname },
  };
}
const BookmarksPage = ({ token, name, pathname }: any): JSX.Element => {
  const cookies = nookies.get(null);
  return (
    <BaseLayout name={name} pathname={pathname}>
      <div>bookmarks</div>
    </BaseLayout>
  );
};

export default BookmarksPage;
