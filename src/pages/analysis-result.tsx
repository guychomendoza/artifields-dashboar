import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AnalysisResultView } from 'src/sections/analysis/view/analysis-result-view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`Analisis - ${CONFIG.appName}`}</title>
            </Helmet>
            <AnalysisResultView />
        </>
    );
}
