const mergeIntervals = (events) => {
    // 1. Edge Case: Handle empty input
    if (!events || events.length === 0) return [];

    // 2. Pre-processing: Convert to timestamps ONCE for efficiency.
    // This avoids creating new Date() objects repeatedly during the sort.
    const intervals = events.map(event => ({
        start: new Date(event.start_time).getTime(),
        end: new Date(event.end_time).getTime()
    }));

    // 3. Sort by start time (Integer comparison is fast)
    intervals.sort((a, b) => a.start - b.start);

    const merged = [];
    let current = intervals[0];

    for (let i = 1; i < intervals.length; i++) {
        const next = intervals[i];

        // 4. Overlap Check: If next start is before (or exactly at) current end
        if (next.start <= current.end) {
            // Merge: Extend the current end time to the max of both
            current.end = Math.max(current.end, next.end);
        } else {
            // No Overlap: Push the finished block and start a new one
            merged.push(current);
            current = next;
        }
    }
    // Push the last remaining block
    merged.push(current);

    // 5. Post-processing: Convert back to readable ISO strings for the API/Frontend
    return merged.map(interval => ({
        start_time: new Date(interval.start).toISOString(),
        end_time: new Date(interval.end).toISOString()
    }));
};

module.exports = { mergeIntervals };