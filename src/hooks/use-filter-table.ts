import { z } from 'zod';
import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
    key: string;
    direction: SortDirection;
}

export interface UseFilterTableReturn<T> {
    sortedData: T[];
    sortConfig: SortConfig;
    requestSort: (key: string) => void;
    getSortDirection: (key: string) => SortDirection;
    validationErrors: z.ZodError | null;
    setSearchQuery: (query: string) => void;
    setSearchKeys: (keys: string[]) => void;
    searchQuery: string;
    searchKeys: string[];
}

export interface UseFilterTableOptions {
    defaultSort?: SortConfig;
    defaultSearchKeys?: string[];
    defaultSearchQuery?: string;
}

export function useFilterTable<T extends object>(
    data: T[] | undefined,
    schema: z.ZodType<T>,
    options?: UseFilterTableOptions
): UseFilterTableReturn<T> {
    const [sortConfig, setSortConfig] = useState<SortConfig>(
        options?.defaultSort ?? { key: '', direction: null }
    );
    const [validationErrors, setValidationErrors] = useState<z.ZodError | null>(null);
    const [searchQuery, setSearchQuery] = useState(options?.defaultSearchQuery ?? '');
    const [searchKeys, setSearchKeys] = useState<string[]>(options?.defaultSearchKeys ?? []);

    // Helper function to safely get nested value
    const getNestedValue = (obj: any, key: string) => {
        if (!key) return undefined;
        // If the key contains dots, treat it as a nested path
        if (key.includes('.')) {
            return key.split('.').reduce((acc, part) => {
                if (acc === undefined || acc === null) return undefined;
                return acc[part];
            }, obj);
        }
        // If no dots, look in the root object
        return obj[key];
    };

    const compareValues = (a: any, b: any, direction: SortDirection): number => {
        // Handle null/undefined values - always put them at the end
        if (a == null && b == null) return 0;
        if (a == null) return 1; // Always move null values to the end regardless of sort direction
        if (b == null) return -1;

        // Handle numeric values
        const aNum = Number(a);
        const bNum = Number(b);
        if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
            return direction === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // Handle dates
        const aDate = new Date(a);
        const bDate = new Date(b);
        if (aDate.toString() !== 'Invalid Date' && bDate.toString() !== 'Invalid Date') {
            return direction === 'asc'
                ? aDate.getTime() - bDate.getTime()
                : bDate.getTime() - aDate.getTime();
        }

        // Default string comparison
        const aStr = String(a).toLowerCase();
        const bStr = String(b).toLowerCase();
        return direction === 'asc'
            ? aStr.localeCompare(bStr)
            : bStr.localeCompare(aStr);
    };

    const validatedData = useMemo(() => {
        if (!data) return [];

        try {
            const arraySchema = z.array(schema);
            const result = arraySchema.parse(data);
            setValidationErrors(null);
            return result;
        } catch (error) {
            if (error instanceof z.ZodError) {
                setValidationErrors(error);
                console.error('Validation errors:', error.errors);
            }
            return data;
        }
    }, [data, schema]);

    const requestSort = (key: string) => {
        setSortConfig((current) => {
            if (current.key === key) {
                const nextDirection: SortDirection =
                    current.direction === 'asc' ? 'desc' :
                        current.direction === 'desc' ? null : 'asc';

                return {
                    key: nextDirection === null ? '' : key,
                    direction: nextDirection,
                };
            }
            return { key, direction: 'asc' };
        });
    };

    const getSortDirection = (key: string): SortDirection =>
        sortConfig.key === key ? sortConfig.direction : null;

    // Filter data based on search query across multiple keys
    const filteredData = useMemo(() => {
        if (!validatedData || !searchQuery || searchKeys.length === 0) {
            return validatedData;
        }

        const normalizedQuery = searchQuery.toLowerCase();

        return validatedData.filter((item) => searchKeys.some((key) => {
                const value = getNestedValue(item, key);
                if (value == null) return false;
                return String(value)
                    .toLowerCase()
                    .includes(normalizedQuery);
            }));
    }, [validatedData, searchQuery, searchKeys]);

    // Sort the filtered data
    const sortedData = useMemo(() => {
        if (!filteredData || !sortConfig.key || !sortConfig.direction) {
            return filteredData;
        }

        return [...filteredData].sort((a, b) => {
            const aValue = getNestedValue(a, sortConfig.key);
            const bValue = getNestedValue(b, sortConfig.key);

            return compareValues(aValue, bValue, sortConfig.direction);
        });
    }, [filteredData, sortConfig]);

    return {
        sortedData,
        sortConfig,
        requestSort,
        getSortDirection,
        validationErrors,
        setSearchQuery,
        setSearchKeys,
        searchQuery,
        searchKeys,
    };
}