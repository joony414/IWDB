const idInput = document.querySelector('input[type="text"]');
const nameInput = document.querySelector('input[name="name"]');
const emailInput = document.querySelector('input[type="email"]');
const findPasswordButton = document.querySelector('input[type="submit"]');
const savedAccounts = JSON.parse(localStorage.getItem(ACCOUNT_KEY));

findPasswordButton.addEventListener("click", (event) => {
  event.preventDefault();

  let foundAccounts = savedAccounts.filter((currentAccount) => currentAccount["email"] === emailInput.value && currentAccount["id"] === idInput.value);
    // 입력된 이메일과 ID와 일치하는 계정을 필터링하여 찾음
  if (foundAccounts.length === 0) {   // 일치하는 계정이 없는 경우
    swal('error!', "일치하는 계정을 찾을 수 없습니다.", 'error');
    // alert("일치하는 계정을 찾을 수 없습니다.");

    idInput.value = "";   // 입력필드들의 값을 초기화
    nameInput.value = "";
    emailInput.value = "";
  } else {
    swal('success', "등록된 이메일로 비밀번호를 전송했습니다.", 'success');
    //alert("등록된 이메일로 비밀번호를 전송했습니다.");
    idInput.value = "";
    nameInput.value = "";
    emailInput.value = "";
  }
});
