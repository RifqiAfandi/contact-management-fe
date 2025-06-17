import React from "react";
import { renderIcon } from "../utils/iconUtils";

const MonthFilter = ({ 
  currentMonth, 
  onMonthChange, 
  canGoPrevious, 
  canGoNext,
  isLoading,
  compact = false // New prop for compact mode
}) => {
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    if (compact) {
      return date.toLocaleDateString('id-ID', { 
        month: 'short', 
        year: 'numeric' 
      });
    }
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const handlePreviousMonth = () => {
    if (canGoPrevious && !isLoading) {
      const [year, month] = currentMonth.split('-');
      const prevDate = new Date(year, month - 2); // month - 2 because month is 1-based
      const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
      onMonthChange(prevMonth);
    }
  };

  const handleNextMonth = () => {
    if (canGoNext && !isLoading) {
      const [year, month] = currentMonth.split('-');
      const nextDate = new Date(year, month); // month is already 1-based, so this gives us next month
      const nextMonth = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;
      onMonthChange(nextMonth);
    }
  };

  return (
    <div className="month-filter">
      <button 
        className={`month-nav-btn ${!canGoPrevious || isLoading ? 'disabled' : ''}`}
        onClick={handlePreviousMonth}
        disabled={!canGoPrevious || isLoading}
        title="Bulan Sebelumnya"
      >
        {renderIcon("chevron-left")}
      </button>      <div className="current-month">
        {!compact && <span className="month-label">Periode:</span>}
        <span className="month-value">{formatMonth(currentMonth)}</span>
      </div>

      <button 
        className={`month-nav-btn ${!canGoNext || isLoading ? 'disabled' : ''}`}
        onClick={handleNextMonth}
        disabled={!canGoNext || isLoading}
        title="Bulan Selanjutnya"
      >
        {renderIcon("chevron-right")}
      </button>
    </div>
  );
};

export default MonthFilter;
