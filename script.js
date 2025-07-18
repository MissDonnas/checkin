const firebaseConfig = {
  apiKey: "AIzaSyBrK1aMhBv3SL-slt1AN0XaYszc2fsPzQ",
  authDomain: "attendance-6abf9.firebaseapp.com",
  databaseURL: "https://attendance-6abf9-default-rtdb.firebaseio.com",
  projectId: "attendance-6abf9",
  storageBucket: "attendance-6abf9.firebasestorage.app",
  messagingSenderId: "557254925412",
  appId: "1:557254925412:web:3c31d0a9e07a6477db5371"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const studentsRef = database.ref('students');

// Function to format timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust formatting as needed
}

// Function to update a student's status in the database
function updateStudentStatus(studentId, statusType) {
    const timestamp = Date.now(); // Current timestamp
    const updates = {};
    updates[`/${studentId}/${statusType}`] = timestamp;
    if (statusType === 'lastCheckIn') {
        updates[`/${studentId}/checkedIn`] = true;
    } else if (statusType === 'lastCheckOut') {
        updates[`/${studentId}/checkedIn`] = false;
    }
    database.ref('students').update(updates)
        .then(() => {
            console.log(`${studentId} ${statusType} updated successfully.`);
            // No need to update UI here, Firebase listener will handle it
        })
        .catch(error => {
            console.error(`Error updating ${studentId} ${statusType}:`, error);
        });
}

// Function to reset all student data
function resetAllData() {
    if (confirm('Are you sure you want to reset all student check-in/out data? This action cannot be undone.')) {
        database.ref('students').remove()
            .then(() => {
                console.log('All student data reset successfully.');
                // Visual feedback that data is cleared
                document.querySelectorAll('.student-item').forEach(item => {
                    item.classList.remove('checked-in', 'checked-out', 'sunscreen-applied');
                    item.querySelector(`[id$="-lastCheckIn"]`).textContent = 'N/A';
                    item.querySelector(`[id$="-lastCheckOut"]`).textContent = 'N/A';
                    item.querySelector(`[id$="-lastSunscreen"]`).textContent = 'N/A';
                });
                updateStatusBar(); // Update status bar after reset
            })
            .catch(error => {
                console.error('Error resetting all data:', error);
                alert('Error resetting data. Please try again.');
            });
    }
}

// Function to update the status bar
function updateStatusBar() {
    const studentItems = document.querySelectorAll('.student-item');
    let totalStudents = 0;
    let studentsPresent = 0;

    studentItems.forEach(item => {
        // Only count visible students for the status bar
        if (item.style.display !== 'none') {
            totalStudents++;
            if (item.classList.contains('checked-in') && !item.classList.contains('checked-out')) {
                studentsPresent++;
            }
        }
    });

    const studentsAbsent = totalStudents - studentsPresent;

    document.getElementById('totalStudentsCount').textContent = totalStudents;
    document.getElementById('studentsPresentCount').textContent = studentsPresent;
    document.getElementById('studentsAbsentCount').textContent = studentsAbsent;
}


// --- Function to display current date ---
function displayCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString(undefined, options);
    }
}


// Function to filter student cards based on search input
function filterStudentCards() {
    const searchInput = document.getElementById('studentSearch');
    if (!searchInput) return; // Exit if search input not found

    const filter = searchInput.value.toLowerCase();
    const studentList = document.getElementById('student-list');
    const studentItems = studentList.querySelectorAll('.student-item');

    studentItems.forEach(item => {
        const studentName = item.querySelector('h3').textContent.toLowerCase();
        if (studentName.includes(filter)) {
            item.style.display = ''; // Show the element
        } else {
            item.style.display = 'none'; // Hide the element
        }
    });
    updateStatusBar(); // Update status bar after filtering
}


