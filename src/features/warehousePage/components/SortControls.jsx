import React from "react";
import { renderIcon } from "../utils/iconUtils";

const SortControls = ({ 
  sortBy, 
  sortOrder, 
  onSortByChange, 
  onSortOrderChange, 
  onAddClick 
}) => {
  return (
    <div className="sort-controls">
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="sort-select"
      >
        <option value="entryDate">Tanggal Masuk</option>
        <option value="expiredDate">Tanggal Expired</option>
        <option value="itemName">Nama Barang</option>
        <option value="purchasePrice">Harga Beli</option>
      </select>

      <button
        onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
        className="sort-order-btn"
      >
        {renderIcon("sort")}
        {sortOrder === "asc" ? "A-Z" : "Z-A"}
      </button>

      <button className="add-button" onClick={onAddClick}>
        {renderIcon("plus")}
        Tambah Barang
      </button>
    </div>
  );
};

export default SortControls;