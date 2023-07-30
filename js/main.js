let registerUserModalBtn = document.querySelector('#registerUser-modal');
let loginUserModalBtn = document.querySelector('#loginUser-modal');
let registerUserModalBlock = document.querySelector('#registerUser-block');
let loginUserModalBlock = document.querySelector('#loginUser-block');
let registerUserBtn = document.querySelector('#registerUser-btn');
let loginUserBtn = document.querySelector('#loginUser-btn');
let logoutUserBtn = document.querySelector('#logoutUser-btn');
let closeModalBtn = document.querySelector('.btn-close');
let showUsername = document.querySelector('#showUsername');
let adminPanel = document.querySelector('#admin-panel');  
let addTourBtn = document.querySelector('.add-tour-btn');
let saveChangesBtn = document.querySelector('.save-changes-btn');
let tourList = document.querySelector('#tour_list');
let perfecturesList = document.querySelector('.dropdown-menu');
let searchForm = document.querySelector('form');


//* inputs group
let usernameInp = document.querySelector('#reg-username');
let ageInp = document.querySelector('#reg-age');
let passwordInp = document.querySelector('#reg-password');
let passwordConfirmInp = document.querySelector('#reg-passwordConfirm');
let isAdminInp = document.querySelector('#isAdmin');
let loginUsernameInp = document.querySelector('#login-username');
let loginPasswordInp = document.querySelector('#login-password');
let tourTitle = document.querySelector('#tour-title');
let tourDesc = document.querySelector('#tour-desc');
let tourImage = document.querySelector('#tour-image-url');
let tourPerfecture = document.querySelector('#tour-perfecture');
let tourPerfectureImage = document.querySelector('#tour-perfecture-image');
let searchInp = document.querySelector('#search-inp');

//* account logic
registerUserModalBtn.addEventListener('click', () => {
  registerUserModalBlock.setAttribute('style', 'display: flex !important;');
  registerUserBtn.setAttribute('style', 'display: block !important;');
  loginUserModalBlock.setAttribute('style', 'display: none !important;');
  loginUserBtn.setAttribute('style', 'display: none !important;');
});

loginUserModalBtn.addEventListener('click', () => {
  registerUserModalBlock.setAttribute('style', 'display: none !important;');
  registerUserBtn.setAttribute('style', 'display: none !important;');
  loginUserModalBlock.setAttribute('style', 'display: flex !important;');
  loginUserBtn.setAttribute('style', 'display: block !important;');
});


//* register
const USERS_API = 'http://localhost:8000/users';

async function checkUniqueUsername(username) {
    let res = await fetch(USERS_API);
    let users = await res.json();
    return users.some(user => user.username === username);
};

