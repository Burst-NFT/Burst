import React from 'react';

// TODO: Expand to be customizable
function useNumberFormatter() {
  const IntlFormatterRef = React.useRef(null);

  if (IntlFormatterRef.current == null) {
    IntlFormatterRef.current = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  return {
    get numberFormatter() {
      return IntlFormatterRef.current;
    }
  };
}

export default useNumberFormatter;
