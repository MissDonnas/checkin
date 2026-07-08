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

// Helper to calculate status
function isPresent(data) {
    if (!data.lastCheckIn) return false;
    // If no checkout OR checkin happened after checkout
    return !data.lastCheckOut || data.lastCheckIn > data.lastCheckOut;
}

function updatePresentCounter() {
    // Count all cards that have the checked-in state
    const allCards = document.querySelectorAll('.student-item');
    let count = 0;
    allCards.forEach(card => {
        if (card.classList.contains('checked-in')) count++;
    });
    document.getElementById('studentsPresentCount').textContent = count;
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const activeTab = document.querySelector('.tab-btn.active').dataset.target;

    document.querySelectorAll('.student-item').forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const type = card.dataset.type;
        const isScheduled = !card.classList.contains('not-scheduled');
        
        const matchesSearch = name.includes(searchTerm);
        const matchesTab = (activeTab === 'all' || type === activeTab);
        
        card.style.display = (matchesSearch && matchesTab && isScheduled) ? 'flex' : 'none';
    });
    updatePresentCounter();
}

// Main logic
studentsRef.on('value', (snapshot) => {
    const data = snapshot.val() || {};
    
    document.querySelectorAll('.student-item').forEach(card => {
        const id = card.dataset.id;
        const sData = data[id] || {};
        
        // Update labels
        card.querySelector(`#${id}-lastCheckIn`).textContent = sData.lastCheckIn ? new Date(sData.lastCheckIn).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'}) : 'N/A';
        card.querySelector(`#${id}-lastCheckOut`).textContent = sData.lastCheckOut ? new Date(sData.lastCheckOut).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'}) : 'N/A';
        card.querySelector(`#${id}-lastSunscreen`).textContent = sData.lastSunscreen ? new Date(sData.lastSunscreen).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'}) : 'N/A';
        
        // Toggle Class
        if (isPresent(sData)) {
            card.classList.add('checked-in');
            card.classList.remove('checked-out');
        } else if (sData.lastCheckOut) {
            card.classList.add('checked-out');
            card.classList.remove('checked-in');
        } else {
            card.classList.remove('checked-in', 'checked-out');
        }
    });
    updatePresentCounter();
});

document.addEventListener('DOMContentLoaded', () => {
    // ... (Keep your buildStudentList() here) ...
    buildStudentList();
    
    document.getElementById('search-input').addEventListener('input', applyFilters);
    
    document.getElementById('student-list').addEventListener('click', (e) => {
        if(!e.target.tagName === 'BUTTON') return;
        const id = e.target.dataset.id;
        const typeMap = {'check-in-btn': 'lastCheckIn', 'check-out-btn': 'lastCheckOut', 'sunscreen-btn': 'lastSunscreen'};
        const key = typeMap[e.target.className];
        if(key) database.ref(`students/${id}/${key}`).set(Date.now());
    });
});
