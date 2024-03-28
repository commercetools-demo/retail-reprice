import React, { useState } from 'react';
import TextField from '@commercetools-uikit/text-field';
import Text from '@commercetools-uikit/text';
import { useIntl } from 'react-intl';
import messages from './messages';
import Spacings from '@commercetools-uikit/spacings';
import styles from './tag-settings.module.css';
import FieldLabel from '@commercetools-uikit/field-label';
import { useTagsContext } from '../../providers/tags/tags';

type Props = {
  tag: string;
};

const TagSettings: React.FC<Props> = ({ tag }) => {
  const intl = useIntl();
  const {renameTag} = useTagsContext();

  const [tagName, setTagName] = useState(tag);
  return (
    <div className={styles.container}>
      <Spacings.Inset scale="s">
        <Spacings.Stack scale="s" alignItems="stretch">
          <Text.Body>{intl.formatMessage(messages.headline)}</Text.Body>
          <div className={styles.settingsWrapper}>
            <div className={styles.settings}>
              <TextField
                title={intl.formatMessage(messages.tagName)}
                value={tag}
                onChange={(e) => {
                  setTagName(e.target.value);
                }}
              />
              <div className={styles.colorPicker}>
                <FieldLabel
                  title={intl.formatMessage(messages.tagColorLabel)}
                  horizontalConstraint={12}
                ></FieldLabel>
                <input type="color" />
              </div>
            </div>
          </div>
        </Spacings.Stack>
      </Spacings.Inset>
    </div>
  );
};

export default TagSettings;
