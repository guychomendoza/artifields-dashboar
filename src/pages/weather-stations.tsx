import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {WeatherStationsView} from "../sections/weather-stations/weather-stations-view";


// ----------------------------------------------------------------------

export default function WeatherStations() {
    return (
        <>
            <Helmet>
                <title> {`Pronóstico - ${CONFIG.appName}`}</title>
            </Helmet>

            <WeatherStationsView />
        </>
    );
}
