export const getIconSymbol = (iconName) => {
  const icons = {
    home: "🏠",
    report: "📊",
    stock: "📦",
    product: "📋",
    users: "👥",
    userPlus: "👤",
    settings: "⚙️",
    logout: "🚪",
    menu: "☰",
    close: "✕",
    chevronRight: "▶",
    chevronDown: "▼",
  };
  return icons[iconName] || "•";
};

export const renderIcon = (iconName) => {
  return getIconSymbol(iconName);
};