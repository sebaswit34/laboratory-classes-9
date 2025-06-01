const Author = require('../models/Author');


exports.getAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.status(200).json(authors);
    } catch (error) {
        console.error('Błąd podczas pobierania autorów:', error);
        res.status(500).json({ 
            message: 'Wystąpił błąd podczas pobierania autorów',
            error: error.message 
        });
    }
};


exports.updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({ 
                message: 'Imię i nazwisko są wymagane' 
            });
        }

        const author = await Author.findByIdAndUpdate(
            id,
            { firstName, lastName },
            { new: true, runValidators: true }
        );

        if (!author) {
            return res.status(404).json({ 
                message: 'Autor nie został znaleziony' 
            });
        }

        res.status(200).json(author);
    } catch (error) {
        console.error('Błąd podczas aktualizacji autora:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Nieprawidłowe dane autora',
                error: error.message 
            });
        }
        res.status(500).json({ 
            message: 'Wystąpił błąd podczas aktualizacji autora',
            error: error.message 
        });
    }
};


exports.createAuthor = async (req, res) => {
    try {
        const { firstName, lastName } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({ 
                message: 'Imię i nazwisko są wymagane' 
            });
        }

        const author = new Author({ firstName, lastName });
        const savedAuthor = await author.save();
        res.status(201).json(savedAuthor);
    } catch (error) {
        console.error('Błąd podczas dodawania autora:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Nieprawidłowe dane autora',
                error: error.message 
            });
        }
        res.status(500).json({ 
            message: 'Wystąpił błąd podczas dodawania autora',
            error: error.message 
        });
    }
}; 