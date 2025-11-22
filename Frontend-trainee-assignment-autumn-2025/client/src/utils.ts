export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(price);
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'approved':
            return 'success';
        case 'rejected':
            return 'error';
        case 'pending':
            return 'warning';
        case 'draft':
        default:
            return 'default';
    }
};

export const getStatusLabel = (status: string): string => {
    switch (status) {
        case 'approved':
            return 'Одобрено';
        case 'rejected':
            return 'Отклонено';
        case 'pending':
            return 'На модерации';
        case 'draft':
            return 'Черновик';
        default:
            return status;
    }
};
