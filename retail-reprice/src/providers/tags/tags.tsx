import React, { useContext, useEffect, useState } from 'react';
import {
  useCustomObjectFetcher,
  useCustomObjectUpdater,
  useTags,
} from '../../hooks/use-custom-object-connector';

export const CUSTOM_OBJECT_KEY = 'storesToTags';
export const CUSTOM_OBJECT_CONTAINER = 'retail-reprice';

export type TTag = Record<string, { stores: string[] }>;

interface TagsContextReturn {
  tags: TTag;
  loading: boolean;
  addTag: (tag: string, storeId: string) => void;
  removeTag: (tag: string, storeId: string) => void;
  renameTag: (oldName: string, newName: string, storeId: string) => void;
}

const initialData = {
  loading: false,
  tags: {},
  addTag: () => {},
  removeTag: () => {},
  renameTag: () => {},
};

const TagsContext = React.createContext<TagsContextReturn>(initialData);

const TagsProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { customObject: customObjectData, loading } = useCustomObjectFetcher({
    container: CUSTOM_OBJECT_CONTAINER,
    key: CUSTOM_OBJECT_KEY,
  });
  const { execute } = useCustomObjectUpdater();

  const { getAddTagDraft, getRemoveTagDraft, getRenameTagDraft } = useTags();

  const [customObject, setCustomObject] = useState<any>();

  const addTag = async (tag: string, storeId: string) => {
    const result = await execute(getAddTagDraft(tag, storeId, customObject));
    if (!result.errors) {
      return result;
    }
  };
  const removeTag = async (tag: string, storeId: string) => {
    return execute(getRemoveTagDraft(tag, storeId, customObject));
  };
  const renameTag = async (oldName: string, newName: string) => {
    return execute(getRenameTagDraft(oldName, newName, customObject));
  };

  useEffect(() => {
    setCustomObject(customObjectData?.value);
  }, [customObjectData, loading]);

  return (
    <TagsContext.Provider
      value={{ tags: customObject, loading, addTag, removeTag, renameTag }}
    >
      {children}
    </TagsContext.Provider>
  );
};

export default TagsProvider;

export const useTagsContext = () => useContext(TagsContext);
