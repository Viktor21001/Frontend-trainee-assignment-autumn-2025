import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Select, Spin } from 'antd';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { fetchStatsSummary, fetchActivityChart, fetchDecisionsChart, fetchCategoriesChart } from '../api';
import type { StatsSummary, ActivityData } from '../types';

const { Title } = Typography;
const { Option } = Select;

const COLORS = ['#52c41a', '#ff4d4f', '#faad14'];

/**
 * Страница статистики модератора.
 * Отображает сводные показатели и графики активности.
 */
export const Stats: React.FC = () => {
    const [period, setPeriod] = useState<string>('week');
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<StatsSummary | null>(null);
    const [activityData, setActivityData] = useState<ActivityData[]>([]);
    const [decisionsData, setDecisionsData] = useState<any[]>([]);
    const [categoriesData, setCategoriesData] = useState<any[]>([]);

    // Загрузка статистики при изменении периода
    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            try {
                const [summaryRes, activityRes, decisionsRes, categoriesRes] = await Promise.all([
                    fetchStatsSummary({ period }),
                    fetchActivityChart({ period }),
                    fetchDecisionsChart({ period }),
                    fetchCategoriesChart({ period })
                ]);

                setSummary(summaryRes);
                setActivityData(activityRes);

                // Преобразование данных для круговой диаграммы решений
                const decisions = [
                    { name: 'Одобрено', value: decisionsRes.approved },
                    { name: 'Отклонено', value: decisionsRes.rejected },
                    { name: 'На доработку', value: decisionsRes.requestChanges }
                ];
                setDecisionsData(decisions);

                // Преобразование данных для графика категорий
                const categories = Object.entries(categoriesRes).map(([name, value]) => ({
                    name,
                    value
                }));
                setCategoriesData(categories);

            } catch (error) {
                console.error('Failed to load stats', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [period]);

    if (loading && !summary) {
        return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Статистика</Title>
                <Select value={period} onChange={setPeriod} style={{ width: 150 }}>
                    <Option value="today">Сегодня</Option>
                    <Option value="week">Неделя</Option>
                    <Option value="month">Месяц</Option>
                </Select>
            </div>

            {summary && (
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic title="Всего проверено" value={summary.totalReviewed} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Одобрено"
                                value={summary.approvedPercentage}
                                precision={1}
                                suffix="%"
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Отклонено"
                                value={summary.rejectedPercentage}
                                precision={1}
                                suffix="%"
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic title="Среднее время (сек)" value={summary.averageReviewTime} />
                        </Card>
                    </Col>
                </Row>
            )}

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title="Активность">
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="approved" name="Одобрено" stackId="a" fill="#52c41a" />
                                    <Bar dataKey="rejected" name="Отклонено" stackId="a" fill="#ff4d4f" />
                                    <Bar dataKey="requestChanges" name="На доработку" stackId="a" fill="#faad14" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Решения">
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={decisionsData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {decisionsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24}>
                    <Card title="Категории">
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoriesData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={150} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#1890ff" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
