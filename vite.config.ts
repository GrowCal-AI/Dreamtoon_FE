import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 청크 크기 경고 제한 증가
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 수동 청크 분할로 최적화
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['framer-motion'],
          'charts': ['recharts'],
          'icons': ['lucide-react'],
        },
      },
    },
    // 소스맵 비활성화 (프로덕션 번들 크기 감소)
    sourcemap: false,
    // Minification 옵션
    minify: 'esbuild',
    target: 'es2015',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
