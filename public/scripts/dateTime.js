const dateDisplay = document.getElementById('dateDisplay');

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const date = new Date()

const day = date.getDate();
const weekday = days[ date.getDay()]
const month = months[ date.getMonth()]



setInterval(() => {
    const time = new Date();
    const currentTime = time.toLocaleTimeString([], {hour:'2-digit', minute: '2-digit'});
    console.log(currentTime);

    dateDisplay.innerHTML = `
    <p class="text-2xl">${currentTime}</p>
    <p class="text-xl "> ${weekday} ${day} ${month} </p>
    `;

}, 1000);





