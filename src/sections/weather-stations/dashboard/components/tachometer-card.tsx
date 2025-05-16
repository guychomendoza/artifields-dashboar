import {GaugeComponent} from "react-gauge-component";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

import { Iconify } from "../../../../components/iconify";

type TachometerCardProps = {
    title: string;
    subtitle?: string;
    iconName: string;
    minValue: number;
    maxValue: number;
    value: number;
    gradientColors: [string, string, string];
    units?: string;
};

export const TachometerCard = ({
   title,
   subtitle,
   iconName,
   minValue,
   maxValue,
   value,
   gradientColors = ["#00E676", "#FFEA00", "#FF1744"],
   units = 'm/s',
}: TachometerCardProps) => {

    const formatValueLabel = (labelValue: number): string =>
        `${labelValue.toFixed(1)}${units}`;

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
                <GaugeComponent
                    type="semicircle"
                    arc={{
                        width: 0.3,
                        padding: 0.005,
                        cornerRadius: 6,
                        subArcs: [
                            {
                                limit: maxValue * 0.33,
                                color: gradientColors[0],
                            },
                            {
                                limit: maxValue * 0.66,
                                color: gradientColors[1],
                            },
                            {
                                limit: maxValue,
                                color: gradientColors[2],
                            },
                        ],
                        gradient: true,
                    }}
                    pointer={{
                        color: '#6D7A89',
                        length: 0.85,
                        width: 15,
                        elastic: true,
                        animationDelay: 0,
                    }}
                    labels={{
                        valueLabel: {
                            formatTextValue: formatValueLabel,
                            style: {
                                fill: "#1C252E"
                            }
                        },
                        tickLabels: {
                            type: 'outer',
                            ticks: [
                                { value: minValue },
                                { value: maxValue },
                            ],
                        }
                    }}
                    value={value}
                    minValue={minValue}
                    maxValue={maxValue}
                />
            </CardContent>
        </Card>
    )
};
