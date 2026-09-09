"use client";

import { useState, useEffect } from "react";
import { Card, Statistic, Row, Col, Spin, Typography } from "antd";
import {
  ShoppingOutlined,
  BookOutlined,
  TeamOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import API_BASE from "@/lib/api";

const { Title, Text } = Typography;

const API = `${API_BASE}/api/admin`;

const statusGradients: Record<string, string> = {
  Pending: "linear-gradient(90deg, #f59e0b 0%, #fef08a 100%)",
  Confirmed: "linear-gradient(90deg, #059669 0%, #34d399 100%)",
  Cancelled: "linear-gradient(90deg, #dc2626 0%, #fca5a5 100%)",
  Completed: "linear-gradient(90deg, #2563eb 0%, #93c5fd 100%)",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API}/stats`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  // Calculate booking status percentages
  const totalBookingCount = stats?.bookingsByStatus?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;

  // Find max monthly revenue for chart scaling
  const maxRevenue = stats?.revenueByMonth?.reduce((max: number, curr: any) => curr.revenue > max ? curr.revenue : max, 0) || 1;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontFamily: "serif", color: "#d4a853" }}>Dashboard Overview</Title>
          <Text style={{ color: "#a39589" }}>Real-time statistics & showroom performance metrics</Text>
        </div>
      </div>

      {/* Overview Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card hoverable style={{ border: "1px solid rgba(212, 168, 83, 0.15)", background: "#1c1410" }}>
              <Statistic
                title={<span style={{ color: "#a39589", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Products</span>}
                value={stats?.totalProducts || 0}
                prefix={<ShoppingOutlined style={{ color: "#d4a853", marginRight: 8 }} />}
                styles={{ content: { color: "#d4a853", fontWeight: "bold", fontFamily: "serif" } }}
              />
              <div style={{ marginTop: 12 }}>
                <Link href="/admin/products" style={{ fontSize: 12, color: "#d4a853", display: "flex", alignItems: "center", gap: 4 }}>
                  Manage Inventory <ArrowRightOutlined style={{ fontSize: 10 }} />
                </Link>
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
            <Card hoverable style={{ border: "1px solid rgba(212, 168, 83, 0.15)", background: "#1c1410" }}>
              <Statistic
                title={<span style={{ color: "#a39589", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Bookings</span>}
                value={stats?.totalBookings || 0}
                prefix={<BookOutlined style={{ color: "#1890ff", marginRight: 8 }} />}
                styles={{ content: { color: "#1890ff", fontWeight: "bold", fontFamily: "serif" } }}
              />
              <div style={{ marginTop: 12 }}>
                <Link href="/admin/bookings" style={{ fontSize: 12, color: "#1890ff", display: "flex", alignItems: "center", gap: 4 }}>
                  Process Bookings <ArrowRightOutlined style={{ fontSize: 10 }} />
                </Link>
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card hoverable style={{ border: "1px solid rgba(212, 168, 83, 0.15)", background: "#1c1410" }}>
              <Statistic
                title={<span style={{ color: "#a39589", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Customers</span>}
                value={stats?.totalCustomers || 0}
                prefix={<TeamOutlined style={{ color: "#52c41a", marginRight: 8 }} />}
                styles={{ content: { color: "#52c41a", fontWeight: "bold", fontFamily: "serif" } }}
              />
              <div style={{ marginTop: 12 }}>
                <Link href="/admin/customers" style={{ fontSize: 12, color: "#52c41a", display: "flex", alignItems: "center", gap: 4 }}>
                  Customer Directory <ArrowRightOutlined style={{ fontSize: 10 }} />
                </Link>
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
            <Card hoverable style={{ border: "1px solid rgba(212, 168, 83, 0.15)", background: "#1c1410" }}>
              <Statistic
                title={<span style={{ color: "#a39589", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Revenue</span>}
                value={stats?.totalRevenue || 0}
                prefix={<span style={{ color: "#ff4d4f", marginRight: 4, fontWeight: "bold", fontSize: 18 }}>₹</span>}
                styles={{ content: { color: "#ff4d4f", fontWeight: "bold", fontFamily: "serif" } }}
                precision={2}
              />
              <div style={{ marginTop: 12 }}>
                <Link href="/admin/revenue" style={{ fontSize: 12, color: "#ff4d4f", display: "flex", alignItems: "center", gap: 4 }}>
                  Financial Report <ArrowRightOutlined style={{ fontSize: 10 }} />
                </Link>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Visual Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* Bookings Status Breakdown */}
        <Col xs={24} lg={12}>
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Card title={<span style={{ fontFamily: "serif", color: "#d4a853", fontSize: 16 }}>Bookings Status Breakdown</span>} style={{ background: "#251b16", border: "1px solid rgba(212,168,83,0.15)" }}>
              {stats?.bookingsByStatus?.length ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "8px 0" }}>
                  {stats.bookingsByStatus.map((item: any) => {
                    const pct = totalBookingCount > 0 ? (item.count / totalBookingCount) * 100 : 0;
                    const gradient = statusGradients[item._id] || "linear-gradient(90deg, #f59e0b 0%, #fef08a 100%)";
                    return (
                      <div key={item._id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ fontWeight: 500, color: "#fbeed3" }}>{item._id}</span>
                          <span style={{ fontWeight: "bold", color: "#d4a853" }}>
                            {item.count} <span style={{ color: "#a39589", fontSize: 11, fontWeight: "normal" }}>({pct.toFixed(0)}%)</span>
                          </span>
                        </div>
                        {/* Custom Animated Progress Bar */}
                        <div style={{ height: 10, background: "#1c1410", borderRadius: 5, overflow: "hidden", border: "1px solid rgba(212,168,83,0.1)" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                              height: "100%",
                              backgroundImage: gradient,
                              borderRadius: 5,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ color: "#a39589", padding: 40, textAlign: "center" }}>No bookings registered yet</div>
              )}
            </Card>
          </motion.div>
        </Col>

        {/* Revenue Monthly Trends Bar Chart */}
        <Col xs={24} lg={12}>
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Card title={<span style={{ fontFamily: "serif", color: "#d4a853", fontSize: 16 }}>Monthly Revenue Trends</span>} style={{ background: "#251b16", border: "1px solid rgba(212,168,83,0.15)" }}>
              {stats?.revenueByMonth?.length ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-around", alignItems: "end", height: 180, paddingBottom: 10 }}>
                    {stats.revenueByMonth.map((item: any) => {
                      const heightPct = (item.revenue / maxRevenue) * 110; // max height of column
                      const [y, m] = item._id.split("-");
                      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                      const formattedMonth = `${months[parseInt(m) - 1]} ${y}`;
                      return (
                        <div key={item._id} style={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                          {/* Value label */}
                          <span style={{ fontSize: 11, fontWeight: "bold", color: "#ff4d4f", marginBottom: 6 }}>
                            ₹{item.revenue.toLocaleString()}
                          </span>
                          
                          {/* Column container */}
                          <div style={{ width: 32, background: "#1c1410", borderRadius: "16px 16px 0 0", height: 110, display: "flex", alignItems: "end", overflow: "hidden", border: "1px solid rgba(212,168,83,0.15)" }}>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: heightPct }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              style={{
                                width: "100%",
                                backgroundImage: "linear-gradient(0deg, #b45309 0%, #d4a853 70%, #fbeed3 100%)",
                                borderRadius: "16px 16px 0 0",
                              }}
                            />
                          </div>
                          
                          {/* Axis label */}
                          <span style={{ fontSize: 11, color: "#a39589", marginTop: 8 }}>{formattedMonth}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ color: "#a39589", padding: 40, textAlign: "center" }}>No financial data generated yet</div>
              )}
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}
