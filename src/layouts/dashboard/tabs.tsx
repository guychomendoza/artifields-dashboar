import Box from "@mui/material/Box";

export function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vista-${index}`}
            aria-labelledby={`vista-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
        </div>
    );
}