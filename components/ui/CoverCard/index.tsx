import Image from "next/image";

type CoverCardType = {
  imageUrl: string;
  width: number;
  height: number;
};

const CoverCard = ({ imageUrl, width, height }: CoverCardType) => {
  return (
    <>
      {imageUrl === "" ? (
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
    </>
  );
};

export default CoverCard;
