import React, { useState, useEffect } from "react";
import { Card, DatePicker, Button, Statistic, Row, Col, message, Spin } from "antd";
import { LeftOutlined, RightOutlined, CalendarOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const FinancialReport = () => {
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [reportData, setReportData] = useState({
    expenses: 0,
    revenue: 0,
    profit: 0,
    hasData: false,
    hasNextData: false,
    hasPrevData: false
  });

  const fetchReportData = async (month) => {
    setLoading(true);
    try {
      const monthStr = month.format('YYYY-MM');
      const token = localStorage.getItem("token");
        if (!token) {
        message.error("Session expired. Please login again.");
        window.location.href = "/login";
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch all data in parallel
      const [expensesResponse, revenueResponse, nextDataResponse, prevDataResponse] = await Promise.allSettled([
        // Fetch inventory expenses for the month
        axios.get(`http://localhost:5000/api/inventory/expenses`, {
          params: { month: monthStr },
          headers,
        }),
        
        // Fetch transaction revenue for the month
        axios.get(`http://localhost:5000/api/transactions/revenue`, {
          params: { month: monthStr },
          headers,
        }),
        
        // Check if next month has data
        axios.get(`http://localhost:5000/api/transactions/check-data`, {
          params: { month: month.add(1, 'month').format('YYYY-MM') },
          headers,
        }),
        
        // Check if previous month has data
        axios.get(`http://localhost:5000/api/transactions/check-data`, {
          params: { month: month.subtract(1, 'month').format('YYYY-MM') },
          headers,
        })
      ]);

      // Extract data with error handling
      const expenses = expensesResponse.status === 'fulfilled' 
        ? expensesResponse.value.data.data?.totalExpenses || 0 
        : 0;
        
      const revenue = revenueResponse.status === 'fulfilled' 
        ? revenueResponse.value.data.data?.totalRevenue || 0 
        : 0;
        
      const hasNextData = nextDataResponse.status === 'fulfilled' 
        ? nextDataResponse.value.data.data?.hasData || false 
        : false;
        
      const hasPrevData = prevDataResponse.status === 'fulfilled' 
        ? prevDataResponse.value.data.data?.hasData || false 
        : false;

      const profit = revenue - expenses;
      const hasData = expenses > 0 || revenue > 0;

      setReportData({
        expenses,
        revenue,
        profit,
        hasData,
        hasNextData,
        hasPrevData
      });      // Log any failed requests
      [expensesResponse, revenueResponse, nextDataResponse, prevDataResponse].forEach((response, index) => {
        if (response.status === 'rejected') {
          // Handle authorization errors
          if (response.reason?.response?.status === 401) {
            message.error("Session expired. Please login again.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          } else if (response.reason?.response?.status === 403) {
            message.error("Access denied. Admin privileges required.");
          }
        }
      });    } catch (error) {
      message.error("Gagal memuat data laporan");
      setReportData({
        expenses: 0,
        revenue: 0,
        profit: 0,
        hasData: false,
        hasNextData: false,
        hasPrevData: false
      });
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData(currentMonth);
  }, [currentMonth]);

  const handlePrevMonth = () => {
    if (reportData.hasPrevData) {
      setCurrentMonth(prev => prev.subtract(1, 'month'));
    }
  };

  const handleNextMonth = () => {
    if (reportData.hasNextData) {
      setCurrentMonth(prev => prev.add(1, 'month'));
    }
  };

  const handleMonthChange = (date) => {
    if (date) {
      setCurrentMonth(date);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="financial-report">
      <Card title="📊 Laporan Keuangan Bulanan" className="report-card">
        {/* Month Navigation */}
        <div className="month-navigation">
          <Button
            icon={<LeftOutlined />}
            onClick={handlePrevMonth}
            disabled={!reportData.hasPrevData || loading}
            className="nav-button"
          >
            Bulan Sebelumnya
          </Button>
          
          <div className="current-month">
            <DatePicker
              picker="month"
              value={currentMonth}
              onChange={handleMonthChange}
              format="MMMM YYYY"
              allowClear={false}
              suffixIcon={<CalendarOutlined />}
              className="month-picker"
            />
          </div>
          
          <Button
            icon={<RightOutlined />}
            onClick={handleNextMonth}
            disabled={!reportData.hasNextData || loading}
            className="nav-button"
            iconPosition="end"
          >
            Bulan Berikutnya
          </Button>
        </div>

        {/* Report Data */}
        <Spin spinning={loading}>
          {reportData.hasData ? (
            <Row gutter={[24, 24]} className="report-statistics">
              <Col xs={24} sm={8}>
                <Card className="stat-card expenses">
                  <Statistic
                    title="Total Pengeluaran"
                    value={reportData.expenses}
                    formatter={(value) => formatCurrency(value)}
                    valueStyle={{ color: '#f5222d' }}
                    prefix="💸"
                  />
                  <div className="stat-description">
                    Pengeluaran dari pembelian stok inventory
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} sm={8}>
                <Card className="stat-card revenue">
                  <Statistic
                    title="Total Pendapatan"
                    value={reportData.revenue}
                    formatter={(value) => formatCurrency(value)}
                    valueStyle={{ color: '#52c41a' }}
                    prefix="💰"
                  />
                  <div className="stat-description">
                    Pendapatan dari transaksi penjualan
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} sm={8}>
                <Card className={`stat-card profit ${reportData.profit >= 0 ? 'positive' : 'negative'}`}>
                  <Statistic
                    title="Total Keuntungan"
                    value={reportData.profit}
                    formatter={(value) => formatCurrency(value)}
                    valueStyle={{ 
                      color: reportData.profit >= 0 ? '#52c41a' : '#f5222d' 
                    }}
                    prefix={reportData.profit >= 0 ? "📈" : "📉"}
                  />
                  <div className="stat-description">
                    {reportData.profit >= 0 ? 'Keuntungan bersih' : 'Kerugian bersih'}
                  </div>
                </Card>
              </Col>
            </Row>
          ) : (
            <div className="no-data">
              <div className="no-data-icon">📊</div>
              <h3>Tidak Ada Data</h3>
              <p>Tidak ada data laporan untuk bulan {currentMonth.format('MMMM YYYY')}</p>
            </div>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default FinancialReport;
