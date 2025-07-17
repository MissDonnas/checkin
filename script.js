
const firebaseConfig = {
  apiKey: "AIzaSyBrK1aMhBv3SL-slt1ANo0XaYszc2fsPzQ",
  authDomain: "attendance-6abf9.firebaseapp.com",
  databaseURL: "https://attendance-6abf9-default-rtdb.firebaseio.com",
  projectId: "attendance-6abf9",
  storageBucket: "attendance-6abf9.firebasestorage.app",
  messagingSenderId: "557254925412",
  appId: "1:557254925412:web:3c31d0a9e07a6477db5371"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// =======================================================
// STEP 2: Realtime Data Loading and Display (Updates existing elements)
// This function runs every time the 'students' data changes in Firebase
// =======================================================
studentsRef.on('value', (snapshot) => {
    const studentsData = snapshot.val(); // Get all students data as an object

    if (studentsData) {
        // Iterate through each student in the data received from Firebase
        Object.entries(studentsData).forEach(([studentId, student]) => {
            // Find the elements for this specific student in your HTML
            const lastCheckInElement = document.getElementById(`${studentId}-lastCheckIn`);
            const lastCheckOutElement = document.getElementById(`${studentId}-lastCheckOut`);

            if (lastCheckInElement && lastCheckOutElement) { // Ensure elements exist before updating
                const lastCheckIn = student.lastCheckIn ? new Date(student.lastCheckIn).toLocaleString() : 'N/A';
                const lastCheckOut = student.lastCheckOut ? new Date(student.lastCheckOut).toLocaleString() : 'N/A';

                lastCheckInElement.textContent = lastCheckIn;
                lastCheckOutElement.textContent = lastCheckOut;
            } else {
                console.warn(`HTML elements for student ID "${studentId}" not found. Make sure data-id matches and IDs are correctly formatted in index.html.`);
            }
        });
    } else {
        console.log("No student data in Firebase yet.");
        // Optionally, reset all displayed times to N/A if database is empty
        document.querySelectorAll('.status-info strong').forEach(el => el.textContent = 'N/A');
    }
});


// =======================================================
// STEP 3: Attach Event Listeners to Buttons
// This runs once when the page loads to attach listeners to all check-in/out buttons
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // Attach check-in listeners
    document.querySelectorAll('.check-in-btn').forEach(button => {
        button.addEventListener('click', () => checkIn(button.dataset.id));
    });

    // Attach check-out listeners
    document.querySelectorAll('.check-out-btn').forEach(button => {
        button.addEventListener('click', () => checkOut(button.dataset.id));
    });
});


// =======================================================
// STEP 4: Core Check-in / Check-out Functions
// =======================================================

async function checkIn(studentId) {
    const timestamp = new Date().toISOString(); // ISO string format (e.g., "2025-07-16T22:05:00.000Z")
    const studentRef = studentsRef.child(studentId); // Reference to specific student's data

    try {
        // Update lastCheckIn property directly on the student object
        await studentRef.child('lastCheckIn').set(timestamp);

        // Add to a list of all check-ins for this student (under 'checkIns' node)
        // 'push()' generates a unique key for each new entry to prevent overwrites
        await studentRef.child('checkIns').push(timestamp);
        console.log(`Checked in student ${studentId} at ${timestamp}`);
    } catch (error) {
        console.error("Error checking in:", error);
        alert("Failed to check in. Please try again.");
    }
}

async function checkOut(studentId) {
    const timestamp = new Date().toISOString();
    const studentRef = studentsRef.child(studentId);

    try {
        // Update lastCheckOut property directly on the student object
        await studentRef.child('lastCheckOut').set(timestamp);

        // Add to a list of all check-outs for this student (under 'checkOuts' node)
        await studentRef.child('checkOuts').push(timestamp);
        console.log(`Checked out student ${studentId} at ${timestamp}`);
    } catch (error) {
        console.error("Error checking out:", error);
        alert("Failed to check out. Please try again.");
    }
}
