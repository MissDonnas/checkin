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


const CAMP_START_DATE = new Date("2026-07-06T00:00:00"); 


const studentRoster = [
    { id: "adamsi", name: "Isaac Adams", type: "full", days: ["Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 5, 6] },
    { id: "bacaspearlx", name: "X Bacas Pearl", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [5, 6] },
    { id: "beilfussm", name: "Magnolia Beilfuss", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "belaenz", name: "Ziana Belaen", type: "short", days: ["Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "blaggo", name: "Oliver Blagg", type: "short", days: ["Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [3, 4] },
    { id: "boggsn", name: "Nora Boggs", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [2, 3, 4, 5, 6] },
    { id: "boggsb", name: "Ben Boggs", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [2, 3, 4, 5, 6] },
    { id: "bonoguv", name: "Vibha Bonogu", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "brothersm", name: "Maddie Brothers", type: "full", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 4, 5, 6] },
    { id: "brothersc", name: "Clayton Brothers", type: "full", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 4, 5, 6] },
    { id: "brothersma", name: "Mali Brothers", type: "full", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 4, 5, 6] },
    { id: "brotherst", name: "Theodore Brothers", type: "full", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 4, 5, 6] },
    { id: "bueches", name: "Stella Bueche", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 6] },
    { id: "dosreyn", name: "Nico Dosrey", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "freemano", name: "Oliver Freeman", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "freemans", name: "Sophia Freeman", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "furlongl", name: "Logan Furlong", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "hohlp", name: "Peter Hohl", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 6] },
    { id: "kroningl", name: "Lenny Kroning", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "laffeyc", name: "Claire Laffey", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 4, 5, 6] },
    { id: "laffeyj", name: "Jack Laffey", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 4, 5, 6] },
    { id: "medasanin", name: "Neera Medasani", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "montize", name: "Emma Montiz", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "mullenm", name: "Mackenzie Mullen", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [2, 4, 5, 6] },
    { id: "mullenr", name: "Riverly Mullen", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [2, 4, 5, 6] },
    { id: "olsonc", name: "Caden Olson", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [6] },
    { id: "olsonf", name: "Finan Olson", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [6] },
    { id: "pernaas", name: "Asa Perna", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "pernaav", name: "Ava Perna", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "porterh", name: "Harper Porter", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "rodhesx", name: "x Rodhes", type: "short", days: ["Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [3, 6] },
    { id: "sarveshm", name: "Meera Sarvesh", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "shinlor", name: "Loryn Shin", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [2, 3, 4, 5, 6] },
    { id: "shinlog", name: "Logan Shin", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [2, 3, 4, 5, 6] },
    { id: "thompsonb", name: "Benjamin Thompson", type: "short", days: ["Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "vazquezr", name: "Raymond Vazquez", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "velagapudia", name: "Abhinav Velagapudi", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "vennas", name: "Savarnik Venna", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 5, 6] },
    { id: "wingl", name: "Leona Wing", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 2, 3, 4, 5, 6] }

];


function getCurrentCampWeek() {
    const today = new Date();
    
    today.setHours(0,0,0,0);
    
    const diffTime = today - CAMP_START_DATE;
    
    if (diffTime < 0) return 1; 
    

    const weeksPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return weeksPassed + 1;
}

function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function buildStudentList() {
    const listContainer = document.getElementById('student-list');
    listContainer.innerHTML = ''; 
    
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const currentWeek = getCurrentCampWeek();
    
    // Update a sub-header or title if you want to display the current camp week
    const titleElement = document.getElementById('current-date');
    if (titleElement) {
        titleElement.innerHTML = `${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} <br><span style="font-size: 0.9em; color: #555;">Camp Week: ${currentWeek}</span>`;
    }

    let scheduledTotal = 0, scheduledFull = 0, scheduledShort = 0;

    studentRoster.forEach(student => {

        const isRegisteredThisWeek = student.weeks.includes(currentWeek);
        
        if (!isRegisteredThisWeek) return;

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

document.getElementById('student-list').addEventListener('click', (event) => {
    if(event.target.tagName !== 'BUTTON') return;
    const id = event.target.dataset.id;
    if (event.target.classList.contains('check-in-btn')) updateStudentStatus(id, 'lastCheckIn');
    else if (event.target.classList.contains('check-out-btn')) updateStudentStatus(id, 'lastCheckOut');
    else if (event.target.classList.contains('sunscreen-btn')) updateStudentStatus(id, 'lastSunscreen');
});

document.addEventListener('DOMContentLoaded', () => {
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

    document.getElementById('resetAllButton').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset everyone\'s times for today?')) {
        const resetUpdates = {};
        
        studentRoster.forEach(student => {
            resetUpdates[`/${student.id}/lastCheckIn`] = null;
            resetUpdates[`/${student.id}/lastCheckOut`] = null;
            resetUpdates[`/${student.id}/lastSunscreen`] = null;
            resetUpdates[`/${student.id}/checkedIn`] = false;
        });

        database.ref('students').update(resetUpdates, (error) => {
            if (error) {
                console.error("Reset failed:", error);
                alert("Something went wrong while resetting data.");
            } else {
                
                document.querySelectorAll('.student-item').forEach(card => {
                    const id = card.dataset.id;
                    card.querySelector(`#${id}-lastCheckIn`).textContent = 'N/A';
                    card.querySelector(`#${id}-lastCheckOut`).textContent = 'N/A';
                    card.querySelector(`#${id}-lastSunscreen`).textContent = 'N/A';
                    card.classList.remove('checked-in', 'checked-out');
                });
                updatePresentCounter();
                alert("All attendance times have been successfully reset!");
            }
        });
    }
});