async function registerUser() {
    if(
        !usernameInp.value.trim() ||
        !ageInp.value.trim() ||
        !passwordInp.value.trim() ||
        !passwordConfirmInp.value.trim()
    ) {
        alert('Some inputs are empty!');
        return;
    };

    let uniqueUsername = await checkUniqueUsername(usernameInp.value);

    if(uniqueUsername) {
        alert('User with this username already exists!');
        return;
    };

    if(passwordInp.value !== passwordConfirmInp.value) {
        alert('Passwords don\'t match!');
        return;
    };

    let userObj = {
        username: usernameInp.value,
        age: ageInp.value,
        password: passwordInp.value,
        isAdmin: isAdmin.checked
    };

    fetch(USERS_API, {
        method: 'POST',
        body: JSON.stringify(userObj),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    usernameInp.value = '';
    ageInp.value = '';
    passwordInp.value = '';
    passwordConfirmInp.value = '';
    isAdminInp.checked = false;

    closeModalBtn.click();
};

registerUserBtn.addEventListener('click', registerUser);


//* login
function checkLoginLogoutStatus() {
    let user = localStorage.getItem('user');
    if(!user) {
        loginUserModalBtn.parentNode.style.display = 'block';
        logoutUserBtn.parentNode.style.display = 'none';
        showUsername.innerText = 'No user';
    } else {
        loginUserModalBtn.parentNode.style.display = 'none';
        logoutUserBtn.parentNode.style.display = 'block';
        showUsername.innerText = JSON.parse(user).username;
    };

    showAdminPanel();
};
checkLoginLogoutStatus();

function checkUserInUsers(username, users) {
    return users.some(item => item.username === username);
};

function checkUserPassword(user, password) {
    return user.password === password;
};

function setUserToStorage(username, isAdmin) {
    localStorage.setItem('user', JSON.stringify({
        username,
        isAdmin
    }));
};

async function loginUser() {
    if(
        !loginUsernameInp.value.trim() ||
        !loginPasswordInp.value.trim()
    ) {
        alert('Some inpits are empty!');
        return;
    };

    let res = await fetch(USERS_API);
    let users = await res.json();

    if(!checkUserInUsers(loginUsernameInp.value, users)) {
        alert('User not found!');
        return;
    };

    let userObj = users.find(user => user.username === loginUsernameInp.value);

    if(!checkUserPassword(userObj, loginPasswordInp.value)) {
        alert('Wrong password!');
        return;
    };

    setUserToStorage(userObj.username, userObj.isAdmin);

    loginUsernameInp.value = '';
    loginPasswordInp.value = '';

    checkLoginLogoutStatus();

    closeModalBtn.click();

    render();
};

loginUserBtn.addEventListener('click', loginUser);


//* logout
logoutUserBtn.addEventListener('click', () => {
  localStorage.removeItem('user');
  checkLoginLogoutStatus();
  render();
});


//* change perfecture
function changePhoto(photoUrl) {
  const body = document.querySelector('body');
  body.style.backgroundImage = `url(${photoUrl})`;
}

const changePhotoCategory = document.querySelectorAll('#category');
changePhotoCategory.forEach(category => {
  category.addEventListener('click', changePhoto);
});


function changeTitle(titleText) {
  const title = document.querySelector('.header__title');
  title.innerText = titleText;
}

const changeTitleText = document.querySelectorAll('#category');
changePhotoCategory.forEach(category => {
  category.addEventListener('click', changeTitle);
});



//* product logic
function checkUserForTourCreate() {
  let user = JSON.parse(localStorage.getItem('user'));
  if(user) return user.isAdmin;
  return false;
};

function showAdminPanel() {
  if(!checkUserForTourCreate()) {
      adminPanel.setAttribute('style', 'display: none !important;');
  } else {
      adminPanel.setAttribute('style', 'display: flex !important;');
  };
};

//* create tour
const TOURS_API = 'http://localhost:8000/tours';

function cleanAdminForm() {
  tourTitle.value = '';
  tourDesc.value = '';
  tourImage.value = '';
  tourPerfecture.value = '';
  tourPerfectureImage.value = '';
};

async function createTour() {
  if(
      !tourTitle.value.trim() ||
      !tourDesc.value.trim() ||
      !tourImage.value.trim() ||
      !tourPerfecture.value.trim()
  ) {
      alert('Some inputs are empty!');
      return;
  };

  let tourObj = {
      title: tourTitle.value,
      desc: tourDesc.value,
      image: tourImage.value,
      perfecture: tourPerfecture.value,
      perfectureImage: tourPerfectureImage.value
  };

  await fetch(TOURS_API, {
      method: 'POST',
      body: JSON.stringify(tourObj),
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      }
  });

  cleanAdminForm();

  render();
};

addTourBtn.addEventListener('click', createTour);


//* read 
let swiper; 
let perfecture = '';
let search = '';

async function render() {
  let requestAPI = `${TOURS_API}?q=${search}&category=${perfecture}`;
    if(!perfecture) {
      requestAPI = `${TOURS_API}?q=${search}`;
    };
  tourList.innerHTML = '';
  //let res = await fetch(TOURS_API);
  let res = await fetch(requestAPI);
  let tours = await res.json();
  tours.forEach(tour => {
    const newCard = `
      <div class="carousel__card swiper-slide">
        <img class="card__img" src="${tour.image}" alt="">
        <div>
          <div class="card__content active__card">
            <h2 class="card__title">${tour.title}</h2>
            <p class="card__desc">
              ${tour.desc}
            </p>
            <button class="card__btn">
              Read more
            </button>
            <br>
            ${checkUserForTourCreate() ? 
              `<a href="#admin-panel" class="btn btn-dark btn-edit" id="edit-${tour.id}">EDIT</a>
              <a href="#admin-panel" class="btn btn-danger btn-delete" id="del-${tour.id}">DELETE</a>`
              :
              ''
              }

          </d>
        </div>
      </div>
    `;

  
    tourList.insertAdjacentHTML('beforeend', newCard);
  });

  //if(products.length === 0) return;
  addDeleteEvent();
  addEditEvent();
  addPerfectureToDropdownMenu();

  if(swiper) {
    swiper.destroy();
  }

  swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 300,
      modifier: 1,
      slideShadows: false
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    breakpoints: {
      1024: {
        slidesPerView: 2
      },
      1560: {
        slidesPerView: 3
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,  
      stretch: 0,
      depth: 300,
      modifier: 1,
      slideShadows: false
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    breakpoints: {
      1024: {
        slidesPerView: 2
      },
      1560: {
        slidesPerView: 3
      }
    }
  });
});

