import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';
import MuiCardHeader from '@material-ui/core/CardHeader';

const StyledCardHeader = styled(MuiCardHeader)`
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  padding: 8px 16px;
`;

function CardHeader({ title }) {
  return <StyledCardHeader title={title} titleTypographyProps={{ variant: 'h6', color: 'primary' }} />;
}

export default CardHeader;
