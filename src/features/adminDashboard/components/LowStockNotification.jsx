import React, { useState, useEffect } from "react";
import { Card, Table, Tag, message, Spin } from "antd";
import { AlertOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const LowStockNotification = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  // Dummy data untuk stok yang hampir habis
  const dummyLowStockData = [
    {
      id: 1,
      itemName: 'Telur',
      imageUrl: 'https://example.com/telur.jpg',
      purchasePrice: 30000,
      entryDate: '2024-11-15',
      status: 'Hampir Habis'
    },
    {
      id: 2,
      itemName: 'Daun Bawang',
      imageUrl: 'https://example.com/daun-bawang.jpg',
      purchasePrice: 8000,
      entryDate: '2024-11-20',
      status: 'Hampir Habis'
    },
    {
      id: 3,
      itemName: 'Daun Mint',
      imageUrl: 'https://example.com/daun-mint.jpg',
      purchasePrice: 10000,
      entryDate: '2024-11-25',
      status: 'Hampir Habis'
    },
    {
      id: 4,
      itemName: 'Kol',
      imageUrl: 'https://example.com/kol.jpg',
      purchasePrice: 10000,
      entryDate: '2024-12-01',
      status: 'Hampir Habis'
    },
    {
      id: 5,
      itemName: 'Leci',
      imageUrl: 'https://example.com/leci.jpg',
      purchasePrice: 30000,
      entryDate: '2024-12-05',
      status: 'Hampir Habis'
    }
  ];

  const columns = [
    {
      title: "Nama Produk",
      dataIndex: "itemName",
      key: "itemName",
      width: 200,
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
    },    {
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
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Force use dummy data with status field
      const dataWithStatus = dummyLowStockData.map(item => ({
        ...item,
        status: 'Hampir Habis' // Ensure status is always set
      }));
      
      console.log('Loading dummy data:', dataWithStatus);
      setLowStockItems(dataWithStatus);
    } catch (error) {
      console.error("Error fetching low stock data:", error);
      message.error("Gagal memuat data stok yang hampir habis");
      // Fallback to dummy data even on error
      setLowStockItems(dummyLowStockData);
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
