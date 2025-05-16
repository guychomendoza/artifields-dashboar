import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UsersView } from 'src/sections/users/view/users-view';

// ----------------------------------------------------------------------

export default function Users() {
    return (
        <>
            <Helmet>
                <title> {`Sign in - ${CONFIG.appName}`}</title>
            </Helmet>

            <UsersView />
        </>
    );
}
