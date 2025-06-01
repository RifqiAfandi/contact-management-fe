export const getExpiryStatus = (expiredDate) => {
  const today = new Date();
  const expiry = new Date(expiredDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 30) return "warning";
  return "normal";
};

export const getExpiryStatusText = (expiredDate) => {
  const status = getExpiryStatus(expiredDate);
  
  switch (status) {
    case "expired":
      return "Expired";
    case "warning":
      return "Segera";
    case "normal":
      return "Normal";
    default:
      return "Normal";
  }
};