import React from 'react';

export interface NumberFormatter {
  numberFormatter: Intl.NumberFormat | null;
}

// TODO: Expand to be customizable
function useNumberFormatter(): NumberFormatter {
  const IntlFormatterRef = React.useRef<Intl.NumberFormat | null>(null);

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
