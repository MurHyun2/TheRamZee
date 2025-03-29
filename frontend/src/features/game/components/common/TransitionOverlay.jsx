import React from 'react';
import styled from 'styled-components';

const TransitionOverlay = () => {
  return <OverlayContainer />;
};

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url('/path/to/transition.gif') center center no-repeat;
  background-size: cover;
  z-index: 9999;
`;

export default TransitionOverlay;
