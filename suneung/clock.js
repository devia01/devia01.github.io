const clock = document.getElementById("clock");
const clock_sec = document.getElementById("clock-sec");
const time_remain = document.getElementById("time-remain");
const subject = document.getElementById("subject");
const btn_start = document.getElementById("start");

let start = 0;
let end = 0;
let warning = 0;
let now = 0;
let id = 0;
let interval = 1000;
let isPaused = false;

const info = new Map()  // 과목별 시간 정보
  .set("국어", { start: 31200, end: 36000, warning: 35400 })
  .set("수학", { start: 37800, end: 43800, warning: 43200 })
  .set("영어", { start: 47400, end: 51600, warning: 51000 })
  .set("탐구1", { start: 55800, end: 57600, warning: 57300 })
  .set("탐구2", { start: 57720, end: 59520, warning: 59220 })
  .set("외국어", { start: 61200, end: 63000, warning: 62700 });

function playAudio(subject, title) {  // 종소리를 재생합니다.
  let audio = new Audio(`./audio/${subject} ${title}.mp3`);
  audio.volume = 0.5;
  audio.play();
}

function updateClock() {  // 현재 저장된 변수값을 바탕으로 시간을 표시합니다.
  let hour = parseInt(now / 3600);
  let minute = parseInt(now / 60) % 60;
  let second = now % 60;
  clock.innerHTML = ("0" + hour).slice(-2) + " : " + ("0" + minute).slice(-2);
  clock_sec.innerHTML = "&nbsp;:&nbsp;" + ("0" + second).slice(-2);
  time_remain.innerHTML = `시험 종료까지 ${Math.round((end - now) / 60)}분 남았습니다.`;
}

function setInfo() {  // 현재 선택된 값을 바탕으로 변수를 설정합니다.
  start = info.get(subject.value).start;
  end = info.get(subject.value).end;
  warning = info.get(subject.value).warning;
  now = start;

  if (document.getElementById("prepare").checked && subject.value != "탐구2") {
    now -= 300;
  }
}

function tick() {  // 매초마다 실행되는 코드
  now += 1;
  updateClock();

  if (now == start) {
    playAudio(subject.value, "시작령");
  } else if (now == warning) {
    playAudio(subject.value, "예비령");
  } else if (now == end) {
    clearInterval(id);
    playAudio(subject.value, "종료령");
  }
}

btn_start.addEventListener("click", function () {
  if (document.getElementById("fast").checked) {  // 배속 설정
    interval = parseInt(1000 / 1.1);
  } else {
    interval = 1000;
  }

  if (id == 0 && !isPaused) {  // 타이머 정지 상태 && 일시정지 상태 아님
    setInfo();
    updateClock();

    if (document.getElementById("prepare").checked) {
      if (subject.value == "탐구2") {
        playAudio(subject.value, "시작령");
      } else {
        playAudio(subject.value, "준비령");
      }
    } else {
      playAudio(subject.value, "시작령");
    }

    btn_start.classList.remove("bg-blue-400", "hover:bg-blue-300");
    btn_start.classList.add("bg-gray-500", "hover:bg-gray-400");
    btn_start.innerHTML = "> 타이머 일시정지";

    id = setInterval(tick, interval);
  } else if (id == 0 && isPaused) { // 타이머 일시정지 상태
    btn_start.classList.remove("bg-blue-400", "hover:bg-blue-300");
    btn_start.classList.add("bg-gray-500", "hover:bg-gray-400");
    btn_start.innerHTML = "> 타이머 일시정지";

    id = setInterval(tick, interval);
  } else {  // 타이머 작동중
    btn_start.classList.remove("bg-gray-500", "hover:bg-gray-400");
    btn_start.classList.add("bg-blue-400", "hover:bg-blue-300");
    btn_start.innerHTML = "> 타이머 시작";

    clearInterval(id);
    isPaused = true;
    id = 0;
  }
});

document.getElementById("prepare").addEventListener("change", function () {
  setInfo();
  updateClock();
});

subject.addEventListener("change", function () {
  setInfo();
  updateClock();
});
