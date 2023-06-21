const idInput = document.querySelector('input[type="text"]');
const emailInput = document.querySelector('input[type="email"]');
const findIdButton = document.querySelector('input[type="submit"]');
const savedAccounts = JSON.parse(localStorage.getItem(ACCOUNT_KEY));

findIdButton.addEventListener("click", (event) => {
  event.preventDefault();

  let foundAccounts = savedAccounts.filter((currentAccount) => currentAccount["email"] === emailInput.value);
  // 입력된 이메일과 일치하는 계정을 찾음

  if (foundAccounts.length === 0) {     // 일치하는 계정이 없는 경우
     //swal('error!', "일치하는 계정을 찾을 수 없습니다.", 'error');
      
    alert("일치하는 계정을 찾을 수 없습니다.");
    emailInput.value = "";
  } else {
    let foundIds = foundAccounts.map((account) => account["id"]); // 찾은 계정의 아이디를 추출하여 배열로 만듦.

    // 가려진 아이디 생성
    let hiddenIds = foundIds.map((id) => {
      const hiddenLength = Math.floor(id.length / 2); // 가려질 길이
      const hiddenPart = "*".repeat(hiddenLength); // 가려진 부분
      const visiblePart = id.slice(hiddenLength); // 가려지지 않은 부분
      return hiddenPart + visiblePart; // 가려진 아이디 반환
    });
    
    alert("찾은 아이디: " + hiddenIds.join(", "));
  }
});