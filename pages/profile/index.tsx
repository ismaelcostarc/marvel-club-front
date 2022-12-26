import { NextPageContext } from "next/types";
import nookies from "nookies";
import BaseLayout from "../../components/layout/BaseLayout";

export async function getServerSideProps(context: NextPageContext) {
  const cookies = nookies.get(context)
  const token = cookies.MARVEL_CLUB_TOKEN
  return {
    props: { token },
  };
}

const ProfilePage = ({token}: any  ): JSX.Element => {
  const cookies = nookies.get(null)
  return (
    <BaseLayout>
      <div>Profile</div>
    </BaseLayout>
  )
};

export default ProfilePage;
