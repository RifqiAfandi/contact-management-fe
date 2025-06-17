import React from "react";
import { renderIcon } from "../utils/iconUtils";

const SortControls = ({ 
  sortBy, 
  sortOrder, 
  onSortByChange, 
  onSortOrderChange, 
  onAddClick 
}) => {  // Function to get appropriate sort label based on current sortBy field
  const getSortLabel = () => {
    if (sortBy === "itemName" || sortBy === "supplierName") {
      return sortOrder === "asc" ? "A-Z" : "Z-A";
    } else if (sortBy === "entryDate" || sortBy === "useDate") {
      return sortOrder === "asc" ? "Lama→Baru" : "Baru→Lama";
    } else if (sortBy === "purchasePrice") {
      return sortOrder === "asc" ? "Murah→Mahal" : "Mahal→Murah";
    }
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="sort-controls">      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="sort-select"
      >
        <option value="entryDate">Tanggal Masuk</option>
        <option value="useDate">Tanggal Terpakai</option>
        <option value="itemName">Nama Barang</option>
        <option value="supplierName">Nama Supplier</option>
        <option value="purchasePrice">Harga Beli</option>
      </select>

      <button
        onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
        className="sort-order-btn"
        title={`Klik untuk mengubah urutan sorting`}
      >
        {renderIcon("sort")}
        {getSortLabel()}
      </button>

      <button className="add-button" onClick={onAddClick}>
        {renderIcon("plus")}
        Tambah Barang
      </button>
    </div>
  );
};

export default SortControls;