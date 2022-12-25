import { Form, Card, Input, Button } from "antd";
import Image from "next/image";
import Container from "../../components/ui/Container";
import style from "./style.module.css";

export default function LoginPage(): JSX.Element {
  return (
    <Container>
      <Card>
        <div className={style.logo}>
          <Image alt="Marvel logo" src="/assets/marvel-logo.png" fill />
        </div>
        <Form>
          <Form.Item label="E-mail">
            <Input />
          </Form.Item>

          <Form.Item label="Password">
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit">Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
}
