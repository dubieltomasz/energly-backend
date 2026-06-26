import express from 'express';
import 'dotenv/config';
import routes from './routes.js';
import cors from 'cors';

const port: String = process.env.PORT ?? '3000';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET']
}));

app.get('/status', (_, res) => {
    res.json({status: 'OK'});
})
app.use('/api', routes);

app.listen(port, () => {
    console.log('Server running...');
});