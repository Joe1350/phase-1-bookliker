document.addEventListener("DOMContentLoaded", function() {

    // urls
const booksURL = 'http://localhost:3000/books/'

    // helpers
const create = el => document.createElement(el)
const select = el => document.querySelector(el)

    // grab stuff
const booksListContainer = select('#list')
const bookInfoContainer = select('#show-panel')

    // make new user
const newUser = [{id: 11, username: 'Joe'}]


    // various functions
function renderBooksList(books) {
    console.log(books)
    books.forEach(book => {
        const listBook = create('li')
        listBook.dataset.bookId = book.id
        listBook.innerText = book.title
        listBook.addEventListener('click', (e) => renderBookDetails(e))
        booksListContainer.append(listBook)
    })
}

function getAllBooks() {
    fetch(booksURL)
        .then(r => r.json())
        .then(books => renderBooksList(books))
}

function getBook(e) {
    return fetch(`${booksURL}${e.target.dataset.bookId}`)
        .then(r => r.json())
}


function renderBookDetails(e){
    bookInfoContainer.innerText = ''
    getBook(e).then(book => {
        const bookImage = create('img')
        const bookTitle = create('h1')
        const bookSubtitle = create('h3')
        const bookAuthor = create('h2')
        const bookDescription = create('p')
        const likesUserList = create('ul')
        const likeButton = create('button')
        bookImage.src = book['img_url']
        bookTitle.innerText = book.title
        if(book.subtitle) {
            bookSubtitle.innerText = book.subtitle
        }
        bookAuthor.innerText = book.author
        bookDescription.innerText = book.description
        if (book.users) {
            book.users.map(user => {
                const li = create('li')
                li.textContent = user.username
                likesUserList.append(li)
            })
        }
        likeButton.innerText = 'Like'
        likeButton.dataset.bookId = e.target.dataset.bookId
        bookInfoContainer.append(bookImage, bookTitle, bookSubtitle, bookAuthor, bookDescription, likesUserList, likeButton)
    })
}


function changeLikes(e, id, body) {
    fetch(`${booksURL}${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(() => renderBookDetails(e))
}

function handleClick(e) {
    if(e.target.tagName == 'BUTTON') {
        if(e.target.innerText == 'Like') {
            const id = e.target.dataset.bookId
            getBook(e).then(book => {
                const users = book.users
                const body = {"users": [...users, ...newUser]}
                changeLikes(e, id, body)
            })
        }
    }
}

    // event listener
bookInfoContainer.addEventListener('click', handleClick)


    // initialize
getAllBooks();

});