render()


//* delete
async function deleteTour(e) {
  let tourId = e.target.id.split('-')[1];

  await fetch(`${TOURS_API}/${tourId}`, {
      method: 'DELETE'
  });

  render();
};

function addDeleteEvent() {
  let deleteTourBtns = document.querySelectorAll('.btn-delete');
  deleteTourBtns.forEach(btn => btn.addEventListener('click', deleteTour));
};

//* update
function checkCreateAndSaveBtn() {
  if(saveChangesBtn.id) {
      addTourBtn.setAttribute('style', 'display: none;');
      saveChangesBtn.setAttribute('style', 'display: block;');
  } else {
      addTourBtn.setAttribute('style', 'display: block;');
      saveChangesBtn.setAttribute('style', 'display: none;');
  };
};
checkCreateAndSaveBtn();

async function addTourDataToForm(e) {
  let tourId = e.target.id.split('-')[1];
  let res = await fetch(`${TOURS_API}/${tourId}`);
  let tourObj = await res.json();
  
  tourTitle.value = tourObj.title;
  tourDesc.value = tourObj.desc;
  tourImage.value = tourObj.image;
  tourPerfecture.value = tourObj.perfecture;

  saveChangesBtn.setAttribute('id', tourObj.id);

  checkCreateAndSaveBtn();
};

function addEditEvent() {
  let editTourBtns = document.querySelectorAll('.btn-edit');
  editTourBtns.forEach(btn => btn.addEventListener('click', addTourDataToForm));
};

async function saveChanges(e) {
  let updatedTourObj = {
      id: e.target.id,
      title: tourTitle.value,
      desc: tourDesc.value,
      image: tourImage.value,
      perfecture: tourPerfecture.value,
      perfectureImage: tourPerfectureImage.value,
  };

  await fetch(`${TOURS_API}/${e.target.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedTourObj),
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      }
  });

  cleanAdminForm();

  saveChangesBtn.removeAttribute('id');

  checkCreateAndSaveBtn();

  render();
};

saveChangesBtn.addEventListener('click', saveChanges);


//* filtering
async function addPerfectureToDropdownMenu() {
  let res = await fetch(TOURS_API);
  let data = await res.json();
  let perfectures = new Set(data.map(tour => tour.perfecture));
  let perfectureImages = [];

  for (let tour of data) {
    perfectureImages.push(tour.perfectureImage);
  }

  let dropdownHTML = '<li><a class="dropdown-item text-white" href="#">all</a></li>';
  let index = 0;
  for (let perfecture of perfectures) {
    let perfectureImage = perfectureImages[index];
    dropdownHTML += `
      <li>
        <a class="dropdown-item text-white" url="${perfectureImage}" title="${perfecture}" href="#">${perfecture}</a>
      </li>
    `;
    index++;
  }
  perfecturesList.innerHTML = dropdownHTML;
  addClickEventOnDropdownItem(perfectures, data);
};

let currentBackgroundUrl = '../img/japan.png';

function filterOnPerfecture(e, data) {
  let perfectureText = e.target.innerText;
  if (perfectureText === 'all') {
    perfecture = '';
    document.body.style.backgroundImage = `url(${currentBackgroundUrl})`;
  } else {
    perfecture = perfectureText;
  }

  render();

  let filteredTours = data.filter(tour => tour.perfecture === perfecture);
  if (filteredTours.length > 0) {
    let photoUrl = filteredTours[0].perfectureImage;
    changePhoto(photoUrl);
    changeTitle(perfectureText);
  } else {
    currentBackgroundUrl = '../img/japan.png';
    changePhoto(currentBackgroundUrl);
    changeTitle('Japan');
  }
}



function addClickEventOnDropdownItem(perfectures, data) {
  let perfectureItems = document.querySelectorAll('.dropdown-item');
  perfectureItems.forEach(item => item.addEventListener('click', (e) => filterOnPerfecture(e, data)));
};

addPerfectureToDropdownMenu();

