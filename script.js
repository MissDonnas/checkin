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

const CAMP_START_DATE = new Date("2026-07-06T00:00:00");
const studentRoster = [
    { id: "adamsi", name: "Isaac Adams", type: "full", days: ["Tuesday", "Wednesday", "Thursday", "Friday"], weeks: [1, 2, 3, 5, 6] },
    /* ... (Ensure your full studentRoster array is here) ... */
    { id: "wingl", name: "Leona Wing", type: "short", days: ["Tuesday", "Wednesday", "Thursday"], weeks: [1, 2, 3, 4, 5, 6] }
];

function getCurrentCampWeek() {
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffTime = today - CAMP_START_DATE;
    return diffTime < 0 ? 1 : Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;
}

function updatePresentCounter() {
    const presentCount = document.querySelectorAll('.student-item.checked-in').length;
    document.getElementById('studentsPresentCount').textContent = presentCount;
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const activeTab = document.querySelector('.tab-btn.active').dataset.target;
    document.querySelectorAll('.student-item').forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const type = card.dataset.type;
        const isScheduled = !card.classList.contains('not-scheduled');
        card.style.display = (name.includes(searchTerm) && (activeTab === 'all' || type === activeTab) && isScheduled) ? 'flex' : 'none';
    });
    updatePresentCounter();
}

function buildStudentList() {
    const listContainer = document.getElementById('student-list');
    listContainer.innerHTML = '';
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const currentWeek = getCurrentCampWeek();
    
    studentRoster.forEach(s => {
        if (!s.weeks.includes(currentWeek)) return;
        const isToday = s.days.includes(todayName);
        const card = document.createElement('div');
        card.className = `student-item ${isToday ? '' : 'not-scheduled'}`;
        card.dataset.id = s.id;
        card.dataset.type = s.type;
        card.innerHTML = `<h3>${s.name}</h3>
            <p>In: <strong id="${s.id}-lastCheckIn">N/A</strong></p>
            <p>Out: <strong id="${s.id}-lastCheckOut">N/A</strong></p>
            <button class="check-in-btn" data-id="${s.id}">In</button>
            <button class="check-out-btn" data-id="${s.id}">Out</button>`;
        listContainer.appendChild(card);
    });
    applyFilters();
}

document.addEventListener('DOMContentLoaded', () => {
    buildStudentList();
    document.getElementById('search-input').addEventListener('input', applyFilters);
    
    studentsRef.on('value', (snap) => {
        const data = snap.val() || {};
        document.querySelectorAll('.student-item').forEach(card => {
            const id = card.dataset.id;
            const sData = data[id] || {};
            card.querySelector(`#${id}-lastCheckIn`).textContent = sData.lastCheckIn ? new Date(sData.lastCheckIn).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'}) : 'N/A';
            card.classList.toggle('checked-in', sData.lastCheckIn && (!sData.lastCheckOut || sData.lastCheckIn > sData.lastCheckOut));
        });
        updatePresentCounter();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.dataset.id) return;
        const id = e.target.dataset.id;
        if (e.target.className === 'check-in-btn') database.ref(`students/${id}/lastCheckIn`).set(Date.now());
        if (e.target.className === 'check-out-btn') database.ref(`students/${id}/lastCheckOut`).set(Date.now());
    });
});
