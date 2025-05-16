import { PDFDownloadLink } from '@react-pdf/renderer';

import Card from '@mui/material/Card';

import { SensorReportPDF } from './sensor-report-pdf';

export const DownloadReportPDF = ({
    imageUrl,
    plotName,
    isSectionActive,
    content,
}: {
    imageUrl: string;
    plotName: string;
    isSectionActive: boolean;
    content: string;
}) => (
    <Card
        sx={{
            border: isSectionActive ? '1px solid' : 'none',
            borderColor: 'primary.main',
            padding: 3,
            mt: 3,
            pointerEvents: !isSectionActive ? 'none' : 'auto',
            opacity: isSectionActive ? 1 : 0.4,
        }}
    >
        <PDFDownloadLink
            document={<SensorReportPDF plotSrc={imageUrl} title={plotName} content={content} />}
            fileName="reporte-sensor.pdf"
            style={{
                textDecoration: 'none',
                color: 'white',
                backgroundColor: '#1877f2',
                padding: '6px 16px',
                borderRadius: '8px',
                width: '100%',
                minWidth: '164px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            Descargar PDF
        </PDFDownloadLink>
    </Card>
);
