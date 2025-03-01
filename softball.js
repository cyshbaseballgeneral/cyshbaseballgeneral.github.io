let schedules = [];

fetch('games.json').then((response) => {
    return response.json();
}).then((json)=>{
    schedules = json.schedules;
})

function showSchedule() {
    const date = document.getElementById("date-picker").value;
    const team = document.getElementById("teams-picker").value;
    const scheduleContainer = document.getElementById("schedule-container");
    console.log(schedules)

    scheduleContainer.innerHTML = "";

    let check = false;
    for(let schedule of schedules){
        if((date === "" && (schedule.home === team || schedule.away === team))||(date === schedule.date && team === "")||(date === schedule.date && (schedule.home === team || schedule.away === team))){
            const card = document.createElement('div');
            card.classList.add('schedule-card');
            card.innerHTML = `
                <p><strong>日期:</strong> ${schedule.date}</p>
                <p><strong>時間:</strong> ${schedule.time}</p>
                <p><strong>對戰隊伍:</strong> ${schedule.away} VS ${schedule.home}</p>
                <p><strong>對戰比數:</strong> ${schedule.scores}</p>
                <p><strong>地點:</strong> ${schedule.location}</p>
            `;
            check = true;
            scheduleContainer.appendChild(card);
        }
    }
    if(!check){
        scheduleContainer.innerHTML = `<p><strong>該日期或球隊無賽程</strong><p>`;
    }
}
