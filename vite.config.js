import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'

function checkPortListening(port, host = '127.0.0.1', timeoutMs = 400) {
  return new Promise((resolve) => {
    const sock = new net.Socket()
    sock.setTimeout(timeoutMs)
    sock.once('connect', () => {
      sock.destroy()
      resolve(true)
    })
    sock.once('error', () => {
      sock.destroy()
      resolve(false)
    })
    sock.once('timeout', () => {
      sock.destroy()
      resolve(false)
    })
    sock.connect(port, host)
  })
}

/**
 * Custom Vite Plugin that automatically starts Laragon MySQL 8.4 (if offline)
 * and the PHP 8.4 API Server on http://127.0.0.1:8000 whenever `npm run dev` runs.
 */
function phpApiBackendPlugin() {
  let phpProcess = null
  let mysqlProcess = null

  return {
    name: 'php-api-backend-autostart',
    async configureServer() {
      // 1. Ensure Laragon MySQL 8.4 is running on port 3306
      const mysqlOnline = await checkPortListening(3306)
      const laragonMysqld = 'C:/laragon/bin/mysql/mysql-8.4.3-winx64/bin/mysqld.exe'
      const laragonMyIni = 'C:/laragon/bin/mysql/mysql-8.4.3-winx64/my.ini'

      if (!mysqlOnline && fs.existsSync(laragonMysqld)) {
        mysqlProcess = spawn(
          laragonMysqld,
          [`--defaults-file=${laragonMyIni}`],
          { stdio: 'ignore', windowsHide: true }
        )
        mysqlProcess.on('error', () => {
          mysqlProcess = null
        })
        // Wait briefly for MySQL socket to accept connections
        await new Promise((r) => setTimeout(r, 1500))
      }

      // 2. Run auto-migration / seeder so `school_portal_db` appears in Laragon MySQL
      const migrateProc = spawn('php', ['api/database/migrate.php'], {
        stdio: 'ignore',
        windowsHide: true,
      })
      migrateProc.on('error', () => {})

      // 3. Start PHP 8.4 API Server on http://127.0.0.1:8000
      const phpOnline = await checkPortListening(8000)
      if (!phpOnline && !phpProcess) {
        phpProcess = spawn('php', ['-S', '127.0.0.1:8000', '-t', 'api/public'], {
          stdio: 'ignore',
          windowsHide: true,
        })
        phpProcess.on('error', () => {
          phpProcess = null
        })
      }

      process.on('exit', () => {
        if (phpProcess) phpProcess.kill()
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    phpApiBackendPlugin(),
  ],
  server: {
    watch: {
      ignored: ['**/api/**', '**/storage/**', '**/portal_store.json', '**/*.sqlite'],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
