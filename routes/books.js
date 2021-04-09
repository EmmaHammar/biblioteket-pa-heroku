var express = require('express');
var router = express.Router();

let books = [
    {bookTitle: "Vi odlar smultron", author: "Sarah Vegna", about: "En bok om den lekfulla vardagen med ett litet barn!", pages: 32, rented: false, image: "vi-odlar-smultron.png", id: 1},
    {bookTitle: "Vem är arg", author: "Stina Wirsén", about: "En liten bok om stora känslor. Om hur arg och ledsen man kan bli när man ska leka tillsammans. Och hur roligt man kan ha!", pages: 32, rented: false, image: "vem-ar-arg.png", id: 2},
    {bookTitle: "Handbok för superhjältar - del 1: Handboken", author: "Agnes och Elias Våhlund", about: "Lisa måste bo hos sin mormor i några månader eftersom hennes mamma jobbar i en annan stad. Problemet är bara att Lisa vantrivs något fruktansvärt i sin nya skola. Killgänget retar henne konstant för hennes utstående öron, och varje kväll somnar Lisa med händerna tryckta mot öronen, för att de förhoppningsvis ska sluta stå ut så mycket. En dag när Lisa, i vanlig ordning, blir jagad av killgänget rymmer hon in på biblioteket. Där, längst ner på en hylla, står en bok som liksom lyser. Lisa dras till hyllan och får fram boken som har det besynnerliga namnet 'Handbok för superhjältar'. Märkligt nog är inte boken registrerad i bibliotekets system, och bibliotekarien viskar till Lisa att det nog är så att handboken helt enkelt ska följa med Lisa hem och stanna där. Och i det ögonblicket börjar Lisas resa mot att bli superhjälten Röda masken!", pages: 87, rented: false, image: "handbok-for-superhjaltar.png", id: 3},
    {bookTitle: "En annan historia", author: "Lina Thomsgård", about: "Här får du lära känna mattesnillen, låtskrivare, politiker, rösträttskämpar, tennisstjärnor, husmödrar, författare, jägare, börshajar och barnmorskor som alla bidragit till att skapa världen i dag. Femtioen personer som du, genom att läsa denna bok, är med och för in i evigheten.", pages: 195, rented: false, image: "en-annan-historia.png", id: 4},
    {bookTitle: "Invisible women", author: "Caroline Criado Perez", about: "Imagine a world where your phone is too big for your hand, your doctor prescribes a drug that is wrong for your body and in a car accident you are 47% more likely to be injured. If any of that sounds familiar, chances are you're a woman. From government policy and medical research, to technology, workplaces, and the media. Invisible Women reveals how in a world built for and by men we are systematically ignoring half of the population, often with disastrous consequences.", pages: 432, rented: false, image: "invisible-women.png", id: 5}
];

let borrowers = [];


/* GET books listing. */
//denna router '/' är rooten och därför är innehållet i denna det som visas på startsidan
router.get('/', function(req, res, next) {
    let printBooks = '<h1>Bibliotek</h1>'
    
    for (book in books) {
        // console.log(books[book].bookTitle); Denna syns i integrated terminalen

        let bookTemplate = `
        <article>
            <h2><a href="/books/book/${books[book].bookTitle}">${books[book].bookTitle}</a></h2>
            <p>${books[book].author} [<a href="/books/rent/${books[book].bookTitle}">${ (books[book].rented) ? "Utlånad" : "Låna"}]</a></p>
        </article>`;
        //iffy/ IIFE: ${ (books[book].rented) ? "Utlånad" : "Låna"}

        printBooks += bookTemplate;
    };

    printBooks += `</div><a href="/books/add">Lägg till ny bok</a></div>`;

    res.send(printBooks);
});
//hur få länk: vi-odlar-smultron och inte http://localhost:3000/books/Vi%20odlar%20smultron? 
/* Skapa en slug och det är den vi söker efter i servern. Köra stringreplace() alla mellanslag blir bindestreck, alla åä blir a, alla ö blir o*/
//hantera ? i vem är arg så att det funkar att ha det i titeln


/* GET more info about a book */
//FRÅGA: Varför görs detta i app.js och inte i books.js eller egen fil? Det går att göra i apps.get vs router.get men då behöver du ha med XX innan i något av det? 
//varför behövs bara /book/:id och ej /books/book/:id?
router.get('/book/:id', function(req, res) {

    //(Kom ihåg: använder .params när det är query info + get. använder .body när det är post)
    let showBookTitle = req.params.id;

    //hitta klickade boken i books-arrayen
    let showBook =  books.find( ({bookTitle}) => bookTitle == showBookTitle);

    //showbook är den klickade boken. Innehållet i den kan du sen nå via ex. showbook.bootTitle
    // console.log("Visa booktiteln vi har klickat på", showBook.bookTitle);

    res.send("<h3>" + showBook.bookTitle + "</h3>" + "<p>" + showBook.author + "</p><br>" + "<p>" +showBook.about+ "</p><br>");
});

/* add new book */
router.get('/add', function(req, res) {
    let addNewBook = 
        `<div>
            <h4>Lägg till en ny bok:</h4>
            <form action="/books/add" method="post">
                <div><input typ="text" name="bookTitle">Boktitel</div> 
                <div><input typ="text" name="author">Författare</div> 
                <div><input typ="text" name="about">Om boken</div> 
                <div><input typ="text" name="pages">Antal sidor</div> 
                <div><button type="submit">Spara</button></div>
            </form>
        </div>`;

    res.send(addNewBook);
});

router.post('/add', function(req, res) {
    console.log(req.body);

    let newBook = 
    {
        bookTitle: req.body.bookTitle, 
        author: req.body.author, 
        about: req.body.about, 
        pages: req.body.pages 
    };

    books.push(newBook);

    //tillbaka till startsidan
    res.redirect("/books");
});


/* rent a book */
router.get("/rent/:id", function(req, res) {
    let showBookTitle = req.params.id;
    let showBook = books.find( ({bookTitle}) => bookTitle == showBookTitle);

    showBook.rented = true;

    let rentBook = 
        `<h4>Du vill låna: ${showBook.bookTitle}</h4>
        <form action="/books/rent/:id" method="post">
            <div><input typ="text" name="name">Ditt namn</div> 
            <div><input typ="text" name="email">Din email</div> 
            <div><button type="submit">Låna</button></div>
        </form>
        `;
    res.send(rentBook); 
});

router.post("/rent/:id", function(req, res) {
        console.log(req.body);
    
        let newBorrower = 
        {
            name: req.body.name, 
            email: req.body.email, 
            bookTitle: req.body.bookTitle 
        };
    
        borrowers.push(newBorrower);

        //Kolla så det funkar
        // res.send(borrowers);
    
        //tillbaka till startsidan
        res.redirect("/books");
});
//Göra något med borrowers-listan

module.exports = router;

//Vad ska pushas till repot, ex:
//allt i public
//allt i routes
//readme.md
//app.js