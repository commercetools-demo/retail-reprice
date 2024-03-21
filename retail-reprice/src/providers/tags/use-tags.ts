import { TTag } from './tags';

export const useTags = () => {
  const getTagsForStore = (storeId: string, customObject: TTag) => {
    if (customObject) {
      return Object.keys(customObject).filter((tag) => {
        return customObject[tag].stores.includes(storeId);
      });
    }
    return [];
  };
  const filterTagsByStores = (
    stores: string[] | undefined,
    tags: TTag
  ): TTag => {
    if (tags && stores) {
      return Object.keys(tags).reduce((acc, tag) => {
        const storesInTag = tags[tag].stores.filter((id) =>
          stores.includes(id)
        );
        if (storesInTag.length) {
          acc[tag] = {
            stores: storesInTag,
          };
        }
        return acc;
      }, {} as TTag);
    }
    return {};
  };

  return {
    getTagsForStore,
    filterTagsByStores,
  };
};
