// 요소 선언
const cardsBox = document.querySelector("#cards-box");
const offCanvas = document.querySelector("#off-canvas");
const webtoonThumbnail = document.querySelector("#webtoon-thumbnail > img");
const title = document.querySelector("#title-text > h3");
const author = document.querySelector("#author-text > p");
const day = document.querySelector("#day-text > p");
const about = document.querySelector("#about-text > p + p");
const tag = document.querySelector("#tag-text");
const backButton = document.querySelector("#back-button");
const firstPage = document.querySelector("#panel1c");
const secondPage = document.querySelector("#panel2c");
const pagination = document.querySelector("#pagination");
const backPageButton = document.querySelector("#back-page-button");
const nextPageButton = document.querySelector("#next-page-button");
const firstPageButton = document.querySelector("#first-page-button");
const secondPageButton = document.querySelector("#second-page-button");
const rawURL = location.href;
const encodedQuery = rawURL.slice(rawURL.indexOf("=") + 1, rawURL.length);
const query = decodeURIComponent(encodedQuery);
const noResult = document.querySelector("#no-result");
const searchFor = document.querySelector("#search-for");

searchFor.innerText = `'${query}'`;

// 키워드 검색
let queryResult = [];
let queryTitleResult = [];
let queryAuthorResult = [];
let queryTagResult = [];
if (query !== "") {
  naverWebtoons.forEach((searchingtWebtoon) => {
    // 제목 검색
    if (searchingtWebtoon["title"].includes(query)) {
      queryTitleResult.push(searchingtWebtoon["id"]);
    }
    // 작가 검색
    else if (searchingtWebtoon["author"].includes(query)) {
      queryAuthorResult.push(searchingtWebtoon["id"]);
    }
    // 태그 검색
    else {
      let isTagQuery = false;
      searchingtWebtoon["tag"].forEach((searchingTag) => {
        if (searchingTag.includes(query)) {
          isTagQuery = true;
        }
      });
      if (isTagQuery) {
        queryTagResult.push(searchingtWebtoon["id"]);
      }
    }
  });
  kakaoWebtoons.forEach((searchingtWebtoon) => {
    // 제목 검색
    if (searchingtWebtoon["title"].includes(query)) {
      queryTitleResult.push(searchingtWebtoon["id"]);
    }
    // 작가 검색
    else if (searchingtWebtoon["author"].includes(query)) {
      queryAuthorResult.push(searchingtWebtoon["id"]);
    }
    // 태그 검색
    else {
      let isTagQuery = false;
      searchingtWebtoon["tag"].forEach((searchingTag) => {
        if (searchingTag.includes(query)) {
          isTagQuery = true;
        }
      });
      if (isTagQuery) {
        queryTagResult.push(searchingtWebtoon["id"]);
      }
    }
  });
}

queryResult = [...queryTitleResult, ...queryAuthorResult, ...queryTagResult];
queryResult = [...new Set(queryResult)];
if (queryResult.length > 0) {
  noResult.classList.add("hide");
}

