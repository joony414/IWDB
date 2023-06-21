const id = document.querySelector('input[type="text"]');
const password = document.querySelector('input[type="password"]');
const loginButton = document.querySelector('input[type="submit"]');
const savedAccount = JSON.parse(localStorage.getItem(ACCOUNT_KEY));

loginButton.addEventListener("click", () => {
  let login_user = savedAccount.find((currentAccount) => currentAccount["id"] === id.value && currentAccount["password"] === password.value);
  if (login_user === undefined) {
    swal('로그인 실패!', "아이디와 비밀번호를 확인해 주세요", 'error');
    /*alert("아이디 또는 비밀번호가 올바르지 않습니다.");*/
    id.value = "";
    password.value = "";
  } else {
    localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
    location.replace("./main.html");
  }
});
