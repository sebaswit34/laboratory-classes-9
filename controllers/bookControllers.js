const Book = require('../models/Book');
const Author = require('../models/Author');


exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .populate('author', 'firstName lastName');
        res.status(200).json(books);
    } catch (error) {
        console.error('Błąd podczas pobierania książek:', error);
        res.status(500).json({ 
            message: 'Wystąpił błąd podczas pobierania książek',
            error: error.message 
        });
    }
};


exports.createBook = async (req, res) => {
    try {
        const { title, year, author } = req.body;

        // Walidacja danych wejściowych
        if (!title || !year || !author) {
            return res.status(400).json({ 
                message: 'Tytuł, rok i autor są wymagane' 
            });
        }

        
        const authorExists = await Author.findById(author);
        if (!authorExists) {
            return res.status(404).json({ 
                message: 'Autor nie został znaleziony' 
            });
        }

        const book = new Book({ title, year, author });
        await book.save();
        
        const populatedBook = await Book.findById(book._id)
            .populate('author', 'firstName lastName');
            
        res.status(201).json(populatedBook);
    } catch (error) {
        console.error('Błąd podczas dodawania książki:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Nieprawidłowe dane książki',
                error: error.message 
            });
        }
        res.status(500).json({ 
            message: 'Wystąpił błąd podczas dodawania książki',
            error: error.message 
        });
    }
};


exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByIdAndDelete(id);
        
        if (!book) {
            return res.status(404).json({ 
                message: 'Książka nie została znaleziona' 
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Błąd podczas usuwania książki:', error);
        res.status(500).json({ 
            message: 'Wystąpił błąd podczas usuwania książki',
            error: error.message 
        });
    }
}; 