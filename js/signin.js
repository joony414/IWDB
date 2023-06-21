// 요소 및 변수 선언
const formBody = document.querySelector("div.callout");
const idInput = document.querySelector("#id-input");
const passwordInput = document.querySelector("#password");
const nameInput = document.querySelector("#name-input");
const nicknameInput = document.querySelector("#nickname-input");
const emailInput = document.querySelector("#email-input");
const idDoubleCheck = document.querySelector("#id-double-check");
const nicknameDoubleCheck = document.querySelector("#nickname-double-check");
const emailDoubleCheck = document.querySelector("#email-double-check");
const accounts = JSON.parse(localStorage.getItem(ACCOUNT_KEY));
let isIDChecked = false;
let isNicknameChecked = false;
let isEmailChecked = false;
const submitButton = document.querySelector("#submit-button");
const alertCallout = document.querySelector("div.alert.callout");

// 추가적인 다크 모드
if (savedDarkMode !== null) {
  isDarkModeOn = savedDarkMode === "true";
  if (isDarkModeOn) {
    formBody.classList.add("dark-mode");
    darkModeSwitch.checked = true;
  }
}
function toggleDarkMode(event) {
  formBody.classList.toggle("dark-mode");
  isDarkModeOn = darkModeSwitch.checked;
  localStorage.setItem(DARK_MODE_KEY, isDarkModeOn);
}
darkModeSwitch.addEventListener("change", toggleDarkMode);

// ID 중복 확인
idDoubleCheck.addEventListener("click", () => {
  id = idInput.value;
  let identicalID = accounts.filter((currentAccount) => currentAccount["id"] === id);
  // 공백 시
  if (id ==="") {
    isIDChecked = false;
    swal("error!", "아이디를 입력바랍니다.", "error");
  }
  // 비중복 시
  else if (identicalID.length === 0) {
    isIDChecked = true;
    swal("success", "사용 가능한 아이디입니다.", "success");
    //alert("사용 가능한 아이디입니다.");
  }
  // 중복 시
  else {
    isIDChecked = false;
    swal("error!", "이미 사용 중인 아이디입니다.", "error");
    //alert("이미 사용 중인 아이디입니다.");
  }
});
idInput.addEventListener("input", () => (isIDChecked = false));

// 닉네임 중복 확인
nicknameDoubleCheck.addEventListener("click", () => {
  nickname = nicknameInput.value;
  let identicalNickname = accounts.filter((currentAccount) => currentAccount["nickname"] === nickname);
  // 공백 시
  if (nickname ==="") {
    isNicknameChecked = false;
    swal("error!", "닉네임을 입력바랍니다.", "error");
  }
  // 비중복 시
  else if (identicalNickname.length === 0) {
    isNicknameChecked = true;
    swal("success", "사용 가능한 닉네임입니다.", "success");
    //alert("사용 가능한 닉네임입니다.");
  }
  // 중복 시
  else {
    isNicknameChecked = false;
    swal("error!", "이미 사용 중인 닉네임입니다.", "error");
    //alert("이미 사용 중인 닉네임입니다.");
  }
});
nicknameInput.addEventListener("input", () => (isNicknameChecked = false));

// 이메일 중복 확인
emailDoubleCheck.addEventListener("click", () => {
  email = emailInput.value;
  let identicalEmail = accounts.filter((currentAccount) => currentAccount["email"] === email);
  // 공백 시
  if (email ==="") {
    isEmailChecked = false;
    swal("error!", "이메일을 입력바랍니다.", "error");
  }
  // 비중복 시
  if (identicalEmail.length === 0) {
    isEmailChecked = true;
    swal("success", "사용 가능한 이메일입니다.", "success");
    //alert("사용 가능한 이메일입니다.");
  }
  // 중복 시
  else {
    isEmailChecked = false;
    swal("error!", "이미 사용 중인 이메일입니다.", "error");
    //alert("이미 사용 중인 이메일입니다.");
  }
});
emailInput.addEventListener("input", () => (isEmailChecked = false));

// 제출 버튼 기능
submitButton.addEventListener("click", (event) => {
  // 중복 없음이 확인 되었고 폼에 오류가 없을 시
  if (isIDChecked && isNicknameChecked && isEmailChecked && alertCallout.style.display === "none") {
    //alert("회원가입이 완료되었습니다.");
    let newAccount = {};
    newAccount["id"] = idInput.value;
    newAccount["password"] = passwordInput.value;
    newAccount["name"] = nameInput.value;
    newAccount["nickname"] = nicknameInput.value;
    newAccount["email"] = emailInput.value;
    newAccount["favorite"] = [];
    newAccount["history"] = [];
    newAccount["bookmark"] = [];
    accounts.push(newAccount);
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
    swal("success", "회원가입이 완료되었습니다.", "success").then((value) => {
      if (value) {
        location.replace("./login.html");
      }
    });
  }
  // 폼에 오류가 있을 시
  else if (alertCallout.style.display === "block") {
    swal("warning!", "기입하신 항목들을 다시 확인바랍니다.", "warning");
  }
  // 중복이 있을 시
  else {
    swal("warning!", "모든 중복확인을 수행해주십시오", "warning");
    //alert("모든 중복확인을 수행해주십시오");
  }
});
