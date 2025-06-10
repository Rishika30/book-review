import express from 'express';
import { config } from './helpers/env.js';
import authRouter from './routes/auth.routes.js';
import bookRouter from './routes/book.routes.js';
import databaseConnection from './helpers/db.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/auth', authRouter);
app.use('/books', bookRouter);
app.use(errorHandler);

app.get('/', (req,res) => {
    res.send("Welcome to the Book-Review API");
});

app.listen(config.PORT, async () => {
    console.log(`Book-Review API is running on http://localhost:${config.PORT}`);
    await databaseConnection();
})

export default app;
