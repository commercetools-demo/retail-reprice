import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { buildUrlWithParams } from '../../utils/url';

export const useCatalog = () => {
  const dispatchProductSearch = useAsyncDispatch<TSdkAction, any>();

  const context = useApplicationContext((context) => context);

  const toCategoryTree = (commercetoolsCategories: any[]): any[] => {
    const nodes: { [key: string]: any } = {};

    for (const commercetoolsCategory of commercetoolsCategories) {
      nodes[commercetoolsCategory.id] = commercetoolsCategory;
    }

    // Move descentans to their parent category if exists
    for (const commercetoolsCategory of commercetoolsCategories) {
      if (
        !commercetoolsCategory.parent?.id ||
        !(commercetoolsCategory.parent.id in nodes)
      )
        continue;

      // Ensure the descendants array is initialized
      if (!nodes[commercetoolsCategory.parent.id].descendants) {
        nodes[commercetoolsCategory.parent.id].descendants = [];
      }

      nodes[commercetoolsCategory.parent.id].descendants.push(
        nodes[commercetoolsCategory.id]
      );
    }

    // Return only the root categories
    return Object.values(nodes).filter(
      (node) =>
        !node.parent?.id || (node.parent?.id && !(node.parent?.id in nodes))
    );
  };

  const getStoresCategories = async (storeIds?: string[]) => {
    const buckets = await queryFacetCategoriesForSubtree(storeIds);
    const categories = await queryCategories(buckets);

    return categories;
  };

  const queryCategories = async (buckets?: string[]) => {
    const limit = 500;
    const where: string[] = [];

    if (buckets?.length) {
      where.push(`id in (${buckets.map((b) => `"${b}"`).join(',')})`);
    }
    const methodArgs = {
      queryArgs: {
        limit: limit,
        offset: 0,
        ...(where.length > 0 ? { where } : {}),
        expand: ['ancestors[*]', 'parent'],
        sort: 'orderHint',
      },
    };
    const result = await dispatchProductSearch(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(`/${context?.project?.key}/categories`, {
          ...methodArgs.queryArgs,
        }),
      })
    );

    return result.results;
  };

  const queryFacetCategoriesForSubtree = async (
    storeIds?: string[]
  ): Promise<any> => {
    if (!storeIds?.length) {
      return [];
    }

    let searchQuery: any = {};
    if (storeIds?.length === 1) {
      searchQuery = {
        exact: {
          field: 'stores',
          value: storeIds[0],
        },
      };
    } else {
      searchQuery = {
        and: storeIds!.map((storeId) => ({
          exact: {
            field: 'stores',
            value: storeId,
          },
        })),
      };
    }
    const query: any = {
      query: {
        ...searchQuery,
      },
      facets: [
        {
          distinct: {
            name: 'categoriesSubTree',
            field: 'categoriesSubTree',
            level: 'products',
            limit: 200,
          },
        },
      ],
    };

    const result = await dispatchProductSearch(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/products/search`,
          {}
        ),
        payload: {
          ...query,
        },
      })
    );
    const res = result?.facets
      ?.find((r: any) => r.name === 'categoriesSubTree')
      ?.buckets?.filter((b) => b.count > 0)
      ?.map((b) => b.key);

    return res;
  };

  return {
    getStoresCategories,
  };
};
