/**
 * List all transactions for given accounts
 *
 * GET: /books/{bookId}/transactions
 * 
 * query:
 *   accounts {string} A comma-separated search term for accounts.
 *   perPage {integer} The number of results per page.
 *   page {integer} The page number.
 *   newestFirst {boolean} If true (default - false), sort list with newest entries at the beginning.
 *   
 */
const Book = require('../../models/book');
const {AleError, codes} = require('../errors');
exports.handler = function getTransactions(req, res, next) {
    let id = parseInt(req.params.bookId);
    Book.findById(id).then(book => {
        if (!book) {
            throw new AleError(`Book with id ${id} does not exist`, codes.BookDoesNotExist);
        }
        const account = req.query.accounts.split(',');
        const { perPage, page } = req.query;
        const newestFirst = req.query.newestFirst || false;
        const includeMemo = req.query.includeMemo || false;
        return book.getTransactions({ account, perPage, page, newestFirst, includeMemo });
    }).then(txs => {
        const result = txs.map(t => t.values());
        res.json(result);
    }).catch(err => {
        return next(err);
    });
};
