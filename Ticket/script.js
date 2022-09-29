setInterval(() => {
  const now = new Date();
  const time = `${now.getHours()}：${now.getMinutes()}：${now.getSeconds()}：${now.getMilliseconds()}`;
  $("#nowTime").text(time);
}, 100);

function openMyOrder() {
  window.open(
    "https://www.ymca.com.tw/xwt88.aspx?Module=member&files=orderx_mt"
  );
}

function run() {
  const dateInput = $("#dateInput");
  const timeSelect = $("#timeSelect");
  const date = dateInput.val();
  const time = timeSelect.val();

  dateInput.removeClass("is-invalid");
  timeSelect.removeClass("is-invalid");
  // 檢查是否輸入
  if (!date & !time) {
    dateInput.addClass("is-invalid");
    timeSelect.addClass("is-invalid");
    return;
  }
  if (!date) {
    dateInput.addClass("is-invalid");
    return;
  }
  if (!time) {
    timeSelect.addClass("is-invalid");
    return;
  }

  const urls = time.map(
    (t) =>
      `https://www.ymca.com.tw/xwt88.aspx?module=net_booking&files=booking_place&StepFlag=25&QPid=88&QTime=${t}&PT=1&D=${date}`
  );

  $("#active").addClass("disabled");
  $("#activeTitle").removeClass("d-none");

  let checkTime = null;
  checkTime = setInterval(() => {
    const now = new Date();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    console.log(`${min}:${sec}`);
    if (min === 59 && sec >= 59) {
      callApi(urls);
      clearInterval(checkTime);
    }
  });
}

function callApi(urls) {
  let api = null;
  let index = 0;
  api = setInterval(() => {
    index++;
    urls.map((url) => window.open(url));
    if (index >= 8) {
      clearInterval(api);
    }
  }, 250);
}