//  웹툰 카드 생성
queryResult.forEach((currentWebtoonID) => {
  currentWebtoonCard = document.createElement("div");
  currentWebtoonCard.setAttribute("id", currentWebtoonID);
  currentWebtoonCard.setAttribute("class", "card");
  // 네이버 웹툰, 카카오 웹툰 구별
  let isNaverWebtoon = naverWebtoons.filter((webtoon) => webtoon["id"] === currentWebtoonID);

  // 네이버 웹툰인 경우
  if (isNaverWebtoon.length === 1) {
    let currentWebtoon = isNaverWebtoon[0];
    // 카드 생성 부분
    currentWebtoonCard.innerHTML = `
      <img src="${currentWebtoon["thumbnail"]}" loading="lazy" />
      <div class="card-section light-black-bg">\
        <p class="white-font font-bold text-truncate">${currentWebtoon["title"]}</p>
        <p class="white-font font-bold text-truncate">${currentWebtoon["author"].replace(/,/gi, " / ")}</p>
        <div class="favorite-box">
          <button class="favorite large button radius yellow-font grey-bg">
            <i class="fa fa-star-o"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;즐겨찾기 추가&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </button>
        </div>
      </div>`;

    // 웹툰 카드 클릭 이벤트 발생 시 웹툰 정보 캔버스 업데이트
    currentWebtoonCard.addEventListener("click", (event) => {
      // 즐겨찾기 버튼이 클릭된것이 아닌 경우에만
      if (event.target.tagName !== "BUTTON" && event.target.tagName !== "I") {
        webtoonThumbnail.src = `${currentWebtoon["thumbnail"]}`;
        title.innerHTML = `${currentWebtoon["title"]}`;
        author.innerHTML = `<span class="grey-font">작가 : </span>${currentWebtoon["author"].replace(/,/gi, " / ")}`;
        day.innerHTML = `<span class="grey-font">연재요일 : </span>${currentWebtoon["day"]
          .map((currentDay) => {
            if (currentDay === "mon") {
              return "월요일";
            } else if (currentDay === "tue") {
              return "화요일";
            } else if (currentDay === "wed") {
              return "수요일";
            } else if (currentDay === "thu") {
              return "목요일";
            } else if (currentDay === "fri") {
              return "금요일";
            } else if (currentDay === "sat") {
              return "토요일";
            } else if (currentDay === "sun") {
              return "일요일";
            }
          })
          .join(", ")}`;
        about.innerText = `${currentWebtoon["about"]}`;
        tag.innerHTML = " ";
        currentWebtoon["tag"].forEach((currentTag) => {
          if (currentTag !== "") {
            tag.innerHTML += `<button class="button radius" onClick = 'window.open("./search.html?query=${currentTag}")'>${currentTag}</button>`;
          }
        });
        offCanvas.setAttribute("style", `height:${window.innerHeight - 68.8}px`);
        $("#off-canvas").foundation("open");

        // 에피소드 카드 페이지 설정 부분
        // 2 페이지 채워질 경우
        if (currentWebtoon["episode"].length > 10) {
          // 페이지 버튼 초기화
          backPageButton.addEventListener("click", () => {
            firstPageButton.click();
          });
          nextPageButton.addEventListener("click", () => {
            secondPageButton.click();
          });
          secondPageButton.querySelector("a").classList.remove("hide");
          backPageButton.classList.remove("disabled");
          nextPageButton.classList.remove("disabled");
          backPageButton.querySelector("p").classList.remove("disabled");
          nextPageButton.querySelector("p").classList.remove("disabled");

          // 페이지 내용 초기화
          firstPage.innerHTML = " ";
          secondPage.innerHTML = " ";

          // 첫 번째 페이지 채우기
          for (let index = 0; index < 10; index++) {
            // 에피소드 카드 생성
            const currentEpisode = currentWebtoon["episode"][index];
            const button = document.createElement("button");
            button.classList = "button radius small expanded";
            button.setAttribute("id", currentEpisode["episodeURL"]);
            button.innerHTML = `<div class="grid-x grid-padding-x">
                  <div class="large-1 medium-1 small-1 cell invisible">
                    <img src="./images/history.png" width="40px" height="40px" />
                  </div>
                  <div class="auto cell text-left"><h5>${currentEpisode["episodeTitle"]}</h5></div>
                  <div class="large-2 medium-2 small-2 cell bookmark"><h5 class="bookmark">책갈피 추가</h5></div>
                  <div class="large-1 medium-1 small-1 cell bookmark">
                    <p class="h3"><i class="fa fa-bookmark"></i><i class="fa fa-bookmark-o bookmark"></i></p>
                  </div>
                </div>`;

            // 감상 기록 및 책갈피 반영 부분
            if (login_user !== null) {
              // 감상 기록 여부 반영
              if (login_user["history"].includes(currentEpisode["episodeURL"])) {
                button.querySelector("div > div").classList.remove("invisible");
              }
              // 책갈피 여부 반영
              if (login_user["bookmark"].includes(currentEpisode["episodeURL"])) {
                button.querySelectorAll("i")[1].classList = "fa fa-bookmark bookmark";
                button.querySelector(".large-2 h5").innerText = "책갈피 해제";
              }
            }

            // 에피소드 카드 클릭 이벤트 추가
            button.addEventListener("click", (event) => {
              // 책갈피 관련 클릭 시
              if (event.target.classList.contains("bookmark")) {
                // 로그인 여부 확인
                if (login_user === null) {
                  // 비로그인 시
                  alert("책갈피 추가는 로그인 후 사용하실 수 있습니다.");
                }
                // 로그인 시
                else {
                  // 책갈피 해제 작업
                  if (login_user["bookmark"].includes(currentEpisode["episodeURL"])) {
                    button.querySelector(".large-2 h5").innerText = "책갈피 추가";
                    button.querySelectorAll("i")[1].classList = "fa fa-bookmark-o bookmark";
                    temp = login_user["bookmark"].filter((element) => element !== currentEpisode["episodeURL"]);
                    login_user["bookmark"] = JSON.parse(JSON.stringify(temp));
                    localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                  }
                  // 책갈피 추가 작업
                  else {
                    button.querySelector(".large-2 h5").innerText = "책갈피 해제";
                    button.querySelectorAll("i")[1].classList = "fa fa-bookmark bookmark";
                    login_user["bookmark"].push(currentEpisode["episodeURL"]);
                    localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                  }
                }
              }
              // 에피소드 카드 본체 클릭 시
              else {
                // 로그인 여부 확인 후 감상 기록 추가
                if (login_user !== null && !login_user["history"].includes(currentEpisode["episodeURL"])) {
                  login_user["history"].push(currentEpisode["episodeURL"]);
                  localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                }
                window.open(currentEpisode["episodeURL"]);
                button.querySelector("div > div").classList.remove("invisible");
              }
            });
            firstPage.appendChild(button);
          }

          // 두 번째 페이지 채우기
          for (let index = 10; index < currentWebtoon["episode"].length; index++) {
            // 에피소드 카드 생성
            const currentEpisode = currentWebtoon["episode"][index];
            const button = document.createElement("button");
            button.classList = "button radius small expanded";
            button.setAttribute("id", currentEpisode["episodeURL"]);
            button.innerHTML = `<div class="grid-x grid-padding-x">
                  <div class="large-1 medium-1 small-1 cell invisible">
                    <img src="./images/history.png" width="40px" height="40px" />
                  </div>
                  <div class="auto cell text-left "><h5>${currentEpisode["episodeTitle"]}</h5></div>
                  <div class="large-2 medium-2 small-2 cell bookmark"><h5 class="bookmark">책갈피 추가</h5></div>
                  <div class="large-1 medium-1 small-1 cell bookmark">
                    <p class="h3"><i class="fa fa-bookmark"></i><i class="fa fa-bookmark-o bookmark"></i></p>
                  </div>
                </div>`;

            // 감상 기록 및 책갈피 반영 부분
            if (login_user !== null) {
              // 감상 기록 여부 반영
              if (login_user["history"].includes(currentEpisode["episodeURL"])) {
                button.querySelector("div > div").classList.remove("invisible");
              }
              // 책갈피 여부 반영
              if (login_user["bookmark"].includes(currentEpisode["episodeURL"])) {
                button.querySelectorAll("i")[1].classList = "fa fa-bookmark bookmark";
                button.querySelector(".large-2 h5").innerText = "책갈피 해제";
              }
            }

            // 에피소드 카드 클릭 이벤트 추가
            button.addEventListener("click", (event) => {
              // 책갈피 관련 클릭 시
              if (event.target.classList.contains("bookmark")) {
                // 로그인 여부 확인
                if (login_user === null) {
                  // 비로그인 시
                  alert("책갈피 추가는 로그인 후 사용하실 수 있습니다.");
                }
                // 로그인 시
                else {
                  // 책갈피 해제 작업
                  if (login_user["bookmark"].includes(currentEpisode["episodeURL"])) {
                    button.querySelector(".large-2 h5").innerText = "책갈피 추가";
                    button.querySelectorAll("i")[1].classList = "fa fa-bookmark-o bookmark";
                    temp = login_user["bookmark"].filter((element) => element !== currentEpisode["episodeURL"]);
                    login_user["bookmark"] = JSON.parse(JSON.stringify(temp));
                    localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                  }
                  // 책갈피 추가 작업
                  else {
                    button.querySelector(".large-2 h5").innerText = "책갈피 해제";
                    button.querySelectorAll("i")[1].classList = "fa fa-bookmark bookmark";
                    login_user["bookmark"].push(currentEpisode["episodeURL"]);
                    localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                  }
                }
              }
              // 에피소드 카드 본체 클릭 시
              else {
                // 로그인 여부 확인 후 감상 기록 추가
                if (login_user !== null && !login_user["history"].includes(currentEpisode["episodeURL"])) {
                  login_user["history"].push(currentEpisode["episodeURL"]);
                  localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                }
                window.open(currentEpisode["episodeURL"]);
                button.querySelector("div > div").classList.remove("invisible");
              }
            });
            secondPage.appendChild(button);
          }
        }
        // 1 페이지만 채워질 경우
        else {
          // 페이지 버튼 초기화
          secondPageButton.querySelector("a").classList.add("hide");
          backPageButton.classList.add("disabled");
          nextPageButton.classList.add("disabled");
          backPageButton.querySelector("p").classList.add("disabled");
          nextPageButton.querySelector("p").classList.add("disabled");

          // 페이지 내용 초기화
          firstPage.innerHTML = " ";
          secondPage.innerHTML = " ";
          contains;
          // 첫 번쨰 페이지 채우기
          for (let index = 0; index < currentWebtoon["episode"].length; index++) {
            // 에피소드 카드 생성
            const currentEpisode = currentWebtoon["episode"][index];
            const button = document.createElement("button");
            button.classList = "button radius small expanded";
            button.setAttribute("id", currentEpisode["episodeURL"]);
            button.innerHTML = `<div class="grid-x grid-padding-x">
                  <div class="large-1 medium-1 small-1 cell invisible">
                    <img src="./images/history.png" width="40px" height="40px" />
                  </div>
                  <div class="auto cell text-left"><h5>${currentEpisode["episodeTitle"]}</h5></div>
                  <div class="large-2 medium-2 small-2 cell bookmark"><h5 class="bookmark">책갈피 추가</h5></div>
                  <div class="large-1 medium-1 small-1 cell bookmark">
                    <p class="h3"><i class="fa fa-bookmark"></i><i class="fa fa-bookmark-o bookmark"></i></p>
                  </div>
                </div>`;

            // 감상 기록 및 책갈피 반여 부분
            if (login_user !== null) {
              // 감상 기록 여부 반영
              if (login_user["history"].includes(currentEpisode["episodeURL"])) {
                button.querySelector("div > div").classList.remove("invisible");
              }
              // 책갈피 여부 반영
              if (login_user["bookmark"].includes(currentEpisode["episodeURL"])) {
                button.querySelectorAll("i")[1].classList = "fa fa-bookmark bookmark";
                button.querySelector(".large-2 h5").innerText = "책갈피 해제";
              }
            }

            // 에피소드 카드 클릭 이벤트 추가
            button.addEventListener("click", (event) => {
              // 책갈피 관련 클릭 시
              if (event.target.classList.contains("bookmark")) {
                // 로그인 여부 확인
                if (login_user === null) {
                  // 비로그인 시
                  alert("책갈피 추가는 로그인 후 사용하실 수 있습니다.");
                }
                // 비로그인 시
                else {
                  // 책갈피 해제 작업
                  if (login_user["bookmark"].includes(currentEpisode["episodeURL"])) {
                    button.querySelector(".large-2 h5").innerText = "책갈피 추가";
                    button.querySelectorAll("i")[1].classList = "fa fa-bookmark-o bookmark";
                    temp = login_user["bookmark"].filter((element) => element !== currentEpisode["episodeURL"]);
                    login_user["bookmark"] = JSON.parse(JSON.stringify(temp));
                    localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                  }
                  // 책갈피 추가 작업
                  else {
                    button.querySelector(".large-2 h5").innerText = "책갈피 해제";
                    button.querySelectorAll("i")[1].classList = "fa fa-bookmark bookmark";
                    login_user["bookmark"].push(currentEpisode["episodeURL"]);
                    localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                  }
                }
              }
              // 에피소드 카드 본체 클릭 시
              else {
                // 로그인 여부 확인 후 감상 기록 추가
                if (login_user !== null && !login_user["history"].includes(currentEpisode["episodeURL"])) {
                  login_user["history"].push(currentEpisode["episodeURL"]);
                  localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                }

                window.open(currentEpisode["episodeURL"]);
                button.querySelector("div > div").classList.remove("invisible");
              }
            });
            firstPage.appendChild(button);
          }
        }

        // 에피소드 카드 기본 페이지 초기화
        firstPageButton.click();
      }
    });
  }

  // 카카오 웹툰인 경우
  else {
    let currentWebtoon = kakaoWebtoons.filter((webtoon) => webtoon["id"] === currentWebtoonID)[0];
    //카드 생성 부분
    currentWebtoonCard.innerHTML = `
      <img src="./images/thumbnail/${currentWebtoon["thumbnail"]}" loading="lazy" />
      <div class="card-section light-black-bg">
        <p class="white-font font-bold text-truncate">${currentWebtoon["title"]}</p>
        <p class="white-font font-bold text-truncate">${currentWebtoon["author"].replace(/,/gi, " / ")}</p>
        <div class="favorite-box">
          <button class="favorite large button radius yellow-font grey-bg">
            <i class="fa fa-star-o"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;즐겨찾기 추가&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </button>
        </div>
      </div>`;

    // 웹툰 카드 클릭 이벤트 발생 시 웹툰 정보 캔버스 업데이트
    currentWebtoonCard.addEventListener("click", (event) => {
      // 즐겨찾기 버튼이 클릭된것이 아닌 경우에만
      if (event.target.tagName !== "BUTTON" && event.target.tagName !== "I") {
        webtoonThumbnail.src = `./images/thumbnail/${currentWebtoon["thumbnail"]}`;
        title.innerHTML = `${currentWebtoon["title"]}`;
        author.innerHTML = `<span class="grey-font">작가 : </span>${currentWebtoon["author"].replace(/,/gi, " / ")}`;
        day.innerHTML = `<span class="grey-font">연재요일 : </span>${currentWebtoon["day"]
          .map((currentDay) => {
            if (currentDay === "mon") {
              return "월요일";
            } else if (currentDay === "tue") {
              return "화요일";
            } else if (currentDay === "wed") {
              return "수요일";
            } else if (currentDay === "thu") {
              return "목요일";
            } else if (currentDay === "fri") {
              return "금요일";
            } else if (currentDay === "sat") {
              return "토요일";
            } else if (currentDay === "sun") {
              return "일요일";
            }
          })
          .join(", ")}`;
        about.innerText = `${currentWebtoon["about"]}`;
        tag.innerHTML = " ";
        currentWebtoon["tag"].forEach((currentTag) => {
          if (currentTag !== "") {
            tag.innerHTML += `<button class="button radius" onClick = 'window.open("./search.html?query=${currentTag}")'>${currentTag}</button>`;
          }
        });
        offCanvas.setAttribute("style", `height:${window.innerHeight - 68.8}px`);
        $("#off-canvas").foundation("open");

        // 에피소드 카드 페이지 설정 부분
        // 2 페이지 채워질 경우
        if (currentWebtoon["episode"].length > 10) {
          // 페이지 버튼 초기화
          backPageButton.addEventListener("click", () => {
            firstPageButton.click();
          });
          nextPageButton.addEventListener("click", () => {
            secondPageButton.click();
          });
          secondPageButton.querySelector("a").classList.remove("hide");
          backPageButton.classList.remove("disabled");
          nextPageButton.classList.remove("disabled");
          backPageButton.querySelector("p").classList.remove("disabled");
          nextPageButton.querySelector("p").classList.remove("disabled");

          // 페이지 내용 초기화
          firstPage.innerHTML = " ";
          secondPage.innerHTML = " ";

          // 첫 번째 페이지 채우기
          for (let index = 0; index < 10; index++) {
            // 에피소드 카드 생성
            const currentEpisode = currentWebtoon["episode"][index];
            const button = document.createElement("button");
            button.classList = "button radius small expanded";
            tempURL = `${currentWebtoon["id"]}-${currentEpisode["episodeTitle"]}`;
            button.setAttribute("id", tempURL);
            button.innerHTML = `<div class="grid-x grid-padding-x">
                <div class="large-1 medium-1 small-1 cell invisible">
                  <img src="./images/history.png" width="40px" height="40px" />
                </div>
                <div class="auto cell text-left"><h5>${currentEpisode["episodeTitle"]}</h5></div>
                <div class="large-2 medium-2 small-2 cell bookmark"><h5 class="bookmark">책갈피 추가</h5></div>
                <div class="large-1 medium-1 small-1 cell bookmark">
                  <p class="h3"><i class="fa fa-bookmark"></i><i class="fa fa-bookmark-o bookmark"></i></p>
                </div>
              </div>`;

            // 감상 기록 및 책갈피 반영 부분
            if (login_user !== null) {
              // 감상 기록 여부 반영
              if (login_user["history"].includes(tempURL)) {
                button.querySelector("div > div").classList.remove("invisible");
              }
              // 책갈피 여부 반영
              if (login_user["bookmark"].includes(tempURL)) {
                button.querySelectorAll("i")[1].classList = "fa fa-bookmark bookmark";
                button.querySelector(".large-2 h5").innerText = "책갈피 해제";
              }
            }

            // 에피소드 카드 클릭 이벤트 추가
            button.addEventListener("click", (event) => {
              // 책갈피 관련 클릭 시
              if (event.target.classList.contains("bookmark")) {
                // 로그인 여부 확인
                if (login_user === null) {
                  // 비로그인 시
                  alert("책갈피 추가는 로그인 후 사용하실 수 있습니다.");
                }
                // 로그인 시
                else {
                  // 책갈피 해제 작업
                  if (login_user["bookmark"].includes(tempURL)) {
                    button.querySelector(".large-2 h5").innerText = "책갈피 추가";
                    button.querySelectorAll("i")[1].classList = "fa fa-bookmark-o bookmark";
                    temp = login_user["bookmark"].filter((element) => element !== tempURL);
                    login_user["bookmark"] = JSON.parse(JSON.stringify(temp));
                    localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                  }
                  // 책갈피 추가 작업
                  else {
                    button.querySelector(".large-2 h5").innerText = "책갈피 해제";
                    button.querySelectorAll("i")[1].classList = "fa fa-bookmark bookmark";
                    login_user["bookmark"].push(tempURL);
                    localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                  }
                }
              }
              // 에피소드 카드 본체 클릭 시
              else {
                // 로그인 여부 확인 후 감상 기록 추가
                if (login_user !== null && !login_user["history"].includes(tempURL)) {
                  login_user["history"].push(tempURL);
                  localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                }
                window.open(
                  `./toKakao.html?https://webtoon.kakao.com/content/${currentWebtoon["title"].replace(/ /gi, "-")}/${currentWebtoon["id"]}`
                );
                button.querySelector("div > div").classList.remove("invisible");
              }
            });
            firstPage.appendChild(button);
          }

          // 두 번째 페이지 채우기
          for (let index = 10; index < currentWebtoon["episode"].length; index++) {
            // 에피소드 카드 생성
            const currentEpisode = currentWebtoon["episode"][index];
            const button = document.createElement("button");
            button.classList = "button radius small expanded";
            tempURL = `${currentWebtoon["id"]}-${currentEpisode["episodeTitle"]}`;
            button.setAttribute("id", tempURL);
            button.innerHTML = `<div class="grid-x grid-padding-x">
                <div class="large-1 medium-1 small-1 cell invisible">
                  <img src="./images/history.png" width="40px" height="40px" />
                </div>
                <div class="auto cell text-left"><h5>${currentEpisode["episodeTitle"]}</h5></div>
                <div class="large-2 medium-2 small-2 cell bookmark"><h5 class="bookmark">책갈피 추가</h5></div>
                <div class="large-1 medium-1 small-1 cell bookmark">
                  <p class="h3"><i class="fa fa-bookmark"></i><i class="fa fa-bookmark-o bookmark"></i></p>
                </div>
              </div>`;

            // 감상 기록 및 책갈피 반영 부분
            if (login_user !== null) {
              // 감상 기록 여부 반영
              if (login_user["history"].includes(tempURL)) {
                button.querySelector("div > div").classList.remove("invisible");
              }
              // 책갈피 여부 반영
              if (login_user["bookmark"].includes(tempURL)) {
                button.querySelectorAll("i")[1].classList = "fa fa-bookmark bookmark";
                button.querySelector(".large-2 h5").innerText = "책갈피 해제";
              }
            }

            // 에피소드 카드 클릭 이벤트 추가
            button.addEventListener("click", (event) => {
              // 책갈피 관련 클릭 시
              if (event.target.classList.contains("bookmark")) {
                // 로그인 여부 확인
                if (login_user === null) {
                  // 비로그인 시
                  alert("책갈피 추가는 로그인 후 사용하실 수 있습니다.");
                }
                // 로그인 시
                else {
                  // 책갈피 해제 작업
                  if (login_user["bookmark"].includes(tempURL)) {
                    button.querySelector(".large-2 h5").innerText = "책갈피 추가";
                    button.querySelectorAll("i")[1].classList = "fa fa-bookmark-o bookmark";
                    temp = login_user["bookmark"].filter((element) => element !== tempURL);
                    login_user["bookmark"] = JSON.parse(JSON.stringify(temp));
                    localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                  }
                  // 책갈피 추가 작업
                  else {
                    button.querySelector(".large-2 h5").innerText = "책갈피 해제";
                    button.querySelectorAll("i")[1].classList = "fa fa-bookmark bookmark";
                    login_user["bookmark"].push(tempURL);
                    localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                  }
                }
              }
              // 에피소드 카드 본체 클릭 시
              else {
                // 로그인 여부 확인 후 감상 기록 추가
                if (login_user !== null && !login_user["history"].includes(tempURL)) {
                  login_user["history"].push(tempURL);
                  localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                }
                window.open(
                  `./toKakao.html?https://webtoon.kakao.com/content/${currentWebtoon["title"].replace(/ /gi, "-")}/${currentWebtoon["id"]}`
                );

                button.querySelector("div > div").classList.remove("invisible");
              }
            });
            secondPage.appendChild(button);
          }
        }
        // 1 페이지만 채워질 경우
        else {
          // 페이지 버튼 초기화
          secondPageButton.querySelector("a").classList.add("hide");
          backPageButton.classList.add("disabled");
          nextPageButton.classList.add("disabled");
          backPageButton.querySelector("p").classList.add("disabled");
          nextPageButton.querySelector("p").classList.add("disabled");

          // 페이지 내용 초기화
          firstPage.innerHTML = " ";
          secondPage.innerHTML = " ";

          // 첫 번쨰 페이지 채우기
          for (let index = 0; index < currentWebtoon["episode"].length; index++) {
            // 에피소드 카드 생성
            const currentEpisode = currentWebtoon["episode"][index];
            const button = document.createElement("button");
            button.classList = "button radius small expanded";
            tempURL = `${currentWebtoon["id"]}-${currentEpisode["episodeTitle"]}`;
            button.setAttribute("id", tempURL);
            button.innerHTML = `<div class="grid-x grid-padding-x">
                <div class="large-1 medium-1 small-1 cell invisible">
                  <img src="./images/history.png" width="40px" height="40px" />
                </div>
                <div class="auto cell text-left"><h5>${currentEpisode["episodeTitle"]}</h5></div>
                <div class="large-2 medium-2 small-2 cell bookmark"><h5 class="bookmark">책갈피 추가</h5></div>
                <div class="large-1 medium-1 small-1 cell bookmark">
                  <p class="h3"><i class="fa fa-bookmark"></i><i class="fa fa-bookmark-o bookmark"></i></p>
                </div>
              </div>`;

            // 감상 기록 및 책갈피 반여 부분
            if (login_user !== null) {
              // 감상 기록 여부 반영
              if (login_user["history"].includes(tempURL)) {
                button.querySelector("div > div").classList.remove("invisible");
              }
              // 책갈피 여부 반영
              if (login_user["bookmark"].includes(tempURL)) {
                button.querySelectorAll("i")[1].classList = "fa fa-bookmark bookmark";
                button.querySelector(".large-2 h5").innerText = "책갈피 해제";
              }
            }

            // 에피소드 카드 클릭 이벤트 추가
            button.addEventListener("click", (event) => {
              // 책갈피 관련 클릭 시
              if (event.target.classList.contains("bookmark")) {
                // 로그인 여부 확인
                if (login_user === null) {
                  // 비로그인 시
                  alert("책갈피 추가는 로그인 후 사용하실 수 있습니다.");
                }
                // 비로그인 시
                else {
                  // 책갈피 해제 작업
                  if (login_user["bookmark"].includes(tempURL)) {
                    button.querySelector(".large-2 h5").innerText = "책갈피 추가";
                    button.querySelectorAll("i")[1].classList = "fa fa-bookmark-o bookmark";
                    temp = login_user["bookmark"].filter((element) => element !== tempURL);
                    login_user["bookmark"] = JSON.parse(JSON.stringify(temp));
                    localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                  }
                  // 책갈피 추가 작업
                  else {
                    button.querySelector(".large-2 h5").innerText = "책갈피 해제";
                    button.querySelectorAll("i")[1].classList = "fa fa-bookmark bookmark";
                    login_user["bookmark"].push(tempURL);
                    localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                  }
                }
              }
              // 에피소드 카드 본체 클릭 시
              else {
                // 로그인 여부 확인 후 감상 기록 추가
                if (login_user !== null && !login_user["history"].includes(tempURL)) {
                  login_user["history"].push(tempURL);
                  localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
                }
                window.open(
                  `./toKakao.html?https://webtoon.kakao.com/content/${currentWebtoon["title"].replace(/ /gi, "-")}/${currentWebtoon["id"]}`
                );
                button.querySelector("div > div").classList.remove("invisible");
              }
            });
            firstPage.appendChild(button);
          }
        }

        // 에피소드 카드 기본 페이지 초기화
        firstPageButton.click();
      }
    });
  }

  // 즐겨찾기 여부 반영
  favoriteButton = currentWebtoonCard.querySelector("button");
  if (login_user != null) {
    if (login_user["favorite"].includes(currentWebtoonID)) {
      favoriteButton.innerHTML = '<i class="fa fa-star"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;즐겨찾기 해제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    }
  }

  // 즐겨찾기 버튼 클릭 이벤트
  favoriteButton.addEventListener("click", (event) => {
    if (event.target.tagName === "I") {
      button = event.target.parentElement;
    } else {
      button = event.target;
    }
    const id = parseInt(button.parentElement.parentElement.parentElement.getAttribute("id"));
    if (login_user !== null) {
      if (login_user["favorite"].includes(id)) {
        button.innerHTML = '<i class="fa fa-star-o"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;즐겨찾기 추가&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        temp = login_user["favorite"].filter((element) => element !== id);
        login_user["favorite"] = JSON.parse(JSON.stringify(temp));
        localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
      } else {
        button.innerHTML = '<i class="fa fa-star"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;즐겨찾기 해제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        login_user["favorite"].push(id);
        localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(login_user));
      }
    } else {
      alert("즐겨찾기 추가는 로그인 후 사용하실 수 있습니다.");
    }
  });

  // 카드 추가
  cardsBox.appendChild(currentWebtoonCard);
});

//  웹툰 정보 페이지에서 뒤로가기 버튼 클릭 시
backButton.addEventListener("click", () => {
  webtoonThumbnail.src = "";
});
