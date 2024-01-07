setInterval(() => {
  const now = new Date();
  const time = `${now.getHours()}：${now.getMinutes()}：${now.getSeconds()}：${now.getMilliseconds()}`;
  $("#nowTime").text(time);
}, 100);

function openMyOrderYmca() {
  window.open(
    "https://www.ymca.com.tw/xwt88.aspx?Module=member&files=orderx_mt"
  );
}
function openMyOrderCyc() {
  window.open("https://scr.cyc.org.tw/tp13.aspx?Module=member&files=orderx_mt");
}

$(function () {
  // Date
  $.datepicker.regional["it"] = {
    closeText: "關閉", // set a close button text
    currentText: "今天", // set today text
    monthNames: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
    dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
    dateFormat: "yy/mm/dd",
    defaultDate: new Date(),
  };
  $.datepicker.setDefaults($.datepicker.regional["it"]);
  $("#datepicker").datepicker();
  $("#datepicker").datepicker("setDate", "+10d");

  // Local
  const localSelect = $("#localSelect");
  localSelect.change(() => {
    const local = $(this).find(":selected").val();
    const placeSelect = $("#placeSelect");
    if (local === "ymca") {
      placeSelect.html(`
      <option value="83" selected>場地一</option>
      <option value="84">場地二</option>
      <option value="85">場地三</option>
      <option value="86">場地四</option>
      <option value="87">場地五</option>
      <option value="88" selected>場地六</option>`);
    } else {
      placeSelect.html(`
      <option value="1175">場地一</option>
      <option value="1174">場地二</option>
      <option value="1176">場地三</option>`);
    }
  });
});

function run() {
  const dateInput = $("#datepicker");
  const timeSelect = $("#timeSelect");
  const placeSelect = $("#placeSelect");
  const localSelect = $("#localSelect");
  const date = dateInput.val();
  const time = timeSelect.val();
  const place = placeSelect.val();
  const local = localSelect.val();
  const domain =
    local === "ymca"
      ? "https://www.ymca.com.tw/xwt88.aspx"
      : "https://scr.cyc.org.tw/tp13.aspx";

  let error = false;

  dateInput.removeClass("is-invalid");
  timeSelect.removeClass("is-invalid");
  // 檢查是否輸入
  if (!date & (time.length === 0) & (place.length === 0)) {
    dateInput.addClass("is-invalid");
    timeSelect.addClass("is-invalid");
    placeSelect.addClass("is-invalid");
    return;
  }
  if (!date) {
    dateInput.addClass("is-invalid");
    error = true;
  }

  if (time.length === 0) {
    timeSelect.addClass("is-invalid");
    error = true;
  }

  if (place.length === 0) {
    placeSelect.addClass("is-invalid");
    error = true;
  }

  if (error) return;

  let urls = time
    .map((t) =>
      place.map(
        (p) =>
          `${domain}?module=net_booking&files=booking_place&StepFlag=25&QPid=${p}&QTime=${t}&PT=1&D=${date}`
      )
    )
    .flat();

  $("#active").addClass("disabled");
  $("#activeTitle").removeClass("d-none");

  let checkTime = null;

  checkTime = setInterval(() => {
    const now = new Date();
    const min = now.getMinutes();
    const sec = now.getSeconds();
    const msec = now.getMilliseconds();

    console.log(`${min}:${sec}:${msec}`);
    if (min === 0 && sec >= 0 && msec >= 0) {
      callApi(urls);
      clearInterval(checkTime);
    }
  });
}

function callApi(urls) {
  // let api = null;
  // let index = 0;
  // api = setInterval(() => {
  // index++;
  // const now = new Date();
  // const time = `${now.getHours()}：${now.getMinutes()}：${now.getSeconds()}：${now.getMilliseconds()}`;
  // console.log(`time = ${time}`);
  // urls.map((url) => console.log(url));
  urls.map((url) => window.open(url));
  // if (index >= 8) {
  //   clearInterval(api);
  // }
  // }, 250);
}
