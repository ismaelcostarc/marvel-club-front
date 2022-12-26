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
}