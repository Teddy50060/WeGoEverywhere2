
export default () => ({
  app: {
    frontendUrl: process.env.FRONTEND_APP_URL || 'http://localhost:3000',
    port: parseInt(process.env.BACKEND_APP_PORT ?? '3001', 10),
  },
});