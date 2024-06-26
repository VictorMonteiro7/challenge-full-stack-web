import express, { ErrorRequestHandler, Application } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';

dotenv.config();
const app: Application = express();
app.use(helmet());
app.use(cors({
  origin: '*',
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', routes);
app.use('*', (req, res) => {
  res.status(404).json({ error: 'NOT_FOUND' });
});

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  console.error(err);
  res.status(500).json({ error: 'INTERNAL_ERROR' });
};

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
