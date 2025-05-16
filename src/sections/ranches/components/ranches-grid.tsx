import { useQuery } from "@tanstack/react-query"

import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"

import { ClusterCard } from './cluster-card';
import { RanchesLoading } from "./ranches-loading"
import { RanchesSensorsMap } from "./ranches-sensors-map"
import { Scrollbar } from "../../../components/scrollbar"
import { ErrorAlert } from "../../../layouts/alert/error-alert"
import { ReactMap } from "../../../layouts/components/react-map"
import { getClustersAndSensorsByRanchId } from '../../../api-requests/ranches/admin-clusters';

type RanchesGridProps = {
    isContentOnTab?: boolean
    ranchId: number
}

export const RanchesGrid = ({ isContentOnTab = false, ranchId }: RanchesGridProps) => {

    const { data: dataClusters, isLoading, isError, error } = useQuery({
        queryKey: ['clusters-by-ranch', ranchId],
        queryFn: () => getClustersAndSensorsByRanchId(ranchId),
        enabled: !!ranchId  ,
    });

    if (isLoading) {
        return <RanchesLoading />
    }

    if (isError) {
        return <ErrorAlert message={error.message} />
    }

     if (!dataClusters || dataClusters.length === 0) {
         return <ErrorAlert message="Sin sensores asignados" />
    }

    // const selectedRanchSensors = data?.data?.sort((a, b) => {
    //     if (!a.name) return 1
    //     if (!b.name) return -1
    //     return a.name.localeCompare(b.name, undefined, { numeric: true })
    // })

    return (
        <Grid
            container
            spacing={2}
            sx={{
                height: {
                    xs: "auto",
                    md: isContentOnTab ? "calc(100vh - 300px)" : "calc(100vh - 190px)",
                },
            }}
        >
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    height: {
                        xs: "auto",
                        md: "100%",
                    },
                }}
            >
                <Scrollbar
                    fillContent
                    sx={{
                        height: "100%",
                        "& .simplebar-content": {
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        },
                    }}
                >
                    <Box sx={{flexGrow: 1 }}>
                        {
                            dataClusters?.map(cluster => (
                                <ClusterCard key={cluster.cluster.id} name={cluster.cluster.name} sensors={[cluster.sensor15, cluster.sensor30]} />
                            ))
                        }
                    </Box>
                </Scrollbar>
            </Grid>
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    height: {
                        xs: 400,
                        md: "100%",
                    },
                }}
            >
                <Card
                    elevation={3}
                    sx={{
                        height: "100%",
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    <ReactMap>
                        <RanchesSensorsMap clustersAndSensors={dataClusters}/>
                    </ReactMap>
                </Card>
            </Grid>
        </Grid>
    )
}