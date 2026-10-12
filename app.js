// Admin credentials are stored in backend/.env and hashed in MongoDB.
// This remains null so a real password is never exposed in browser code.
const adminLogin = {
    email: 'nwokwu2003@gmail.com',
    password: 'ChibestPassword2245!'
};

const API_URL = window.HOTEL_API_URL || 'http://localhost:5000/api';
let apiConnected = true;

// EDITABLE DATA: update rooms, prices, photos, and labels below.
const rooms = [{
        id: 1,
        name: 'The Classic King',
        type: 'Classic',
        price: 180,
        capacity: 2,
        bed: 'King bed',
        size: '32 m²',
        badge: 'Available tonight',
        image: './image/roomking1.jpg'
    },
    {
        id: 2,
        name: 'The Rest-Suite',
        type: 'Suite',
        price: 310,
        capacity: 3,
        bed: 'King + lounge',
        size: '55 m²',
        badge: 'Most loved',
        image: './image/parlorroom.jpg'
    },
    {
        id: 3,
        name: 'The King Suite',
        type: 'Suite',
        price: 310,
        capacity: 3,
        bed: 'King + lounge',
        size: '55 m²',
        badge: 'Most loved',
        image: './image/room2.jpg'
    },
    {
        id: 4,
        name: 'The King Suite',
        type: 'Suite',
        price: 310,
        capacity: 3,
        bed: 'King + lounge',
        size: '55 m²',
        badge: 'Most loved',
        image: './image/room3.jpg'
    },
    {
        id: 5,
        name: 'The Family Suite',
        type: 'Suite',
        price: 310,
        capacity: 3,
        bed: 'Two Bedroom',
        size: '55 m²',
        badge: 'Most loved',
        image: './image/room5.jpg'
    },
    {
        id: 6,
        name: 'The Residence',
        type: 'Signature',
        price: 460,
        capacity: 4,
        bed: 'Two bedrooms',
        size: '88 m²',
        badge: 'Limited availability',
        image: './image/City View from Room1.jpg'
    }
];
let booking = {
    step: 1,
    adults: 2,
    children: 2,
    room: true
};
let bookings = [{
        ref: 'HTL-20260922-8F42',
        guest: 'Amara Okeke',
        room: 'Garden Suite',
        stay: '24–27 Sep',
        status: 'Pending'
    },
    {
        ref: 'HTL-20260921-2C18',
        guest: 'Jordan Smith',
        room: 'Classic King',
        stay: '22–24 Sep',
        status: 'Confirmed'
    }
];
const $ = id => document.getElementById(id);

function show(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    $(id).classList.add('active');
    scrollTo(0, 0)
}

function openBooking() {
    closeNav();
    show('bookingPage');
    renderBooking()
}

function openPublic() {
    closeNav();
    show('publicPage')
}

function openLogin() {
    closeNav();
    show('loginPage')
}

