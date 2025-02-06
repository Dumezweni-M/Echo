// Get element from DOM
const dateDisplay = document.getElementById('dateDisplay');

// Set Days and Months
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


const date = new Date()

const day = date.getDate();
const weekday = days[ date.getDay()]
const month = months[ date.getMonth()]


// Update time frequently
setInterval(() => {
    const time = new Date();

    const currentTime = time.toLocaleTimeString([], {
        hour:'2-digit',
        minute: '2-digit',
        hour12: false
    });

    dateDisplay.innerHTML = `
    <p class="text-4xl mr-2">${currentTime}</p>
    <p class="text-4xl ml-2"> ${weekday} ${day} ${month} </p>
    `;

}, 1000);





