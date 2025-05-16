import Card from "@mui/material/Card"
import Slider from "@mui/material/Slider";
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"

import {Iconify} from "../../../../components/iconify";
import {normalizeSliderValue} from "../../../../utils/charts";

type SliderBarCartProps = {
    title: string
    subtitle?: string
    iconName: string
    value: number
    minValue: number
    maxValue: number
    units: string
    colors?: [string, string, string]
}


export const SliderBarCart = ({
    title,
    subtitle,
    iconName,
    value,
    minValue,
    maxValue,
    units,
    colors = ["#0b2af1", "#f1ee0b", "#f10b0b"]
}: SliderBarCartProps) => (
        <Card>
            <CardHeader
                title={title}
                subheader={subtitle}
                avatar={
                    <Iconify icon={iconName} />
                }
                sx={{
                    '& .MuiCardHeader-title': {
                        fontSize: '1rem',
                        fontWeight: 500,
                    },
                    '& .MuiCardHeader-subheader': {
                        fontSize: '0.75rem',
                        color: '#6b6b6b',
                    },
                }}
            />
            <CardContent
                sx={{
                    height: "16rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Slider
                    track={false}
                    marks={[
                        { value: 0, label: `${minValue.toLocaleString('en-US')}${units}` },
                        {value:100, label: `${maxValue.toLocaleString('en-US')}${units}` },
                    ]}
                    orientation="vertical"
                    value={normalizeSliderValue(value, maxValue, minValue)}
                    disabled
                    valueLabelDisplay="on"
                    valueLabelFormat={() => `${value}${units}`}
                    sx={{
                        height: '90%',
                        marginLeft: 4,
                        width: 8,
                        '& .MuiSlider-rail': {
                            background: `linear-gradient(to top, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
                            opacity: 1,
                        },
                        '& .MuiSlider-thumb': {
                            backgroundColor: '#fff',
                            border: '2px solid currentColor',
                            width: 16,
                            height: 16,
                        },
                        '& .MuiSlider-valueLabel': {
                            backgroundColor: 'white',
                            color: 'black',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            borderColor: 'white',
                            border: '1px solid #EBEBEB'
                        }
                    }}
                />
            </CardContent>
        </Card>
    )
