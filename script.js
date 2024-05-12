// script.js

function register() {
    // Your existing code for creating an account
    var nickname = document.getElementById("nickname").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Store user account information in localStorage
    var user = {
        nickname: nickname,
        email: email,
        password: password
    };
    localStorage.setItem(email, JSON.stringify(user));

    // Redirect to login page
    window.location.href = "login.html";
}

function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Check if it's the master account
    if (username === "Ivan" && password === "camaya2024") { // Updated master account credentials
        // Set the signed-in user as the master account
        localStorage.setItem("currentUser", "Ivan");
        // Redirect to dashboard
        window.location.href = "dashboard.html";
        return;
    }

    // Check if user exists in localStorage
    var user = JSON.parse(localStorage.getItem(username));
    if (user && user.password === password) {
        // Set the signed-in user
        localStorage.setItem("currentUser", user.nickname);
        // Redirect to dashboard
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid username or password!");
    }
}


function confirmBook() {
    var bookCode = document.getElementById("book-code").value;
    var bookDetails = "";

    // Retrieve book details based on code
switch (bookCode) {
    case "0-001":
        bookDetails = "Romeo and Juliet";
        break;
    case "0-002":
        bookDetails = "Harry Potter";
        break;
    case "0-003":
        bookDetails = "Lord of the Rings";
        break;
    case "0-004":
        bookDetails = "To Kill a Mockingbird";
        break;
    case "0-005":
        bookDetails = "General Biology";
        break;
    case "0-006":
        bookDetails = "Game of Thrones";
        break;
    case "0-007":
        bookDetails = "He's Into Her";
        break;
    case "0-008":
        bookDetails = "General Physics for Grade 12";
        break;
    default:
        alert("Invalid book code!");
        return;
}

// Display book details
document.getElementById("book-details").innerText = bookDetails;

}

function confirmBorrow() {
    var duration = document.getElementById("duration").value;
    var dueDate;
    switch (duration) {
        case "1":
            dueDate = getDueDate(1);
            break;
        case "3":
            dueDate = getDueDate(3);
            break;
        case "7":
            dueDate = getDueDate(7);
            break;
    }
    // Save borrowed book and due date in localStorage
    var currentUser = localStorage.getItem("currentUser");
    var borrowedBooks = JSON.parse(localStorage.getItem(currentUser + "-books")) || [];
    var bookDetails = document.getElementById("book-details").innerText;
    borrowedBooks.push({ title: bookDetails, dueDate: dueDate });
    localStorage.setItem(currentUser + "-books", JSON.stringify(borrowedBooks));

    // Redirect to borrowing successful page
    window.location.href = "borrow-success.html";
}

function getDueDate(days) {
    var currentDate = new Date();
    var dueDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
    return dueDate.toDateString();
}

function logout() {
    // Clear local storage and redirect to login page
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// script.js
// Function to handle scanning a book
function scanBook() {
    // Prompt the user for camera access
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(function(stream) {
            // Access granted, show the camera stream
            var videoElement = document.createElement('video');
            videoElement.id = 'camera'; // Set ID for styling
            videoElement.srcObject = stream;
            videoElement.setAttribute('autoplay', true);
            videoElement.setAttribute('playsinline', true);
            document.body.appendChild(videoElement);

            // Check if QR code scanning is supported
            if ('BarcodeDetector' in window) {
                var barcodeDetector = new BarcodeDetector();
                barcodeDetector.detect(videoElement)
                    .then(function(barcodes) {
                        if (barcodes.length > 0) {
                            // QR code detected, handle it here
                            console.log('QR code detected:', barcodes[0].rawValue);
                            // Show scanned successfully message
                            showScannedMessage();
                        }
                    })
                    .catch(function(error) {
                        console.error('Error detecting barcode:', error);
                    });
            }
        })
        .catch(function(error) {
            console.error('Error accessing camera:', error);
            alert('Failed to access camera. Please check your camera settings and try again.');
        });
}

// Function to show "Scanned successfully" message
function showScannedMessage() {
    // Remove the camera element
    var cameraElement = document.getElementById('camera');
    if (cameraElement) {
        cameraElement.remove();
    }
    // Create and display the success message
    var successMessage = document.createElement('div');
    successMessage.textContent = 'Scanned successfully';
    successMessage.style.position = 'fixed';
    successMessage.style.bottom = '1rem';
    successMessage.style.right = '1rem';
    successMessage.style.backgroundColor = 'green';
    successMessage.style.color = 'white';
    successMessage.style.padding = '0.5rem 1rem';
    successMessage.style.borderRadius = '0.5rem';
    document.body.appendChild(successMessage);
}
// Function to simulate scanning the book and adding a record to the dashboard
function simulateScanAndAddRecord() {
    // List of available books
    var books = [
        "Romeo and Juliet",
        "The Lord of the Rings",
        "Game of Thrones",
        "Harry Potter",
        "He's Into Her",
        "To Kill a Mockingbird",
        "General Physics for Grade 12",
        "General Biology"
    ];

    // Randomly select a book
    var randomBook = books[Math.floor(Math.random() * books.length)];

    // Get today's date
    var currentDate = new Date();

    // Randomly generate a due date between 1 to 7 days from today
    var dueDate = new Date(currentDate.getTime() + (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000);

    // Add the record to the dashboard
    var currentUser = localStorage.getItem("currentUser");
    var borrowedBooks = JSON.parse(localStorage.getItem(currentUser + "-books")) || [];
    borrowedBooks.push({ title: randomBook, dueDate: dueDate.toDateString() }); // Convert due date to string
    localStorage.setItem(currentUser + "-books", JSON.stringify(borrowedBooks));

    // Redirect to scanned successfully page
    window.location.href = "scanned-successfully.html";
}
// script.js

// Update the dashboard with user's nickname and borrowed books' due dates
var currentUser = localStorage.getItem("currentUser");
document.getElementById("nickname").textContent = currentUser || "Guest"; // Display "Guest" if no user is logged in