import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import metaMaskIcon from './metamask.svg';
import MuiButton from '@material-ui/core/Button';
import styled from 'styled-components';

const ONBOARD_TEXT = 'Click here to install MetaMask!';
const CONNECT_TEXT = 'Connect';
const CONNECTED_TEXT = 'Connected';

const Button = styled(MuiButton)`
  && {
    background-color: ${(props) => (props.disabled ? 'rgb(237, 247, 237)' : '')};
  }
  img {
    max-width: 32px;
  }
`;

function MetaMaskButton() {
  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef();

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        console.log(accounts);
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  React.useEffect(() => {
    function handleNewAccounts(newAccounts) {
      setAccounts(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(handleNewAccounts);
      window.ethereum.on('accountsChanged', handleNewAccounts);
      return () => {
        // This errors and says etherum.off doesn't exist for some reason, need to look into it
        // window.ethereum.off('accountsChanged', handleNewAccounts);
      };
    }
  }, []);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((newAccounts) => setAccounts(newAccounts));
    } else {
      onboarding.current.startOnboarding();
    }
  };
  return (
    <Button onClick={onClick} startIcon={<img src={metaMaskIcon} />} variant='outlined' size='large' disabled={isDisabled}>
      {buttonText}
    </Button>
  );
}

export default React.memo(MetaMaskButton);
