import { defineMessages } from 'react-intl';

export default defineMessages({
  backToBusinessUnitList: {
    id: 'businessUnitDetails.backToWelcome',
    defaultMessage: 'Back to business units',
  },
  title: {
    id: 'businessUnitDetails.title',
    defaultMessage: 'Business unit details: {businessUnitName}',
  },
  demoHint: {
    id: 'businessUnitDetails.demoHint',
    defaultMessage:
      'This page demonstrates how you can develop a component following some of the Merchant Center UX Guidelines and development best practices. For instance, fetching data using GraphQL, displaying data in a paginated table, writing functional tests, etc.',
  },
  noResults: {
    id: 'businessUnitDetails.noResults',
    defaultMessage:
      'There are no businessUnitDetails available in this project.',
  },
  allStores: {
    id: 'stores.storeTable',
    defaultMessage: 'All stores',
  },
});
