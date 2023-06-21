// 요소 선언
const userName = document.querySelector("#userName");
const userID = document.querySelector("#userID");
const userNickname = document.querySelector("#nickname");
const userEmail = document.querySelector("#email");

// 로그인된 회원정보 
userName.innerText = login_user["name"];
userID.innerText = login_user["id"];
userNickname.innerText = login_user["nickname"];
userEmail.innerText = login_user["email"];