
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
const studentListContainer = document.getElementById('student-list'); // Reference to the empty container
const noStudentsMessage = document.getElementById('noStudentsMessage'); // Reference to the message

// Status Bar Elements
const totalStudentsCount = document.getElementById('totalStudentsCount');
const studentsPresentCount = document.getElementById('studentsPresentCount');
const studentsAbsentCount = document.getElementById('studentsAbsentCount');


// =======================================================
// STEP 3: Helper Function to Get Current Day of Week
// Returns a string like "Monday", "Tuesday", etc.
// =======================================================
function getCurrentDayOfWeek() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date(); // Gets the current date and time
    return days[today.getDay()]; // getDay() returns 0 for Sunday, 1 for Monday, etc.
}

// =======================================================
// STEP 4: Function to Create a Student HTML Element
// This function generates the HTML structure for a single student card
// =======================================================
function createStudentHtml(studentId, student) {
    // Format timestamps for display, or show 'N/A' if not present
    const lastCheckIn = student.lastCheckIn ? new Date(student.lastCheckIn).toLocaleString() : 'N/A';
    const lastCheckOut = student.lastCheckOut ? new Date(student.lastCheckOut).toLocaleString() : 'N/A';
    const lastSunscreen = student.lastSunscreen ? new Date(student.lastSunscreen).toLocaleString() : 'N/A';

    // Create the main div for the student item
    const studentItemDiv = document.createElement('div');
    studentItemDiv.className = 'student-item';
    studentItemDiv.setAttribute('data-id', studentId); // Important for linking to data

    // Set the inner HTML of the student item using a template literal
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
    return studentItemDiv; // Return the created HTML element
}


// =======================================================
// STEP 5: Realtime Data Loading, Filtering, and Display (Main Logic)
// This function runs every time the 'students' data changes in Firebase.
// It now filters students by the current day.
// =======================================================
studentsRef.on('value', (snapshot) => {
    const allStudentsData = snapshot.val(); // Get ALL students data from Firebase
    const currentDay = getCurrentDayOfWeek(); // Get today's day (e.g., "Thursday")

    // Clear any previously rendered students from the HTML display
    studentListContainer.innerHTML = '';
    
    // Initialize counts for the status bar
    let totalStudentsDisplayed = 0;
    let presentStudents = 0;
    let absentStudents = 0;

    if (allStudentsData) {
        // Iterate through each student in the data received from Firebase
        Object.entries(allStudentsData).forEach(([studentId, student]) => {
            // Check if the student has a 'daysAvailable' array and if it includes the current day
            const isAvailableToday = student.daysAvailable && student.daysAvailable.includes(currentDay);

            if (isAvailableToday) {
                totalStudentsDisplayed++; // Increment count only for students displayed today

                // Create the HTML element for this student and add it to the page
                const studentElement = createStudentHtml(studentId, student);
                studentListContainer.appendChild(studentElement);

                // Determine student status for the status bar
                const checkInTime = student.lastCheckIn ? new Date(student.lastCheckIn).getTime() : 0;
                const checkOutTime = student.lastCheckOut ? new Date(student.lastCheckOut).getTime() : 0;

                // Logic: A student is 'Present' if they have checked in AND their last check-in
                // is more recent than their last check-out (or they haven't checked out yet).
                if (checkInTime > 0 && (checkOutTime === 0 || checkInTime > checkOutTime)) {
                    presentStudents++;
                } else {
                    absentStudents++;
                }
            }
        });
    }

    // Update the text content of the status bar elements
    totalStudentsCount.textContent = totalStudentsDisplayed;
    studentsPresentCount.textContent = presentStudents;
    studentsAbsentCount.textContent = absentStudents;

    // Show/hide the "No students for today" message
    if (totalStudentsDisplayed === 0) {
        noStudentsMessage.style.display = 'block'; // Make the message visible
    } else {
        noStudentsMessage.style.display = 'none'; // Hide the message
        // IMPORTANT: Re-attach event listeners to buttons after they are dynamically added to the page
        attachButtonListeners();
    }
});


// =======================================================
// STEP 6: Function to Attach Event Listeners to ALL Student Buttons
// This function must be called AFTER students are rendered in the HTML
// =======================================================
function attachButtonListeners() {
    // Select all "Check In" buttons on the page
    document.querySelectorAll('.check-in-btn').forEach(button => {
        button.onclick = null; // Clear any old listeners to prevent multiple triggers
        button.onclick = () => checkIn(button.dataset.id); // Assign new listener
    });

    // Select all "Check Out" buttons
    document.querySelectorAll('.check-out-btn').forEach(button => {
        button.onclick = null;
        button.onclick = () => checkOut(button.dataset.id);
    });

    // Select all "Sunscreen" buttons
    document.querySelectorAll('.sunscreen-btn').forEach(button => {
        button.onclick = null;
        button.onclick = () => checkSunscreen(button.dataset.id);
    });
}


// =======================================================
// STEP 7: Initial Global Button Event Listeners (PDF, Reset)
// These buttons are NOT dynamically re-rendered, so their listeners attach once on page load
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    savePdfButton.addEventListener('click', saveAsPdf);
    resetAllButton.addEventListener('click', resetAllData);
  const createStudentsNodeButton = document.getElementById('createStudentsNodeButton');
