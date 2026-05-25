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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const studentsRef = database.ref('students');
const historyRef = database.ref('history');

// =====================================================================
// MASTER ROSTER: Now with specific days of the week!
// Edit the "days" array to match exactly when the child is scheduled.
// =====================================================================
const studentRoster = [
    { id: "grayson", name: "Grayson", type: "full", days: ["Monday", "Wednesday", "Friday"] },
    { id: "oaklyn", name: "Oaklyn", type: "short", days: ["Tuesday", "Thursday"] },
    { id: "magnolia", name: "Magnolia", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "ben-beer", name: "Ben Beer", type: "full", days: ["Tuesday", "Wednesday", "Thursday"] },
    // I have set the rest to Monday-Friday as a default. Edit as needed!
    { id: "joe", name: "Joe", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "orla", name: "Orla", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "ben-boggs", name: "Ben Boggs", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "nora-1", name: "Nora", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "monroe", name: "Monroe", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "clayton", name: "Clayton", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "maddie", name: "Maddie", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "mali", name: "Mali", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "theo", name: "Theo", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "luke", name: "Luke", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "olivia", name: "Olivia", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "sofia", name: "Sofia", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "aura", name: "Aura", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "vada", name: "Vada", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "ben-kiseda", name: "Ben Kiseda", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "henry", name: "Henry", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "james", name: "James", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "ryan", name: "Ryan", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "lenny", name: "Lenny", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "neera", name: "Neera", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "luciana", name: "Luciana", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "nora-2", name: "Nora (2)", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "marcella", name: "Marcella", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "david", name: "David", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "veda", name: "Veda", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "mackenzie", name: "Mackenzie", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "riverly", name: "Riverly", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "asa", name: "Asa", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "ava", name: "Ava", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "harper", name: "Harper", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "maisha", name: "Maisha", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "logan", name: "Logan", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "loryn", name: "Loryn", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "mason", name: "Mason", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "ashley", name: "Ashley", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "jack", name: "Jack", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "raymond", name: "Raymond", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "savarnik", name: "Savarnik", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "nivirth", name: "Nivirth", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "smaya", name: "Smaya", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }
];

