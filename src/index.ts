import express from 'express';
import 'dotenv/config';
import routes from './routes.js';

const port = process.env.PORT;
const api_url = process.env.API_URL;

const app = express();

app.use('/api', routes);

app.listen(port, () => {
  console.log('Server running on http://localhost:' + port);
});