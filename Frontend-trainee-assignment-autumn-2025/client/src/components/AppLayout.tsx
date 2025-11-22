import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { UnorderedListOutlined, BarChartOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export const AppLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/list',
            icon: <UnorderedListOutlined />,
            label: 'Объявления',
        },
        {
            key: '/stats',
            icon: <BarChartOutlined />,
            label: 'Статистика',
        },
    ];

    const selectedKey = menuItems.find(item => location.pathname.startsWith(item.key))?.key || '/list';

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={250} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
                <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    <Title level={4} style={{ margin: 0 }}>Avito Moderation</Title>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                    style={{ borderRight: 0 }}
                />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Title level={5} style={{ margin: 0 }}>Панель модератора</Title>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', borderRadius: 8, overflow: 'initial' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};
