import { Form, Input, Button } from "antd";
import { MaskedInput } from "antd-mask-input";
import { UserType } from "../../../../types";

const { useForm } = Form;

type RegisterFormProps = {
  onFinishRegister: (values: UserType) => void;
};

const RegisterForm = ({ onFinishRegister }: RegisterFormProps) => {
  const [form] = useForm();

  return (
    <Form
      wrapperCol={{ span: 24 }}
      layout="vertical"
      onFinish={onFinishRegister}
      form={form}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input your name" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: "Please input your address" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: "Please input your phone" }]}
      >
        <MaskedInput mask="(00) 00000-0000" />
      </Form.Item>

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

      <Form.Item
        label="Confirm password"
        name="password_confirmation"
        rules={[{ required: true, message: "Please confirm your password" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" type="primary" block danger>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
