import { Form, Input, Button } from "antd";
import { CredentialsType } from "../../types";

const { useForm } = Form;

type LoginFormProps = {
  onFinishLogin: (values: CredentialsType) => void;
};

const LoginForm = ({ onFinishLogin }: LoginFormProps) => {
  const [form] = useForm();

  return (
    <Form
      wrapperCol={{ span: 24 }}
      layout="vertical"
      onFinish={onFinishLogin}
      form={form}
    >
      <Form.Item
        label="E-mail"
        name="email"
        rules={[{ required: true, message: "Please input your email" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" type="primary" block danger>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
