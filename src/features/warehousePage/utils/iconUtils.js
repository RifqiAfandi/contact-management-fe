export const getIconSymbol = (iconName) => {
  const icons = {
    plus: "➕",
    search: "🔍",
    sort: "🔄",
    edit: "✏️",
    delete: "🗑️",
    close: "✕",
    save: "💾",
    calendar: "📅",
    money: "💰",
    package: "📦",
    check: "✅",
    alert: "⚠️",
    archive: "📁",
    refresh: "🔄",
    "chevron-left": "◀",
    "chevron-right": "▶",
  };
  return icons[iconName] || "•";
};

export const renderIcon = (iconName) => {
  return getIconSymbol(iconName);
};
