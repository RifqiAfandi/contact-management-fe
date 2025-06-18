import React, { useState, useEffect } from "react";
import { Card, Table, Tag, message, Spin } from "antd";
import { AlertOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const LowStockNotification = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logicType, setLogicType] = useState("standard"); // "standard" or "no_duplicates"
  const [explanation, setExplanation] = useState("");

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

      console.log('📦 Low stock API response:', response.data);      if (response.data.isSuccess) {
        const lowStockData = response.data.data || [];
        const logicUsed = response.data.logic || "standard";
        const explanationText = response.data.explanation || "";
        
        console.log(`✅ Low stock items loaded: ${lowStockData.length} items`);
        console.log(`🔧 Logic used: ${logicUsed}`);
        console.log(`📝 Explanation: ${explanationText}`);
        
        setLowStockItems(lowStockData);
        setLogicType(logicUsed);
        setExplanation(explanationText);
      } else {
        console.warn('⚠️ API returned unsuccessful response:', response.data.message);
        setLowStockItems([]);
        setLogicType("standard");
        setExplanation("");
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
      }        setLowStockItems([]);
        setLogicType("standard");
        setExplanation("");
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
          <span>
            {logicType === "no_duplicates" 
              ? "🚨 Semua Item Ditampilkan (Tidak Ada Duplikat)" 
              : "⚠️ Notifikasi Stok yang Hampir Habis"
            }
          </span>
          <Tag color={logicType === "no_duplicates" ? "red" : "orange"}>
            {logicType === "no_duplicates" ? "Mode: Semua Item" : "Mode: < 3 Item"}
          </Tag>
        </div>
      }
      style={{ marginTop: "24px" }}
      extra={
        <Tag color={logicType === "no_duplicates" ? "red" : "orange"}>
          {lowStockItems.length} Item{lowStockItems.length !== 1 ? 's' : ''}
        </Tag>
      }
    >      <Spin spinning={loading}>
        {/* Logic Explanation */}
        <div style={{ 
          marginBottom: "16px", 
          padding: "12px", 
          backgroundColor: logicType === "no_duplicates" ? "#fff2f0" : "#fff7e6", 
          borderRadius: "6px",
          border: `1px solid ${logicType === "no_duplicates" ? "#ffccc7" : "#ffd591"}`,
          fontSize: "13px",
          color: logicType === "no_duplicates" ? "#a8071a" : "#d46b08"
        }}>
          <strong>
            {logicType === "no_duplicates" ? "🚨 Mode Khusus Aktif:" : "📌 Mode Standar:"}
          </strong>{" "}
          {logicType === "no_duplicates" 
            ? "Tidak ada item duplikat ditemukan dalam database. SEMUA item ditampilkan dalam notifikasi karena setiap item hanya ada 1." 
            : "Item dengan jumlah kurang dari 3 ditampilkan dalam notifikasi. Item dengan 3+ tidak ditampilkan."
          }
          {explanation && (
            <div style={{ marginTop: "6px", fontStyle: "italic" }}>
              📝 {explanation}
            </div>
          )}
        </div>
        
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
          </>        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "20px", 
            color: "#666",
            backgroundColor: "#f6ffed",
            borderRadius: "6px",
            border: "1px solid #b7eb8f"
          }}>
            <AlertOutlined style={{ fontSize: "24px", color: "#52c41a", marginBottom: "8px" }} />
            <p style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "500" }}>
              ✅ Tidak Ada Item yang Perlu Diperhatikan
            </p>
            <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
              {logicType === "no_duplicates" 
                ? "Semua item sudah ditampilkan di atas karena tidak ada duplikat." 
                : "Semua produk memiliki stok ≥ 3 item. Sistem bekerja normal."
              }
            </p>
          </div>
        )}
      </Spin>
    </Card>
  );
};

export default LowStockNotification;
