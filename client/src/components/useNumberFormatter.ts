import React from 'react';

export interface NumberFormatter {
  numberFormatter: Intl.NumberFormat;
}

// TODO: Expand to be customizable
function useNumberFormatter(): NumberFormatter {
  // @ts-ignore We check for null and set .current to NumberFormatter immediately after executing the useRef hook, so IntlForammterRef will never truly be null
  const IntlFormatterRef: React.MutableRefObject<Intl.NumberFormat> = React.useRef<Intl.NumberFormat>(null);

  if (IntlFormatterRef.current == null) {
    IntlFormatterRef.current = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

  return {
    get numberFormatter() {
      return IntlFormatterRef.current;
    },
  };
}

export default useNumberFormatter;
