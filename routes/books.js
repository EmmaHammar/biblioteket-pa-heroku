const { log } = require('console');
var express = require('express');
var router = express.Router();
const fs = require("fs");

let htmlHead = 
    `<link href="/stylesheets/style.css" rel="stylesheet" type="text/css"> 
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">`
;

let borrowers = [];


/* GET books listing. */
//denna router '/' är rooten och därför är innehållet i denna det som visas på startsidan
router.get('/', function(req, res, next) {
    let printBooks = htmlHead + `<title>Library</title> <h1>Bibliotek</h1>`;
    

    //hämta books.json
    fs.readFile('books.json', function(err, data) {

        if (err) {
            console.log(err);
        }

        let books = JSON.parse(data);
        // console.log(books);


        for (book in books) {
            // console.log(books[book].bookTitle); Denna syns i integrated terminalen
    
            let bookTemplate = `
                <article>
                    <ul>
                        <li>
                            <h2><a href="/books/book/${books[book].bookTitle}">${books[book].bookTitle}</a></h2>
                            <p>
                                ${books[book].author} 
                                [<a href="/books/rent/${books[book].bookTitle}">${(books[book].rented) ? "Utlånad" : "Låna"}</a>]
                            </p>
                        </li>
                    </ul>
                </article>`
            ;
            //iffy/ IIFE: ${ (books[book].rented) ? "Utlånad" : "Låna"}
    
            printBooks += bookTemplate;
        };
    
        printBooks += `</div><h2><a href="/books/add">Lägg till ny bok</a></h2></div>`;
    
        res.send(printBooks);
    })

});
// //hur få länk: vi-odlar-smultron och inte http://localhost:3000/books/Vi%20odlar%20smultron? 
// /* Skapa en slug och det är den vi söker efter i servern. Köra stringreplace() alla mellanslag blir bindestreck, alla åä blir a, alla ö blir o*/
// //hantera ? i vem är arg så att det funkar att ha det i titeln


// /* GET more info about a book */
// //FRÅGA: Varför görs detta i app.js och inte i books.js eller egen fil? Det går att göra i apps.get vs router.get men då behöver du ha med XX innan i något av det? 
// //varför behövs bara /book/:id och ej /books/book/:id?
router.get('/book/:id', function(req, res) {

    //(Kom ihåg: använder .params när det är query info + get. använder .body när det är post)
    let showBookTitle = req.params.id;

    fs.readFile('books.json', function(err, data) {

        if (err) {
            console.log(err);
        }

        let books = JSON.parse(data);
        console.log(books);
    
    //hitta klickade boken i books-arrayen
    let showBook =  books.find( ({bookTitle}) => bookTitle == showBookTitle);

    //showbook är den klickade boken. Innehållet i den kan du sen nå via ex. showbook.bootTitle
    // console.log("Visa booktiteln vi har klickat på", showBook.bookTitle);

    let showBookTemplate = htmlHead + 
        `<title>Library - ${showBook.bookTitle}</title> 
        <h3>${showBook.bookTitle}</h3> 
        <p>Av: ${showBook.author}</p><br> 
        <img src="/images/${showBook.image}" alt="Visar bokomslaget för ${showBook.bookTitle}"><br><br>
        <p>${showBook.about}</p><br> 
        <button><a href="/books">Tillbaka</a></button>`
    ;
    res.send(showBookTemplate);
    });
});

/* add new book */
router.get('/add', function(req, res) {

    //Printar ny bok-formuläret: 
    let addNewBookTemplate = htmlHead + 
        `<div>
            <h4>Lägg till en ny bok:</h4>
            <form action="/books/add" method="post">
                <div><input typ="text" id="bookTitle" name="bookTitle">Boktitel</div> 
                <div><input typ="text" name="author">Författare</div> 
                <div><input typ="text" name="about">Om boken</div> 
                <div><input typ="text" name="pages">Antal sidor</div> 
                <div><button type="submit">Spara</button></div>
            </form>
        </div>`;
    res.send(addNewBookTemplate);
});

router.post('/add', function(req, res) {
    console.log(req.body);

    //ÖPPNAR FILEN 
    fs.readFile("books.json", function(err, data) {
        if(err) {
            console.log(err);
        }

        //HÄMTA(?) books.json-böckerna
        let books = JSON.parse(data);
        // console.log(books);

        //SKAPA NY BOK
        //lägga till id senare
        let newBook = 
            {
                bookTitle: req.body.bookTitle, 
                author: req.body.author, 
                about: req.body.about, 
                pages: req.body.pages,
                rented: false 
            };

        //LÄGGER TILL NY BOK I BOOKS.JSON
        books.push(newBook);


        //SKRIVER ÖVER GAMLA BOOKS.JSON MED NYA BOOKS
        fs.writeFile("books.json", JSON.stringify(books, null, 2), function(err) {
            if (err) {
              console.log(err);
            }

        });

        //tillbaka till startsidan
        res.redirect("/books");

    });
    
});


// /* rent a book */
// router.get("/rent/:id", function(req, res) {
//     let showBookTitle = req.params.id;
//     let showBook = books.find( ({bookTitle}) => bookTitle == showBookTitle);

//     showBook.rented = true;

//     let rentBook = 
//         htmlHead + `<h4>Du vill låna: ${showBook.bookTitle}</h4>
//         <form action="/books/rent/:id" method="post">
//             <div><input typ="text" name="name">Ditt namn</div> 
//             <div><input typ="text" name="email">Din email</div> 
//             <div><button type="submit">Låna</button></div>
//         </form>
//         `;
//     res.send(rentBook); 
//     // res.send(showBookTitle)
// });

// //id är allt efter rent/ o du kan döpa id till något annat (går bara att göra för att variabeln är dynamisk efter /lend/ i roten)
// router.post("/rent/:id", function(req, res) {
//         console.log(req.body);
    
//         let newBorrower = 
//         {
//             name: req.body.name, 
//             email: req.body.email, 
//             bookTitle: req.body.bookTitle 
//         };
    
//         borrowers.push(newBorrower);

//         //Kolla så det funkar
//         // res.send(borrowers);
    
//         //tillbaka till startsidan
//         res.redirect("/books");
// });
// //Göra något med borrowers-listan


module.exports = router;