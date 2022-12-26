import { Layout, Menu, MenuProps, Button } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import {
  UnorderedListOutlined,
  StarOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import style from "./style.module.css";
import UserCard from "../UserCard";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type BaseLayoutProps = {
  children: React.ReactNode;
  name: string;
  pathname: string;
};

type MenuItem = Required<MenuProps>["items"][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
};

const items: MenuItem[] = [
  getItem("Lists", "0", <UnorderedListOutlined />),
  getItem("Bookmarks", "1", <StarOutlined />),
  getItem("Profile", "2", <ProfileOutlined />),
  getItem(
    <Button block>
      <LogoutOutlined /> Log out
    </Button>,
    "3"
  ),
];

const routes = ["/lists", "/bookmarks", "/profile"];

export default function BaseLayout({ children, name, pathname }: BaseLayoutProps) {
  const router = useRouter();
  const [actualKey, setActualKey] = useState("");

  useEffect(() => {
    const key = routes.findIndex((route) => route === pathname);

    setActualKey(`${key}`);
  }, [pathname]);

  const onClick = ({ key }: { key: string }) => {
    const route = routes[+key];
    router.push(route);
  };

  return (
    <div className={style.container}>
      <Layout>
        <Sider>
          <Image
            src="/assets/marvel-logo.png"
            width="200"
            height="70"
            alt="Marvel Logo"
          />
          <UserCard name={name} />
          <Menu
            theme="dark"
            items={items}
            onClick={onClick}
            mode="vertical"
            multiple={false}
            selectedKeys={[actualKey]}
          ></Menu>
        </Sider>
        <Content>
          <div className={style.content}>{children}</div>
        </Content>
      </Layout>
    </div>
  );
}
