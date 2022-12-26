import { Card, Typography } from "antd";
import style from "./style.module.css";
import Image from "next/image";

const { Title } = Typography;

type ComicCardType = {
  title: string;
  images:
    | [
        {
          extension: string;
          path: string;
        }
      ]
    | [];
  starred: boolean;
};

const ComicCard = ({ title, images, starred }: ComicCardType) => {
  const src =
    images.length !== 0 ? `${images[0].path}.${images[0].extension}` : "";

  return (
    <Card className={style.card} title={title}>
      {images.length === 0 ? (
        <Image
          alt="Comic Cover"
          width="100"
          height="100"
          src="/assets/default-comic-cover.jpg"
        />
      ) : (
        <Image
          loader={() => src}
          src={src}
          alt="Comic Cover"
          width="150"
          height="200"
        />
      )}
    </Card>
  );
};

export default ComicCard;
