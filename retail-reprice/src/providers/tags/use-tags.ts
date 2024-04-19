import { CUSTOM_OBJECT_CONTAINER, CUSTOM_OBJECT_KEY, TTag } from './tags';

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

  const getAddTagDraft = (tag: string, storeId: string, currentTag: TTag) => {
    return {
      draft: {
        container: CUSTOM_OBJECT_CONTAINER,
        key: CUSTOM_OBJECT_KEY,
        value: JSON.stringify({
          ...currentTag,
          [tag]: {
            ...currentTag?.[tag],
            stores: [...(currentTag?.[tag]?.stores || []), storeId],
          },
        }),
      },
    };
  };

  const getRemoveTagDraft = (
    tag: string,
    storeId: string,
    currentTag: TTag
  ) => {
    return {
      draft: {
        container: CUSTOM_OBJECT_CONTAINER,
        key: CUSTOM_OBJECT_KEY,
        value: JSON.stringify({
          ...currentTag,
          [tag]: {
            ...currentTag?.[tag],
            stores: currentTag?.[tag].stores.filter((id) => id !== storeId),
          },
        }),
      },
    };
  };

  const getRenameTagDraft = (
    oldName: string,
    newName: string,
    currentTag: TTag
  ) => {
    return {
      draft: {
        container: CUSTOM_OBJECT_CONTAINER,
        key: CUSTOM_OBJECT_KEY,
        value: JSON.stringify({
          ...currentTag,
          [newName]: currentTag?.[oldName],
          [oldName]: undefined,
        }),
      },
    };
  };

  return {
    getRenameTagDraft,
    getAddTagDraft,
    getRemoveTagDraft,
    getTagsForStore,
    filterTagsByStores,
  };
};
