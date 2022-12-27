type imagesType = [] | [{ path: string; extension: string }];

export const getImageUrl = (images: imagesType): string => {
  const image = images[0];
  if (image) {
    return `${image.path}.${image.extension}`;
  } else {
    return "";
  }
};