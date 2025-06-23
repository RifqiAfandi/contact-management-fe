import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, DatePicker, Space, Card, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const StockTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/inventory", {
        params: {
          page: params.current || pagination.current,
          limit: params.pageSize || pagination.pageSize,
          itemName: filters.itemName,
          entryDateStart: filters.dateFrom?.format("YYYY-MM-DD"),
          entryDateEnd: filters.dateTo?.format("YYYY-MM-DD"),
          expiredDateStart: filters.expiryFrom?.format("YYYY-MM-DD"),
          expiredDateEnd: filters.expiryTo?.format("YYYY-MM-DD"),
          sortField: params.sortField,
          sortOrder: params.sortOrder,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Gunakan response.data.data dan response.data.pagination.totalItems
      setData(response.data.data || []);
      setPagination({        ...pagination,
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total: response.data.pagination?.totalItems || 0,
      });
    } catch (error) {
      message.error("Gagal memuat data stok");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchData({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      sortField: sorter.field,
      sortOrder:
        sorter.order === "ascend"
          ? "asc"
          : sorter.order === "descend"
          ? "desc"
          : undefined,
    });
  };

  const handleSearch = (value) => {
    setFilters((prev) => ({
      ...prev,
      itemName: value,
    }));
  };

  const handleDateRangeChange = (dates, type) => {
    setFilters((prev) => ({
      ...prev,
      [type + "From"]: dates?.[0] || null,
      [type + "To"]: dates?.[1] || null,
    }));
  };

  return (
    <Card>
      <Space
        direction="vertical"
        style={{ width: "100%", marginBottom: 16 }}
      >
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
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey="id"
      />
    </Card>
  );
};

export default StockTable;
