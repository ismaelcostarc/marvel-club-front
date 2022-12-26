import nookies, { destroyCookie } from "nookies";
import BaseLayout from "../../components/layout/BaseLayout";
import axios from "axios";
import Container from "../../components/ui/Container";
import { Card, Form, Input, Button, Col, Row, notification } from "antd";
import style from "./style.module.css";
import { useState } from "react";
import { useRouter } from "next/router";

type GetUserResponse = {
  name: string;
};

type UserType = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

const { useForm } = Form;

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
    const { data: user } = await axios.get<GetUserResponse>(`${baseURL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      props: { token, user, pathname, baseURL, tokenName },
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

const ProfilePage = ({
  token,
  user,
  pathname,
  baseURL,
  tokenName,
}: any): JSX.Element => {
  const [form] = useForm();
  const cookies = nookies.get(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const onFieldsChange = () => {
    setButtonDisabled(false);
  };

  const updateUser = async (values: UserType) => {
    try {
      await axios.put(`${baseURL}/user`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      api.success({
        message: "User updated",
        placement: "topRight",
      });

      router.push('/profile')
    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  };

  const deleteUser = async () => {};

  return (
    <BaseLayout
      name={user.name}
      pathname={pathname}
      baseURL={baseURL}
      tokenName={tokenName}
    >
      <Container>
        {contextHolder}
        <Col xs={24} sm={24} md={18} lg={16} xl={8}>
          <Card title="Profile">
            <Form
              form={form}
              layout="vertical"
              initialValues={user}
              onFieldsChange={onFieldsChange}
              onFinish={updateUser}
            >
              <Form.Item name="name" label="Name">
                <Input />
              </Form.Item>

              <Form.Item name="address" label="Address">
                <Input />
              </Form.Item>

              <Form.Item name="email" label="E-mail">
                <Input />
              </Form.Item>

              <Form.Item name="phone" label="Phone">
                <Input />
              </Form.Item>

              <Form.Item name="password" label="Password">
                <Input />
              </Form.Item>

              <Form.Item name="password_confirmation" label="Confirm password">
                <Input />
              </Form.Item>
              <Row justify="end">
                <Col span={12}>
                  <Form.Item className={style.wrapperButton}>
                    <Button
                      block
                      type="primary"
                      disabled={buttonDisabled}
                      htmlType="submit"
                    >
                      Update
                    </Button>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item className={style.wrapperButton}>
                    <Button block type="text" danger onClick={deleteUser}>
                      Delete user
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Container>
    </BaseLayout>
  );
};

export default ProfilePage;
