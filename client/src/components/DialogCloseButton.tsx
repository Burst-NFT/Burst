import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface DialogCloseButtonComponentProps {
  onClose: () => void;
}

const SIconButton = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
  color: #9e9e9e;
`;

function DialogCloseButtonComponent({ onClose: handleClose }: DialogCloseButtonComponentProps) {
  return (
    <SIconButton aria-label='close' onClick={handleClose}>
      <CloseIcon />
    </SIconButton>
  );
}

export const DialogCloseButton = DialogCloseButtonComponent;
