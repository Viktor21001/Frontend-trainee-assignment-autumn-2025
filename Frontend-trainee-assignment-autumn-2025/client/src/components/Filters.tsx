import React from 'react';
import { Form, Select, Input, InputNumber, Button, Space, Card } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import type { AdFilters } from '../types';

const { Option } = Select;

interface FiltersProps {
    filters: AdFilters;
    onFilterChange: (filters: AdFilters) => void;
    onClear: () => void;
}

/**
 * Компонент фильтров для поиска объявлений.
 * Содержит поля для поиска по названию, фильтрации по статусу, категории и цене.
 */
export const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, onClear }) => {
    const [form] = Form.useForm();

    // Синхронизация формы с пропсами фильтров
    React.useEffect(() => {
        form.setFieldsValue(filters);
    }, [filters, form]);

    /**
     * Вызывается при изменении любого поля формы.
     * Передает обновленные значения в родительский компонент.
     */
    const handleValuesChange = (_: any, allValues: any) => {
        onFilterChange(allValues);
    };

    return (
        <Card style={{ marginBottom: 24 }}>
            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
                initialValues={filters}
            >
                <Space wrap size="large" align="start">
                    <Form.Item name="search" label="Поиск">
                        <Input prefix={<SearchOutlined />} placeholder="Название" style={{ width: 200 }} />
                    </Form.Item>

                    <Form.Item name="status" label="Статус">
                        <Select mode="multiple" placeholder="Все статусы" style={{ width: 250 }} allowClear>
                            <Option value="pending">На модерации</Option>
                            <Option value="approved">Одобрено</Option>
                            <Option value="rejected">Отклонено</Option>
                            <Option value="draft">Черновик</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="categoryId" label="Категория">
                        <Select placeholder="Все категории" style={{ width: 150 }} allowClear>
                            <Option value={1}>Электроника</Option>
                            <Option value={2}>Одежда</Option>
                            <Option value={3}>Мебель</Option>
                            <Option value={4}>Авто</Option>
                            <Option value={5}>Недвижимость</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Цена">
                        <Space>
                            <Form.Item name="minPrice" noStyle>
                                <InputNumber placeholder="От" style={{ width: 100 }} min={0} />
                            </Form.Item>
                            <Form.Item name="maxPrice" noStyle>
                                <InputNumber placeholder="До" style={{ width: 100 }} min={0} />
                            </Form.Item>
                        </Space>
                    </Form.Item>

                    <Form.Item label=" ">
                        <Button icon={<ClearOutlined />} onClick={onClear}>Сбросить</Button>
                    </Form.Item>
                </Space>
            </Form>
        </Card>
    );
};
