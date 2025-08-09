const apiUrl = 'https://script.google.com/macros/s/AKfycbyf7i6npS9CgUpAYrCAGQRgE-haF7rGXaDQqkF_y1FvJYElwQhBlNFmvOT_9wzy66JyEQ/exec';

//date
const dateDiv = document.getElementById('dateDisplay');
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1; //月份從0開始所以加1
const day = today.getDate();

dateDiv.textContent = `${year}/${month}/${day} 當週課表`;
//date end

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data.length === 0) return;

        console.log(data);

        const day1TableHead = document.querySelector('#day1-table thead');
        const day1TableBody = document.querySelector('#day1-table tbody');
        const day2TableHead = document.querySelector('#day2-table thead');
        const day2TableBody = document.querySelector('#day2-table tbody');

        day1TableHead.innerHTML = '';
        day1TableBody.innerHTML = '';
        day2TableHead.innerHTML = '';
        day2TableBody.innerHTML = '';

        const keys = Object.keys(data[0]);
        const key1 = keys.find(k => k.includes('1天')) || keys[0];  // 找包含「1天」的欄位，找不到就用第一欄
        const key2 = keys.find(k => k.includes('2天')) || keys[1];  // 找包含「2天」的欄位，找不到就用第二欄

        // 第一天下的資料
        let day1Actions = data.map(row => row[key1]).filter(x => x);
        // 第二天下的資料
        let day2Actions = data.map(row => row[key2]).filter(x => x);

        // 第一天下表頭
        let trHead1 = document.createElement('tr');
        let th1 = document.createElement('th');
        th1.textContent = key1 || '第1天課表';
        th1.colSpan = 1;
        trHead1.appendChild(th1);
        day1TableHead.appendChild(trHead1);

        day1Actions.forEach(action => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = action;
            tr.appendChild(td);
            day1TableBody.appendChild(tr);
        });

        // 第二天下表頭
        let trHead2 = document.createElement('tr');
        let th2 = document.createElement('th');
        th2.textContent = key2 || '第2天課表';
        th2.colSpan = 1;
        trHead2.appendChild(th2);
        day2TableHead.appendChild(trHead2);

        day2Actions.forEach(action => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = action;
            tr.appendChild(td);
            day2TableBody.appendChild(tr);
        });
    })
