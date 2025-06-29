import React, { useState, useEffect } from "react";
import { Table, Input, DatePicker, Space, Card, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useInventory } from "../hooks/useInventory";

const StockTable = () => {
  const { 
    inventoryItems,
    loading,
    error,
    fetchAllInventory,
    refreshInventory 
  } = useInventory();

  // Local state for filtering and pagination
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [filters, setFilters] = useState({
    itemName: "",
    dateFrom: null,
    dateTo: null,
    expiryFrom: null,
    expiryTo: null,
  });

  const columns = [
    {
      title: "Nama Produk",
      dataIndex: "itemName",
      key: "itemName",
      sorter: true,
    },
    {
      title: "Gambar",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) =>
        imageUrl ? (
          <img
            src={imageUrl}
            alt="Product"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          <span>No image</span>
        ),
    },
    {
      title: "Harga Beli",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      sorter: true,
      render: (price) => `Rp ${price.toLocaleString("id-ID")}`,
    },
    {
      title: "Tanggal Masuk",
      dataIndex: "entryDate",
      key: "entryDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: true,
    },
    {
      title: "Tanggal Kadaluarsa",
      dataIndex: "expiredDate",
      key: "expiredDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        if (!record.expiredDate)
          return <span style={{ color: "blue" }}>Non-Expired</span>;

        const now = dayjs();
        const expiry = dayjs(record.expiredDate);
        const daysUntilExpiry = expiry.diff(now, "day");

        if (daysUntilExpiry < 0) {
          return <span style={{ color: "red" }}>Kadaluarsa</span>;
        } else if (daysUntilExpiry < 30) {
          return <span style={{ color: "orange" }}>Hampir Kadaluarsa</span>;
        }
        return <span style={{ color: "green" }}>Baik</span>;
      },
    },
  ];
  // Filter and paginate data based on current filters
  const filterAndPaginateData = () => {
    let filtered = [...inventoryItems];

    // Apply filters
    if (filters.itemName) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(filters.itemName.toLowerCase())
      );
    }

    if (filters.dateFrom && filters.dateTo) {
      filtered = filtered.filter(item => {
        const entryDate = dayjs(item.entryDate);
        return entryDate.isAfter(filters.dateFrom.subtract(1, 'day')) && 
               entryDate.isBefore(filters.dateTo.add(1, 'day'));
      });
    }

    if (filters.expiryFrom && filters.expiryTo) {
      filtered = filtered.filter(item => {
        if (!item.expiredDate) return false;
        const expiryDate = dayjs(item.expiredDate);
        return expiryDate.isAfter(filters.expiryFrom.subtract(1, 'day')) && 
               expiryDate.isBefore(filters.expiryTo.add(1, 'day'));
      });
    }

    // Update pagination total
    setPagination(prev => ({
      ...prev,
      total: filtered.length
    }));

    // Apply pagination
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedData = filtered.slice(startIndex, endIndex);

    setFilteredData(paginatedData);
  };

  // Effect to filter data when inventoryItems or filters change
  useEffect(() => {
    filterAndPaginateData();
  }, [inventoryItems, filters, pagination.current, pagination.pageSize]);
  const handleTableChange = (newPagination, tableFilters, sorter) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });

    // Note: Sorting can be implemented here if needed
    // For now, we'll keep it simple with just pagination
  };

  const handleSearch = (value) => {
    setFilters((prev) => ({
      ...prev,
      itemName: value,
    }));
    // Reset pagination to first page when searching
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const handleDateRangeChange = (dates, type) => {
    setFilters((prev) => ({
      ...prev,
      [type + "From"]: dates?.[0] || null,
      [type + "To"]: dates?.[1] || null,
    }));
    // Reset pagination to first page when filtering
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Cari nama produk"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200 }}
          />
          <DatePicker.RangePicker
            placeholder={["Tanggal Masuk Dari", "Tanggal Masuk Sampai"]}
            onChange={(dates) => handleDateRangeChange(dates, "date")}
          />
          <DatePicker.RangePicker
            placeholder={["Kadaluarsa Dari", "Kadaluarsa Sampai"]}
            onChange={(dates) => handleDateRangeChange(dates, "expiry")}
          />
        </Space>
      </Space>      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey="id"
      />
    </Card>
  );
};

export default StockTable;
