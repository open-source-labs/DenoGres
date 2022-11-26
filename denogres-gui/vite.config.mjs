import { defineConfig } from 'npm:vite@^3.2.3';
import react from 'npm:@vitejs/plugin-react@^2.2.0';

import 'npm:react@^18.2.0';
import 'npm:react-dom@^18.2.0/client';
import 'npm:react-router-dom@^6.4';
import 'npm:reactflow';
// import 'npm:tailwindcss'
// import 'npm:postcss'
// import 'npm:autoprefixer'
// import { tw } from 'https://cdn.skypack.dev/twind'
// import { setup, disconnect } from 'twind/shim'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
