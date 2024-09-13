import './bootstrap';
import '../css/app.css';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import {ToastContainer} from "react-toastify";
import React from "react";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        if (import.meta.env.DEV) {
            createRoot(el).render(
                // <App {...props} />
                <React.Fragment>
                    <App {...props} />
                    <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                                    closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
                </React.Fragment>
            );
            return
        }

        hydrateRoot(el,
            <App {...props} />
        // <React.Fragment>
        //     <App {...props} />
        //     <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false}
        //                     closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
        // </React.Fragment>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
