const STORAGE_KEY = "BOOKSHELF_APP";
const bookForm = document.getElementById("bookForm");
const searchForm = document.getElementById("searchBook");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function renderBooks(searchQuery = "") {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";
  books
    .filter((book) => (searchQuery ? book.title.toLowerCase().includes(searchQuery.toLowerCase()) : true))
    .forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
}

function createBookElement({ id, title, author, year, isComplete }) {
  const bookElement = document.createElement("div");
  bookElement.setAttribute("data-bookid", id);
  bookElement.setAttribute("data-testid", "bookItem");
  bookElement.className = "book-item";
  bookElement.innerHTML = `
    <h3 data-testid="bookItemTitle">${title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${author}</p>
    <p data-testid="bookItemYear">Tahun: ${year}</p>
    <div>
      <button class="toggle" data-testid="bookItemIsCompleteButton">
        ${isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
      </button>
      <button class="delete" data-testid="bookItemDeleteButton">Hapus Buku</button>
      <button class="edit" data-testid="bookItemEditButton">Edit Buku</button>
    </div>
  `;

  bookElement.querySelector(".toggle").addEventListener("click", () => toggleBook(id));
  bookElement.querySelector(".delete").addEventListener("click", () => deleteBook(id));
  bookElement.querySelector(".edit").addEventListener("click", () => editBook(id));

  return bookElement;
}

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;
  const newBook = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };
  books.push(newBook);
  saveBooks();
  renderBooks();
  bookForm.reset();
});

function toggleBook(id) {
  const book = books.find((book) => book.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks();
    renderBooks();
  }
}

function deleteBook(id) {
  books = books.filter((book) => book.id !== id);
  saveBooks();
  renderBooks();
}

function editBook(id) {
  const book = books.find((book) => book.id === id);
  if (book) {
    const title = prompt("Edit Judul", book.title);
    const author = prompt("Edit Penulis", book.author);
    const year = prompt("Edit Tahun", book.year);

    if (title && author && year) {
      book.title = title;
      book.author = author;
      book.year = Number(year);
      saveBooks();
      renderBooks();
    }
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.getElementById("searchBookTitle").value;
  renderBooks(query);
});

renderBooks();
