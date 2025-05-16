import { useState, useEffect, useCallback } from 'react';

import { fetchIotDevices } from 'src/api-requests/iot';
import { type DeviceRead } from 'src/api-requests/type';

import { Groups } from './components/groups';
import { DevicesWithoutGroup } from './components/devices-without-group';

// ----------------------------------------------------------------------

export function GroupsView() {
    const [groupedDevices, setGroupedData] = useState<Record<string, DeviceRead[]>>({});

    const fetchData = useCallback(async () => {
        const data = await fetchIotDevices();

        // group data by grupo_name if the group is nulll put 'without group'
        const groupedData = data.reduce(
            (acc, item) => {
                const group = item.grupo_name || 'Without Group';
                acc[group] = [...(acc[group] || []), item];
                return acc;
            },
            {} as Record<string, typeof data>
        );

        setGroupedData(groupedData);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <Groups groups={groupedDevices} refetch={fetchData} />
            <DevicesWithoutGroup groups={groupedDevices} refetch={fetchData} />
        </>
    );
}
