// Main elements
const elBookShelf = document.getElementById('book-shelf');
const elBookTemplate = document.getElementById('book-prototype');
const elAddButton = document.getElementById('add-book-button');
const elRemoveAllButton = document.getElementById('remove-all-button');

// Form elements
const elBookForm = document.getElementById('book-form')
const elFormTitle = document.getElementById('title-form');
const elFormISBN = document.getElementById('isbn-form');
const elFormFirstName = document.getElementById('first-name-form');
const elFormLastName = document.getElementById('last-name-form');
const elFormLanguage = document.getElementById('language-form');
const elFormPages = document.getElementById('pages-form');
const elFormRead = document.getElementById('read-form');
const elFormSummary = document.getElementById('summary-form');

let books = initLibrary();

// Add the event listeners
elBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    elBookForm.classList.add('was-validated');

    if (!elBookForm.checkValidity()) {
        event.stopPropagation();
    } else {
        addBook();
        elBookForm.classList.remove('was-validated');
    }
});
elRemoveAllButton.addEventListener('click', removeBooks);

function Book(title, isbn, author, language, pages, read, summary) {
    this.title = title;
    this.isbn = isbn;
    this.author = author;
    this.language = language;
    this.pages = pages;
    this.read = read;
    this.summary = summary;
}

function initLibrary() {
    let books = {};

    if (storageAvailable('localStorage')) {
        if (localStorage.getItem('userLibrary') == null) {
            localStorage.setItem('userLibrary', JSON.stringify(books));
        } else {
            books = JSON.parse(localStorage.getItem('userLibrary'));

            for (let book in books) {
                displayBook(books[book]);
            }
        }
    }

    return books;
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

// Adds a book to the storage and 
function addBook() {
    // Read the input
    let title = elFormTitle.value;
    let isbn = elFormISBN.value;
    let firstName = elFormFirstName.value;
    let lastName = elFormLastName.value;
    let language = elFormLanguage.value;
    let pages = elFormPages.value;
    let read = elFormRead.value;
    let summary = elFormSummary.value;

    // Clear the fields
    elFormTitle.value = '';
    elFormISBN.value = '';
    elFormFirstName.value = '';
    elFormLastName.value = '';
    elFormPages.value = '';
    elFormSummary.value = '';

    // Construct a new book
    let newBook = new Book(title, isbn, firstName + ' ' + lastName, language, pages, read, summary);

    // Add the new book to our storage
    books[title] = newBook;

    // Add to the local storage
    if (storageAvailable('localStorage')) {
        localStorage.setItem('userLibrary', JSON.stringify(books));
    }

    // Display the book on the page
    displayBook(newBook);
}

// Removes a book from the storage
function removeBook(bookTitle) {
    delete books[bookTitle];
    elBookShelf.removeChild(document.getElementById(bookTitle));

    if (storageAvailable('localStorage')) {
        localStorage.setItem('userLibrary', JSON.stringify(books));
    }
}

// Remove all books
function removeBooks() {
    for (let book in books) {
        removeBook(book);
    }
}

// Display the book on the page
function displayBook(book) {
    // Make a copy of the template element
    let elNewBook = elBookTemplate.cloneNode(true);
    
    // Set up the content
    elNewBook.style.display = 'block';
    elNewBook.id = book.title;

    let strippedStr = book.title.replace(/\s/g, '');

    elNewBook.getElementsByClassName('accordion-header')[0].id = strippedStr + '-heading';
    elNewBook.getElementsByClassName('accordion-button')[0].setAttribute('data-bs-target', '#' + strippedStr + '-collapse');
    elNewBook.getElementsByClassName('accordion-button')[0].setAttribute('aria-controls', strippedStr + '-collapse');
    elNewBook.getElementsByClassName('accordion-collapse')[0].id = strippedStr + '-collapse';
    elNewBook.getElementsByClassName('accordion-collapse')[0].setAttribute('aria-labelledby', strippedStr + '-heading');

    elNewBook.getElementsByClassName('book-title')[0].textContent = book.title;
    elNewBook.getElementsByClassName('card-title')[0].textContent = book.title;
    elNewBook.getElementsByClassName('isbn-field')[0].textContent = book.isbn;
    elNewBook.getElementsByClassName('author-field')[0].textContent = book.author;
    elNewBook.getElementsByClassName('language-field')[0].textContent = book.language;
    elNewBook.getElementsByClassName('pages-field')[0].textContent = book.pages;
    elNewBook.getElementsByClassName('read-field')[0].value = book.read;
    elNewBook.getElementsByClassName('read-field')[0].addEventListener('change', () => {
        updateReadStatus(book.title);
    });

    elNewBook.getElementsByClassName('summary-field')[0].textContent = book.summary;

    elNewBook.getElementsByClassName('remove-book-button')[0].addEventListener('click', () => {
        removeBook(book.title);
    })

    // Add the book to the book-shelf
    elBookShelf.appendChild(elNewBook);
}

function updateReadStatus(bookTitle) {
    books[bookTitle].read = books[bookTitle].read == 'true' ? 'false' : 'true';
    
    if (storageAvailable('localStorage')) {
        localStorage.setItem('userLibrary', JSON.stringify(books));
    }
}



