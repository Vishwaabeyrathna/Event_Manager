// File: backend/tests/unit.test.js
const { mergeIntervals } = require('../logic/scheduler');

describe('Algorithm Logic', () => {
    test('should merge overlapping intervals', () => {
        const input = [
            { start_time: '2024-01-01 10:00', end_time: '2024-01-01 12:00' },
            { start_time: '2024-01-01 11:30', end_time: '2024-01-01 13:00' }
        ];
        const result = mergeIntervals(input);
        
        expect(result).toHaveLength(1);
        expect(new Date(result[0].end_time)).toEqual(new Date('2024-01-01 13:00'));
    });

    test('should keep non-overlapping intervals separate', () => {
        const input = [
            { start_time: '2024-01-01 10:00', end_time: '2024-01-01 11:00' },
            { start_time: '2024-01-01 12:00', end_time: '2024-01-01 13:00' }
        ];
        const result = mergeIntervals(input);
        expect(result).toHaveLength(2);
    });
});