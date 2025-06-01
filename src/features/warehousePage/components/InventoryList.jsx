import React from "react";
import InventoryItem from "./InventoryItem";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";

const InventoryList = ({
  items,
  isLoading,
  error,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  const renderContent = () => {
    if (error) {
      return <ErrorState error={error} />;
    }

    if (isLoading) {
      return <LoadingState />;
    }

    if (items.length === 0) {
      return <EmptyState onAddClick={onAddClick} />;
    }

    return items.map((item) => (
      <InventoryItem
        key={item.id}
        item={item}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ));
  };

  return <div className="inventory-list">{renderContent()}</div>;
};

export default InventoryList;