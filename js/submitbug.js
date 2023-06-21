href="./cs.html"  // 현재 페이지와 동일한 경로에 있는 cs.html 파일로 이동하는 링크
function MailSend() {  //이메일 ID와 도메인을 검사하여 유효성을 확인한 후 처리
    var fm = document.getElementById("bug-report-form");
    var emailID = fm.elements["EmailID"].value;
    var emailDomain = fm.elements["EmailDomain"].value;

    if (emailID === "" || emailDomain === "") {
        alert("사용자 이메일을 정확하게 입력해주세요.");
        fm.elements["EmailID"].focus();
        return false;
    } else {
        var strEmail = emailID + "@" + emailDomain;

        if (!CheckEmail(strEmail)) {        // 생성된 이메일 주소가 유효하지 않은 경우
            alert("사용자 이메일을 정확하게 입력해주세요.");
            fm.elements["EmailID"].focus();
            return false;
        } else {

            alert("제출되었습니다. 문의하신 사항에 관해서는 이메일을 통해 답변드리겠습니다. 소통해 주셔서 감사합니다. "); // 성공 팝업 메시지 표시
            window.open(this.href); // 다른 페이지로 이동
            return false;
        }
    }
}

function CheckEmail(strEmail) {     // 유효성 검사
    var regDoNot = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/;
    var regMust = /^[a-zA-Z0-9\-\.\_]+\@[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3})$/;

    if (!regDoNot.test(strEmail) && regMust.test(strEmail)) // 유효성 검사를 통과한 경우
        return true;
    else
        return false;
}

function SearchDomain(frm) {    // 도메인 입력 필드에 입력된 값을 가져와서 해당 도메인을 선택하는 이메일 도메인 선택 필드를 설정
    var emailDomain = frm.elements["EmailDomain"].value.toLowerCase();  // 도메인 입력필드의 값을 가져옴
    var selEmailDomain = frm.elements["SelEmailDomain"];                // 도메인 선택 필드를 가져옴

    if (emailDomain) {                      // 입력필드의 값이 존재하는경우
        selEmailDomain.value = "user";      // 도메인 선택필드의 값을 user로 함.
    }   

    for (var i = 0; i < selEmailDomain.options.length; i++) {
        if (emailDomain === selEmailDomain.options[i].value) {          // 입력필드의 값과 일치하는 도메인을 찾은 경우
            selEmailDomain.value = emailDomain;                         // 이메일 도메인 선택 필드의 값을 일치하는 도메인으로 설정
            if (emailDomain !== "user" && selEmailDomain.options[i].value !== "") {  
                frm.elements["EmailDomain"].disabled = true;        // 도메인 입력필드 비활성화
            }
            break;
        }
    }
}

function domainChange(frm) {            // 도메인 선택 필드에서 선택된 도메인에 따라 도메인 입력 필드를 제어함
    with (frm) {
        var strSelDomain = SelEmailDomain[SelEmailDomain.selectedIndex].value;

        if (strSelDomain == "" || strSelDomain == "user") {     //도메인 선택필드가 비어있거나 직접입력인 경우   
            EmailDomain.disabled = 0;   
            EmailDomain.value = "";
            EmailDomain.focus();
        } else {                            
            EmailDomain.disabled = 1;           // 입력필드를 비활성화
            EmailDomain.value = strSelDomain;   // 선택된 도메인으로 값을 설정.
        }
    }
}
