import { useState, useEffect } from "react";
import { checkMonthlyData, fetchInventoryByMonth } from "../utils/apiUtils";

export const useMonthFilter = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [canGoPrevious, setCanGoPrevious] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Check if data exists for previous and next months
  const checkAdjacentMonths = async (month) => {
    try {
      setIsLoading(true);
      
      // Calculate previous and next months
      const [year, monthNum] = month.split('-');
      const currentDate = new Date(year, monthNum - 1);
      
      const prevDate = new Date(year, monthNum - 2);
      const nextDate = new Date(year, monthNum);
      
      const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
      const nextMonth = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;
      
      // Check both months concurrently
      const [prevResult, nextResult] = await Promise.allSettled([
        checkMonthlyData(prevMonth),
        checkMonthlyData(nextMonth)
      ]);
      
      const hasPrevData = prevResult.status === 'fulfilled' && prevResult.value.hasData;
      const hasNextData = nextResult.status === 'fulfilled' && nextResult.value.hasData;
      
      setCanGoPrevious(hasPrevData);
      setCanGoNext(hasNextData);
      
      console.log(`📅 Month navigation: Prev(${prevMonth}): ${hasPrevData}, Next(${nextMonth}): ${hasNextData}`);
      
    } catch (error) {
      console.error("❌ Error checking adjacent months:", error);
      setCanGoPrevious(false);
      setCanGoNext(false);
    } finally {
      setIsLoading(false);
    }
  };
  // Get inventory data for specific month
  const getInventoryForMonth = async (month, sortBy = "entryDate", sortOrder = "desc", searchTerm = "", selectedStatus = "") => {
    try {
      setIsLoading(true);
      const data = await fetchInventoryByMonth(month, sortBy, sortOrder, searchTerm, selectedStatus);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching inventory for month ${month}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changeMonth = (newMonth) => {
    if (newMonth !== currentMonth) {
      setCurrentMonth(newMonth);
    }
  };

  // Check adjacent months when current month changes
  useEffect(() => {
    checkAdjacentMonths(currentMonth);
  }, [currentMonth]);

  return {
    currentMonth,
    canGoPrevious,
    canGoNext,
    isLoading,
    changeMonth,
    getInventoryForMonth,
    checkAdjacentMonths
  };
};
