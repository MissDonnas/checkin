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
    { id: "bacaspearl", name: "Lucas Bacas Pearl", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [5, 6] },
    { id: "barolig", name: "Grayson Baroli", type: "full", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [2] },
    { id: "barolio", name: "Oaklyn Baroli", type: "full", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 2, 4, 5] },
    { id: "beilfussm", name: "Magnolia Beilfuss", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "belaenz", name: "Ziana Belaen", type: "short", days: ["Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "blaggo", name: "Oliver Blagg", type: "short", days: ["Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [3, 4] },
    { id: "boggsn", name: "Nora Boggs", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [2, 3, 4, 5, 6] },
    { id: "boggsb", name: "Ben Boggs", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [2, 3, 4, 5, 6] },
    { id: "bomminenin", name: "Nihira Bommineni", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "bonoguv", name: "Vibha Bonogu", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "brothersm", name: "Maddie Brothers", type: "full", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 4, 5, 6] },
    { id: "brothersc", name: "Clayton Brothers", type: "full", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 4, 5, 6] },
    { id: "brothersma", name: "Mali Brothers", type: "full", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 4, 5, 6] },
    { id: "brotherst", name: "Theodore Brothers", type: "full", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 4, 5, 6] },
    { id: "bueches", name: "Stella Bueche", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 6] },
    { id: "dipaolaa", name: "Antonino DiPaola", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [3, 4] },
    { id: "dosreyn", name: "Nico Dosrey", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "dwyera", name: "Ava Dwyer", type: "full", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [2] },
    { id: "dwyerj", name: "Julian Dwyer", type: "full", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [2] },
    { id: "freemano", name: "Oliver Freeman", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "freemans", name: "Sophia Freeman", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "furlongl", name: "Logan Furlong", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "hohlc", name: "Charlie Hohl", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 6] },
    { id: "hohlp", name: "Peter Hohl", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 6] },
    { id: "kokoszkaj", name: "James Kokoszka", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "kroningl", name: "Lenny Kroning", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "laffeyc", name: "Claire Laffey", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 4, 5, 6] },
    { id: "laffeyj", name: "Jack Laffey", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 4, 5, 6] },
    { id: "maruccic", name: "Casper Marucci", type: "full", days: ["Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2] },
    { id: "medasanin", name: "Neera Medasani", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "montize", name: "Emma Montiz", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "mullenm", name: "Mackenzie Mullen", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [2, 4, 5, 6] },
    { id: "mullenr", name: "Riverly Mullen", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [2, 4, 5, 6] },
    { id: "olsonc", name: "Caden Olson", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [6] },
    { id: "olsonf", name: "Finan Olson", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [6] },
    { id: "pernaas", name: "Asa Perna", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "pernaav", name: "Ava Perna", type: "short", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "porterh", name: "Harper Porter", type: "full", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "rioa", name: "Adelina Rio", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "rhodesl", name: "Lincoln Rhodes", type: "short", days: ["Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [3, 6] },
    { id: "ruffinl", name: "Lennon Ruffin", type: "short", days: ["Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 6] },
    { id: "sarveshm", name: "Meera Sarvesh", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 2, 3, 4, 5, 6] },
    { id: "schwitzero", name: "Oak Schwitzer", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 3, 4, 5, 6] },
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

function applyFilters() {
    const searchTerm = (document.getElementById('search-input')?.value || '').toLowerCase();
    const activeTab = document.querySelector('.tab-btn.active')?.dataset.target || 'all';

    document.querySelectorAll('.student-item').forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const type = card.dataset.type;
        const isScheduled = !card.classList.contains('not-scheduled');

        const matchesSearch = name.includes(searchTerm);
        const matchesTab = (activeTab === 'all' || type === activeTab);

        card.style.display = (matchesSearch && matchesTab && isScheduled) ? 'flex' : 'none';
    });
}

function buildStudentList() {
    const listContainer = document.getElementById('student-list');
    listContainer.innerHTML = '';
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const currentWeek = getCurrentCampWeek();

    document.getElementById('current-date').innerHTML = `${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} <br><span style="font-size: 0.9em; color: #555;">Camp Week: ${currentWeek}</span>`;

    let scheduledTotal = 0, scheduledFull = 0, scheduledShort = 0;

    studentRoster.forEach(student => {
        if (!student.weeks.includes(currentWeek)) return;
        const isScheduledToday = student.days.includes(todayName);
        if (isScheduledToday) {
            student.type === 'full' ? scheduledFull++ : scheduledShort++;
            scheduledTotal++;
        }

        const card = document.createElement('div');
        card.className = `student-item ${isScheduledToday ? '' : 'not-scheduled'}`;
        card.dataset.id = student.id;
        card.dataset.type = student.type;
        card.innerHTML = `<h3>${student.name} ${!isScheduledToday ? '<span class="badge-not-scheduled">Not Scheduled Today</span>' : (student.type === 'full' ? '<span class="badge-full">Full Day</span>' : '<span class="badge-short">Shortened</span>')}</h3>
            <div class="status-info"><p>In: <strong id="${student.id}-lastCheckIn">N/A</strong></p><p>Out: <strong id="${student.id}-lastCheckOut">N/A</strong></p><p>Sun: <strong id="${student.id}-lastSunscreen">N/A</strong></p></div>
            <div class="buttons"><button class="check-in-btn" data-id="${student.id}">Check In</button><button class="check-out-btn" data-id="${student.id}">Check Out</button><button class="sunscreen-btn" data-id="${student.id}">Sunscreen</button></div>`;
        listContainer.appendChild(card);
    });

    document.getElementById('totalScheduledCount').textContent = scheduledTotal;
    document.getElementById('fullScheduledCount').textContent = scheduledFull;
    document.getElementById('shortScheduledCount').textContent = scheduledShort;
    applyFilters();
}

function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
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
                applyFilters();
            }
        });
    });
    document.getElementById('search-input')?.addEventListener('input', applyFilters);
}

document.addEventListener('DOMContentLoaded', () => {
    buildStudentList();
    setupTabs();
    studentsRef.on('value', (snapshot) => {
        const dataExists = snapshot.exists();
        document.querySelectorAll('.student-item').forEach((card) => {
            const id = card.dataset.id;
            if (dataExists && snapshot.hasChild(id)) {
                const data = snapshot.child(id).val();
                card.querySelector(`#${id}-lastCheckIn`).textContent = formatTimestamp(data.lastCheckIn);
                card.querySelector(`#${id}-lastCheckOut`).textContent = formatTimestamp(data.lastCheckOut);
                card.querySelector(`#${id}-lastSunscreen`).textContent = formatTimestamp(data.lastSunscreen);
                card.classList.toggle('checked-in', data.lastCheckIn && (!data.lastCheckOut || data.lastCheckIn > data.lastCheckOut));
                card.classList.toggle('checked-out', !!data.lastCheckOut);
            }
        });
    });
    // ... (keep your existing history logic and event listeners for buttons)
});