function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// 1. Build the HTML dynamically based on TODAY'S DAY
function buildStudentList() {
    const listContainer = document.getElementById('student-list');
    listContainer.innerHTML = ''; 

    // Get today's day name (e.g., "Monday")
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    studentRoster.sort((a, b) => a.name.localeCompare(b.name));

    let scheduledTotal = 0;
    let scheduledFull = 0;
    let scheduledShort = 0;

    studentRoster.forEach(student => {
        // Check if the student is scheduled for today
        const isScheduledToday = student.days.includes(todayName);
        
        let badgeHtml = '';
        if (!isScheduledToday) {
            badgeHtml = `<span class="badge-not-scheduled">Not Scheduled Today</span>`;
        } else if (student.type === 'full') {
            badgeHtml = `<span class="badge-full">Full Day</span>`;
            scheduledFull++;
            scheduledTotal++;
        } else {
            badgeHtml = `<span class="badge-short">Shortened</span>`;
            scheduledShort++;
            scheduledTotal++;
        }
        
        const card = document.createElement('div');
        // Add a special class if they aren't scheduled today so CSS can dim them
        card.className = `student-item ${isScheduledToday ? '' : 'not-scheduled'}`;
        card.dataset.id = student.id;
        card.dataset.type = student.type; 

        card.innerHTML = `
            <h3>${student.name} ${badgeHtml}</h3>
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

    // Update the counters to only show who is expected TODAY
    document.getElementById('totalScheduledCount').textContent = scheduledTotal;
    document.getElementById('fullScheduledCount').textContent = scheduledFull;
    document.getElementById('shortScheduledCount').textContent = scheduledShort;
}

function updatePresentCounter() {
    let presentCount = 0;
    document.querySelectorAll('.student-item').forEach(card => {
        if (card.classList.contains('checked-in') && !card.classList.contains('checked-out')) {
            presentCount++;
        }
    });
    document.getElementById('studentsPresentCount').textContent = presentCount;
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('studentSearch');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');

            const target = e.target.dataset.target;
            
            if (target === 'history') {
                document.getElementById('view-students').style.display = 'none';
                document.getElementById('view-history').style.display = 'block';
                document.querySelector('.search-container').style.display = 'none'; 
            } else {
                document.getElementById('view-students').style.display = 'block';
                document.getElementById('view-history').style.display = 'none';
                document.querySelector('.search-container').style.display = 'block';

                document.querySelectorAll('.student-item').forEach(card => {
                    if (target === 'all' || card.dataset.type === target) {
                        card.style.display = 'flex'; 
                    } else {
                        card.style.display = 'none'; 
                    }
                });
                searchInput.value = ''; 
            }
        });
    });
}

function updateStudentStatus(studentId, statusType) {
    const timestamp = Date.now();
    const updates = {};
    updates[`/${studentId}/${statusType}`] = timestamp;
    
    if (statusType === 'lastCheckIn') updates[`/${studentId}/checkedIn`] = true;
    else if (statusType === 'lastCheckOut') updates[`/${studentId}/checkedIn`] = false;

    database.ref('students').update(updates).catch(console.error);
}

function saveToHistory() {
    const now = new Date();
    const dateString = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const timestampId = Date.now();

    let snapshotData = {
        date: dateString,
        present: [],
        absent: []
    };

    document.querySelectorAll('.student-item').forEach(card => {
        const nameElement = card.querySelector('h3').cloneNode(true);
        // Remove the badge text before saving the name
        const badge = nameElement.querySelector('span');
        if(badge) badge.remove();
        const name = nameElement.textContent.trim();

        if (card.classList.contains('checked-in') && !card.classList.contains('checked-out')) {
            snapshotData.present.push(name);
        } else if (!card.classList.contains('not-scheduled')) {
            // Only log them as absent if they were actually scheduled today
            snapshotData.absent.push(name);
        }
    });

    historyRef.child(timestampId).set(snapshotData).then(() => {
        alert("Attendance history saved successfully!");
    });
}

document.getElementById('student-list').addEventListener('click', (event) => {
    if(event.target.tagName !== 'BUTTON') return;
    const studentId = event.target.dataset.id;
    
    if (event.target.classList.contains('check-in-btn')) updateStudentStatus(studentId, 'lastCheckIn');
    else if (event.target.classList.contains('check-out-btn')) updateStudentStatus(studentId, 'lastCheckOut');
    else if (event.target.classList.contains('sunscreen-btn')) updateStudentStatus(studentId, 'lastSunscreen');
});

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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-date').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    buildStudentList();
    setupTabs();

    studentsRef.on('value', (snapshot) => {
        snapshot.forEach((child) => {
            const id = child.key;
            const data = child.val();
            const card = document.querySelector(`.student-item[data-id="${id}"]`);

            if (card) {
                card.querySelector(`#${id}-lastCheckIn`).textContent = formatTimestamp(data.lastCheckIn);
                card.querySelector(`#${id}-lastCheckOut`).textContent = formatTimestamp(data.lastCheckOut);
                card.querySelector(`#${id}-lastSunscreen`).textContent = formatTimestamp(data.lastSunscreen);

                card.classList.remove('checked-in', 'checked-out');
                if (data.lastCheckIn && (!data.lastCheckOut || data.lastCheckIn > data.lastCheckOut)) {
                    card.classList.add('checked-in');
                } else if (data.lastCheckOut) {
                    card.classList.add('checked-out'); 
                }
            }
        });
        updatePresentCounter(); 
    });

    historyRef.orderByKey().on('value', snapshot => {
        const historyContainer = document.getElementById('history-content');
        historyContainer.innerHTML = '';
        
        let records = [];
        snapshot.forEach(child => { records.push(child.val()); });
        
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

    document.getElementById('resetAllButton').addEventListener('click', () => {
        if (confirm('Clear today\'s board? Make sure you saved a PDF/History first!')) {
            database.ref('students').remove();
        }
    });

    document.getElementById('savePdfButton').addEventListener('click', () => {
        saveToHistory(); 
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'letter');
        doc.setFontSize(20);
        doc.text("Daily Attendance Report", doc.internal.pageSize.getWidth() / 2, 60, { align: "center" });
        doc.setFontSize(12);
        doc.text(new Date().toLocaleDateString(), doc.internal.pageSize.getWidth() / 2, 85, { align: "center" });

        const body = [];
        document.querySelectorAll('.student-item').forEach(card => {
            // Only add them to the PDF if they were scheduled today
            if (!card.classList.contains('not-scheduled')) {
                const nameElement = card.querySelector('h3').cloneNode(true);
                const badge = nameElement.querySelector('span');
                if(badge) badge.remove();
                const name = nameElement.textContent.trim();
                
                let status = "Absent";
                if (card.classList.contains('checked-in')) status = "Present";
                if (card.classList.contains('checked-out')) status = "Checked Out";
                body.push([name, status]);
            }
        });

        doc.autoTable({ head: [['Expected Student', 'Final Status']], body: body, startY: 100 });
        doc.save("Attendance.pdf");
    });
});
