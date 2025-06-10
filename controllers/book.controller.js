import User from '../models/user.model.js';
import Book from '../models/book.model.js';
import Review from '../models/review.model.js';
import CustomErrorHandler from '../utils/customErrorHandler.js';

export const addBook = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return next(CustomErrorHandler.wrongCredentials());
        }

        const { title, author, description, genre } = req.body;
        await Book.create({ title, author, description, genre });
        res.status(201).json({ message: "Added book successfully" });
        return;
    } catch (err) {
        next(err);
    }
}

export const getAllBooks = async (req, res, next) => {
    try {
        console.log("hi");
       const page = Number(req.query.page) || 1;
       const limit = Number(req.query.limit) || 10;
       const skip = (page - 1) * limit;
       
       const { author, genre } = req.query;

       const query = {};
       if (author) {
        query.author = { $regex: author, $options: 'i' }; // case-insensitive partial match
       }
       if (genre) {
        query.genre = { $regex: genre, $options: 'i' };
       }

       const totalBooks = await Book.countDocuments(query);

       const books = await Book.find(query)
       .skip(skip)
       .limit(limit)
       .sort({ createdAt: -1 });

        res.status(200).json({
        page,
        limit,
        totalPages: Math.ceil(totalBooks / limit),
        data: books
    });

    } catch (err) {
        next(err);
    }
}

export const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Pagination for reviews
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 5;
    const skip = (page - 1) * limit;

    // Fetch book
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Get average rating and total reviews
    const aggResult = await Review.aggregate([
      { $match: { bookId: book._id } },
      {
        $group: {
          _id: "$bookId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const averageRating = aggResult[0]?.averageRating || 0;
    const totalReviews = aggResult[0]?.totalReviews || 0;

    // Get paginated reviews
    const reviews = await Review.find({ bookId: book._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("userId rating comment createdAt");

    res.status(200).json({
      book,
      averageRating: averageRating.toFixed(2),
      totalReviews,
      reviews: {
        page,
        limit,
        totalPages: Math.ceil(totalReviews / limit),
        data: reviews
      }
    });

  } catch (err) {
    next(err);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { id: bookId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    // Validate book existence
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Prevent duplicate reviews by same user
    const alreadyReviewed = await Review.findOne({ bookId, userId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this book.' });
    }

    // Create and save the review
    const review = new Review({
      bookId,
      userId,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({ message: 'Review added successfully.', review });
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { id: reviewId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if current user owns the review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update your own review' });
    }

    // Update the fields
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    res.status(200).json({
      message: 'Review updated successfully',
      review
    });

  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id: reviewId } = req.params;
    const userId = req.user.id;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own review' });
    }

    await review.deleteOne();

    res.status(200).json({ message: 'Review deleted successfully' });

  } catch (err) {
    next(err);
  }
};

export const searchBooks = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(query, 'i'); // case-insensitive partial match

    const books = await Book.find({
      $or: [
        { title: { $regex: searchRegex } },
        { author: { $regex: searchRegex } }
      ]
    });

    res.status(200).json({ results: books });

  } catch (err) {
    next(err);
  }
};
  