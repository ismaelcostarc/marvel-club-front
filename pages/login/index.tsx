import { Form, Card, Input, Button, Space, notification } from "antd";
import Image from "next/image";
import Container from "../../components/ui/Container";
import style from "./style.module.css";
import axios from "axios";
import nookies, { destroyCookie } from "nookies";
import { useRouter } from "next/router";
import Head from "next/head";

type CredentialsType = {
  email: string;
  password: string;
};

const { useForm } = Form;

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
          destination: "/lists",
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
  const [form] = useForm();
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();

  const onFinish = async (values: CredentialsType) => {
    try {
      const { data } = await axios.post(`${baseURL}/user/login`, values);

      nookies.set(null, tokenName, data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "*",
      });

      router.push("/lists");
    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  };

  return (
    <Container>
      {contextHolder}

      <Head>
        <title>Marvel Club</title>
      </Head>

      <video autoPlay muted loop className={style.backgroundVideo}>
        <source src="assets/background-login.mp4" type="video/mp4" />
      </video>

      <Card>
        <Space direction="vertical" size="large">
          <div className={style.logo}>
            <Image
              alt="Marvel logo"
              src="/assets/marvel-logo.png"
              width="100"
              height="50"
            />
          </div>

          <Form
            wrapperCol={{ span: 24 }}
            layout="vertical"
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" type="primary" block danger>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </Container>
  );
};

export default LoginPage;
