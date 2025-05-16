import type {ReactNode} from "react";

import {APIProvider} from "@vis.gl/react-google-maps";

type ReactMapProps = {
    children: ReactNode
}

export const  ReactMap = ({
    children,
}: ReactMapProps) => (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY!}>
        {children}
    </APIProvider>
)