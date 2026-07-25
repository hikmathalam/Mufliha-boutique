"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Spin, ConfigProvider, theme } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  BookOutlined,
  TeamOutlined,
  DollarOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/admin/products", icon: <ShoppingOutlined />, label: "Products" },
  { key: "/admin/bookings", icon: <BookOutlined />, label: "Bookings" },
  { key: "/admin/customers", icon: <TeamOutlined />, label: "Customers" },
  { key: "/admin/revenue", icon: <DollarOutlined />, label: "Revenue" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !(user as any).isAdmin)) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brown-950">
        <Spin size="large" />
      </div>
    );
  }

  if (!user || !(user as any).isAdmin) {
    return null;
  }

  const selectedKey = "/" + pathname.split("/").slice(1, 3).join("/");

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#d4a853", // boutique gold
          colorBgBase: "#1c1410",   // deep chocolate base
          colorBgContainer: "#251b16", // container background
          colorBgLayout: "#120c09",    // layout background
          colorBorder: "rgba(212, 168, 83, 0.15)",
          colorTextBase: "#fbeed3", // cream text
        },
        components: {
          Layout: {
            siderBg: "#1c1410",
            headerBg: "#251b16",
            bodyBg: "#120c09",
          },
          Menu: {
            darkItemBg: "#1c1410",
            darkItemColor: "#a39589",
            darkItemSelectedBg: "#d4a853",
            darkItemSelectedColor: "#1c1410",
            darkItemHoverBg: "rgba(212, 168, 83, 0.1)",
            darkItemHoverColor: "#d4a853",
          },
          Table: {
            headerBg: "#1c1410",
            headerColor: "#d4a853",
            rowHoverBg: "rgba(212, 168, 83, 0.05)",
          },
          Card: {
            headerBg: "#1c1410",
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" style={{ borderRight: "1px solid rgba(212, 168, 83, 0.15)" }}>
          <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(212, 168, 83, 0.15)", gap: collapsed ? 0 : 10, padding: collapsed ? "0 4px" : "0 16px" }}>
            <img src="/logo.jpg" alt="Mufliha Logo" style={{ height: 32, width: 32, borderRadius: "50%", border: "1px solid rgba(212,168,83,0.3)", objectFit: "cover" }} />
            {!collapsed && (
              <span style={{ color: "#d4a853", fontWeight: "bold", fontSize: 16, whiteSpace: "nowrap", fontFamily: "serif", letterSpacing: "0.1em" }}>
                Mufliha Admin
              </span>
            )}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => router.push(key)}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(212, 168, 83, 0.15)" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ color: "#d4a853" }}
            />
            <Dropdown
              menu={{
                items: [
                  { key: "profile", label: user.name, disabled: true, style: { color: "#d4a853", fontWeight: "bold" } },
                  { type: "divider" },
                  { key: "logout", icon: <LogoutOutlined />, label: "Sign Out", danger: true },
                ],
                onClick: ({ key }) => { if (key === "logout") logout(); },
              }}
            >
              <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar style={{ backgroundColor: "#d4a853", verticalAlign: "middle", color: "#1c1410", fontWeight: "bold" }} size="small">
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <span style={{ fontSize: 13, color: "#fbeed3" }}>{user.name}</span>
              </div>
            </Dropdown>
          </Header>
          <Content style={{ margin: 24, minHeight: 280, color: "#fbeed3" }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
