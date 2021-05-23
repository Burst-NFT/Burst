import Button from '@material-ui/core/Button';
import { useMoralis } from 'react-moralis';
import { useWallet } from './useWallet';

function ConnectToWallet() {
  const { authenticate, isAuthenticated, user } = useMoralis();
  const { web3, account } = useWallet();

  const displayAccount = isAuthenticated && account ? `${account.slice(0, 10)}...` : '';
  console.log('ConnectToWallet.account', account, displayAccount);
  console.log('authenticate', isAuthenticated, user);
  const handleClick = () => {
    authenticate();
    // web3.currentProvider.enable();
  };
  return !!displayAccount ? (
    <Button variant='contained' disableElevation style={{ backgroundColor: 'white' }} disabled>
      {displayAccount}
    </Button>
  ) : (
    <Button onClick={handleClick} variant='contained' disableElevation style={{ backgroundColor: 'white' }}>
      Connect
    </Button>
  );
}

export default ConnectToWallet;
