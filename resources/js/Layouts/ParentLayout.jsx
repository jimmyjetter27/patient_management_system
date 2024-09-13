import {usePage} from "@inertiajs/react";
import FlashMessage from "@/Components/FlashMessage";
import React, { PropsWithChildren } from "react";
export default function Authenticated({ children }) {
    const { flash } = usePage().props;
    return (
        <>
            {flash.success_message && <FlashMessage message={flash.success_message} type="success" />}
            {flash.error_message && <FlashMessage message={flash.error_message} type="error" />}
            <main>{children}</main>
        </>
    );
}
