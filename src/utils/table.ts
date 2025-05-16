import { parseISO } from 'date-fns';

export const isActive = (timestamp: string) => {
    const lastUpdate = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24;
};

export function getRelativeColor(dateString: string) {
    // Parse the input date
    const date = parseISO(dateString);

    // Get the relative time (e.g., "2 hours ago")
    // const relativeTime = formatDistanceToNow(date, { addSuffix: true });

    // Get the current time and the difference in hours
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60); // Difference in hours

    // Determine the color based on the hour difference
    let color = '';
    if (diffInHours < 1) {
        color = '#28a745'; // Green for less than 1 hour
    } else if (diffInHours < 10) {
        color = '#fd7e14'; // Orange for less than 10 hours
    } else if (diffInHours < 24) {
        color = '#dc3545'; // Red for less than 1 day
    } else {
        color = '#6c757d'; // Gray for more than 1 day
    }

    return color;
}

export const copyToClipboard = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    textToCopy: string
) => {
    e.stopPropagation();
    navigator.clipboard.writeText(textToCopy);
};
