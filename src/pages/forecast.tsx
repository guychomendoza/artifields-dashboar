import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {ForecastView} from "../sections/forecast/forecast-view";

// ----------------------------------------------------------------------

export default function Forecast() {
    return (
        <>
            <Helmet>
                <title> {`Pronóstico - ${CONFIG.appName}`}</title>
            </Helmet>

            <ForecastView />
        </>
    );
}
