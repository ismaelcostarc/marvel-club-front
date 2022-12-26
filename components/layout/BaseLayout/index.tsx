import { Layout, Menu, MenuProps, Button, notification } from "antd";
const { Sider, Content } = Layout;
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
import { destroyCookie } from "nookies";
import axios from "axios";

type BaseLayoutProps = {
  children: React.ReactNode;
  name: string;
  pathname: string;
  baseURL: string;
  tokenName: string;
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

const routes = [
  "",
  "/lists/comics",
  "/lists/characters",
  "",
  "/bookmarks/comics",
  "/bookmarks/characters",
  "/profile",
];

export default function BaseLayout({
  children,
  name,
  pathname,
  baseURL,
  tokenName,
}: BaseLayoutProps) {
  const router = useRouter();
  const [actualKey, setActualKey] = useState("");
  const [actualGroup, setActualGroup] = useState("");
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const key = routes.findIndex((route) => route === pathname).toString();

    setActualKey(key);
    if (key !== "6") {
      const group = ["1", "2"].includes(key) ? "0" : "3";
      setActualGroup(group);
    }
  }, [pathname]);

  const logOut = async () => {
    const cookies = nookies.get(null);
    const token = cookies[tokenName];
    try {
      const { data } = await axios.post(
        `${baseURL}/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        destroyCookie(null, tokenName);
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
    if (key === "7") await logOut();
    else {
      const route = routes[+key];
      router.push(route);
    }
  };

  const onOpenChange = (arr: Array<string>) => {
    if (arr.length === 0) {
      return;
    }
    setActualGroup(arr[1]);
  };

  const title = pathname[1].toUpperCase() + pathname.substring(2);

  const items: MenuItem[] = [
    getItem("Lists", "0", <UnorderedListOutlined />, [
      getItem("Comics", "1"),
      getItem("Characters", "2"),
    ]),
    getItem("Bookmarks", "3", <StarOutlined />, [
      getItem("Comics", "4"),
      getItem("Characters", "5"),
    ]),
    getItem("Profile", "6", <ProfileOutlined />),
    getItem(
      <Button block>
        <LogoutOutlined /> Log out
      </Button>,
      "7"
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
            onOpenChange={onOpenChange}
            mode="inline"
            multiple={false}
            selectedKeys={[actualKey]}
            openKeys={[actualGroup]}
          ></Menu>
        </Sider>
        <Content>
          <div className={style.content}>{children}</div>
        </Content>
      </Layout>
    </div>
  );
}
