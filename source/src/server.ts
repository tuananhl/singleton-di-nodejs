import App from './app';

const port: number = parseInt(process.env.PORT) || 3500;
const app = new App(port);

/**
 * Bootstrap app heree.
 */
app.bootstrapApplication();
