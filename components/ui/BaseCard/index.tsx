import { Card, Button } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import style from "./style.module.css";
import Image from "next/image";
import { useState } from "react";
import BaseModal from "../BaseModal";
import CoverCard from "../CoverCard";

type ComicCardType = {
  type: "comic" | "character";
  title: string;
  imageUrl: string;
  starred: boolean;
  id: number;
  width: number;
  height: number;
  openModal: (id: number) => void;
  mark: (id: number) => void;
  markOff: (id: number) => void;
};

const ComicCard = ({
  type,
  title,
  imageUrl,
  starred,
  id,
  width,
  height,
  openModal,
  mark,
  markOff,
}: ComicCardType) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  return (
    <Card
      className={style.card}
      title={title}
      actions={[
        starred ? (
          <Button key="bookmark" type="text" onClick={() => markOff(id)}>
            <StarFilled style={{ fontSize: "20px" }} />
          </Button>
        ) : (
          <Button key="bookmark" type="text" onClick={() => mark(id)}>
            <StarOutlined style={{ fontSize: "20px" }} />
          </Button>
        ),
        <Button
          key="description"
          type="text"
          onClick={showModal}
          disabled={type === "character"}
        >
          About
        </Button>,
      ]}
    >
      <CoverCard imageUrl={imageUrl} width={width} height={height} />
      {type === "comic" && (
        <BaseModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          id={id}
          cover={
            <CoverCard imageUrl={imageUrl} width={width} height={height} />
          }
        />
      )}
    </Card>
  );
};

export default ComicCard;
