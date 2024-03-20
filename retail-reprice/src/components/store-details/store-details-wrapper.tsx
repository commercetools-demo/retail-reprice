import { useParams } from 'react-router';
import StoreDetailsProvider from '../../providers/storeDetails/store-details';
import StoreDetails from './store-details';

type TStoreDetailsProps = {
  linkToWelcome: string;
};

const StoreDetailsWrapper = (props: TStoreDetailsProps) => {
  const params = useParams<{ storeId: string }>();
  console.log('params', params.storeId);

  return (
    <StoreDetailsProvider storeId={params.storeId}>
      <StoreDetails linkToWelcome={props.linkToWelcome} />
    </StoreDetailsProvider>
  );
};

export default StoreDetailsWrapper;
