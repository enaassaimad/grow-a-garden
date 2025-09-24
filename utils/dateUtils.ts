export const getDaysForWeekView = (currentDate: Date): Date[] => {
    const date = new Date(currentDate);
    const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - dayOfWeek);
    
    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        weekDays.push(day);
    }
    return weekDays;
};

export const getDaysForMonthView = (currentDate: Date): { date: Date, isCurrentMonth: boolean }[] => {
    const date = new Date(currentDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    // Ensure calendar grid has 6 rows for consistent layout
    const daysInGrid = 42;
    
    const monthDays: { date: Date, isCurrentMonth: boolean }[] = [];
    let currentDay = new Date(startDate);
    
    for(let i=0; i < daysInGrid; i++) {
        monthDays.push({
            date: new Date(currentDay),
            isCurrentMonth: currentDay.getMonth() === month,
        });
        currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return monthDays;
};


export const formatDate = (date: Date | string): string => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
    }).format(new Date(date));
};

export const formatTime = (date: Date | string): string => {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(new Date(date));
};

export const formatDateTime = (date: Date | string): string => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(new Date(date));
};
