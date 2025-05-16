import { useState, useEffect, useCallback } from 'react';

import Typography from '@mui/material/Typography';

import { useAuth } from 'src/context/AuthContext';
import { BACKEND_URL } from 'src/api-requests/api-url';
import { DashboardContent } from 'src/layouts/dashboard';
import { type ReportResponse } from 'src/api-requests/type';

import { ActiveSection } from './types';
import { UploadCsv } from '../upload-csv';
import { UpdateCsv } from '../update-csv';
import { ReportsTable } from '../reports-table';

export function SensorsReportView() {
    const { userData } = useAuth();
    const [activeSection, setActiveSection] = useState<ActiveSection>(ActiveSection.UPLOAD_CSV);
    const [reports, setReports] = useState<ReportResponse[]>([]);

    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [blobImage, setBlobImage] = useState<Blob | null>(null);
    const [plotName, setPlotName] = useState('');
    const [fieldCapacity, setFieldCapacity] = useState('');

    const restartState = () => {
        setCsvFile(null);
        setImageUrl('');
        setBlobImage(null);
        setPlotName('');
        setFieldCapacity('');
    };

    const fetchData = useCallback(async () => {
        try {
            if (!userData || !userData.id) return;
            const response = await fetch(`${BACKEND_URL}/api/reporte/user/${userData.id}`);
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error(error);
        }
    }, [userData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <DashboardContent>
            <Typography variant="h4">Reporte de sensores</Typography>
            <ReportsTable reports={reports} />
            <UploadCsv
                csvFile={csvFile}
                setCsvFile={setCsvFile}
                setImageUrl={setImageUrl}
                plotName={plotName}
                setPlotName={setPlotName}
                isSectionActive={activeSection === ActiveSection.UPLOAD_CSV}
                setActiveSection={setActiveSection}
                setBlobImage={setBlobImage}
            />

            <UpdateCsv
                csvFile={csvFile}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                plotName={plotName}
                setPlotName={setPlotName}
                isSectionActive={activeSection === ActiveSection.UPDATE_REPORT}
                setActiveSection={setActiveSection}
                fieldCapacity={fieldCapacity}
                setFieldCapacity={setFieldCapacity}
                blobImage={blobImage}
                setBlobImage={setBlobImage}
                restartState={restartState}
                refetchReports={fetchData}
            />
        </DashboardContent>
    );
}