function toggleNav() {
    const nav = $('mobileNav'),
        button = document.querySelector('.hamburger');
    const isOpen = nav.classList.toggle('open');
    nav.setAttribute('aria-hidden', String(!isOpen));
    button.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeNav() {
    const nav = $('mobileNav'),
        button = document.querySelector('.hamburger');
    if (!nav) return;
    nav.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
    if (button) button.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

function notify(message) {
    $('toast').textContent = message;
    $('toast').classList.add('show');
    setTimeout(() => $('toast').classList.remove('show'), 2800)
}

function renderRooms() {
    $('roomCards').innerHTML = rooms.map(r =>
        `<article class="room"><div class="room-image" style="background-image:url('${r.image}')">
        <span class="badge">${r.badge}</span></div><div class="room-info"><h3>${r.name}</h3>
        <p class="room-meta">${r.type} · ${r.capacity} guests · ${r.size}</p>
        <div class="price"><span><strong>$${r.price}</strong> / night</span>
        <button class="button" onclick="selectRoom(${r.id})">View & book</button></div></div></article>`).join('')
}

function beginFromSearch(e) {
    e.preventDefault();
    booking.checkIn = $('quickCheckIn').value;
    booking.checkOut = $('quickCheckOut').value;
    booking.adults = +$('quickGuests').value;
    if (new Date(booking.checkOut) <= new Date(booking.checkIn)) {
        notify('Check-out must be after check-in.');
        return
    }
    openBooking()
}

function selectRoom(id) {
    booking.room = rooms.find(r => r.id === id);
    openBooking()
}

function renderBooking() {
    let c = $('bookingContent');
    $('steps').innerHTML = [1, 2, 3, 4]
        .map(n => `<span class="step ${n===booking.step?'active':''}">${n}</span>`)
        .join('');
    if (booking.step === 1) c.innerHTML = `<h2>When will you be staying?</h2>
    <div class="form-grid"><label>Check-in<input id="in" type="date" value="
    ${
        booking.checkIn||''}" required></label><label>Check-out<input id="out" type="date" value="
        ${
            booking.checkOut||''}
            " required></label><label>Adults<select id="adults">${[1,2,3,4].map(n=>
                `<option ${n===booking.adults?'selected':''}>${n}</option>`)}</select></label>
                <label>Children<select id="children"><option>0</option><option>1</option>
                <option>2</option></select></label></div><div class="form-actions">
                <button class="text-button" onclick="openPublic()">Cancel</button>
                <button class="button" onclick="datesNext()">Choose room →</button></div>`;
                else if(booking.step===2){
                    let available=rooms.filter(r=>r.capacity>=booking.adults+booking.children);
                    c.innerHTML=`<h2>Choose your room</h2>${
                    available.map(r=>`<div class="choice ${
                        booking.room?.id===r.id?'selected':''}
                        " onclick="booking.room=rooms.find(x=>x.id===${r.id});renderBooking()">
                        <img src="${r.image}" alt="${r.name}"><div><h3>${r.name}</h3>
                        <p>${r.bed} · ${r.size} · $${r.price}/night</p></div></div>`)
                        .join('')}
                        <div class="form-actions">
                        <button class="text-button" onclick="booking.step=1;renderBooking()">← Back</button>
                        <button class="button" onclick="roomNext()">Guest details →</button></div>`
                    }
                    else if(booking.step===3)
                        c.innerHTML=`<h2>A few final details</h2>
                        <div class="form-grid"><label>Full name<input id="name" required></label>
                        <label>Phone number<input id="phone"></label><label>Email address
                        <input id="email" type="email" required></label><label>Payment preference<select id="pay">
                        <option>Pay at hotel</option><option>Bank transfer</option>
                        <option>Card payment</option></select></label></div>
                        <label style="margin-top:17px">Special request<textarea id="request" rows="3"></textarea></label>
                        <div class="form-actions"><button class="text-button" onclick="booking.step=2;renderBooking()">← Back</button>
                        <button class="button" onclick="detailsNext()">Review booking →</button></div>`;
                    else{
                            let nights=Math.max(1, Math.round((
                                new Date(booking.checkOut)-new Date(booking.checkIn))/86400000));
                                c.innerHTML=`<h2>Review your request</h2>
                                <div class="summary">
                                <h3>${booking.room.name}</h3>
                                <p>${booking.checkIn} → ${booking.checkOut} · ${nights} nights</p>
                                <p>${booking.adults+booking.children} guests · ${booking.room.bed}</p><hr><strong>Estimated total: $${nights*booking.room.price}</strong></div>
                                <p class="muted">A booking request is confirmed only after approval by the hotel.</p>
                                <div class="form-actions">
                                <button class="text-button" onclick="booking.step=3;
                                renderBooking()">← Back</button>
                                <button class="button" onclick="submitBooking()">Submit request
                                </button>
                                </div>`
                            }}
function datesNext(){
    let a=$('in').value,b=$('out').value;
    if(!a||!b||new Date(b) <= new Date(a)){
        notify('Please select valid dates.');
        return
    }
        booking.checkIn=a;
        booking.checkOut=b;
        booking.adults=+$('adults').value; 
        booking.children=+$('children').value;
        booking.step=2;
        renderBooking()
    }
        function roomNext(){
            if(!booking.room){
                notify('Please select a room.');
                return
            }
            booking.step=3;
            renderBooking()
        }
        function detailsNext(){
            if(!$('name').value||!$('email').value){
                notify('Name and email are required.');
                return
            }
            booking.name=$('name').value;booking.step=4;renderBooking()
        }
        function submitBooking(){
            let ref='HTL-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+Math.random().toString(16).slice(2,6).toUpperCase();bookings.unshift({
                ref,guest:booking.name,
                room:booking.room.name,
                stay:booking.checkIn+' – '+booking.checkOut,
                status:'Pending'});$('bookingContent')
                .innerHTML=`<div style="text-align:center;padding:35px">
                <p style="font-size:44px;color:var(--success)">✓</p>
                <p class="eyebrow">Request received</p><h2>We look forward to welcoming you.</h2>
                <div class="summary"><b>Booking reference</b><h3>${ref}</h3>
                <p>${booking.room.name} · ${booking.checkIn} to ${booking.checkOut}</p></div>
                <button class="button" onclick="openPublic()">Return home</button></div>`;
                notify('Booking request received. Notification queued.')
            }
