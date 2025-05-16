import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent"

import {Iconify} from "../../../../components/iconify";


type SliderBarCartProps = {
    title: string
    subtitle?: string
    iconName: string
    value: number,
}


export const CompassCard = ({
    title,
    subtitle,
    iconName,
    value,
}: SliderBarCartProps) => {

    const cardinalPoints = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']

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
                <Box
                    sx={{
                        position: 'relative',
                        width: "12.5rem",
                        height: "12.5rem",
                    }}
                >
                    {/* Compass circle */}
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            backgroundColor: 'grey.800',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: "0 0 0 3px #C5C5C5, 0 0 0 13px #F3F3F3, 0 0 5px 10px #000"
                        }}
                    >
                        {/* Cardinal points */}
                        {cardinalPoints.map((point, index) => {
                            const angle = (index * 45) - 90 // Start from North (-90 degrees)
                            const radian = (angle * Math.PI) / 180
                            const radius = 80 // Distance from center
                            const x = Math.cos(radian) * radius
                            const y = Math.sin(radian) * radius

                            return (
                                <Typography
                                    key={point}
                                    variant="body2"
                                    sx={{
                                        position: 'absolute',
                                        color: 'common.white',
                                        fontWeight: 'medium',
                                        transform: `translate(${x}px, ${y}px)`,
                                    }}
                                >
                                    {point}
                                </Typography>
                            )
                        })}

                        {/* Arrow pointer */}
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                transform: `rotate(${value}deg)`,
                                transition: 'transform 0.3s ease-out',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 30,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 4,
                                    height: '50%',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 0,
                                        height: 0,
                                        borderLeft: '7px solid transparent',
                                        borderRight: '7px solid transparent',
                                        borderBottom: '20px solid white',
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Direction value */}
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: 'common.white',
                                zIndex: 1,
                            }}
                        >
                            {value}°
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}
