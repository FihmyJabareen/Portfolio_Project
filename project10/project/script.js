
const calendarDays = document.getElementById('calendar-days');
const monthYearElement = document.getElementById('month-year');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const selectedDateElement = document.getElementById('selected-date');


let currentDate = new Date();
let selectedDate = null;


const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];


function generateCalendar(year, month) {
    calendarDays.innerHTML = '';


    monthYearElement.textContent = `${monthNames[month]} ${year}`;


    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();


    const daysInPrevMonth = new Date(year, month, 0).getDate();




    for (let i = firstDay - 1; i >= 0; i--) {
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


            selectedDateElement.textContent = `Selected: ${monthNames[month]} ${i}, ${year}`;
        });

        calendarDays.appendChild(dayElement);
    }


    const totalDaysDisplayed = firstDay + daysInMonth;
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


generateCalendar(currentDate.getFullYear(), currentDate.getMonth());