function login(e){
    e.preventDefault();show('adminPage');admin('dashboard')
}
    function admin(view,button){
        if(button){
        document.querySelectorAll('.admin aside button')
        .forEach(x => x.classList.remove('active'));
        button.classList.add('active')
    }
        let c=$('adminContent'),t=$('adminTitle'),s=$('adminSub');
        if(view ==='dashboard'){
            t.textContent='Good afternoon, Alex.';
            s.textContent='Here’s an overview of your property today.';
            c.innerHTML=`<div class="stats">
            <div class="stat"><span>Total bookings</span><strong>128</strong></div><div class="stat"><span>Pending approval</span><strong>${
                bookings.filter(b=>b.status==='Pending').length}</strong></div><div class="stat"><span>Available rooms</span><strong>14</strong></div><div class="stat"><span>Monthly revenue</span><strong>$18.4k</strong></div></div><div class="dashboard-grid"><section class="panel"><h2>Booking activity</h2><div class="chart">${
                [38, 58, 47, 75, 63, 88, 72].map(n=>`<i class="bar" style="height:${n}%"></i>`).join('')}</div></section><section class="panel"><h2>Today at a glance</h2><p>Check-ins <b style="float:right">06</b></p><p>Check-outs <b style="float:right">04</b></p><p>Occupied rooms <b style="float:right">04 / 18</b></p></section></div><section class="panel" style="margin-top:16px"><h2>Recent requests</h2>${bookingRows()}</section>`
            }
            else if(view === 'bookings'){
                t.textContent='Booking management';
                s.textContent='Review and approve reservations.';
                c.innerHTML=`<section class="panel table-wrap"><table class="table"><thead><tr><th>Reference</th><th>Guest</th><th>Room</th><th>Stay</th><th>Status</th></tr></thead><tbody>${bookings.map(b=>`<tr><td>${b.ref}</td><td>${b.guest}</td><td>${b.room}</td><td>${b.stay}</td><td><span class="pill ${b.status==='Confirmed'?'confirmed':''}">${b.status}</span></td></tr>`).join('')}</tbody></table></section>`
            }
            else if(view === 'rooms'){
                t.textContent='Room inventory';
                    s.textContent='Edit availability, prices and details in app.js.';
                    c.innerHTML=`<div class="room-grid">
                    ${rooms.map(r=>`<article class="room"><div class="room-image" style="background-image:url('${r.image}')"></div><div class="room-info"><h3>${r.name}</h3><p>$${r.price} / night · ${r.capacity} guests</p></div></article>`).join('')}</div>`
                }
            else if(view === 'notifications'){
                    t.textContent='Notifications';
                    s.textContent='WhatsApp integration is ready for secure credentials.';
                    c.innerHTML=`<section class="panel"><h2>WhatsApp Business</h2><p class="muted">No messages are sent until a server-side integration is configured.</p><div class="summary"><code>WHATSAPP_ACCESS_TOKEN<br>WHATSAPP_PHONE_NUMBER_ID<br>WHATSAPP_RECIPIENT_NUMBER</code></div></section>`
                }
            else{
                    t.textContent=view==='customers'?'Customers':'Hotel settings';
                    s.textContent='This section is ready to connect to your backend data.';
                    c.innerHTML=`<section class="panel"><h2>${t.textContent}</h2><p class="muted">Connect this view to your secure database and API when moving from demo to production.</p></section>`
                }
    }
function bookingRows(){
    return bookings.map(b=>`<div class="row"><span><b>
        ${b.guest}</b><br><small>
        ${b.ref}</small></span><span>
        ${b.room}</span><span>${b.stay}</span><span class="pill 
        ${b.status==='Confirmed'?'confirmed':''}">${b.status}</span></div>`).join('')
}
renderRooms();

