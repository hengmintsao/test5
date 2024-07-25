const express = require('express'); 
const app = express(); 
const HTTP_PORT = process.env.PORT || 8080; 


const Sequelize =  require('sequelize');
const sequelize = new Sequelize('senecadb','senecadb_owner','RXxzb5DQ3BsW',{
    host: 'ep-orange-brook-a5emrbla.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  });

  app.set('view engine', 'ejs');

sequelize
.authenticate()
.then(() =>{
    console.log("Connection has been sucessfully created");})
.catch((err)=>{
    console.log("Connection unsucessful", err);
});

//Define
const Book = sequelize.define('Book', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "project_id" as a primary key
        autoIncrement: true, // automatically increment the value
      },
        title: Sequelize.STRING,
        author:  Sequelize.STRING,
        year:  Sequelize.INTEGER,
      }, {
        createdAt: false,
        updatedAt: false,
      });

//Create the Books table in the database.
/*sequelize.sync().then(() => {
    Book.create({
        
        title: 'Avatar',
        author: 'Adam Smith',
        year: 2011
    }).then(() => {
      console.log('The book: Avatar created!');
    });
  
    Book.create({
        title: 'Chicken eat Tiger',
        author: 'Hengmin Tsao',
        year: 2050
    }).then(() => {
      console.log('The book: Chicken eat Tiger created!');
    });
  
    Book.create({
        title: 'Airplane and airport theory',
        author: 'Michael Jackson',
        year: 1995
    }).then(() => {
      console.log('The book: Airplane and airport theory created!');
    });
  });*/




      // List all books with options to edit and delete each book.
      app.get('/', async (req, res) => {
        const books = await Book.findAll();
        res.render('books', { books });
      });
      
      // Display form for creating a new book
      app.get('/new', (req, res) => {
        res.render('newBook');
      });
      
      
      app.post('/', async (req, res) => {
        const { id,title, author, year } = req.body;
        await Book.create({ id,title, author, year });
        res.redirect('/');
      });
      
      app.get('/edit/:id', async (req, res) => {
        const bookId = req.params.id;
        const book = await Book.findByPk(bookId);
        if (book) {
          res.render('editBook', { book });
        } else {
          res.status(404).send('Book not found');
        }
      });

      // Delete a book
      app.post('/delete/:id', async (req, res) => {
        const bookId = req.params.id;
        await Book.destroy({ where: { id: bookId } });
        res.redirect('/books');
      });
      
      // Start the server
      /*app.listen(HTTP_PORT, () => {
        console.log(`Server listening on port ${HTTP_PORT}`);
      });*/
      
      sequelize.authenticate()
        .then(() => {
          console.log('Connection has been successfully established.');
          sequelize.sync();
        })
        .catch(err => {
          console.error('Unable to connect to the database:', err);
        });

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));