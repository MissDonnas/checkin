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

const studentRoster = [
    { id: "grayson", name: "Grayson", type: "full", days: ["Monday", "Wednesday", "Friday"] },
    { id: "oaklyn", name: "Oaklyn", type: "short", days: ["Tuesday", "Thursday"] },
    { id: "magnolia", name: "Magnolia", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: "ben-beer", name: "Ben Beer", type: "full", days: ["Tuesday", "Wednesday", "Thursday"] },
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

function buildStudentList() {
    const listContainer = document.getElementById('student-list');
    listContainer.innerHTML = ''; 
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    studentRoster.sort((a, b) => a.name.localeCompare(b.name));

    let scheduledTotal = 0, scheduledFull = 0, scheduledShort = 0;

    studentRoster.forEach(student => {
        const isScheduledToday = student.days.includes(todayName);
        let badgeHtml = !isScheduledToday ? `<span class="badge-not-scheduled">Not Scheduled Today</span>` : 
                        (student.type === 'full' ? `<span class="badge-full">Full Day</span>` : `<span class="badge-short">Shortened</span>`);
        
        if (isScheduledToday) {
            student.type === 'full' ? scheduledFull++ : scheduledShort++;
            scheduledTotal++;
        }
        
        const card = document.createElement('div');
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

    document.getElementById('totalScheduledCount').textContent = scheduledTotal;
    document.getElementById('fullScheduledCount').textContent = scheduledFull;
    document.getElementById('shortScheduledCount').textContent = scheduledShort;
}

function updatePresentCounter() {
    let presentCount = 0;
    document.querySelectorAll('.student-item').forEach(card => {
        if (card.classList.contains('checked-in') && !card.classList.contains('checked-out')) presentCount++;
    });
    document.getElementById('studentsPresentCount').textContent = presentCount;
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
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
                    card.style.display = (target === 'all' || card.dataset.type === target) ? 'flex' : 'none';
                });
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
    database.ref('students').update(updates);
}

function saveToHistory() {
    const now = new Date();
    const dateString = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const timestampId = Date.now();
    let snapshotData = { date: dateString, present: [], absent: [] };

    document.querySelectorAll('.student-item').forEach(card => {
        const nameElement = card.querySelector('h3').cloneNode(true);
        const badge = nameElement.querySelector('span');
        if(badge) badge.remove();
        const studentInfo = {
            name: nameElement.textContent.trim(),
            timeIn: card.querySelector(`#${card.dataset.id}-lastCheckIn`).textContent,
            timeOut: card.querySelector(`#${card.dataset.id}-lastCheckOut`).textContent,
            sunscreen: card.querySelector(`#${card.dataset.id}-lastSunscreen`).textContent
        };

        if (card.classList.contains('checked-in') && !card.classList.contains('checked-out')) snapshotData.present.push(studentInfo);
        else if (!card.classList.contains('not-scheduled')) snapshotData.absent.push(studentInfo);
    });
    historyRef.child(timestampId).set(snapshotData);
}

// History Event Listeners
document.getElementById('student-list').addEventListener('click', (event) => {
    if(event.target.tagName !== 'BUTTON') return;
    const id = event.target.dataset.id;
    if (event.target.classList.contains('check-in-btn')) updateStudentStatus(id, 'lastCheckIn');
    else if (event.target.classList.contains('check-out-btn')) updateStudentStatus(id, 'lastCheckOut');
    else if (event.target.classList.contains('sunscreen-btn')) updateStudentStatus(id, 'lastSunscreen');
});

// Load App
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
                if (data.lastCheckIn && (!data.lastCheckOut || data.lastCheckIn > data.lastCheckOut)) card.classList.add('checked-in');
                else if (data.lastCheckOut) card.classList.add('checked-out'); 
            }
        });
        updatePresentCounter(); 
    });

    historyRef.orderByKey().on('value', snapshot => {
        const historyContainer = document.getElementById('history-content');
        historyContainer.innerHTML = '';
        snapshot.forEach(child => {
            const record = child.val();
            const id = child.key;
            const historyItem = document.createElement('div');
            historyItem.className = 'history-record';
            
            let tableHtml = `<table class="history-table"><thead><tr><th>Name</th><th>Status</th><th>In</th><th>Out</th><th>Sun</th></tr></thead><tbody>`;
            (record.present || []).forEach(s => tableHtml += `<tr><td>${s.name}</td><td><span class="table-badge badge-present">Present</span></td><td>${s.timeIn}</td><td>${s.timeOut}</td><td>${s.sunscreen}</td></tr>`);
            (record.absent || []).forEach(s => tableHtml += `<tr><td>${typeof s === 'string' ? s : s.name}</td><td><span class="table-badge badge-absent">Absent</span></td><td>-</td><td>-</td><td>-</td></tr>`);
            tableHtml += `</tbody></table>`;

            historyItem.innerHTML = `
                <div class="history-header">
                    <span>📅 ${record.date}</span>
                    <button class="delete-history-btn" data-id="${id}">Delete</button>
                </div>
                <div class="history-details">${tableHtml}</div>
            `;
            historyItem.querySelector('.history-header').addEventListener('click', (e) => {
                if(!e.target.classList.contains('delete-history-btn')) historyItem.classList.toggle('expanded');
            });
            historyItem.querySelector('.delete-history-btn').addEventListener('click', () => {
                if(confirm('Delete this record?')) historyRef.child(id).remove();
            });
            historyContainer.appendChild(historyItem);
        });
    });

    document.getElementById('resetAllButton').addEventListener('click', () => { if(confirm('Clear today?')) database.ref('students').remove(); });
    document.getElementById('savePdfButton').addEventListener('click', saveToHistory);
});
