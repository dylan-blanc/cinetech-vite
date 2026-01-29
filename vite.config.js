import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    AutoImport({ // de npm install -D unplugin-auto-import
      imports: [
        'react',
        'react-dom',
        'react-router-dom',
        {
          './src/utils/utilitaire': 
          ['DLE']
        }
        /*
        * sert a ne pas devoir ecrire ces import dans tous les autres fichiers 
        *
        * import { Link } from "react-router-dom";
        * import { useState, useEffect } from 'react';
        * import { BrowserRouter, Routes, Route } from 'react-router-dom';
        * 
        */
      ],
      dts: true,
      eslintrc: { // evite les erreurs ESLint
        enabled: true,
      },
    }),
  ],
})
