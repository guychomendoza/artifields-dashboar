import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProjectView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`Proyectos - ${CONFIG.appName}`}</title>
            </Helmet>

            <ProjectView />
        </>
    );
}
