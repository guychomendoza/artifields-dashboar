import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EmailsView } from '../sections/emails/emails-view';

// ----------------------------------------------------------------------

export default function Emails() {
    return (
        <>
            <Helmet>
                <title> {`Emails - ${CONFIG.appName}`}</title>
            </Helmet>

            <EmailsView />
        </>
    );
}
