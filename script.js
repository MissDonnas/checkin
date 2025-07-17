
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database service
const database = firebase.database();
// Get a reference to the 'students' node in your database
const studentsRef = database.ref('students');

// =======================================================
// STEP 2: DOM Element References
// =======================================================
const studentListDiv = document.getElementById('student-list');
const addStudentButton = document.getElementById('addStudentButton');
const addStudentForm = document.getElementById('addStudentForm');
const newStudentNameInput = document.getElementById('newStudentName');
const submitNewStudentButton = document.getElementById('submitNewStudent');
const cancelAddStudentButton = document.getElementById('cancelAddStudent');

// =======================================================
// STEP 3: Event Listeners for Adding New Students
// =======================================================

addStudentButton.addEventListener('click', () => {
    addStudentForm.classList.remove('hidden'); // Show the form
    addStudentButton.style.display = 'none'; // Hide the add button
});

cancelAddStudentButton.addEventListener('click', () => {
    addStudentForm.classList.add('hidden'); // Hide the form
    addStudentButton.style.display = 'block'; // Show the add button
    newStudentNameInput.value = ''; // Clear input
});

submitNewStudentButton.addEventListener('click', async () => {
    const studentName = newStudentNameInput.value.trim();
    if (studentName) {
        try {
            // Generate a unique key for the new student
            const newStudentRef = studentsRef.push();
            await newStudentRef.set({
                name: studentName,
                lastCheckIn: null,
                lastCheckOut: null
            });
            console.log(`Added new student: ${studentName}`);
            newStudentNameInput.value = ''; // Clear input field
            addStudentForm.classList.add('hidden'); // Hide the form
            addStudentButton.style.display = 'block'; // Show the add button
        } catch (error) {
            console.error("Error adding new student:", error);
            alert("Failed to add student. Check console for details.");
        }
    } else {
        alert("Student name cannot be empty!");
    }
});

// =======================================================
// STEP 4: Realtime Data Loading and Display
// This function runs every time the 'students' data changes in Firebase
// =======================================================
studentsRef.on('value', (snapshot) => {
    const studentsData = snapshot.val(); // Get all students data as an object
    studentListDiv.innerHTML = ''; // Clear current list to re-render

    if (studentsData) {
        // Convert the object of students into an array for easier sorting
        // and iterate through it.
        // Object.entries returns [key, value] pairs, e.g., ["-MiL_...", {name: "Alice", ...}]
        const studentEntries = Object.entries(studentsData);

        // Sort students alphabetically by name
        studentEntries.sort((a, b) => {
            const nameA = a[1].name.toLowerCase();
            const nameB = b[1].name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });

        if (studentEntries.length === 0) {
             studentListDiv.innerHTML = '<p>No students added yet. Click "Add New Student" to begin!</p>';
             return;
        }


        studentEntries.forEach(([studentId, student]) => {
            const studentItem = document.createElement('div');
            studentItem.classList.add('student-item');

            const lastCheckIn = student.lastCheckIn ? new Date(student.lastCheckIn).toLocaleString() : 'N/A';
            const lastCheckOut = student.lastCheckOut ? new Date(student.lastCheckOut).toLocaleString() : 'N/A';

            studentItem.innerHTML = `
                <h3>${student.name}</h3>
                <div class="status-info">
                    <p>Last Check In: <strong>${lastCheckIn}</strong></p>
                    <p>Last Check Out: <strong>${lastCheckOut}</strong></p>
                </div>
                <div class="buttons">
                    <button class="check-in" data-id="${studentId}">Check In</button>
                    <button class="check-out" data-id="${studentId}">Check Out</button>
                    <button class="delete-student" data-id="${studentId}">Delete</button>
                </div>
            `;
            studentListDiv.appendChild(studentItem);
        });

        // After rendering, attach event listeners to new buttons
        attachButtonListeners();

    } else {
        studentListDiv.innerHTML = '<p>No students added yet. Click "Add New Student" to begin!</p>';
    }
});

// =======================================================
// STEP 5: Attach Event Listeners to Dynamically Created Buttons
// =======================================================
function attachButtonListeners() {
    // Attach check-in listeners
    document.querySelectorAll('.check-in').forEach(button => {
        button.onclick = () => checkIn(button.dataset.id);
    });

    // Attach check-out listeners
    document.querySelectorAll('.check-out').forEach(button => {
        button.onclick = () => checkOut(button.dataset.id);
    });

    // Attach delete listeners
    document.querySelectorAll('.delete-student').forEach(button => {
        button.onclick = () => deleteStudent(button.dataset.id, button.closest('.student-item').querySelector('h3').textContent);
    });
}

// =======================================================
// STEP 6: Core Check-in / Check-out / Delete Functions
// =======================================================

async function checkIn(studentId) {
    const timestamp = new Date().toISOString(); // ISO string format (e.g., "2025-07-16T22:05:00.000Z")
    const studentRef = studentsRef.child(studentId); // Reference to specific student

    try {
        // Update lastCheckIn
        await studentRef.child('lastCheckIn').set(timestamp);

        // Add to a list of all check-ins for this student
        // 'push()' generates a unique key for each new entry
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
        // Update lastCheckOut
        await studentRef.child('lastCheckOut').set(timestamp);

        // Add to a list of all check-outs for this student
        await studentRef.child('checkOuts').push(timestamp);
        console.log(`Checked out student ${studentId} at ${timestamp}`);
    } catch (error) {
        console.error("Error checking out:", error);
        alert("Failed to check out. Please try again.");
    }
}

async function deleteStudent(studentId, studentName) {
    if (confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
        try {
            await studentsRef.child(studentId).remove();
            console.log(`Deleted student: ${studentName} (${studentId})`);
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Failed to delete student. Check console for details.");
        }
    }
}
