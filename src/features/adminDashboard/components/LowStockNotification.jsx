import React, { useState, useEffect } from "react";
import { Card, Table, Tag, message, Spin } from "antd";
import { AlertOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const LowStockNotification = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Nama Produk",
      dataIndex: "itemName",
      key: "itemName",
      width: 200,
    },
    {
      title: "Jumlah Stok",
      dataIndex: "itemCount",
      key: "itemCount",
      width: 100,
      render: (count) => (
        <Tag color="red" style={{ fontWeight: 'bold' }}>
          {count} item{count !== 1 ? 's' : ''}
        </Tag>
      ),
    },
    {
      title: "Gambar",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      render: (imageUrl) =>
        imageUrl ? (
          <img
            src={imageUrl}
            alt="Product"
            style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
          />
        ) : (
          <span style={{ fontSize: "12px", color: "#999" }}>No image</span>
        ),
    },
    {
      title: "Harga Beli",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      width: 120,
      render: (price) => `Rp ${price?.toLocaleString("id-ID")}`,
    },
    {
      title: "Tanggal Masuk",
      dataIndex: "entryDate",
      key: "entryDate",
      width: 120,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Supplier",
      dataIndex: "supplierName",
      key: "supplierName",
      width: 150,
      render: (supplier) => supplier || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status, record) => {
        const statusText = status || 'Hampir Habis';
        return <Tag color="orange">{statusText}</Tag>;
      },
    },
  ];

  const fetchLowStockData = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      console.log('🔄 Fetching low stock data from API...');
      const response = await axios.get("http://localhost:5000/api/inventory/low-stock", {
        headers,
      });

      console.log('📦 Low stock API response:', response.data);

      if (response.data.isSuccess) {
        const lowStockData = response.data.data || [];
        console.log(`✅ Low stock items loaded: ${lowStockData.length} items`);
        setLowStockItems(lowStockData);
      } else {
        console.warn('⚠️ API returned unsuccessful response:', response.data.message);
        setLowStockItems([]);
      }
    } catch (error) {
      console.error("❌ Error fetching low stock data:", error);
      if (error.response?.status === 401) {
        message.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        message.error("Gagal memuat data stok yang hampir habis");
      }
      setLowStockItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLowStockData();
  }, []);

  return (
    <Card 
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertOutlined style={{ color: "#fa8c16" }} />
          <span>⚠️ Notifikasi Stok yang Hampir Habis</span>
        </div>
      }
      style={{ marginTop: "24px" }}
      extra={
        <Tag color="orange">
          {lowStockItems.length} Item{lowStockItems.length !== 1 ? 's' : ''}
        </Tag>
      }
    >      <Spin spinning={loading}>
        {lowStockItems.length > 0 ? (
          <>
            {console.log('Rendering table with data:', lowStockItems)}
            <Table
              columns={columns}
              dataSource={lowStockItems}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "20px", 
            color: "#666",
            backgroundColor: "#f9f9f9",
            borderRadius: "6px"
          }}>
            <AlertOutlined style={{ fontSize: "24px", color: "#52c41a", marginBottom: "8px" }} />
            <p style={{ margin: 0, fontSize: "14px" }}>
              Tidak ada stok yang hampir habis saat ini
            </p>
          </div>
        )}
      </Spin>
    </Card>
  );
};

export default LowStockNotification;
