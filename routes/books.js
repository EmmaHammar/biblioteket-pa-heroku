var express = require('express');
var router = express.Router();

let books = [
    {bookTitle: "Vi odlar smultron", author: "Sarah Vegna", about: "En bok om den lekfulla vardagen med ett litet barn!", pages: 32, rented: false, image: "vi-odlar-smultron.png", id: 1},
    {bookTitle: "Vem är arg?", author: "Stina Wirsén", about: "En liten bok om stora känslor. Om hur arg och ledsen man kan bli när man ska leka tillsammans. Och hur roligt man kan ha!", pages: 32, rented: false, image: "vem-ar-arg.png", id: 2},
    {bookTitle: "Handbok för superhjältar - del 1: Handboken", author: "Agnes och Elias Våhlund", about: "Lisa måste bo hos sin mormor i några månader eftersom hennes mamma jobbar i en annan stad. Problemet är bara att Lisa vantrivs något fruktansvärt i sin nya skola. Killgänget retar henne konstant för hennes utstående öron, och varje kväll somnar Lisa med händerna tryckta mot öronen, för att de förhoppningsvis ska sluta stå ut så mycket. En dag när Lisa, i vanlig ordning, blir jagad av killgänget rymmer hon in på biblioteket. Där, längst ner på en hylla, står en bok som liksom lyser. Lisa dras till hyllan och får fram boken som har det besynnerliga namnet 'Handbok för superhjältar'. Märkligt nog är inte boken registrerad i bibliotekets system, och bibliotekarien viskar till Lisa att det nog är så att handboken helt enkelt ska följa med Lisa hem och stanna där. Och i det ögonblicket börjar Lisas resa mot att bli superhjälten Röda masken!", pages: 87, rented: false, image: "handbok-for-superhjaltar.png", id: 3},
    {bookTitle: "En annan historia", author: "Lina Thomsgård", about: "Här får du lära känna mattesnillen, låtskrivare, politiker, rösträttskämpar, tennisstjärnor, husmödrar, författare, jägare, börshajar och barnmorskor som alla bidragit till att skapa världen i dag. Femtioen personer som du, genom att läsa denna bok, är med och för in i evigheten.", pages: 195, rented: false, image: "en-annan-historia.png", id: 4},
    {bookTitle: "Invisible women", author: "Caroline Criado Perez", about: "Imagine a world where your phone is too big for your hand, your doctor prescribes a drug that is wrong for your body and in a car accident you are 47% more likely to be injured. If any of that sounds familiar, chances are you're a woman. From government policy and medical research, to technology, workplaces, and the media. Invisible Women reveals how in a world built for and by men we are systematically ignoring half of the population, often with disastrous consequences.", pages: 432, rented: false, image: "invisible-women.png", id: 5}
];

/* GET books listing. */
router.get('/', function(req, res, next) {
    let printBooks = '<h1>Bibliotek</h1>'
    
    for (book in books) {
        // console.log(books[book].bookTitle); Denna syns i integrated terminalen
        let bookTemplate = `
            <article>
                <h2><a href="/books/${books[book].bookTitle}">${books[book].bookTitle}</a></h2>
                <p>${books[book].author} [Låna]</p>
            </article>`

        printBooks += bookTemplate;
    };

    printBooks += `</div><a href="/books/add">Lägg till ny bok</a></div>`;

    res.send(printBooks);
});
//hur få länk: vi-odlar-smultron och inte http://localhost:3000/books/Vi%20odlar%20smultron? - ge id:et? 

/* GET more info about a book */
//lägga till id 42 i länken -> visar 42 - kolla jannes? video?
//Hur skriva länken så den blir dynamisk - skicka in det användaren klickar på, antingen titeln eller id:et /books/${books[book].id}
// router.get(`/books/${books[book].bookTitle}`}, function(req, res) {
//     for (book in books) {
//         let printBookInfo = `   
//             <article>
//                 <h3><a href="/books/${books[book].bookTitle}">${books[book].bookTitle}</a></h3>
//                 <p>${books[book].author} [Låna]</p>
//                 <p>${books[book].about}</p>
//                 <img>${books[book].image}</img>
//             </article>`;
//     };
// });

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







module.exports = router;
