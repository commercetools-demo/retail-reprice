export const useTags = () => {
  const getTagsForStore = (storeId: string, customObject: any) => {
    if (customObject) {
      return Object.keys(customObject).filter((tag) => {
        return customObject[tag].stores.includes(storeId);
      });
    }
  };

  return {
    getTagsForStore,
  };
};
