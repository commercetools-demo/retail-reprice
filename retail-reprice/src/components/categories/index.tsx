import React, { useEffect, useState } from 'react';
import { TBusinessUnitDetail } from '../../hooks/use-business-units-connector/types';
import { useCatalog } from '../../hooks/use-catalog';
import TreeNode from './tree-node';
import styled from 'styled-components';
import Text from '@commercetools-uikit/text';

type Props = {
  businessUnit?: TBusinessUnitDetail;
};

const TreeContainer = styled.div`
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 2px;
`;

const buildTree = (items: any) => {
  const itemMap = new Map();
  const roots: any = [];

  // First pass: Create all nodes
  items.forEach((item: any) => {
    itemMap.set(item.id, {
      ...item,
      children: [],
    });
  });

  // Second pass: Build tree structure
  items.forEach((item: any) => {
    const node = itemMap.get(item.id);
    if (item.parent && item.parent.id && itemMap.has(item.parent.id)) {
      const parent = itemMap.get(item.parent.id);
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

const CategoriesTree = ({ businessUnit }: Props) => {
  const { getStoresCategories } = useCatalog();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getStoresCategories(businessUnit?.stores?.map((store) => store.id)).then(
      (res) => {
        setCategories(res);
      }
    );
  }, [businessUnit]);

  const data = buildTree(categories);

  const handleToggle = (id: string, isOpen: boolean) => {
    console.log(`Node ${id} is now ${isOpen ? 'open' : 'closed'}`);
  };

  const handleClick = (id: string) => {
    console.log(`Node ${id} was clicked`);
  };

  return (
    <TreeContainer>
      <Text.Headline as="h2">Categories</Text.Headline>
      {data.map((node: any) => (
        <TreeNode
          key={node.id}
          {...node}
          onToggle={handleToggle}
          onClick={handleClick}
        />
      ))}
    </TreeContainer>
  );
};

export default CategoriesTree;
