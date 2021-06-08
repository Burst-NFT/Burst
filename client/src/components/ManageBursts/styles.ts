import styled from 'styled-components';

export const SPanel = styled.div`
  background-color: #fff;
  border: solid 2px #000;
  box-shadow: 0 6px 6px -6px #000;
  display: inline-block;
  flex: 1 1;
  /* height: 200px; */
  margin: 1vmin;
  overflow: hidden;
  position: relative;
  /* &:nth-child(4n + 1) {
    background-image: radial-gradient(circle, yellow, orange);
  }
  &:nth-child(4n + 2) {
    background-image: radial-gradient(circle, lightblue, deepskyblue);
  }
  &:nth-child(4n + 3) {
    background-image: radial-gradient(circle, palegreen, yellowgreen);
  } */
`;

export const SPanelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-family: 'Comic Sans', cursive;
  padding: 1vmin;
`;
