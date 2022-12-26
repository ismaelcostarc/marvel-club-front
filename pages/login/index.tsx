import { Form, Card, Input, Button, Space, notification } from "antd";
import Image from "next/image";
import Container from "../../components/ui/Container";
import style from "./style.module.css";
import axios from "axios";
import nookies from "nookies";
import { useRouter } from "next/router";

type CredentialsType = {
  email: string;
  password: string;
};

const { useForm } = Form;

export async function getServerSideProps() {
  const baseURL = process.env.BASE_URL;
  return {
    props: { baseURL },
  };
}

type LoginProps = {
  baseURL: string;
};

const LoginPage = ({ baseURL }: LoginProps): JSX.Element => {
  const [form] = useForm();
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();

  const onFinish = async (values: CredentialsType) => {
    try {
      const { data } = await axios.post(`${baseURL}/user/login`, values);

      nookies.set(null, "MARVEL_CLUB_TOKEN", data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "*",
      });

      router.push('/list')
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
              <Button htmlType="submit" type="primary" block>
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
