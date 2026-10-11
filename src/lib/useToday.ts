import { useState } from 'react';

export function useToday() {
    const [today] = useState(() => new Date());
    return today;
}