import React from "react";
import Header from "./components/Header";
import StatsGrid from "./components/StatsGrid";
import SearchBox from "./components/SearchBox";
import StatusFilter from "./components/StatusFilter";
import SortControls from "./components/SortControls";
import MonthFilter from "./components/MonthFilter";
import InventoryList from "./components/InventoryList";
import Modal from "./components/Modal";
import { useInventory } from "./hooks/useInventory";
import { useModal } from "./hooks/useModal";
import { useAuth } from "./hooks/useAuth";
import "./WarehousePage.css";

const WarehousePage = () => {
  const { user, handleLogout } = useAuth();  const {
    inventoryItems,
    filteredItems,
    isLoading,
    error,
    searchTerm,
    sortBy,
    sortOrder,
    selectedStatus,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    setSelectedStatus,
    handleDelete,
    handleSubmit,
    refreshInventoryList,
    // Month filter props
    useMonthlyFilter,
    toggleMonthlyFilter,
    currentMonth,
    canGoPrevious,
    canGoNext,
    handleMonthChange,
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

  // Create a wrapper function for form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const success = await handleSubmit(e, formData, editingItem);
    if (success) {
      handleCloseModal();
    }
  };return (
    <div className="gudang-container">
      <Header user={user} onLogout={handleLogout} />
      
      <StatsGrid inventoryItems={inventoryItems} />
        <div className="controls-section">
        <SearchBox 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <StatusFilter
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
        
        {/* Month Filter placed next to search */}
        {useMonthlyFilter && (
          <MonthFilter
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            isLoading={isLoading}
            compact={true}
          />
        )}
        
        <div className="right-controls">
          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            onAddClick={() => setIsModalOpen(true)}
          />
          
          <div className="filter-toggle">
            <button
              className={`filter-toggle-btn ${useMonthlyFilter ? 'active' : ''}`}
              onClick={toggleMonthlyFilter}
              title={useMonthlyFilter ? 'Beralih ke tampilan semua data' : 'Beralih ke filter bulanan'}
            >
              {useMonthlyFilter ? '📅 Bulanan' : '📋 Semua'}
            </button>
          </div>
        </div>
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
          onSubmit={handleFormSubmit}
          onClose={handleCloseModal}
          onInputChange={handleInputChange}
        />
      )}
    </div>
  );
};

export default WarehousePage;