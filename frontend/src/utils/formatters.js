// Format currency to Ghana Cedis (GHS)
export const formatCurrency = (value) => {
  const num = Number(value || 0);
  try {
    return num.toLocaleString('en-GH', { 
      style: 'currency', 
      currency: 'GHS', 
      maximumFractionDigits: 2 
    });
  } catch (e) {
    return num.toLocaleString(undefined, { 
      style: 'currency', 
      currency: 'GHS', 
      maximumFractionDigits: 2 
    });
  }
};

// Format number with optional decimal places
export const formatNumber = (value, digits = 0) => {
  const num = Number(value || 0);
  return num.toLocaleString(undefined, { maximumFractionDigits: digits });
};
