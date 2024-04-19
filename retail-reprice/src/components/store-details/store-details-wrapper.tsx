import { useParams } from 'react-router';
import StoreDetailsProvider from '../../providers/storeDetails/store-details';
import StoreDetails from './store-details';

type TStoreDetailsProps = {
  linkToWelcome: string;
};

const StoreDetailsWrapper = (props: TStoreDetailsProps) => {
  const params = useParams<{ storeId: string }>();

  return (
    <StoreDetailsProvider storeId={params.storeId}>
      <StoreDetails linkToWelcome={props.linkToWelcome} storeId={params.storeId}/>
    </StoreDetailsProvider>
  );
};

export default StoreDetailsWrapper;
