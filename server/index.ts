import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import app from './routes';

const port = process.env.PORT || 3001;

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use('/*', serveStatic({
    root: './dist',
    rewriteRequestPath: (path) => {
      // For non-API routes, serve index.html for client-side routing
      if (!path.startsWith('/api') && !path.includes('.') && path !== '/') {
        return '/index.html';
      }
      return path;
    }
  }));
}

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port: Number(port),
});