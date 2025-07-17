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
const database = firebase.database();
const studentsRef = database.ref('students');

// =======================================================
// STEP 2: DOM Element References for new buttons and status bar
// =======================================================
const savePdfButton = document.getElementById('savePdfButton');
const resetAllButton = document.getElementById('resetAllButton');

// Status Bar Elements
const totalStudentsCount = document.getElementById('totalStudentsCount');
const studentsPresentCount = document.getElementById('studentsPresentCount');
const studentsAbsentCount = document.getElementById('studentsAbsentCount');


// =======================================================
// STEP 3: Realtime Data Loading and Display & Status Bar Updates
// This function runs every time the 'students' data changes in Firebase
// =======================================================
studentsRef.on('value', (snapshot) => {
    const studentsData = snapshot.val(); // Get all students data as an object

    let totalStudents = 0;
    let presentStudents = 0;
    let absentStudents = 0;

    // Get all student item divs from the HTML
    const studentItemsInHtml = document.querySelectorAll('.student-item');

    // Loop through each student item found in the HTML
    studentItemsInHtml.forEach(studentItemDiv => {
        const studentId = studentItemDiv.dataset.id; // Get the data-id from the HTML
        const student = studentsData ? studentsData[studentId] : null; // Get corresponding data from Firebase

        // Only process if data exists for this student ID in Firebase
        if (student) {
            totalStudents++; // Count total students that have data in Firebase

            // Find the elements for this specific student in your HTML
            const lastCheckInElement = document.getElementById(`${studentId}-lastCheckIn`);
            const lastCheckOutElement = document.getElementById(`${studentId}-lastCheckOut`);
            const lastSunscreenElement = document.getElementById(`${studentId}-lastSunscreen`);

            if (lastCheckInElement && lastCheckOutElement && lastSunscreenElement) {
                const lastCheckIn = student.lastCheckIn ? new Date(student.lastCheckIn).toLocaleString() : 'N/A';
                const lastCheckOut = student.lastCheckOut ? new Date(student.lastCheckOut).toLocaleString() : 'N/A';
                const lastSunscreen = student.lastSunscreen ? new Date(student.lastSunscreen).toLocaleString() : 'N/A';

                lastCheckInElement.textContent = lastCheckIn;
                lastCheckOutElement.textContent = lastCheckOut;
                lastSunscreenElement.textContent = lastSunscreen;

                // Determine student status for status bar
                const checkInTime = student.lastCheckIn ? new Date(student.lastCheckIn).getTime() : 0;
                const checkOutTime = student.lastCheckOut ? new Date(student.lastCheckOut).getTime() : 0;

                if (checkInTime > 0 && (checkOutTime === 0 || checkInTime > checkOutTime)) {
                    presentStudents++;
                } else {
                    absentStudents++;
                }
            } else {
                console.warn(`HTML elements for student ID "${studentId}" not found. Make sure data-id matches and IDs are correctly formatted in index.html.`);
            }
        } else {
            // If a student exists in HTML but not in Firebase, set their status to N/A
            const lastCheckInElement = document.getElementById(`${studentId}-lastCheckIn`);
            const lastCheckOutElement = document.getElementById(`${studentId}-lastCheckOut`);
            const lastSunscreenElement = document.getElementById(`${studentId}-lastSunscreen`);
            if(lastCheckInElement) lastCheckInElement.textContent = 'N/A';
            if(lastCheckOutElement) lastCheckOutElement.textContent = 'N/A';
            if(lastSunscreenElement) lastSunscreenElement.textContent = 'N/A';
            // Also count them as absent if they're in HTML but no data in Firebase
            absentStudents++;
            totalStudents++; // Still count them in total if they are in HTML
        }
    });

    // Update the status bar counts
    totalStudentsCount.textContent = totalStudents;
    studentsPresentCount.textContent = presentStudents;
    studentsAbsentCount.textContent = absentStudents;
});


// =======================================================
// STEP 4: Attach Event Listeners to Buttons
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.check-in-btn').forEach(button => {
        button.addEventListener('click', () => checkIn(button.dataset.id));
    });

    document.querySelectorAll('.check-out-btn').forEach(button => {
        button.addEventListener('click', () => checkOut(button.dataset.id));
    });

    document.querySelectorAll('.sunscreen-btn').forEach(button => {
        button.addEventListener('click', () => checkSunscreen(button.dataset.id));
    });

    savePdfButton.addEventListener('click', saveAsPdf);
    resetAllButton.addEventListener('click', resetAllData);
});


// =======================================================
// STEP 5: Core Check-in / Check-out / Sunscreen Functions
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
// STEP 6: Save as PDF Function
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
// STEP 7: Reset All Data Function
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
