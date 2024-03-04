import { Tag } from '@commercetools-uikit/tag';
import React, { useState } from 'react';
import { PlusThinIcon } from '@commercetools-uikit/icons';
import TextInput from '@commercetools-uikit/text-input/';
import styles from './tag.module.css';
type Props = {
  onAdd: (tag: string) => void;
};

const NewTag = (props: Props) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [tagName, setTagName] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onAdd(tagName);
    setIsInputVisible(false);
  };
  return (
    <>
      {isInputVisible && (
        <form onSubmit={handleSubmit}>
          <TextInput
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            className={styles.input}
          />
        </form>
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
