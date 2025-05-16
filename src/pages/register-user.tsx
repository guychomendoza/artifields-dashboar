import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UsersView } from 'src/sections/register-user.tsx/view/users-view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`Nuevo usuario - ${CONFIG.appName}`}</title>
            </Helmet>

            <UsersView />
        </>
    );
}
