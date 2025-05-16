import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent"

import {Iconify} from "../../../../components/iconify";

// UV index color mapping
const getUVColor = (index: number) => {
    if (index <= 2) return { main: '#4EB400', glow: '#84D654' };  // Low - Green
    if (index <= 5) return { main: '#F7E400', glow: '#FFF176' };  // Moderate - Yellow
    if (index <= 7) return { main: '#F85900', glow: '#FFB74D' };  // High - Orange
    if (index <= 10) return { main: '#D8001D', glow: '#EF5350' }; // Very High - Red
    return { main: '#998CFF', glow: '#B39DDB' };                   // Extreme - Purple
};

const getUVLevel = (index: number) => {
    if (index <= 2) return 'Bajo';
    if (index <= 5) return 'Moderado';
    if (index <= 7) return 'Alto';
    if (index <= 10) return 'Muy Alto';
    return 'Extremo';
};

const getUVLabelColor = (index: number) => {
    if (index <= 2) return '#87CF3A';
    if (index <= 5) return '#FEC006';
    if (index <= 7) return '#F18B00';
    if (index <= 10) return '#E64A19';
    return '#9C27B0';
};

type SliderBarCartProps = {
    title: string
    subtitle?: string
    iconName: string
    value: number,
}


export const SunCard = ({
    title,
    subtitle,
    iconName,
    value,
}: SliderBarCartProps) => {

    const colors = getUVColor(value);
    const level = getUVLevel(value);
    const colorLabels = getUVLabelColor(value);

    return (
        <Card>
            <CardHeader
                title={title}
                subheader={subtitle}
                avatar={
                    <Iconify icon={iconName}/>
                }
                sx={{
                    '& .MuiCardHeader-title': {
                        fontSize: '1rem', // Smaller title
                        fontWeight: 500,
                    },
                    '& .MuiCardHeader-subheader': {
                        fontSize: '0.75rem', // Smaller subheader
                        color: '#6b6b6b', // Optional: muted color for subtitle
                    },
                }}
            />
            <CardContent
                sx={{
                    height: "16rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <svg
                    viewBox="0 0 400 400"
                    style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="10" result="blur"/>
                            <feComposite in="blur" operator="over"/>
                        </filter>

                        <radialGradient id="sunCore">
                            <stop offset="0%" stopColor="#fff"/>
                            <stop offset="50%" stopColor={colors.glow}/>
                            <stop offset="100%" stopColor={colors.main}/>
                        </radialGradient>

                        <radialGradient id="corona">
                            <stop offset="0%" stopColor={`${colors.main}80`}/>
                            <stop offset="100%" stopColor={`${colors.main}00`}/>
                        </radialGradient>
                    </defs>

                    {/* Corona (outer glow) */}
                    <circle
                        cx="200"
                        cy="200"
                        r="150"
                        fill="url(#corona)"
                        filter="url(#glow)"
                    />

                    {/* Main sun body */}
                    <circle
                        cx="200"
                        cy="200"
                        r="80"
                        fill="url(#sunCore)"
                        filter="url(#glow)"
                    >
                        <animate
                            attributeName="r"
                            values="78;82;78"
                            dur="3s"
                            repeatCount="indefinite"
                        />
                    </circle>

                    {/* Rays */}
                    {Array.from({length: 12}).map((_, i) => {
                        const angle = i * 30;
                        const x2 = 200 + Math.cos(angle * Math.PI / 180) * 120;
                        const y2 = 200 + Math.sin(angle * Math.PI / 180) * 120;

                        return (
                            <line
                                key={i}
                                x1="200"
                                y1="200"
                                x2={x2}
                                y2={y2}
                                stroke={`${colors.glow}99`}
                                strokeWidth="6"
                                strokeLinecap="round"
                                filter="url(#glow)"
                            >
                                <animate
                                    attributeName="strokeWidth"
                                    values="6;8;6"
                                    dur="2s"
                                    repeatCount="indefinite"
                                    begin={`${i * 0.2}s`}
                                />
                            </line>
                        );
                    })}
                </svg>

                <Typography
                    sx={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: colorLabels,
                    }}
                >
                    {value} UV - {level}
                </Typography>

            </CardContent>
        </Card>
        )
}
