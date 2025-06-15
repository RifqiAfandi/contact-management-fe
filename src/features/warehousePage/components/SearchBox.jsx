import React from "react";
import { renderIcon } from "../utils/iconUtils";

const SearchBox = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-box">
      <span className="icon">{renderIcon("search")}</span>
      <input
        type="text"
        placeholder="Cari nama barang..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchBox;
