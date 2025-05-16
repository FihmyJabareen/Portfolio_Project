const calendarDays = document.getElementById('calendar-days');
const monthYearElement = document.getElementById('month-year');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const selectedDateElement = document.getElementById('selected-date');
const eventSection = document.getElementById('event-section');
const eventList = document.getElementById('event-list');
const eventInput = document.getElementById('event-input');
const addEventButton = document.getElementById('add-event');
const clearEventsButton = document.getElementById('clear-events');

let currentDate = new Date();
let selectedDate = null;
let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

function getDateKey(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function saveEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

function showEventsForDate(date) {
    const dateKey = getDateKey(date);
    eventList.innerHTML = '';

    if (events[dateKey] && events[dateKey].length > 0) {
        events[dateKey].forEach((event, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${event}
                <button class="delete-event" data-index="${index}">✖</button>
            `;
            eventList.appendChild(li);
        });


        document.querySelectorAll('.delete-event').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                events[dateKey].splice(index, 1);
                saveEvents();
                showEventsForDate(date);
                generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
            });
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'אין אירועים לתאריך זה';
        eventList.appendChild(li);
    }
}

function generateCalendar(year, month) {
    calendarDays.innerHTML = '';

    monthYearElement.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();


    let adjustedFirstDay = firstDay;
    if (adjustedFirstDay === 0) adjustedFirstDay = 7;


    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day', 'other-month');
        dayElement.textContent = daysInPrevMonth - i;
        calendarDays.appendChild(dayElement);
    }

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;


    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = i;

        const dateKey = getDateKey(new Date(year, month, i));
        if (events[dateKey] && events[dateKey].length > 0) {
            dayElement.classList.add('has-event');
        }

        if (isCurrentMonth && i === today.getDate()) {
            dayElement.classList.add('today');
        }

        if (selectedDate &&
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month &&
            selectedDate.getDate() === i) {
            dayElement.classList.add('selected');
        }

        dayElement.addEventListener('click', () => {
            const previouslySelected = document.querySelector('.day.selected');
            if (previouslySelected) {
                previouslySelected.classList.remove('selected');
            }

            selectedDate = new Date(year, month, i);
            dayElement.classList.add('selected');

            selectedDateElement.textContent = `נבחר: ${i} ${monthNames[month]} ${year}`;
            eventSection.style.display = 'block';
            showEventsForDate(selectedDate);
        });

        calendarDays.appendChild(dayElement);
    }


    const totalDaysDisplayed = adjustedFirstDay + daysInMonth;
    const nextMonthDays = 42 - totalDaysDisplayed;

    for (let i = 1; i <= nextMonthDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day', 'other-month');
        dayElement.textContent = i;
        calendarDays.appendChild(dayElement);
    }
}


prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

addEventButton.addEventListener('click', () => {
    if (!selectedDate) return;
    if (!eventInput.value.trim()) return;

    const dateKey = getDateKey(selectedDate);
    if (!events[dateKey]) {
        events[dateKey] = [];
    }

    events[dateKey].push(eventInput.value.trim());
    saveEvents();
    eventInput.value = '';
    showEventsForDate(selectedDate);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

clearEventsButton.addEventListener('click', () => {
    if (!selectedDate) return;

    const dateKey = getDateKey(selectedDate);
    if (events[dateKey]) {
        delete events[dateKey];
        saveEvents();
        showEventsForDate(selectedDate);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    }
});


generateCalendar(currentDate.getFullYear(), currentDate.getMonth());