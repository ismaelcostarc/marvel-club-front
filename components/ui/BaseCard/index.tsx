import { Card, Button } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import style from "./style.module.css";
import Image from "next/image";

type ComicCardType = {
  title: string;
  imageUrl: string;
  starred: boolean;
  id: number;
  width: number,
  height: number,
  openModal: (id: number) => void;
  mark: (id: number) => void;
  markOff: (id: number) => void;
};

const ComicCard = ({
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
  return (
    <Card
      className={style.card}
      title={title}
      actions={[
        starred ? (
          <Button key="bookmark" type="text" onClick={() => markOff(id)}>
            <StarFilled style={{fontSize:"20px"}}/>
          </Button>
        ) : (
          <Button key="bookmark" type="text" onClick={() => mark(id)}>
            <StarOutlined style={{fontSize:"20px"}}/>
          </Button>
        ),
        <Button key="description" type="text" onClick={() => openModal(id)} >
          About
        </Button>,
      ]}
    >
      {imageUrl === '' ? (
        <Image
          alt="Comic Cover"
          width={width}
          height={height}
          src="/assets/default-comic-cover.jpg"
        />
      ) : (
        <Image
          loader={() => imageUrl}
          src={imageUrl}
          alt="Comic Cover"
          width={width}
          height={height}
        />
      )}
    </Card>
  );
};

export default ComicCard;
