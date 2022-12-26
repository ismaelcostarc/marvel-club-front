import { Form, Card, Col, Space, notification, Tabs } from "antd";
import nookies, { destroyCookie } from "nookies";
import { useRouter } from "next/router";
import Image from "next/image";
import Container from "../../components/ui/Container";
import style from "./style.module.css";
import axios from "axios";
import Head from "next/head";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { CredentialsType, UserType } from "./types";

export async function getServerSideProps(context: any) {
  const cookies = nookies.get(context);
  const token = cookies[process.env.TOKEN_NAME as string];
  const baseURL = process.env.BASE_URL;
  const tokenName = process.env.TOKEN_NAME as string;

  if (token) {
    try {
      await axios.get(`${baseURL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        redirect: {
          permanent: false,
          destination: "/search/comics",
        },
        props: {},
      };
    } catch (err) {
      destroyCookie(null, tokenName);
    }
  }

  return {
    props: { baseURL, tokenName },
  };
}

type LoginProps = {
  baseURL: string;
  tokenName: string;
};

const LoginPage = ({ baseURL, tokenName }: LoginProps): JSX.Element => {
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();

  const onFinishLogin = async (values: CredentialsType) => {
    try {
      const { data } = await axios.post(`${baseURL}/user/login`, values);

      nookies.set(null, tokenName, data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "*",
      });

      router.push("/search/comics");
    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  };

  const onFinishRegister = async (values: UserType) => {
    const newUser = {
      ...values,
      phone: values.phone.replace(/[()-\s]/g, "")
    }
    
    try {
      const { data } = await axios.post(`${baseURL}/user`, newUser)

      nookies.set(null, tokenName, data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "*",
      });

      router.push("/search/comics");
    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  }

  return (
    <Container>
      {contextHolder}

      <Head>
        <title>Marvel Club</title>
      </Head>

      <video autoPlay muted loop className={style.backgroundVideo}>
        <source src="assets/background-login.mp4" type="video/mp4" />
      </video>

      <Col xs={24} sm={24} md={20} lg={14} xl={6}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div className={style.logo}>
              <Image
                alt="Marvel logo"
                src="/assets/marvel-logo.png"
                width="100"
                height="50"
              />
            </div>
            <Tabs
              defaultActiveKey="0"
              type="card"
              centered
              animated
              items={[
                {
                  label: "Login",
                  key: "0",
                  children: <LoginForm onFinishLogin={onFinishLogin} />,
                },
                {
                  label: "Register",
                  key: "1",
                  children: <RegisterForm onFinishRegister={onFinishRegister}/>,
                },
              ]}
            />
          </Space>
        </Card>
      </Col>
    </Container>
  );
};

export default LoginPage;
