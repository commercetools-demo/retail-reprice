import React from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './sidebar-layout.module.css';
import messages from './messages';
import { useIntl } from 'react-intl';
import Spacings from '@commercetools-uikit/spacings';
import Tooltip from '@commercetools-uikit/tooltip';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import { ArrowRightIcon } from '@commercetools-uikit/icons';

type Props = {
  isOpen: boolean;
  hideHeader?: boolean;
  onClose: () => void;
};

const SidebarLayout: React.FC<Props> = ({
  isOpen,
  children,
  hideHeader,
  onClose,
}) => {
  const { formatMessage } = useIntl();
  return (
    <CSSTransition
      in={isOpen}
      classNames={{
        enter: styles.enterAnimation,
        enterActive: styles.enterActiveAnimation,
        exit: styles.exitAnimation,
        exitActive: styles.exitActiveAnimation,
      }}
      timeout={{ enter: 300, exit: 300 }}
      mountOnEnter
      unmount
    >
      <div className={styles.container} data-testid="sidebar-layout">
        {!hideHeader && (
          <div className={styles.headerContainer}>
            <>
              <Spacings.Inline alignItems="flex-end" justifyContent="flex-end">
                <Tooltip
                  placement="left"
                  title={formatMessage(messages.hideFilters)}
                >
                  <SecondaryIconButton
                    data-testid="hide-sidebar-layout-button"
                    icon={
                      <>
                        <ArrowRightIcon color="primary" size="big" />
                      </>
                    }
                    label={formatMessage(messages.hideFilters)}
                    onClick={onClose}
                    size="medium"
                  />
                </Tooltip>
              </Spacings.Inline>
            </>
          </div>
        )}
        <div className={styles.bodyContainer}>{children}</div>
      </div>
    </CSSTransition>
  );
};

export default SidebarLayout;
