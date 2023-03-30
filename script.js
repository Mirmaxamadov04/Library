const container = document.querySelector(".container");
const elForm = document.querySelector(".form");
const elHideButton = document.querySelector(".hide-form-button");
const elShowForm = document.querySelector(".book-add");
const elBookList = document.querySelector(".book-list");
const elTemplate = document.getElementById("template").content;
const elBookTitle = document.getElementById("title");
const elBookAuthor = document.getElementById("author");
const elBookPages = document.getElementById("pages");
const elBookLanguage = document.getElementById("language");
const elBookDate = document.getElementById("date");
const elBookStatus = document.getElementById("status");

const bookButton = elTemplate.querySelector(".not-read");
const ReadCountValue = document.querySelector(".read-count");
const unReadCountValue = document.querySelector(".not-read-count");
const BooksCount = document.querySelector(".books-count");

const storedBooks = localStorage.getItem("books");
const Books = storedBooks ? JSON.parse(storedBooks) : [];

let allbooks = Books.length;
let readcount = parseInt(localStorage.getItem("readedBooks")) || 0;
let unreadcount = parseInt(localStorage.getItem("unReadedBooks")) || 0;

function initCounts() {
  ReadCountValue.textContent = readcount;
  unReadCountValue.textContent = unreadcount;
  BooksCount.textContent = allbooks;
}

// Call initCounts when the page is loaded
window.addEventListener("load", initCounts);

const formdisplay = function () {
  elForm.classList.toggle("form-clicked");
  container.classList.toggle("container-clicked");
};

const numOfRead = function () {
  readcount = Books.filter((book) => book.readStatus === "read").length;
  localStorage.setItem("readedBooks", JSON.stringify(readcount));
  ReadCountValue.textContent = readcount;
};

const numOfUnRead = function () {
  unreadcount = Books.filter((book) => book.readStatus === "none-read").length;
  localStorage.setItem("unReadedBooks", JSON.stringify(unreadcount));
  unReadCountValue.textContent = unreadcount;
};

const AddBook = function (array, node) {
  node.innerHTML = null;

  const BooksFagment = document.createDocumentFragment();
  array.forEach((book) => {
    const elTemplateCopy = elTemplate.cloneNode(true);

    const bookTitleValue = elTemplateCopy.querySelector(".book-title");
    const bookAuthorValue = elTemplateCopy.querySelector(".book-author");
    const bookPageValue = elTemplateCopy.querySelector(".book-pages");
    const BookLanguageValue = elTemplateCopy.querySelector(".book-language");
    const BookDateValue = elTemplateCopy.querySelector(".book-date");
    const deleteButton = elTemplateCopy.querySelector("#delete");
    const bookButton = elTemplateCopy.querySelector(".not-read");

    bookTitleValue.textContent = book.title;
    bookAuthorValue.textContent = book.author;
    bookPageValue.textContent = book.page;
    BookLanguageValue.textContent = book.language;
    BookDateValue.textContent = book.date;
    deleteButton.dataset.bookId = book.id;
    bookButton.textContent = book.readStatus;

    if (book.readStatus === "read") {
      bookButton.style.backgroundColor = "green";
    } else {
      bookButton.style.backgroundColor = "red";
    }

    BooksFagment.appendChild(elTemplateCopy);
  });

  node.appendChild(BooksFagment);
};

AddBook(Books, elBookList);

elShowForm.addEventListener("click", formdisplay);
elHideButton.addEventListener("click", formdisplay);

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let readStatusText, readStatusColor;
  if (elBookStatus.value == "read") {
    readStatusText = "read";
    readStatusColor = "green";
  } else {
    readStatusText = "none-read";
    readStatusColor = "red";
  }

  const newBook = {
    title: elBookTitle.value,
    author: elBookAuthor.value,
    page: elBookPages.value,
    language: elBookLanguage.value,
    date: elBookDate.value,
    id: Books[Books.length - 1]?.id + 1 || 0,
    readStatus: elBookStatus.value,
  };

  Books.push(newBook);

  localStorage.setItem("books", JSON.stringify(Books));

  AddBook(Books, elBookList);

  // Update the color of the last book's button
  const lastBookButton = elBookList.lastElementChild.querySelector(".not-read");
  lastBookButton.textContent = readStatusText;
  lastBookButton.style.backgroundColor = readStatusColor;

  allbooks = Books.length;
  localStorage.setItem("allBooks", JSON.stringify(allbooks));
  BooksCount.textContent = allbooks;
  numOfRead();
  numOfUnRead();
  elForm.classList.remove("form-clicked");
  container.classList.remove("container-clicked");

  elBookTitle.value = "";
  elBookAuthor.value = "";
  elBookPages.value = "";
  elBookLanguage.value = "";
  elBookDate.value = "";
  elBookStatus.value = "";
});

elBookList.addEventListener("click", (evt) => {
  evt.preventDefault();

  if (evt.target.matches(".not-read")) {
    const bookElement = evt.target.closest(".book-item");
    const bookId = parseInt(
      bookElement.querySelector("#delete").dataset.bookId
    );
    console.log(Books);
    console.log(bookId);
    console.log(Books[bookId]["readStatus"]);

    console.log(Books[bookId].readStatus);

    if (Books[bookId].readStatus == "none-read") {
      evt.target.textContent = "read";
      Books[bookId].readStatus = "read";
      evt.target.style.backgroundColor = "green";

      localStorage.setItem("books", JSON.stringify(Books));

      AddBook(Books, elBookList);
      numOfRead();
      numOfUnRead();
    } else if (Books[bookId].readStatus == "read") {
      evt.target.textContent = "none-read";
      Books[bookId].readStatus = "none-read";
      evt.target.style.backgroundColor = "red";

      localStorage.setItem("books", JSON.stringify(Books));

      AddBook(Books, elBookList);
      numOfRead();
      numOfUnRead();
    }
  } else if (evt.target.matches("#delete")) {
    const bookId = parseInt(evt.target.dataset.bookId);
    const bookIndex = Books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      Books.splice(bookIndex, 1);

      for (let i = bookIndex; i < Books.length; i++) {
        Books[i].id--;
      }
      localStorage.setItem("books", JSON.stringify(Books));
      AddBook(Books, elBookList);
    }

    numOfRead();
    numOfUnRead();

    allbooks = Books.length;
    localStorage.setItem("allBooks", JSON.stringify(allbooks));
    BooksCount.textContent = allbooks;
  }
});

window.addEventListener("load", AddBook(Books, elBookList));

numOfRead();
numOfUnRead();
