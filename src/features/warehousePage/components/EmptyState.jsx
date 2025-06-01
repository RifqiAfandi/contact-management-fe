import React from "react";
import { renderIcon } from "../utils/iconUtils";

const EmptyState = ({ onAddClick }) => {
  return (
    <div className="empty-state">
      <p>Tidak ada barang yang ditemukan</p>
      <button className="add-button" onClick={onAddClick}>
        {renderIcon("plus")}
        Tambah Barang Pertama
      </button>
    </div>
  );
};

export default EmptyState;