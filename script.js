
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
const database = firebase.database(); // Should be firebase.database()
const studentsRef = database.ref('students');

// =======================================================
// STEP 2: DOM Element References
// =======================================================
const savePdfButton = document.getElementById('savePdfButton');
const resetAllButton = document.getElementById('resetAllButton');
const studentListContainer = document.getElementById('student-list');
const noStudentsMessage = document.getElementById('noStudentsMessage');

// Status Bar Elements
const totalStudentsCount = document.getElementById('totalStudentsCount');
const studentsPresentCount = document.getElementById('studentsPresentCount');
const studentsAbsentCount = document.getElementById('studentsAbsentCount');


// =======================================================
// STEP 3: Function to Create a Student HTML Element
// This function generates the HTML structure for a single student card
// =======================================================
function createStudentHtml(studentId, student) {
    const lastCheckIn = student.lastCheckIn ? new Date(student.lastCheckIn).toLocaleString() : 'N/A';
    const lastCheckOut = student.lastCheckOut ? new Date(student.lastCheckOut).toLocaleString() : 'N/A';
    const lastSunscreen = student.lastSunscreen ? new Date(student.lastSunscreen).toLocaleString() : 'N/A';

    const studentItemDiv = document.createElement('div');
    studentItemDiv.className = 'student-item';
    studentItemDiv.setAttribute('data-id', studentId);

    studentItemDiv.innerHTML = `
        <h3>${student.name}</h3>
        <div class="status-info">
            <p>Last Check In: <strong id="${studentId}-lastCheckIn">${lastCheckIn}</strong></p>
            <p>Last Check Out: <strong id="${studentId}-lastCheckOut">${lastCheckOut}</strong></p>
            <p>Last Sunscreen: <strong id="${studentId}-lastSunscreen">${lastSunscreen}</strong></p>
        </div>
        <div class="buttons">
            <button class="check-in-btn" data-id="${studentId}">Check In</button>
            <button class="check-out-btn" data-id="${studentId}">Check Out</button>
            <button class="sunscreen-btn" data-id="${studentId}">Sunscreen</button>
        </div>
    `;
    return studentItemDiv;
}


// =======================================================
// STEP 4: Realtime Data Loading and Display (Main Logic - NO DAYS FILTERING)
// This function runs every time the 'students' data changes in Firebase.
// It now displays ALL students.
// =======================================================
studentsRef.on('value', (snapshot) => {
    const allStudentsData = snapshot.val(); // Get ALL students data from Firebase

    // Clear any previously rendered students from the HTML display
    studentListContainer.innerHTML = '';

    // Initialize counts for the status bar
    let totalStudentsDisplayed = 0;
    let presentStudents = 0;
    let absentStudents = 0;

    if (allStudentsData) {
        // Iterate through each student in the data received from Firebase
        Object.entries(allStudentsData).forEach(([studentId, student]) => {
            // *** Removed daysAvailable filtering logic ***

            totalStudentsDisplayed++; // Increment count for EVERY student found

            // Create the HTML element for this student and add it to the page
            const studentElement = createStudentHtml(studentId, student);
            studentListContainer.appendChild(studentElement);

            // Determine student status for the status bar
            const checkInTime = student.lastCheckIn ? new Date(student.lastCheckIn).getTime() : 0;
            const checkOutTime = student.lastCheckOut ? new Date(student.lastCheckOut).getTime() : 0;

            if (checkInTime > 0 && (checkOutTime === 0 || checkInTime > checkOutTime)) {
                presentStudents++;
            } else {
                absentStudents++;
            }
        });
    }

    // Update the text content of the status bar elements
    totalStudentsCount.textContent = totalStudentsDisplayed;
    studentsPresentCount.textContent = presentStudents;
    studentsAbsentCount.textContent = absentStudents;

    // Show/hide the "No students found" message
    if (totalStudentsDisplayed === 0) {
        noStudentsMessage.style.display = 'block'; // Make the message visible
    } else {
        noStudentsMessage.style.display = 'none'; // Hide the message
        // IMPORTANT: Re-attach event listeners to buttons after they are dynamically added to the page
        attachButtonListeners();
    }
});


