export type ComicType = {
  id: number;
  title: string;
  dates: [
    {
      date: string;
    }
  ];
  images:
    | [
        {
          extension: string;
          path: string;
        }
      ]
    | [];
    description: ''
};

export type CharacterType = {
  id: number;
  name: string;
  thumbnail: {
    extension: string;
    path: string;
  };
};

export type UserType = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

export type BookmarkType = {
  id: number;
  code: number;
}