import styled from 'styled-components';
import { Colors } from '../styles';

export const SBurstCard = styled.div`
  background-color: #fff;
  border-radius: 4px;
  border: solid 2px #000;

  display: inline-block;
  flex: 1 1;
  /* height: 200px; */
  margin: 1vmin;
  overflow: hidden;
  position: relative;
  max-width: 250px;
  &:hover {
    /* background-color: ${Colors.secondary.light}; */
    box-shadow: 0 6px 6px -6px #000;
  }
`;
export const SBurstCardToolbar = styled.div``;
export const SBurstCardContent = styled.div`
  cursor: pointer;
`;
export const SChartTotalContainer = styled.div`
  display: flex;
  justify-content: center;
`;

interface SMarkerProps {
  color?: string;
}

export const SMarker = styled.div<SMarkerProps>`
  background: ${(props) => props.color || '#9a9a9a'};
  padding: 5px;
  color: white;
  border-radius: 4px;
  font-size: 12px;
`;

export const SPanel = styled.div`
  background-color: #fff;
  border: solid 2px #000;
  /* box-shadow: 0 6px 6px -6px #000; */
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
  padding: 1vmin;
`;
