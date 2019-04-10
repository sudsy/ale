/**
 * Return an account balance
 *
 * GET: /books/{bookId}/balance
 * 
 * query:
 *   account {string} The account to get the balance for.
 *   inQuoteCurrency {boolean} If true (default), converts all values to the quote currency first.
 *   
 */
const Book = require('../../models/book');
const {AleError, codes} = require('../errors');

exports.handler = function getBalance(req, res, next) {
    let id = parseInt(req.params.bookId);
    let startDate;
    let endDate;
    Book.findById(id).then(book => {
        if (!book) {
            throw new AleError(`Book with id ${id} does not exist`, codes.BookDoesNotExist);
        }
        if (req.query.startDate) {
            startDate = new Date(req.query.startDate);
        }
        if (req.query.endDate) {
            endDate = new Date(req.query.endDate);
        }
        const { account, perPage, page } = req.query;
        const inQuote = req.query.inQuoteCurrency !== false;
        return book.getBalance({startDate, endDate, account, perPage, page }, inQuote);
    }).then(balance => {
        res.json(balance);
    }).catch(err => {
        return next(err);
    });
};

