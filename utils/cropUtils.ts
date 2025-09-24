// Approximations based on general gameplay feel.
// These would need to be replaced with actual game data for accuracy.
const TIER_GROWTH_TIMES_MINUTES: Record<string, number> = {
    'Common': 30,       // 30 minutes
    'Uncommon': 90,     // 1.5 hours
    'Rare': 240,        // 4 hours
    'Legendary': 480,   // 8 hours
    'Mythical': 720,    // 12 hours
    'Divine': 1440,     // 24 hours
    'Prismatic': 2880,  // 48 hours
    'Transcendent': 5760, // 96 hours
};

export const estimateGrowthTimeMinutes = (tier: string): number => {
    return TIER_GROWTH_TIMES_MINUTES[tier] || 60; // Default to 1 hour if tier not found
};

export const parseSellValue = (sellValue: string): [number, number] => {
    if (!sellValue || sellValue.toLowerCase() === 'n/a') return [0, 0];
    const cleanedValue = sellValue.replace(/,/g, '');
    
    if (cleanedValue.includes(' - ')) {
        const parts = cleanedValue.split(' - ').map(part => parseInt(part, 10));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            const avg = (parts[0] + parts[1]) / 2;
            return [avg, parts[1]];
        }
    }
    const value = parseInt(cleanedValue, 10);
    if (!isNaN(value)) {
        return [value, value];
    }
    return [0, 0]; // Return 0 if parsing fails
};
