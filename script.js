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
    return diffTime < 0 ? 1 : Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;
}

function updatePresentCounter() {
    const presentCount = document.querySelectorAll('.student-item.checked-in').length;
    const el = document.getElementById('studentsPresentCount');
    if (el) el.textContent = presentCount;
}

function applyFilters() {
    const input = document.getElementById('search-input');
    if (!input) return;
    const searchTerm = input.value.toLowerCase();
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
    if (!listContainer) return;
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
        if (e.target.classList.contains('check-in-btn')) database.ref(`students/${id}/lastCheckIn`).set(Date.now());
        if (e.target.classList.contains('check-out-btn')) database.ref(`students/${id}/lastCheckOut`).set(Date.now());
    });
});
