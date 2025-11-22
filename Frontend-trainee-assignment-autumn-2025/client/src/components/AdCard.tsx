import React from 'react';
import { Card, Tag, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Advertisement } from '../types';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '../utils';

const { Meta } = Card;
const { Text } = Typography;

interface AdCardProps {
    ad: Advertisement;
}

/**
 * Карточка объявления для списка.
 * Отображает основную информацию и статус.
 * При клике переходит на страницу деталей.
 */
export const AdCard: React.FC<AdCardProps> = ({ ad }) => {
    const navigate = useNavigate();

    return (
        <Card
            hoverable
            cover={
                <img
                    alt={ad.title}
                    src={ad.images[0] ? (ad.images[0].startsWith('http') ? ad.images[0] : `http://localhost:3001${ad.images[0]}`) : 'https://via.placeholder.com/300x200?text=No+Image'}
                    style={{ height: 200, objectFit: 'cover' }}
                />
            }
            onClick={() => navigate(`/item/${ad.id}`)}
        >
            <Meta
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }} title={ad.title}>
                            {ad.title}
                        </span>
                        {ad.priority === 'high' && <Tag color="gold">ТОП</Tag>}
                    </div>
                }
                description={
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Text strong style={{ fontSize: 16 }}>{formatPrice(ad.price)}</Text>
                        <Space split={<Text type="secondary">|</Text>}>
                            <Text type="secondary">{ad.category}</Text>
                            <Text type="secondary">{formatDate(ad.createdAt)}</Text>
                        </Space>
                        <div style={{ marginTop: 8 }}>
                            <Tag color={getStatusColor(ad.status)}>{getStatusLabel(ad.status)}</Tag>
                        </div>
                    </Space>
                }
            />
        </Card>
    );
};
