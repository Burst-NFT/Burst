import logo from './logo.svg';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';

const LogoImg = styled.img`
  max-height: 64px;
`;

function App() {
  return (
    <Container className='App'>
      <header className='App-header'>
        <LogoImg src={logo} className='App-logo' alt='logo' />
      </header>
      <Typography>
        Edit <code>src/App.js</code> and save to reload.
      </Typography>
      <Link className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
        Learn React
      </Link>
    </Container>
  );
}

export default App;
