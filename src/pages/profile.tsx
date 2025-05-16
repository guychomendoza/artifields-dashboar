import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProfileView } from 'src/sections/profile/view/profile-view';

// ----------------------------------------------------------------------

export default function Profile() {
    return (
        <>
            <Helmet>
                <title> {`Profile - ${CONFIG.appName}`}</title>
            </Helmet>

            <ProfileView />
        </>
    );
}
