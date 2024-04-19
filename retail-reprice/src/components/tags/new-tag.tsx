import { Tag } from '@commercetools-uikit/tag';
import { useState } from 'react';
import { PlusThinIcon } from '@commercetools-uikit/icons';
import { useTagsContext } from '../../providers/tags/tags';
import SelectInput from '@commercetools-uikit/creatable-select-input';
import Constraints from '@commercetools-uikit/constraints';

type Props = {
  onAdd: (tag: string) => void;
};

const NewTag = (props: Props) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const { tags } = useTagsContext();

  const handleSubmit = (tag: { label: string; value: string }) => {
    props.onAdd(tag.value);
    setIsInputVisible(false);
  };
  return (
    <>
      {isInputVisible && (
        <Constraints.Horizontal max={4}>
          <SelectInput
            options={Object.keys(tags).map((tag) => ({
              label: tag,
              value: tag,
            }))}
            menuPortalTarget={document.body}
            onChange={(e) =>
              handleSubmit(e.target.value as { label: string; value: string })
            }
            isSearchable
            menuPortalZIndex={40}
          />
        </Constraints.Horizontal>
      )}
      {!isInputVisible && (
        <Tag horizontalConstraint={1} onClick={() => setIsInputVisible(true)}>
          <PlusThinIcon size="small" />
        </Tag>
      )}
    </>
  );
};

export default NewTag;
