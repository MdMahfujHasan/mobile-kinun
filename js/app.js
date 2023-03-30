const loadPhones = async (searchText, dataLimit) => {
    try {
        const url = `https://openapi.programming-hero.com/api/phones?search=${searchText}`;
        const res = await fetch(url);
        const data = await res.json();
        displayPhones(data.data, dataLimit);
    }
    catch (error) {
        // console.log(error);
    }
}

const displayPhones = (phones, dataLimit) => {
    const phonesCard = document.getElementById('phones-card');
    phonesCard.textContent = '';
    const showAll = document.getElementById('show-all');
    const noPhonesFound = document.getElementById('no-phones-found');
    if (dataLimit && phones.length > 10) {
        phones = phones.slice(0, dataLimit);
        showAll.classList.remove('d-none');
    }
    else {
        showAll.classList.add('d-none');
    }
    if (phones.length === 0) {
        noPhonesFound.classList.remove('d-none');
    }
    else {
        noPhonesFound.classList.add('d-none');
    }
    phones.forEach(phone => {
        // console.log(phone);
        const { brand, phone_name, slug, image } = phone;
        // console.log(phone_name);
        const div = document.createElement('div');
        div.classList.add('col');
        div.innerHTML = `
        <div class="card">
            <img class="p-4 w-50" src="${image}" class="card-img-top" alt="phone image">
            <div class="card-body">
                <h5 class="card-title">${phone_name}</h5>
                <small>${brand}</small>
            </div>
            <button type="button" data-bs-toggle="modal" data-bs-target="#phoneDetails" class="btn btn-info text-white" onclick="loadPhoneDetails('${slug}')">Details</button>
        </div>
        `;
        phonesCard.appendChild(div);
    })
    handleLoading(false);
}

const getInputValue = dataLimit => {
    handleLoading(true);
    const searchInput = document.getElementById('search-input');
    const inputValue = searchInput.value;
    loadPhones(inputValue, dataLimit);
    searchInput.value = '';
}

document.getElementById('btn-search').addEventListener('click', function () {
    getInputValue(10);
})

document.getElementById('search-input').addEventListener('keypress', function (event) {
    // console.log(event.key);
    if (event.key === 'Enter') {
        getInputValue(10);
    }
})

document.getElementById('btn-show-all').addEventListener('click', function () {
    getInputValue();
})

const handleLoading = isloading => {
    const spinner = document.getElementById('spinner');
    if (isloading) {
        spinner.classList.remove('d-none');
    }
    else {
        spinner.classList.add('d-none');
    }
}

const loadPhoneDetails = async id => {
    const url = `https://openapi.programming-hero.com/api/phone/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayPhoneDetails(data.data);
}

// brand, name, releaseDate, mainFeatures --> storage, displaySize, chipSet, ///others--> WLAN, Bluetooth, GPS NFC
const displayPhoneDetails = details => {
    console.log(details);
    const { name, releaseDate, mainFeatures, others } = details;
    const { storage, displaySize, chipSet } = mainFeatures;
    const { WLAN, Bluetooth, GPS, NFC } = others;
    const phoneName = document.getElementById('phone-name');
    phoneName.innerText = `${name}`;
    const specifications = document.getElementById('specifications');
    specifications.innerHTML = `
    <p><b>Release Date:</b> ${releaseDate}</p>
    <p><b>Storage:</b> ${storage}</p>
    <p><b>Display Size:</b> ${displaySize}</p>
    <p><b>ChipSet:</b> ${chipSet}</p>
    <p><b>W-LAN:</b> ${WLAN}</p>
    <p><b>Bluetooth:</b> ${Bluetooth}</p>
    <p><b>GPS:</b> ${GPS}</p>
    <p><b>NFC:</b> ${NFC}</p>
    `;
}