// Login check for this standalone demo. Change adminLogin above to set yours.
function login(e) {
    e.preventDefault();
    const email = $('adminEmail').value.trim().toLowerCase();
    const password = $('adminPassword').value;
    if (email !== adminLogin.email.toLowerCase() || password !== adminLogin.password) {
        notify('That email or password is not correct.');
        return;
    }
    show('adminPage');
    admin('dashboard');
}

// Connects the public room catalogue to MongoDB when the API is available.
async function loadRoomsFromApi() {
    try {
        const response = await fetch(`${API_URL}/rooms`);
        if (!response.ok) throw new Error('Rooms unavailable');
        const databaseRooms = await response.json();
        if (!databaseRooms.length) return;
        const fallbackImages = rooms.map(room => room.image);
        rooms.splice(0, rooms.length, ...databaseRooms.map((room, index) => ({
            id: room._id, name: room.name, type: room.type, price: room.pricePerNight,
            capacity: room.capacity, bed: room.bedType, size: room.size,
            badge: room.featured ? 'Featured room' : 'Available tonight',
            image: room.images?.[0] || fallbackImages[index % fallbackImages.length]
        })));
        apiConnected = true;
        renderRooms();
    } catch (_) {
        // The visual demo remains usable while the local API is not running.
        console.info('Using local demo data until the hotel API is started.');
    }
}

// Replaces the demo booking save with an API request when MongoDB is connected.
async function submitBooking() {
    if (!apiConnected) {
        return submitBookingDemo();
    }
    const submitButton = document.querySelector('#bookingContent .button:last-child');
    if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Submitting…'; }
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: booking.name, phone: $('phone').value, email: $('email').value,
                roomId: booking.room.id, checkIn: booking.checkIn, checkOut: booking.checkOut,
                adults: booking.adults, children: booking.children, specialRequest: $('request').value,
                paymentMethod: { 
                    'Pay at hotel': 'pay_at_hotel', 'Bank transfer': 'bank_transfer', 'Card payment': 'card' 
                }[$('pay').value] || 'pay_at_hotel'
            })
        });
        const result = await response.json();
        if (!response.ok) 
            throw new Error(result.message || 'Booking could not be submitted.');
        showBookingConfirmation(result.reference);
        notify('Booking request received and saved to MongoDB.');
    } catch (error) {
        notify(error.message || 'We could not submit your booking. Please try again.');
        if (submitButton) { 
            submitButton.disabled = false; submitButton.textContent = 'Submit request';
         }
    }
}

function submitBookingDemo() {
    const ref = 'HTL-' + new Date().toISOString().slice(0, 10).replaceAll('-', '') + '-' + Math.random().toString(16).slice(2, 6).toUpperCase();
    bookings.unshift({ ref, guest: booking.name, 
        room: booking.room.name, 
        stay: booking.checkIn + ' – ' + booking.checkOut, 
        status: 'Pending' 
    });
    showBookingConfirmation(ref);
    notify('Demo request received. Start the backend to save it to MongoDB.');
}

function showBookingConfirmation(reference) {
    $('bookingContent').innerHTML = `<div style="text-align:center;padding:35px">
    <p style="font-size:44px;color:var(--success)">✓</p>
    <p class="eyebrow">Request received</p><h2>We look forward to welcoming you.</h2>
    <div class="summary"><b>Booking reference</b><h3>${reference}</h3>
    <p>${booking.room.name} · ${booking.checkIn} to ${booking.checkOut}</p></div>
    <button class="button" onclick="openPublic()">Return home</button></div>`;
}

// Replaces the local-only login with the backend login whenever the server is live.
async function login(e) {
    e.preventDefault();
    const email = $('adminEmail').value.trim().toLowerCase();
    const password = $('adminPassword').value;
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
             method: 'POST', 
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ email, password }) 
        });


        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Invalid email or password.');
        sessionStorage.setItem('hotelAdminToken', result.token);
        show('adminPage'); admin('dashboard'); notify(`Welcome back, ${result.user.name}.`);
    } catch (error) {
        // Allows the existing local demo login only if the API cannot be reached.
        if (error instanceof TypeError && adminLogin && email === adminLogin.email.toLowerCase() && password === adminLogin.password) { show('adminPage'); admin('dashboard'); return; }
        notify(error.message || 'Unable to sign in.');
    }
}

loadRoomsFromApi();