// =======================================================
// STEP 5: Function to Attach Event Listeners to ALL Student Buttons
// This function must be called AFTER students are rendered in the HTML
// =======================================================
function attachButtonListeners() {
    document.querySelectorAll('.check-in-btn').forEach(button => {
        button.onclick = null;
        button.onclick = () => checkIn(button.dataset.id);
    });

    document.querySelectorAll('.check-out-btn').forEach(button => {
        button.onclick = null;
        button.onclick = () => checkOut(button.dataset.id);
    });

    document.querySelectorAll('.sunscreen-btn').forEach(button => {
        button.onclick = null;
        button.onclick = () => checkSunscreen(button.dataset.id);
    });
}


// =======================================================
// STEP 6: Initial Global Button Event Listeners (PDF, Reset)
// These listeners attach once on page load
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    savePdfButton.addEventListener('click', saveAsPdf);
    resetAllButton.addEventListener('click', resetAllData);
    // TEMPORARY BUTTON LISTENER REMOVED: createStudentsNodeButton.addEventListener('click', createStudentsRootNode);
});


// =======================================================
// STEP 7: Core Check-in / Check-out / Sunscreen Functions
// =======================================================

async function checkIn(studentId) {
    const timestamp = new Date().toISOString();
    const studentRef = studentsRef.child(studentId);

    try {
        await studentRef.child('lastCheckIn').set(timestamp);
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
        await studentRef.child('lastCheckOut').set(timestamp);
        await studentRef.child('checkOuts').push(timestamp);
        console.log(`Checked out student ${studentId} at ${timestamp}`);
    } catch (error) {
        console.error("Error checking out:", error);
        alert("Failed to check out. Please try again.");
    }
}

async function checkSunscreen(studentId) {
    const timestamp = new Date().toISOString();
    const studentRef = studentsRef.child(studentId);

    try {
        await studentRef.child('lastSunscreen').set(timestamp);
        await studentRef.child('sunscreenApplications').push(timestamp);
        console.log(`Sunscreen applied for ${studentId} at ${timestamp}`);
    } catch (error) {
        console.error("Error applying sunscreen:", error);
        alert("Failed to record sunscreen. Please try again.");
    }
}


// =======================================================
// STEP 8: Save as PDF Function
// =======================================================
async function saveAsPdf() {
    const element = document.getElementById('student-list');
    const filename = `Student_Attendance_${new Date().toLocaleDateString()}.pdf`;

    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        console.error("jsPDF library not loaded. Check script tag for jspdf.umd.min.js.");
        alert("PDF generation failed: Library not loaded. Check browser console.");
        return;
    }

    const buttons = document.querySelectorAll('.student-item .buttons');
    buttons.forEach(btnContainer => btnContainer.style.display = 'none');

    try {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

        let heightLeft = imgHeight - pdf.internal.pageSize.getHeight();
        let pageHeight = pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(filename);
        console.log(`PDF saved: ${filename}`);

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please check the console for details.");
    } finally {
        buttons.forEach(btnContainer => btnContainer.style.display = 'flex');
    }
}


// =======================================================
// STEP 9: Reset All Data Function
// =======================================================
async function resetAllData() {
    if (!confirm("Are you sure you want to RESET ALL ATTENDANCE DATA? This action cannot be undone.")) {
        return;
    }

    if (!confirm("Seriously? This will clear ALL check-in, check-out, and sunscreen times for ALL students. Confirm again.")) {
        return;
    }

    try {
        const snapshot = await studentsRef.once('value');
        const studentsData = snapshot.val();

        if (studentsData) {
            const updates = {};
            Object.keys(studentsData).forEach(studentId => {
                updates[`${studentId}/lastCheckIn`] = null;
                updates[`${studentId}/lastCheckOut`] = null;
                updates[`${studentId}/lastSunscreen`] = null;
                updates[`${studentId}/checkIns`] = {};
                updates[`${studentId}/checkOuts`] = {};
                updates[`${studentId}/sunscreenApplications`] = {};
            });
            await studentsRef.update(updates);
            console.log("All attendance data has been reset.");
            alert("All attendance data has been reset!");
        } else {
            console.log("No students found to reset data for.");
            alert("No student data found to reset.");
        }

    } catch (error) {
        console.error("Error resetting all data:", error);
        alert("Failed to reset data. Please check console for details.");
    }
}
