// 요소 선언
const episodeCardsBox = document.querySelector("#episode-cards-box");

//  사용자의 감상 기록에 있는 웹툰 에피소드 카드 생성
const reversedHistory = login_user["history"].toReversed();
reversedHistory.forEach((currentEpisodeURL) => {
  const button = document.createElement("button");
  button.classList = "button radius small expanded";
  button.setAttribute("id", currentEpisodeURL);
  button.setAttribute("data-closable", "slide-out-right");

  let currentWebtoonID;
  let currentWebtoon;
  let currentEpisodeTitle;
  let platform;
  // 네이버 웹툰인 경우
  if (currentEpisodeURL[0] === "h") {
    currentWebtoonID = currentEpisodeURL.slice(currentEpisodeURL.indexOf("=") + 1, currentEpisodeURL.indexOf("&"));
    currentWebtoon = naverWebtoons.filter((webtoon) => webtoon["id"] === parseInt(currentWebtoonID))[0];
    currentEpisodeTitle = currentWebtoon["episode"].filter((episode) => episode["episodeURL"] === currentEpisodeURL)[0]["episodeTitle"];
    platform = "naver";
  }
  // 카카오 웹툰인 경우
  else {
    currentWebtoonID = currentEpisodeURL.slice(0, currentEpisodeURL.indexOf("-"));
    currentWebtoon = kakaoWebtoons.filter((webtoon) => webtoon["id"] === parseInt(currentWebtoonID))[0];
    currentEpisodeTitle = currentEpisodeURL.slice(currentEpisodeURL.indexOf("-") + 1, currentEpisodeURL.length);
    platform = "kakao";
  }
  const currentWebtoonTitle = currentWebtoon["title"];
  button.innerHTML = `<div class="grid-x grid-padding-x">
    <div class="large-1 medium-1 small-1 cell">&nbsp;</div>
    <div class="large-4 medium-4 small-4 text-left"><h5>${currentWebtoonTitle}</h5></div>
    <div class="large-4 medium-4 small-4 text-left"><h5>${currentEpisodeTitle}</h5></div>
    <div class="large-2 medium-2 small-2 cell history" data-close><h5 class="history" data-close>감상 기록 삭제</h5></div>
    <div class="large-1 medium-1 small-1 cell history" data-close>
      <img class="history" src="./images/history.png" width="40px" height="40px" data-close/>
      <i class="fa fa-times history"></i>
    </div>
  </div>`;

  // 에피소드 카드 클릭 이벤트 추가
  button.addEventListener("click", (event) => {
    // 감상 기록 관련 클릭 시
    if (event.target.classList.contains("history")) {
      // 감상 기록 삭제 작업
      temp = login_user["history"].filter((element) => element !== currentEpisodeURL);
      login_user["history"] = JSON.parse(JSON.stringify(temp));
      localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
    }
    // 에피소드 카드 본체 클릭 시
    else {
      if (platform === "naver") {
        window.open(currentEpisodeURL);
      } else if (platform === "kakao");
      {
        window.open(`./toKakao.html?https://webtoon.kakao.com/content/${currentWebtoonTitle.replace(/ /gi, "-")}/${currentWebtoonID}`);
      }
    }
  });
  
  // 검색 기록 삭제 호버링 효과
  button.addEventListener("mouseover", (event) => {
    if (event.target.classList.contains("history")) {
      button.querySelector("i").style = "color:red";
    }
  });
  button.addEventListener("mouseout", (event) => {
    if (event.target.classList.contains("history")) {
      button.querySelector("i").style = "color:transparent";
    }
  });

  episodeCardsBox.appendChild(button);
});