// Listen for changes in Firebase database
studentsRef.on('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const studentId = childSnapshot.key;
        const studentData = childSnapshot.val();

        const studentItem = document.querySelector(`.student-item[data-id="${studentId}"]`);

        if (studentItem) {
            // Update last check-in/out/sunscreen times
            const lastCheckInEl = studentItem.querySelector(`[id="${studentId}-lastCheckIn"]`);
            if (lastCheckInEl) lastCheckInEl.textContent = formatTimestamp(studentData.lastCheckIn);

            const lastCheckOutEl = studentItem.querySelector(`[id="${studentId}-lastCheckOut"]`);
            if (lastCheckOutEl) lastCheckOutEl.textContent = formatTimestamp(studentData.lastCheckOut);

            const lastSunscreenEl = studentItem.querySelector(`[id="${studentId}-lastSunscreen"]`);
            if (lastSunscreenEl) lastSunscreenEl.textContent = formatTimestamp(studentData.lastSunscreen);

            // Update status classes
            studentItem.classList.remove('checked-in', 'checked-out', 'sunscreen-applied');

            if (studentData.lastCheckIn && (!studentData.lastCheckOut || studentData.lastCheckIn > studentData.lastCheckOut)) {
                studentItem.classList.add('checked-in');
            } else if (studentData.lastCheckOut) {
                studentItem.classList.add('checked-out');
            }

            if (studentData.lastSunscreen) {
                studentItem.classList.add('sunscreen-applied');
            }
        }
    });
    updateStatusBar(); // Update status bar after Firebase data sync
});


// DOM Content Loaded - Main setup
document.addEventListener('DOMContentLoaded', () => {
    // Call to display the current date when the page loads
    displayCurrentDate();

    // Event listeners for check-in/out/sunscreen buttons
    document.querySelectorAll('.check-in-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const studentId = event.target.dataset.id;
            updateStudentStatus(studentId, 'lastCheckIn');
        });
    });

    document.querySelectorAll('.check-out-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const studentId = event.target.dataset.id;
            updateStudentStatus(studentId, 'lastCheckOut');
        });
    });

    document.querySelectorAll('.sunscreen-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const studentId = event.target.dataset.id;
            updateStudentStatus(studentId, 'lastSunscreen');
        });
    });

    // Event listener for Reset All button
    const resetAllButton = document.getElementById('resetAllButton');
    if (resetAllButton) {
        resetAllButton.addEventListener('click', resetAllData);
    }

    // Event listener for Save as PDF button
    const savePdfButton = document.getElementById('savePdfButton');
    if (savePdfButton) {
        savePdfButton.addEventListener('click', () => {
            const studentListElement = document.getElementById('student-list');
            // Temporarily make hidden items visible for PDF, then hide again
            const hiddenItems = [];
            studentListElement.querySelectorAll('.student-item').forEach(item => {
                if (item.style.display === 'none') {
                    item.style.display = ''; // Make visible
                    hiddenItems.push(item);
                }
            });

            html2canvas(document.querySelector('.container'), {
                scale: 2, // Increase scale for better quality
                useCORS: true // Important for external images if any, though not likely here
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'pt', 'letter'); // 'p' for portrait, 'pt' for points, 'letter' for paper size

                const imgWidth = 612; // Letter width in points
                const pageHeight = 792; // Letter height in points
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save("student_attendance.pdf");

                // Re-hide the items that were temporarily made visible
                hiddenItems.forEach(item => {
                    item.style.display = 'none';
                });
            }).catch(error => {
                console.error("Error generating PDF:", error);
                alert("Failed to generate PDF. Please try again.");
            });
        });
    }

    // Event listener for search input
    const studentSearchInput = document.getElementById('studentSearch');
    if (studentSearchInput) {
        studentSearchInput.addEventListener('keyup', () => {
            filterStudentCards();
            updateStatusBar(); // Update status bar after filtering
        });
    }

    // Call this initially to populate status bar on load (after Firebase data might have loaded)
    // The Firebase listener also calls updateStatusBar, so this might be redundant if data loads fast,
    // but it ensures it's called even if no initial Firebase data is present.
    updateStatusBar();
});
