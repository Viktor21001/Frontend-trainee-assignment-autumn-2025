import axios from 'axios';
import type {
    Advertisement,
    AdFilters,
    StatsSummary,
    ActivityData,
    DecisionsData,
    Pagination
} from '../types';

// Используем относительный путь, так как настроен прокси в Vite
const API_URL = '/api/v1';

export const api = axios.create({
    baseURL: API_URL,
});

/**
 * Получение списка объявлений с фильтрацией и пагинацией.
 */
export const fetchAds = async (params: AdFilters) => {
    const response = await api.get<{ ads: Advertisement[], pagination: Pagination }>('/ads', { params });
    return {
        ads: response.data.ads,
        pagination: response.data.pagination
    };
};

/**
 * Получение детальной информации об объявлении по ID.
 */
export const fetchAdById = async (id: number) => {
    const response = await api.get<Advertisement>(`/ads/${id}`);
    return response.data;
};

/**
 * Одобрение объявления.
 */
export const approveAd = async (id: number) => {
    const response = await api.post(`/ads/${id}/approve`);
    return response.data;
};

/**
 * Отклонение объявления с указанием причины.
 */
export const rejectAd = async (id: number, reason: string, comment?: string) => {
    const response = await api.post(`/ads/${id}/reject`, { reason, comment });
    return response.data;
};

/**
 * Запрос изменений для объявления.
 */
export const requestChangesAd = async (id: number, reason: string, comment?: string) => {
    const response = await api.post(`/ads/${id}/request-changes`, { reason, comment });
    return response.data;
};

/**
 * Получение сводной статистики.
 */
export const fetchStatsSummary = async (params?: any) => {
    const response = await api.get<StatsSummary>('/stats/summary', { params });
    return response.data;
};

/**
 * Получение данных для графика активности.
 */
export const fetchActivityChart = async (params?: any) => {
    const response = await api.get<ActivityData[]>('/stats/chart/activity', { params });
    return response.data;
};

/**
 * Получение данных для графика решений.
 */
export const fetchDecisionsChart = async (params?: any) => {
    const response = await api.get<DecisionsData>('/stats/chart/decisions', { params });
    return response.data;
};

/**
 * Получение данных для графика категорий.
 */
export const fetchCategoriesChart = async (params?: any) => {
    const response = await api.get<Record<string, number>>('/stats/chart/categories', { params });
    return response.data;
};
