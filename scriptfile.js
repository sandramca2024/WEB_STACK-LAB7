$(document).ready(function () {
    const booksPerPage = 6; // Updated value
    let allBooks = [];
    let filteredBooks = [];
    let currentPage = 1;

    // Fetch Books from JSON File
    function fetchBooks() {
        $.ajax({
            url: 'bookdata.json',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                allBooks = data;
                filteredBooks = allBooks;
                renderBooks();
                renderPagination();
            },
            error: function () {
                showError('Failed to fetch books data. Please try again later.');
            }
        });
    }

    // Render Books to the DOM
    function renderBooks() {
        const booksContainer = $('#books-container');
        booksContainer.empty();

        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

        if (paginatedBooks.length === 0) {
            showError('No books found. Please adjust your search or filters.');
            return;
        }

        hideError();

        paginatedBooks.forEach(book => {
            const bookItem = `
                <div class="book">
                    <img src="${book.coverImage}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>by ${book.author}</p>
                    <p><em>${book.genre}</em> - ${book.year}</p>
                </div>
            `;
            booksContainer.append(bookItem);
        });
    }

    // Render Pagination Buttons
    function renderPagination() {
        const paginationContainer = $('#pagination');
        paginationContainer.empty();

        const pageCount = Math.ceil(filteredBooks.length / booksPerPage);

        if (pageCount <= 1) return;

        for (let i = 1; i <= pageCount; i++) {
            const button = `<button class="${i === currentPage ? 'active' : ''}">${i}</button>`;
            paginationContainer.append(button);
        }
    }

    // Search Books by Title or Author
    function searchBooks(query) {
        query = query.trim().toLowerCase();
        filteredBooks = allBooks.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        );
        currentPage = 1;
        renderBooks();
        renderPagination();
    }

    // Filter Books by Genre
    function filterBooks(genre) {
        filteredBooks = allBooks.filter(book => 
            genre === '' || book.genre === genre
        );
        currentPage = 1;
        renderBooks();
        renderPagination();
    }

    // Sort Books by Title or Year
    function sortBooks(criteria) {
        if (criteria === 'title') {
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
        } else if (criteria === 'year') {
            filteredBooks.sort((a, b) => b.year - a.year);
        }
        currentPage = 1;
        renderBooks();
    }

    // Show Error Message
    function showError(message) {
        $('#error-message').text(message).fadeIn();
        $('#pagination').empty();
    }

    // Hide Error Message
    function hideError() {
        $('#error-message').fadeOut();
    }

    // Event Listeners
    $('#search-input').on('input', function () {
        const query = $(this).val();
        searchBooks(query);
    });

    $('#genre-filter').on('change', function () {
        const selectedGenre = $(this).val();
        filterBooks(selectedGenre);
    });

    $('#sort-options').on('change', function () {
        const sortCriteria = $(this).val();
        sortBooks(sortCriteria);
    });

    $('#pagination').on('click', 'button', function () {
        currentPage = parseInt($(this).text());
        renderBooks();
        renderPagination();
    });

    // Initial Fetch
    fetchBooks();
});
