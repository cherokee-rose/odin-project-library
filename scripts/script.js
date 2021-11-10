let myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function info() {
    return this.title + ' by ' + this.author + ', ' + this.pages + ' pages, ' + (this.read ? 'read' : 'not read yet');
};

function addBookToLibrary() {
    // do stuff here
  }

