import express from 'express';
import 'dotenv/config';
import routes from './routes.js';

const port: String = process.env.PORT ?? '3000';

const app = express();

app.get('/status', (req, res) => {
    res.json({status: 'ok'});
})
app.use('/api', routes);

app.listen(port, () => {
    console.log('Server running...');
});