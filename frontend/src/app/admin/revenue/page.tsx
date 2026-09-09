"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Typography, Spin, Tag } from "antd";
import { BookOutlined, RiseOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import API_BASE from "@/lib/api";

const { Title, Text } = Typography;
const API = `${API_BASE}/api/admin`;

export default function AdminRevenue() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API}/stats`, { credentials: "include" });
        if (res.ok) setStats(await res.json());
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

  const totalRevenue = stats?.totalRevenue || 0;
  const monthlyData = stats?.revenueByMonth || [];
  const totalBookings = stats?.totalBookings || 0;

  const columns = [
    {
      title: "Month", dataIndex: "_id", key: "month",
      render: (v: string) => {
        const [y, m] = v.split("-");
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[parseInt(m) - 1]} ${y}`;
      },
    },
    {
      title: "Revenue", dataIndex: "revenue", key: "revenue",
      render: (v: number) => (
        <span style={{ color: "#ff4d4f", fontWeight: "bold", fontSize: 16 }}>₹{v?.toFixed(2) || "0.00"}</span>
      ),
      sorter: (a: any, b: any) => (a.revenue || 0) - (b.revenue || 0),
    },
    {
      title: "Bookings", dataIndex: "count", key: "count",
      render: (v: number) => <Tag color="blue">{v || 0}</Tag>,
    },
    {
      title: "Avg/Booking", key: "avg",
      render: (_: any, r: any) => {
        const avg = r.count > 0 ? (r.revenue / r.count).toFixed(2) : "0.00";
        return <span style={{ color: "#52c41a" }}>₹{avg}</span>;
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontFamily: "serif", color: "#d4a853" }}>Revenue Analytics</Title>
        <Text style={{ color: "#a39589" }}>Financial performance, earnings statements, and monthly transaction averages</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card style={{ border: "1px solid rgba(212, 168, 83, 0.15)", background: "#1c1410" }}>
              <Statistic
                title={<span style={{ color: "#a39589", fontSize: 13 }}>Total Revenue</span>}
                value={totalRevenue}
                precision={2}
                prefix={<span style={{ color: "#ff4d4f", marginRight: 4, fontWeight: "bold", fontSize: 18 }}>₹</span>}
                styles={{ content: { color: "#ff4d4f", fontWeight: "bold", fontFamily: "serif" } }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
            <Card style={{ border: "1px solid rgba(212, 168, 83, 0.15)", background: "#1c1410" }}>
              <Statistic
                title={<span style={{ color: "#a39589", fontSize: 13 }}>Total Bookings</span>}
                value={totalBookings}
                prefix={<BookOutlined style={{ color: "#1890ff", marginRight: 8 }} />}
                styles={{ content: { color: "#1890ff", fontWeight: "bold", fontFamily: "serif" } }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card style={{ border: "1px solid rgba(212, 168, 83, 0.15)", background: "#1c1410" }}>
              <Statistic
                title={<span style={{ color: "#a39589", fontSize: 13 }}>Avg Revenue per Booking</span>}
                value={totalBookings > 0 ? (totalRevenue / totalBookings) : 0}
                precision={2}
                prefix={<span style={{ color: "#52c41a", marginRight: 4, fontWeight: "bold", fontSize: 18 }}>₹</span>}
                styles={{ content: { color: "#52c41a", fontWeight: "bold", fontFamily: "serif" } }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Card title={<span style={{ fontFamily: "serif", color: "#d4a853", fontSize: 16 }}>Monthly Breakdown</span>} style={{ background: "#251b16", border: "1px solid rgba(212,168,83,0.15)" }}>
              {monthlyData.length > 0 ? (
                <Table
                  dataSource={monthlyData}
                  columns={columns}
                  rowKey="_id"
                  pagination={false}
                  style={{ border: "1px solid rgba(212,168,83,0.1)", borderRadius: 8, overflow: "hidden" }}
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}><strong style={{ color: "#fbeed3" }}>Total</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <strong style={{ color: "#ff4d4f", fontSize: 16 }}>₹{totalRevenue.toFixed(2)}</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        <strong style={{ color: "#1890ff" }}>{totalBookings}</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>
                        <strong style={{ color: "#52c41a" }}>₹{(totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(2) : "0.00")}</strong>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
              ) : (
                <div style={{ padding: 40, textAlign: "center", color: "#a39589" }}>
                  No revenue data yet. Revenue appears once bookings are confirmed or completed.
                </div>
              )}
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={10}>
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Card title={<span style={{ fontFamily: "serif", color: "#d4a853", fontSize: 16 }}>Earnings Share by Month</span>} style={{ background: "#251b16", border: "1px solid rgba(212,168,83,0.15)" }}>
              {monthlyData.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {monthlyData.map((item: any) => {
                    const pct = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0;
                    const [y, m] = item._id.split("-");
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const label = `${months[parseInt(m) - 1]} ${y}`;
                    return (
                      <div key={item._id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ fontWeight: 500, color: "#fbeed3" }}>{label}</span>
                          <span style={{ fontWeight: "bold", color: "#d4a853" }}>
                            ₹{item.revenue.toLocaleString()} <span style={{ color: "#a39589", fontSize: 11, fontWeight: "normal" }}>({pct.toFixed(0)}%)</span>
                          </span>
                        </div>
                        {/* Custom Animated Progress Bar for Revenue Share */}
                        <div style={{ height: 10, background: "#1c1410", borderRadius: 5, overflow: "hidden", border: "1px solid rgba(212,168,83,0.1)" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                              height: "100%",
                              backgroundImage: "linear-gradient(90deg, #ff4d4f 0%, #ff8585 100%)",
                              borderRadius: 5,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: 40, textAlign: "center", color: "#a39589" }}>No monthly breakdown details</div>
              )}
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}
