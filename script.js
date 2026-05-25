// FIREBASE CONFIGURATION
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
const historyRef = database.ref('history');

// =====================================================================
// MASTER ROSTER: All 44 students from your temp list are here.
// To change someone to a short day, change "full" to "short".
// =====================================================================
const studentRoster = [
    { id: "grayson", name: "Grayson", type: "full" },
    { id: "oaklyn", name: "Oaklyn", type: "short" },
    { id: "magnolia", name: "Magnolia", type: "full" },
    { id: "ben-beer", name: "Ben Beer", type: "full" },
    { id: "joe", name: "Joe", type: "full" },
    { id: "orla", name: "Orla", type: "short" },
    { id: "ben-boggs", name: "Ben Boggs", type: "full" },
    { id: "nora-1", name: "Nora", type: "full" },
    { id: "monroe", name: "Monroe", type: "full" },
    { id: "clayton", name: "Clayton", type: "short" },
    { id: "maddie", name: "Maddie", type: "full" },
    { id: "mali", name: "Mali", type: "full" },
    { id: "theo", name: "Theo", type: "full" },
    { id: "luke", name: "Luke", type: "short" },
    { id: "olivia", name: "Olivia", type: "full" },
    { id: "sofia", name: "Sofia", type: "full" },
    { id: "aura", name: "Aura", type: "short" },
    { id: "vada", name: "Vada", type: "full" },
    { id: "ben-kiseda", name: "Ben Kiseda", type: "full" },
    { id: "henry", name: "Henry", type: "full" },
    { id: "james", name: "James", type: "short" },
    { id: "ryan", name: "Ryan", type: "full" },
    { id: "lenny", name: "Lenny", type: "full" },
    { id: "neera", name: "Neera", type: "full" },
    { id: "luciana", name: "Luciana", type: "short" },
    { id: "nora-2", name: "Nora (2)", type: "full" },
    { id: "marcella", name: "Marcella", type: "full" },
    { id: "david", name: "David", type: "short" },
    { id: "veda", name: "Veda", type: "full" },
    { id: "mackenzie", name: "Mackenzie", type: "full" },
    { id: "riverly", name: "Riverly", type: "short" },
    { id: "asa", name: "Asa", type: "full" },
    { id: "ava", name: "Ava", type: "full" },
    { id: "harper", name: "Harper", type: "full" },
    { id: "maisha", name: "Maisha", type: "short" },
    { id: "logan", name: "Logan", type: "full" },
    { id: "loryn", name: "Loryn", type: "full" },
    { id: "mason", name: "Mason", type: "full" },
    { id: "ashley", name: "Ashley", type: "short" },
    { id: "jack", name: "Jack", type: "full" },
    { id: "raymond", name: "Raymond", type: "full" },
    { id: "savarnik", name: "Savarnik", type: "full" },
    { id: "nivirth", name: "Nivirth", type: "short" },
    { id: "smaya", name: "Smaya", type: "full" }
];

// Utility: Format Time
function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// 1. Build the HTML dynamically from the array
function buildStudentList() {
    const listContainer = document.getElementById('student-list');
    listContainer.innerHTML = ''; // Clear first

    // Sort alphabetically
    studentRoster.sort((a, b) => a.name.localeCompare(b.name));

    studentRoster.forEach(student => {
        const badge = student.type === 'full' ? `<span class="badge-full">Full Day</span>` : `<span class="badge-short">Shortened</span>`;
        
        const card = document.createElement('div');
        card.className = 'student-item';
        card.dataset.id = student.id;
        card.dataset.type = student.type; // Helps with tabs

        card.innerHTML = `
            <h3>${student.name} ${badge}</h3>
            <div class="status-info">
                <p>In: <strong id="${student.id}-lastCheckIn">N/A</strong></p>
                <p>Out: <strong id="${student.id}-lastCheckOut">N/A</strong></p>
                <p>Sun: <strong id="${student.id}-lastSunscreen">N/A</strong></p>
            </div>
            <div class="buttons">
                <button class="check-in-btn" data-id="${student.id}">Check In</button>
                <button class="check-out-btn" data-id="${student.id}">Check Out</button>
                <button class="sunscreen-btn" data-id="${student.id}">Sunscreen</button>
            </div>
        `;
        listContainer.appendChild(card);
    });

    calculateStaticCounters(); // Set scheduled counters
}

// 2. Counters Logic
function calculateStaticCounters() {
    const total = studentRoster.length;
    const full = studentRoster.filter(s => s.type === 'full').length;
    const short = studentRoster.filter(s => s.type === 'short').length;

    document.getElementById('totalScheduledCount').textContent = total;
    document.getElementById('fullScheduledCount').textContent = full;
    document.getElementById('shortScheduledCount').textContent = short;
}

function updatePresentCounter() {
    // Count items that have 'checked-in' class but NOT 'checked-out' class
    let presentCount = 0;
    document.querySelectorAll('.student-item').forEach(card => {
        if (card.classList.contains('checked-in') && !card.classList.contains('checked-out')) {
            presentCount++;
        }
    });
    document.getElementById('studentsPresentCount').textContent = presentCount;
}

// 3. Tab Logic
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('studentSearch');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Remove active classes
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');

            const target = e.target.dataset.target;
            
            // Handle view switching (History vs Roster)
            if (target === 'history') {
                document.getElementById('view-students').style.display = 'none';
                document.getElementById('view-history').style.display = 'block';
                document.querySelector('.search-container').style.display = 'none'; // hide search in history
            } else {
                document.getElementById('view-students').style.display = 'block';
                document.getElementById('view-history').style.display = 'none';
                document.querySelector('.search-container').style.display = 'block';

                // Filter the student cards
                document.querySelectorAll('.student-item').forEach(card => {
                    if (target === 'all' || card.dataset.type === target) {
                        card.style.display = 'flex'; // Show
                    } else {
                        card.style.display = 'none'; // Hide
                    }
                });
                searchInput.value = ''; // Clear search when switching tabs
            }
        });
    });
}

