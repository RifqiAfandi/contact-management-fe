import React from "react";

const SortControls = ({ 
  sortOrder, 
  onSortOrderChange 
}) => {
  return (
    <div className="sort-controls">
      <button
        onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
        className="category-btn"
        title={`Klik untuk mengubah urutan sorting nama`}
      >
        {sortOrder === "asc" ? "A-Z" : "Z-A"}
      </button>
    </div>
  );
};

export default SortControls;
