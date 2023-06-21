// Foundation 플러그인
$(document).foundation();

// 키
const DARK_MODE_KEY = "dark_mode";
const LOGIN_USER_KEY = "login_user";
const ACCOUNT_KEY = "account";
const WEBTOON_INFO_KEY = "webtoon_info";

// 요소 선언
const darkModeSwitch = document.querySelector(".switch-input");
const body = document.body;
const myLibrayMenu = document.querySelector("#my-library-text");
const nicknameMenu = document.querySelector("#nickname-text");
const loginMenu = document.querySelector("#login-text");
const searchInput = document.querySelector("#search-box input");
const searchButton = document.querySelector("#search-button");


// 다크 모드
let isDarkModeOn = false;
const savedDarkMode = localStorage.getItem(DARK_MODE_KEY);
if (savedDarkMode !== null) {
  isDarkModeOn = savedDarkMode === "true";
  if (isDarkModeOn) {
    body.classList.add("dark-mode");
    darkModeSwitch.checked = true;
  }
}
function toggleDarkMode(event) {
  body.classList.toggle("dark-mode");
  isDarkModeOn = darkModeSwitch.checked;
  localStorage.setItem(DARK_MODE_KEY, isDarkModeOn);
}
darkModeSwitch.addEventListener("change", toggleDarkMode);

// 로그인 여부 확인
let login_user = null;
const savedLoginUser = JSON.parse(localStorage.getItem(LOGIN_USER_KEY));
if (savedLoginUser !== null) {
  login_user = savedLoginUser;
  myLibrayMenu.classList.remove("hide");
  nicknameMenu.classList.remove("hide");
  loginMenu.classList.add("hide");
  nicknameText = document.querySelector("#nickname-text");
  nicknameText.innerText = login_user["nickname"];
}

// 로그아웃 및 계정 정보 업데이트
const logout = document.querySelector("#logout-text");
logout.addEventListener("click", (event) => {
  event.preventDefault();
  let accounts = JSON.parse(localStorage.getItem(ACCOUNT_KEY));
  accounts.forEach(account => {
    if(account["id"] === login_user["id"]) {
      account["favorite"] = JSON.parse(JSON.stringify(login_user["favorite"]));
      account["history"] = JSON.parse(JSON.stringify(login_user["history"]));
      account["bookmark"] = JSON.parse(JSON.stringify(login_user["bookmark"]));
    }
  });
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
  localStorage.removeItem(LOGIN_USER_KEY);
  location.href = "./main.html";
});

// 검색 기능
searchButton.addEventListener("click", ()=> {
  location.href = `./search.html?query=${searchInput.value}`;
});
searchInput.addEventListener("keyup", (event)=>{
  // 엔터키인지 확인
  if (event.keyCode === 13) {
  location.href = `./search.html?query=${searchInput.value}`;    
  }
});
