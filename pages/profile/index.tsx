import { Card, Form, Input, Button, Col, Row, notification, Modal } from "antd";
import { useState } from "react";
import { useRouter } from "next/router";
import { UserType } from "../../types";
import nookies, { destroyCookie } from "nookies";
import BaseLayout from "../../components/layout/BaseLayout";
import axios from "axios";
import BaseContainer from "../../components/ui/BaseContainer";
import style from "./style.module.css";

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
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      router.push("/profile");
    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  };

  const deleteUser = async () => {
    try {
      const result = await axios.delete(`${baseURL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(result) {
        destroyCookie(null, tokenName);

        api.info({
          message: "Account deleted",
          placement: "topRight",
        });
  
        router.push("/login");
      }

    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    deleteUser()
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <BaseLayout
      name={user.name}
      pathname={pathname}
      baseURL={baseURL}
      tokenName={tokenName}
    >
      <BaseContainer>
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
                    <Button block type="text" danger onClick={showModal}>
                      Delete account
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </BaseContainer>

      {contextHolder}

      <Modal
        title="Delete account"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Are you sure you want to delete your account?
      </Modal>
    </BaseLayout>
  );
};

export default ProfilePage;
