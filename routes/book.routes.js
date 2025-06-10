import { Router } from 'express';
import { addBook, getAllBooks, getBookById, addReview, updateReview, deleteReview, searchBooks } from '../controllers/book.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest, addBookSchema } from '../middleware/validator.js';
const bookRouter = Router();

bookRouter.post('/', authenticate, validateRequest(addBookSchema), addBook);
bookRouter.get('/', getAllBooks);
bookRouter.get('/:id', getBookById);
bookRouter.post('/books/:id/reviews', authenticate, addReview);
bookRouter.put('/reviews/:id', authenticate, updateReview);
bookRouter.delete('/reviews/:id', authenticate, deleteReview);
bookRouter.get('/search', searchBooks);

export default bookRouter;