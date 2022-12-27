import { Card, Typography, Space } from "antd";
import Image from "next/image";
import style from "./style.module.css";

type UserCard = {
  name: string;
};

const { Title } = Typography;

const UserCard = ({ name }: UserCard) => {
  return (
    <Card className={style.container}>
      <Space direction="vertical" size="middle">
        <Image
          alt="User Picture Default"
          width="100"
          height="100"
          src="/assets/user.jpg"
          className={style.user}
        />
        <Title level={4}>{name}</Title>
      </Space>
    </Card>
  );
};

export default UserCard;