// 4. Update Database
function updateStudentStatus(studentId, statusType) {
    const timestamp = Date.now();
    const updates = {};
    updates[`/${studentId}/${statusType}`] = timestamp;
    
    if (statusType === 'lastCheckIn') updates[`/${studentId}/checkedIn`] = true;
    else if (statusType === 'lastCheckOut') updates[`/${studentId}/checkedIn`] = false;

    database.ref('students').update(updates).catch(console.error);
}

// 5. Save to History function
function saveToHistory() {
    const now = new Date();
    const dateString = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const timestampId = Date.now();

    // Create a snapshot of currently present vs absent
    let snapshotData = {
        date: dateString,
        present: [],
        absent: []
    };

    document.querySelectorAll('.student-item').forEach(card => {
        const name = card.querySelector('h3').textContent.replace('Full Day', '').replace('Shortened', '').trim();
        if (card.classList.contains('checked-in') && !card.classList.contains('checked-out')) {
            snapshotData.present.push(name);
        } else {
            snapshotData.absent.push(name);
        }
    });

    historyRef.child(timestampId).set(snapshotData).then(() => {
        alert("Attendance history saved successfully!");
    });
}


// Event Delegation for Buttons (Better Performance)
document.getElementById('student-list').addEventListener('click', (event) => {
    if(event.target.tagName !== 'BUTTON') return;
    const studentId = event.target.dataset.id;
    
    if (event.target.classList.contains('check-in-btn')) updateStudentStatus(studentId, 'lastCheckIn');
    else if (event.target.classList.contains('check-out-btn')) updateStudentStatus(studentId, 'lastCheckOut');
    else if (event.target.classList.contains('sunscreen-btn')) updateStudentStatus(studentId, 'lastSunscreen');
});


// Search Functionality
document.getElementById('studentSearch').addEventListener('input', (e) => {
    const filter = e.target.value.toLowerCase();
    const activeTab = document.querySelector('.tab-btn.active').dataset.target;

    document.querySelectorAll('.student-item').forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const matchesSearch = name.includes(filter);
        const matchesTab = (activeTab === 'all' || card.dataset.type === activeTab);
        
        card.style.display = (matchesSearch && matchesTab) ? 'flex' : 'none';
    });
});


// MAIN INIT ON LOAD
document.addEventListener('DOMContentLoaded', () => {
    // 1. Show Date
    document.getElementById('current-date').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // 2. Build DOM
    buildStudentList();
    setupTabs();

    // 3. Listen to Firebase Database for Live Updates
    studentsRef.on('value', (snapshot) => {
        snapshot.forEach((child) => {
            const id = child.key;
            const data = child.val();
            const card = document.querySelector(`.student-item[data-id="${id}"]`);

            if (card) {
                // Update text times
                card.querySelector(`#${id}-lastCheckIn`).textContent = formatTimestamp(data.lastCheckIn);
                card.querySelector(`#${id}-lastCheckOut`).textContent = formatTimestamp(data.lastCheckOut);
                card.querySelector(`#${id}-lastSunscreen`).textContent = formatTimestamp(data.lastSunscreen);

                // Update visual styling (greyed out vs green)
                card.classList.remove('checked-in', 'checked-out');
                if (data.lastCheckIn && (!data.lastCheckOut || data.lastCheckIn > data.lastCheckOut)) {
                    card.classList.add('checked-in');
                } else if (data.lastCheckOut) {
                    card.classList.add('checked-out'); // Will grey out the box
                }
            }
        });
        updatePresentCounter(); // Recalculate present counter
    });

    // 4. Listen to History Database
    historyRef.orderByKey().on('value', snapshot => {
        const historyContainer = document.getElementById('history-content');
        historyContainer.innerHTML = '';
        
        let records = [];
        snapshot.forEach(child => { records.push(child.val()); });
        
        // Reverse array to show newest first
        records.reverse().forEach(record => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-record';
            historyItem.innerHTML = `
                <h4>📅 ${record.date}</h4>
                <p><strong>Present (${record.present ? record.present.length : 0}):</strong> ${record.present ? record.present.join(', ') : 'None'}</p>
                <p style="color: #666; font-size: 0.85em;"><strong>Absent:</strong> ${record.absent ? record.absent.join(', ') : 'None'}</p>
            `;
            historyContainer.appendChild(historyItem);
        });
    });

    // Reset Button
    document.getElementById('resetAllButton').addEventListener('click', () => {
        if (confirm('Clear today\'s board? Make sure you saved a PDF/History first!')) {
            database.ref('students').remove();
        }
    });

    // Save PDF Button
    document.getElementById('savePdfButton').addEventListener('click', () => {
        saveToHistory(); // Auto-saves to History tab
        
        // Generate PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'letter');
        doc.setFontSize(20);
        doc.text("Daily Attendance Report", doc.internal.pageSize.getWidth() / 2, 60, { align: "center" });
        doc.setFontSize(12);
        doc.text(new Date().toLocaleDateString(), doc.internal.pageSize.getWidth() / 2, 85, { align: "center" });

        const body = [];
        document.querySelectorAll('.student-item').forEach(card => {
            const name = card.querySelector('h3').textContent;
            let status = "Absent";
            if (card.classList.contains('checked-in')) status = "Present";
            if (card.classList.contains('checked-out')) status = "Checked Out";
            body.push([name, status]);
        });

        doc.autoTable({ head: [['Student', 'Final Status']], body: body, startY: 100 });
        doc.save("Attendance.pdf");
    });
});
