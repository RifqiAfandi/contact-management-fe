import React from "react";
import Header from "./components/Header";
import StatsGrid from "./components/StatsGrid";
import SearchBox from "./components/SearchBox";
import SortControls from "./components/SortControls";
import InventoryList from "./components/InventoryList";
import Modal from "./components/Modal";
import { useInventory } from "./hooks/useInventory";
import { useModal } from "./hooks/useModal";
import { useAuth } from "./hooks/useAuth";
import "./WarehousePage.css";

const WarehousePage = () => {
  const { user, handleLogout } = useAuth();
  const {
    inventoryItems,
    filteredItems,
    isLoading,
    error,
    searchTerm,
    sortBy,
    sortOrder,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    handleDelete,
    handleSubmit,
    refreshInventoryList,
  } = useInventory();

  const {
    isModalOpen,
    editingItem,
    formData,
    handleEdit,
    handleCloseModal,
    handleInputChange,
    setIsModalOpen,
  } = useModal(refreshInventoryList);

  return (
    <div className="gudang-container">
      <Header user={user} onLogout={handleLogout} />
      
      <StatsGrid inventoryItems={inventoryItems} />
      
      <div className="controls-section">
        <SearchBox 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <SortControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onAddClick={() => setIsModalOpen(true)}
        />
      </div>
      
      <InventoryList
        items={filteredItems}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddClick={() => setIsModalOpen(true)}
      />
      
      {isModalOpen && (
        <Modal
          editingItem={editingItem}
          formData={formData}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          onInputChange={handleInputChange}
        />
      )}
    </div>
  );
};

export default WarehousePage;