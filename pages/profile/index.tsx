import nookies, { destroyCookie } from "nookies";
import BaseLayout from "../../components/layout/BaseLayout";
import axios from "axios";
import Container from "../../components/ui/Container";
import { Card, Form, Input, Button, Col, Row } from "antd";
import style from "./style.module.css";
import { MaskedInput } from "antd-mask-input";
import { useState } from "react";

type GetUserResponse = {
  name: string;
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
  const [newUser, setNewUser] = useState(user);
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const onFieldsChange = () => {
    setButtonDisabled(false)
  }

  console.log(user);
  return (
    <BaseLayout
      name={user.name}
      pathname={pathname}
      baseURL={baseURL}
      tokenName={tokenName}
    >
      <Container>
        <Col xs={24} sm={24} md={18} lg={16} xl={8}>
          <Card title="Profile">
            <Form form={form} layout="vertical" initialValues={user} onFieldsChange={onFieldsChange}>
              <Form.Item name="name" label="Name">
                <Input/>
              </Form.Item>

              <Form.Item name="address" label="Address">
                <Input />
              </Form.Item>

              <Form.Item name="email" label="E-mail">
                <Input />
              </Form.Item>

              <Form.Item name="phone" label="Phone">
                <MaskedInput mask={"(00) 00000-0000"} />
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
                    <Button block type="primary" disabled={buttonDisabled}>
                      Update
                    </Button>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item className={style.wrapperButton}>
                    <Button block type="text" danger>
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
