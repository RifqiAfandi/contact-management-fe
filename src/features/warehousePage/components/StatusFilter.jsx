import React from "react";

const StatusFilter = ({ selectedStatus, onStatusChange }) => {
  const statuses = [
    { value: "", label: "Semua Status" },
    { value: "Baik", label: "Baik" },
    { value: "Segera Expired", label: "Segera Expired" },
    { value: "Expired", label: "Expired" },
    { value: "Terpakai", label: "Terpakai" },
  ];

  return (
    <div className="status-filter">
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="status-select"
      >
        {statuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusFilter;
