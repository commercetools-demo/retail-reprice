import React, { useContext, useEffect, useState } from 'react';
import {
  useCustomObjectFetcher,
  useCustomObjectUpdater,
} from '../../hooks/use-custom-object-connector';

export const CUSTOM_OBJECT_KEY = 'storesToTags';
export const CUSTOM_OBJECT_CONTAINER = 'retail-reprice';

export type TTag = Record<string, { stores: string[] }>;

interface TagsContextReturn {
  tags: TTag;
  loading: boolean;
  addTag: (tag: string, storeId: string) => void;
  removeTag: (tag: string, storeId: string) => void;
}

const initialData = {
  loading: false,
  tags: {},
  addTag: () => {},
  removeTag: () => {},
};

const TagsContext = React.createContext<TagsContextReturn>(initialData);

const TagsProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { customObject: customObjectData, loading } = useCustomObjectFetcher({
    container: CUSTOM_OBJECT_CONTAINER,
    key: CUSTOM_OBJECT_KEY,
  });
  const { execute } = useCustomObjectUpdater();

  const [customObject, setCustomObject] = useState<any>();

  const addTag = async (tag: string, storeId: string) => {
    const result = await execute({
      draft: {
        container: CUSTOM_OBJECT_CONTAINER,
        key: CUSTOM_OBJECT_KEY,
        value: JSON.stringify({
          ...customObject,
          [tag]: {
            ...customObject?.[tag],
            stores: [...(customObject?.[tag]?.stores || []), storeId],
          },
        }),
      },
    });
    if (!result.errors) {
      return result;
    }
  };
  const removeTag = async (tag: string, storeId: string) => {
    return execute({
      draft: {
        container: CUSTOM_OBJECT_CONTAINER,
        key: CUSTOM_OBJECT_KEY,
        value: JSON.stringify({
          ...customObject,
          [tag]: {
            ...customObject?.[tag],
            stores: customObject?.[tag].stores.filter((id) => id !== storeId),
          },
        }),
      },
    });
  };

  useEffect(() => {
    setCustomObject(customObjectData?.value);
  }, [customObjectData, loading]);

  return (
    <TagsContext.Provider
      value={{ tags: customObject, loading, addTag, removeTag }}
    >
      {children}
    </TagsContext.Provider>
  );
};

export default TagsProvider;

export const useTagsContext = () => useContext(TagsContext);
