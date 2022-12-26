import { Layout, Menu, MenuProps, Button, notification } from "antd";
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
import Head from "next/head";
import nookies from "nookies";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import axios from "axios";

type BaseLayoutProps = {
  children: React.ReactNode;
  name: string;
  pathname: string;
  baseURL: string;
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

const routes = ["/lists", "/bookmarks", "/profile"];

export default function BaseLayout({
  children,
  name,
  pathname,
  baseURL,
}: BaseLayoutProps) {
  const router = useRouter();
  const [actualKey, setActualKey] = useState("");
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const key = routes.findIndex((route) => route === pathname);

    setActualKey(`${key}`);
  }, [pathname]);

  const logOut = async () => {
    const cookies = nookies.get(null);
    const token = cookies.MARVEL_CLUB_TOKEN;
    try {
      const {data} = await axios.post(`${baseURL}/user/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if(data) {
        destroyCookie(null, "MARVEL_CLUB_TOKEN");
        router.push("/login");
      }
    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "topRight",
      });
    }
  };

  const onClick = async ({ key }: { key: string }) => {
    if (key === "3") await logOut();
    else {
      const route = routes[+key];
      router.push(route);
    }
  };

  const title = pathname[1].toUpperCase() + pathname.substring(2);

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

  return (
    <div className={style.container}>
      {contextHolder}
      <Head>
        <title>{title}</title>
      </Head>
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
