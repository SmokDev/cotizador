import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { route } from 'ziggy-js';

// Expose route helper globally so we can use it like route('name')
window.route = route;

createInertiaApp({
    resolve: async (name) => {
        const pages = import.meta.glob("./Pages/**/*.tsx");
        const page = await pages[`./Pages/${name}.tsx`]();
        return page.default;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
