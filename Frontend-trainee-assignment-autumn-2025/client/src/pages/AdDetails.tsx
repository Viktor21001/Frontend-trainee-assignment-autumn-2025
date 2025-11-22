import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography, Spin, Button, Space, Descriptions, Tag, Image,
    Card, Divider, List, Modal, Form, Select, Input, message, Row, Col
} from 'antd';
import {
    CheckCircleOutlined, CloseCircleOutlined, EditOutlined,
    ArrowLeftOutlined, UserOutlined
} from '@ant-design/icons';
import { fetchAdById, approveAd, rejectAd, requestChangesAd } from '../api';
import type { Advertisement } from '../types';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '../utils';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Список причин для отклонения или доработки
const REJECTION_REASONS = [
    'Запрещенный товар',
    'Неверная категория',
    'Некорректное описание',
    'Проблемы с фото',
    'Подозрение на мошенничество',
    'Другое'
];

/**
 * Страница детального просмотра объявления.
 * Позволяет модератору просматривать информацию и выполнять действия (одобрить, отклонить, вернуть).
 */
export const AdDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ad, setAd] = useState<Advertisement | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Состояние модального окна для отклонения/доработки
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalAction, setModalAction] = useState<'reject' | 'changes' | null>(null);
    const [form] = Form.useForm();

    // Загрузка данных объявления
    useEffect(() => {
        const loadAd = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await fetchAdById(Number(id));
                setAd(data);
            } catch (error) {
                console.error('Failed to load ad', error);
                message.error('Не удалось загрузить объявление');
            } finally {
                setLoading(false);
            }
        };
        loadAd();
    }, [id]);

    /**
     * Обработчик одобрения объявления.
     */
    const handleApprove = async () => {
        if (!ad) return;
        setActionLoading(true);
        try {
            await approveAd(ad.id);
            message.success('Объявление одобрено');
            // Обновляем данные объявления после действия
            const updatedAd = await fetchAdById(ad.id);
            setAd(updatedAd);
        } catch (error) {
            message.error('Ошибка при одобрении');
        } finally {
            setActionLoading(false);
        }
    };

    /**
     * Открытие модального окна для отклонения или запроса изменений.
     */
    const handleRejectOrChanges = (action: 'reject' | 'changes') => {
        setModalAction(action);
        setIsModalVisible(true);
        form.resetFields();
    };

    /**
     * Подтверждение действия в модальном окне.
     */
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            setActionLoading(true);
            if (modalAction === 'reject') {
                await rejectAd(ad!.id, values.reason, values.comment);
                message.success('Объявление отклонено');
            } else {
                await requestChangesAd(ad!.id, values.reason, values.comment);
                message.success('Запрошены изменения');
            }
            setIsModalVisible(false);
            // Обновляем данные объявления
            const updatedAd = await fetchAdById(ad!.id);
            setAd(updatedAd);
        } catch (error) {
            console.error(error);
            message.error('Ошибка выполнения операции');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
    }

    if (!ad) {
        return <div>Объявление не найдено</div>;
    }

    return (
        <div>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/list')} style={{ marginBottom: 16 }}>
                Назад к списку
            </Button>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    {/* Основная информация об объявлении */}
                    <Card title={<Title level={4} style={{ margin: 0 }}>{ad.title}</Title>}>
                        <Image.PreviewGroup>
                            <Space size="middle" style={{ marginBottom: 24, overflowX: 'auto', width: '100%' }}>
                                {ad.images.map((img, index) => (
                                    <Image
                                        key={index}
                                        width={200}
                                        src={img.startsWith('http') ? img : `http://localhost:3001${img}`}
                                        style={{ objectFit: 'cover', borderRadius: 8 }}
                                    />
                                ))}
                            </Space>
                        </Image.PreviewGroup>

                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Цена">
                                <Text strong style={{ fontSize: 18 }}>{formatPrice(ad.price)}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Категория">{ad.category}</Descriptions.Item>
                            <Descriptions.Item label="Статус">
                                <Tag color={getStatusColor(ad.status)}>{getStatusLabel(ad.status)}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Дата создания">{formatDate(ad.createdAt)}</Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Описание</Divider>
                        <Paragraph>{ad.description}</Paragraph>

                        <Divider orientation="left">Характеристики</Divider>
                        <Descriptions bordered size="small" column={1}>
                            {Object.entries(ad.characteristics).map(([key, value]) => (
                                <Descriptions.Item key={key} label={key}>{value}</Descriptions.Item>
                            ))}
                        </Descriptions>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        {/* Панель действий модератора */}
                        <Card title="Действия модератора">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button
                                    type="primary"
                                    block
                                    icon={<CheckCircleOutlined />}
                                    style={{ backgroundColor: '#52c41a' }}
                                    onClick={handleApprove}
                                    loading={actionLoading}
                                    disabled={ad.status === 'approved'}
                                >
                                    Одобрить
                                </Button>
                                <Button
                                    danger
                                    block
                                    icon={<CloseCircleOutlined />}
                                    onClick={() => handleRejectOrChanges('reject')}
                                    loading={actionLoading}
                                    disabled={ad.status === 'rejected'}
                                >
                                    Отклонить
                                </Button>
                                <Button
                                    block
                                    icon={<EditOutlined />}
                                    onClick={() => handleRejectOrChanges('changes')}
                                    loading={actionLoading}
                                >
                                    Вернуть на доработку
                                </Button>
                            </Space>
                        </Card>

                        {/* Информация о продавце */}
                        <Card title="Продавец">
                            <Space align="start">
                                <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                                <div>
                                    <Text strong>{ad.seller.name}</Text>
                                    <br />
                                    <Text type="secondary">Рейтинг: {ad.seller.rating}</Text>
                                    <br />
                                    <Text type="secondary">На Авито с {new Date(ad.seller.registeredAt).toLocaleDateString()}</Text>
                                </div>
                            </Space>
                        </Card>

                        {/* История модерации */}
                        {ad.moderationHistory.length > 0 && (
                            <Card title="История модерации">
                                <List
                                    itemLayout="horizontal"
                                    dataSource={ad.moderationHistory}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={
                                                    <Space>
                                                        <Text strong>{item.moderatorName}</Text>
                                                        <Tag>{item.action}</Tag>
                                                    </Space>
                                                }
                                                description={
                                                    <div>
                                                        <div style={{ fontSize: 12 }}>{formatDate(item.timestamp)}</div>
                                                        {item.reason && <div>Причина: {item.reason}</div>}
                                                        {item.comment && <div>{item.comment}</div>}
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        )}
                    </Space>
                </Col>
            </Row>

            {/* Модальное окно для указания причины */}
            <Modal
                title={modalAction === 'reject' ? 'Отклонение объявления' : 'Запрос изменений'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={actionLoading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="reason"
                        label="Причина"
                        rules={[{ required: true, message: 'Выберите причину' }]}
                    >
                        <Select>
                            {REJECTION_REASONS.map(reason => (
                                <Option key={reason} value={reason}>{reason}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="comment" label="Комментарий">
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
