import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import styled from 'styled-components';

export interface BurstAssetChartDataItem {
  id: string;
  label: string;
  value: number;
}

interface BurstAssetChartComponentProps {
  height?: string;
  width?: string;
  data: BurstAssetChartDataItem[];
}

interface SChartWrapperProps {
  height?: string;
  width?: string;
}
const SChartWrapper = styled.div<SChartWrapperProps>`
  height: ${(props) => props.height || '300px'};
  width: ${(props) => props.width || '300px'};
`;

function BurstAssetChartComponent({ data, height, width }: BurstAssetChartComponentProps) {
  return (
    <SChartWrapper height={height} width={width}>
      <ResponsivePie
        data={data}
        margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'set3' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        enableArcLinkLabels={false}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor='#333333'
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabel='label'
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        tooltip={({ datum: { label, value, color } }) => (
          <div
            style={{
              padding: 6,
              color,
              background: '#222222',
            }}
          >
            {label}: {value}
          </div>
        )}
      />
    </SChartWrapper>
  );
}

export const BurstAssetChart = BurstAssetChartComponent;
