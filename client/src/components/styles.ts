import styled from 'styled-components';

interface SLayoutProps {
  maxWidth?: string;
}

export const SLayout = styled.div<SLayoutProps>`
  margin-top: 32px;
  box-sizing: border-box;
  margin: 0px auto;
  min-width: 0px;
  display: flex;
  max-width: ${(props) => props.maxWidth || '540px'};
  flex: 1 1 0%;
  align-items: center;
  padding-bottom: 48px;
  position: relative;
`;

export const SHeading = styled.div`
  font-size: 20px;
  text-align: center;
  font-weight: 600;
  letter-spacing: -1px;
  font-style: italic;
`;

export const Colors = {
  primary: {
    main: '#212121',
    light: '#484848',
    dark: '#000000',
  },
  secondary: {
    main: '#f7d9e7',
    light: '#ffffff',
    dark: '#c4a7b5',
  },
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
  success: '#4caf50',
};
