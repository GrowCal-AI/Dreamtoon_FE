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
        // 수동 청크 분할로 최적화 (페이지별 + 라이브러리별)
        manualChunks: (id) => {
          // Node modules vendor splitting
          if (id.includes('node_modules')) {
            // React와 React-DOM은 항상 함께 번들링되어야 함 (중요!)
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('react-router')) {
              return 'vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Other node_modules
            return 'vendor';
          }

          // UI components chunk
          if (id.includes('/src/components/ui/')) {
            return 'ui-components';
          }

          // Feature components chunk
          if (id.includes('/src/components/features/')) {
            return 'feature-components';
          }

          // Pages는 lazy loading으로 자동 분할되므로 수동 청크 불필요
        },
      },
    },
    // 소스맵 비활성화 (프로덕션 번들 크기 감소)
    sourcemap: false,
    // Minification 옵션
    minify: 'esbuild',
    target: 'es2015',
    // CSS 코드 분할
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
})
