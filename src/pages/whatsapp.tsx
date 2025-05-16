import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {WhatsappView} from "../sections/whatsapp/whatsapp-view";


export default function Whatsapp() {
    return (
        <>
            <Helmet>
                <title> {`WhatsApp - ${CONFIG.appName}`}</title>
            </Helmet>

            <WhatsappView />
        </>
    );
}
