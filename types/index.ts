export type ComicType = {
  id: number;
  title: string;
  images:
    | [
        {
          extension: string;
          path: string;
        }
      ]
    | [];
};

export type CharacterType = {
  id: number;
  name: string;
  thumbnail: {
    extension: string;
    path: string;
  };
};
