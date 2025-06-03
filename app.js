const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Połączenie z MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Połączono z MongoDB Atlas');
})
.catch(err => {
    console.error('Błąd połączenia z MongoDB Atlas:', err);
    process.exit(1);
});

//główny endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'API Biblioteki',
        endpoints: {
            books: {
                GET: '/api/books - lista wszystkich książek',
                POST: '/api/books - dodanie nowej książki',
                DELETE: '/api/books/:id - usunięcie książki'
            },
            authors: {
                GET: '/api/authors - lista wszystkich autorów',
                POST: '/api/authors - dodanie nowego autora',
                PUT: '/api/authors/:id - aktualizacja autora'
            }
        }
    });
});


app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/authors', require('./routes/authorRoutes'));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Wystąpił błąd serwera', error: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
