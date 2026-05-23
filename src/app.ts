import express, { type Application, type Request, type Response } from 'express'
import cors from 'cors'
import { authRouter } from './module/Authentication/auth.router';
import { issuesRouter } from './module/Issues/issue.router';
import { globalErrorHandler } from './middleware/globalErrorHandling';

const app:Application = express()

app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}));


app.use('/api/auth',authRouter);
app.use('/api/issues',issuesRouter);

app.get('/', (req:Request, res:Response) => {
  res.send('Backend - work perfectly')
});

app.use(globalErrorHandler)

export default app;