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

// =======================================================
// STEP 2: DOM Element References
// =======================================================
const savePdfButton = document.getElementById('savePdfButton');
const resetAllButton = document.getElementById('resetAllButton');
const studentListContainer = document.getElementById('student-list'); // The container for all student items
const studentSearchInput = document.getElementById('studentSearch'); // The new search input

// Status Bar Elements
const totalStudentsCount = document.getElementById('totalStudentsCount');
const studentsPresentCount = document.getElementById('studentsPresentCount');
const studentsAbsentCount = document.getElementById('studentsAbsentCount');


// =======================================================
// STEP 3: Realtime Data Loading and Display Logic
// This function runs every time the 'students' data changes in Firebase.
// It updates the pre-existing HTML elements.
// =======================================================
studentsRef.on('value', (snapshot) => {
    const allStudentsData = snapshot.val(); // Get ALL students data from Firebase

    // Get all student item divs from the HTML (these are static now)
    const studentItemsInHtml = document.querySelectorAll('.student-item');

    // Initialize counts for the status bar (these will be updated by applySearchFilter)
    let visibleStudents = 0;
    let visiblePresent = 0;
    let visibleAbsent = 0;

    // Loop through each student item found in the HTML
    studentItemsInHtml.forEach(studentItemDiv => {
        const studentId = studentItemDiv.dataset.id; // Get the data-id from the HTML
        const student = allStudentsData ? allStudentsData[studentId] : null; // Get corresponding data from Firebase

        // Find the specific elements within this student's card
        const lastCheckInElement = studentItemDiv.querySelector(`#${studentId}-lastCheckIn`);
        const lastCheckOutElement = studentItemDiv.querySelector(`#${studentId}-lastCheckOut`);
        const lastSunscreenElement = studentItemDiv.querySelector(`#${studentId}-lastSunscreen`);

        if (student) {
            // Update text content with Firebase data
            lastCheckInElement.textContent = student.lastCheckIn ? new Date(student.lastCheckIn).toLocaleString() : 'N/A';
            lastCheckOutElement.textContent = student.lastCheckOut ? new Date(student.lastCheckOut).toLocaleString() : 'N/A';
            lastSunscreenElement.textContent = student.lastSunscreen ? new Date(student.lastSunscreen).toLocaleString() : 'N/A';
        } else {
            // If student data doesn't exist in Firebase, set to N/A
            lastCheckInElement.textContent = 'N/A';
            lastCheckOutElement.textContent = 'N/A';
            lastSunscreenElement.textContent = 'N/A';
        }
    });

    // After updating all student cards, apply the current search filter
    // and update the status bar based on visible students.
    applySearchFilter();
});


// =======================================================
// STEP 4: Search Functionality
// Filters students based on search input and updates status bar
// =======================================================
function applySearchFilter() {
    const searchText = studentSearchInput.value.toLowerCase();
    const studentItems = document.querySelectorAll('.student-item');

    let totalVisibleStudents = 0;
    let presentVisibleStudents = 0;
    let absentVisibleStudents = 0;

    studentItems.forEach(item => {
        const studentName = item.querySelector('h3').textContent.toLowerCase();
        const studentId = item.dataset.id.toLowerCase(); // Also search by ID for robustness

        // Check if name or ID contains the search text
        if (studentName.includes(searchText) || studentId.includes(searchText)) {
            item.style.display = 'flex'; // Show the student card
            totalVisibleStudents++;

            // Recalculate present/absent for visible students
            const lastCheckInTimeStr = item.querySelector('strong[id$="-lastCheckIn"]').textContent;
            const lastCheckOutTimeStr = item.querySelector('strong[id$="-lastCheckOut"]').textContent;

            const checkInTime = lastCheckInTimeStr !== 'N/A' ? new Date(lastCheckInTimeStr).getTime() : 0;
            const checkOutTime = lastCheckOutTimeStr !== 'N/A' ? new Date(lastCheckOutTimeStr).getTime() : 0;

            if (checkInTime > 0 && (checkOutTime === 0 || checkInTime > checkOutTime)) {
                presentVisibleStudents++;
            } else {
                absentVisibleStudents++;
            }
        } else {
            item.style.display = 'none'; // Hide the student card
        }
    });

    // Update the status bar counts based on currently visible students
    totalStudentsCount.textContent = totalVisibleStudents;
    studentsPresentCount.textContent = presentVisibleStudents;
    studentsAbsentCount.textContent = absentVisibleStudents;
}


// =======================================================
// STEP 5: Attach Event Listeners
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // Attach listeners for check-in/out/sunscreen buttons
    document.querySelectorAll('.check-in-btn').forEach(button => {
        button.addEventListener('click', () => checkIn(button.dataset.id));
    });

    document.querySelectorAll('.check-out-btn').forEach(button => {
        button.addEventListener('click', () => checkOut(button.dataset.id));
    });

    document.querySelectorAll('.sunscreen-btn').forEach(button => {
        button.addEventListener('click', () => checkSunscreen(button.dataset.id));
    });

    // Attach listeners for global buttons
    savePdfButton.addEventListener('click', saveAsPdf);
    resetAllButton.addEventListener('click', resetAllData);

    // Attach listener for the search input
    studentSearchInput.addEventListener('input', applySearchFilter);
});


// =======================================================
// STEP 6: Core Check-in / Check-out / Sunscreen Functions
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
// STEP 7: Save as PDF Function
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
// STEP 8: Reset All Data Function
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
