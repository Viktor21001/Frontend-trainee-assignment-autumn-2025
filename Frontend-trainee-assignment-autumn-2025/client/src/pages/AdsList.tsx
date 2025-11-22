import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Pagination, Spin, Typography, Empty, Select, Space } from 'antd';
import { AdCard } from '../components/AdCard';
import { Filters } from '../components/Filters';
import { fetchAds } from '../api';
import type { Advertisement, AdFilters, Pagination as PaginationType } from '../types';

const { Title } = Typography;
const { Option } = Select;

const ITEMS_PER_PAGE = 10;

/**
 * Страница со списком объявлений.
 * Отвечает за загрузку данных, фильтрацию, сортировку и пагинацию.
 */
export const AdsList: React.FC = () => {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(false);

    // Состояние пагинации
    const [pagination, setPagination] = useState<PaginationType>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: ITEMS_PER_PAGE,
    });

    // Состояние фильтров
    const [filters, setFilters] = useState<AdFilters>({
        page: 1,
        limit: ITEMS_PER_PAGE,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    /**
     * Загрузка объявлений с сервера с учетом текущих фильтров.
     */
    const loadAds = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAds(filters);
            setAds(data.ads);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Failed to load ads', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Загружаем объявления при изменении фильтров
    useEffect(() => {
        loadAds();
    }, [loadAds]);

    /**
     * Обработчик изменения фильтров.
     * Сбрасывает страницу на первую при изменении критериев поиска.
     */
    const handleFilterChange = (newFilters: AdFilters) => {
        const isPageChange = newFilters.page !== filters.page;
        const isSortChange = newFilters.sortBy !== filters.sortBy || newFilters.sortOrder !== filters.sortOrder;

        if (!isPageChange && !isSortChange) {
            setFilters({ ...filters, ...newFilters, page: 1 });
        } else {
            setFilters({ ...filters, ...newFilters });
        }
    };

    /**
     * Сброс всех фильтров к значениям по умолчанию.
     */
    const handleClearFilters = () => {
        setFilters({
            page: 1,
            limit: ITEMS_PER_PAGE,
            sortBy: 'createdAt',
            sortOrder: 'desc',
        });
    };

    /**
     * Обработчик смены страницы.
     */
    const handlePageChange = (page: number) => {
        setFilters({ ...filters, page });
    };

    /**
     * Обработчик смены сортировки.
     * Принимает значение в формате "поле-порядок" (например, "price-asc").
     */
    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split('-') as [any, any];
        setFilters({ ...filters, sortBy, sortOrder });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Объявления</Title>
                <Space>
                    <span>Сортировка:</span>
                    <Select
                        defaultValue="createdAt-desc"
                        style={{ width: 200 }}
                        onChange={handleSortChange}
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                    >
                        <Option value="createdAt-desc">Сначала новые</Option>
                        <Option value="createdAt-asc">Сначала старые</Option>
                        <Option value="price-asc">Сначала дешевые</Option>
                        <Option value="price-desc">Сначала дорогие</Option>
                        <Option value="priority-desc">По приоритету</Option>
                    </Select>
                </Space>
            </div>

            {/* Компонент фильтров */}
            <Filters filters={filters} onFilterChange={handleFilterChange} onClear={handleClearFilters} />

            {loading ? (
                <div style={{ textAlign: 'center', padding: 50 }}>
                    <Spin size="large" />
                </div>
            ) : ads.length > 0 ? (
                <>
                    {/* Сетка карточек объявлений */}
                    <Row gutter={[16, 16]}>
                        {ads.map((ad) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={ad.id}>
                                <AdCard ad={ad} />
                            </Col>
                        ))}
                    </Row>
                    {/* Пагинация */}
                    <div style={{ marginTop: 24, textAlign: 'center' }}>
                        <Pagination
                            current={pagination.currentPage}
                            total={pagination.totalItems}
                            pageSize={ITEMS_PER_PAGE}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    </div>
                </>
            ) : (
                <Empty description="Объявления не найдены" />
            )}
        </div>
    );
};
