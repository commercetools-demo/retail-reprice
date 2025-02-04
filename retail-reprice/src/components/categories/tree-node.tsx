import React from 'react';
import styled from 'styled-components';
import { AngleDownIcon, AngleRightIcon } from '@commercetools-uikit/icons';
import { LocalizedString } from '@commercetools-frontend/l10n/dist/declarations/src/types';
import { formatLocalizedString } from '@commercetools-frontend/l10n';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
interface TreeNodeProps {
  id: string;
  name: LocalizedString;
  children?: TreeNodeProps[];
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
  className?: string;
  indentSize?: number;
  onToggle?: (id: string, isOpen: boolean) => void;
  onClick?: (id: string) => void;
}

const TreeNodeContainer = styled.div`
  /* Base styles for the tree node container */
`;

const NodeContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ToggleButton = styled.button`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  border-radius: 4px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.075);
  }
`;

const Spacer = styled.div`
  width: 16px;
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 500;
  user-select: none;
`;

const MetadataContainer = styled.span`
  font-size: 12px;
  color: #666;
  margin-left: auto;
`;

const MetadataItem = styled.span`
  margin-left: 8px;
`;

const ChildrenContainer = styled.div<{ indentSize: number }>`
  margin-left: ${(props) => props.indentSize}px;
`;

const TreeNode: React.FC<TreeNodeProps> = ({
  id,
  name,
  children = [],
  icon,
  metadata,
  className = '',
  indentSize = 16,
  onToggle,
  onClick,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = children && children.length > 0;
  const { dataLocale } = useApplicationContext();
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggle?.(id, newIsOpen);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(id);
  };

  return (
    <TreeNodeContainer className={className}>
      <NodeContent onClick={handleClick} role="button" aria-expanded={isOpen}>
        {hasChildren ? (
          <ToggleButton
            onClick={handleToggle}
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            {isOpen ? (
              <AngleDownIcon size="10" />
            ) : (
              <AngleRightIcon size="10" />
            )}
          </ToggleButton>
        ) : (
          <Spacer />
        )}

        {icon && <span>{icon}</span>}

        <Label>
          {formatLocalizedString(
            { name },
            { key: 'name', locale: dataLocale || 'en-US' }
          )}
        </Label>

        {metadata && (
          <MetadataContainer>
            {Object.entries(metadata).map(([key, value]) => (
              <MetadataItem key={key}>{value}</MetadataItem>
            ))}
          </MetadataContainer>
        )}
      </NodeContent>

      {isOpen && hasChildren && (
        <ChildrenContainer indentSize={indentSize} role="group">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              {...child}
              indentSize={indentSize}
              onToggle={onToggle}
              onClick={onClick}
            />
          ))}
        </ChildrenContainer>
      )}
    </TreeNodeContainer>
  );
};

// Optional: Create a styled wrapper component for the tree
const TreeContainer = styled.div`
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

export default TreeNode;
