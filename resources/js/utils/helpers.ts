// Helper to ensure we have a Date object
export const toDate = (date: Date | string) => {
    return typeof date === 'string' ? new Date(date) : date;
};

// Helper to format numbers with commas
export const formatCurrency = (value: number): string => {
    return value.toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};


export const formatDate = (date: Date): string => {
    return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "America/Mexico_City",
    });
};