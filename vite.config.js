import { defineConfig } from "vite";

export default defineConfig({
    assetsInclude: ["**/*.gltf"],
    publicDir: "static/",
    server: {
        host: true,
    },
});
