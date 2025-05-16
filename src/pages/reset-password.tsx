import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ResetPasswordView } from '../sections/reset-password/view/reset-password-view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`Asignar Contraseña - ${CONFIG.appName}`}</title>
            </Helmet>

            <ResetPasswordView />
        </>
    );
}