createStudentsNodeButton.addEventListener('click', createStudentsRootNode);
});


// =======================================================
// STEP 8: Core Check-in / Check-out / Sunscreen Functions (Logic is UNCHANGED)
// These functions interact directly with Firebase
// =======================================================

async function checkIn(studentId) {
    const timestamp = new Date().toISOString(); // Current time in ISO format
    const studentRef = studentsRef.child(studentId); // Reference to specific student in Firebase

    try {
        await studentRef.child('lastCheckIn').set(timestamp); // Update lastCheckIn timestamp
        await studentRef.child('checkIns').push(timestamp); // Add to checkIns history
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
        await studentRef.child('sunscreenApplications').push(timestamp); // Add to sunscreen history
        console.log(`Sunscreen applied for ${studentId} at ${timestamp}`);
    } catch (error) {
        console.error("Error applying sunscreen:", error);
        alert("Failed to record sunscreen. Please try again.");
    }
}


// =======================================================
// STEP 9: Save as PDF Function (Logic is UNCHANGED)
// Captures the currently displayed student list as a PDF
// =======================================================
async function saveAsPdf() {
    const element = document.getElementById('student-list'); // This captures only the students currently displayed
    const filename = `Student_Attendance_${new Date().toLocaleDateString()}.pdf`;

    // Basic check if PDF libraries are loaded (important for CDN usage)
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        console.error("jsPDF library not loaded. Check script tag for jspdf.umd.min.js.");
        alert("PDF generation failed: Library not loaded. Check browser console.");
        return;
    }

    // Temporarily hide the buttons on student cards for a cleaner PDF capture
    const buttons = document.querySelectorAll('.student-item .buttons');
    buttons.forEach(btnContainer => btnContainer.style.display = 'none');

    try {
        // Use html2canvas to convert the HTML element to a canvas (image)
        const canvas = await html2canvas(element, { scale: 2 }); // Scale for better image quality
        const imgData = canvas.toDataURL('image/png'); // Get image data as PNG

        const { jsPDF } = window.jspdf; // Get jsPDF constructor from the UMD bundle

        const pdf = new jsPDF('p', 'mm', 'a4'); // Create new PDF: 'p'=portrait, 'mm'=units, 'a4'=page size
        const imgWidth = 210; // A4 width in mm
        const imgHeight = canvas.height * imgWidth / canvas.width; // Calculate image height to maintain aspect ratio
        let position = 0; // Initial Y position for the image

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); // Add the image to the PDF

        // Logic to handle content spanning multiple pages
        let heightLeft = imgHeight - pdf.internal.pageSize.getHeight();
        let pageHeight = pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
            position = heightLeft - imgHeight; // Calculate position for the next part of the image
            pdf.addPage(); // Add a new page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(filename); // Download the PDF
        console.log(`PDF saved: ${filename}`);

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please check the console for details.");
    } finally {
        // Re-show the buttons after PDF generation is complete
        buttons.forEach(btnContainer => btnContainer.style.display = 'flex');
    }
}


// =======================================================
// STEP 10: Reset All Data Function (Logic is UNCHANGED)
// This function clears all timestamps for ALL students in Firebase, not just displayed ones
// =======================================================
async function resetAllData() {
    // First confirmation
    if (!confirm("Are you sure you want to RESET ALL ATTENDANCE DATA? This action cannot be undone.")) {
        return; // If user cancels, stop
    }

    // Second, stronger confirmation
    if (!confirm("Seriously? This will clear ALL check-in, check-out, and sunscreen times for ALL students. Confirm again.")) {
        return; // If user cancels, stop
    }

    try {
        // Fetch all student IDs from Firebase to know which data to clear
        const snapshot = await studentsRef.once('value');
        const studentsData = snapshot.val();

        if (studentsData) {
            const updates = {}; // Prepare an object for multi-path update for efficiency
            // Iterate through all student IDs (not just displayed ones)
            Object.keys(studentsData).forEach(studentId => {
                // Set these fields to null to clear individual timestamps
                updates[`${studentId}/lastCheckIn`] = null;
                updates[`${studentId}/lastCheckOut`] = null;
                updates[`${studentId}/lastSunscreen`] = null;
                // Set history lists to empty objects to clear them
                updates[`${studentId}/checkIns`] = {};
                updates[`${studentId}/checkOuts`] = {};
                updates[`${studentId}/sunscreenApplications`] = {};
            });
            await studentsRef.update(updates); // Perform the update in one go
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
// =======================================================
// TEMPORARY: Function to Create the initial 'students' node
// This function should be REMOVED after successful use.
// =======================================================
async function createStudentsRootNode() {
    if (!confirm("This will create an empty 'students' node in your database. Only do this once if it's missing.")) {
        return;
    }
    try {
        await database.ref('students').set({}); // Set 'students' to an empty object
        console.log("Empty 'students' node created successfully.");
        alert("Empty 'students' node created successfully in Firebase! You can now remove the 'Create Students Node' button and function.");
        // Optionally, hide the button after successful creation
        document.getElementById('createStudentsNodeButton').style.display = 'none';
    } catch (error) {
        console.error("Error creating students root node:", error);
        alert("Failed to create 'students' node. Check console for details.");
    }
}
