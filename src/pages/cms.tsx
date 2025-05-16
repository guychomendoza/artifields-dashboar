import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CmsView } from 'src/sections/cms/view/cms-view';

// ----------------------------------------------------------------------

export default function Cms() {
    return (
        <>
            <Helmet>
                <title> {`Cms - ${CONFIG.appName}`}</title>
            </Helmet>

            <CmsView />
        </>
    );
}
