//------------------countdown timer-------------------
var countDownInterval1 = null;
var countDownInterval2 = null;
var countDownInterval3 = null;

function countDownTimer({ GAME_TYPE_ID }) {
  const getIntervalSeconds = (gameType) => {
    const intervalMap = { "1": 30, "3": 60, "5": 180, "10": 300 };
    return intervalMap[gameType] || 30;
  };

  const intervalSeconds = getIntervalSeconds(GAME_TYPE_ID);
  const is30SecGame = GAME_TYPE_ID === "1";

  const getTimeMSS = () => {
    var now = Math.floor(Date.now() / 1000); // current epoch seconds
    var secondsInInterval = intervalSeconds - (now % intervalSeconds);

    // When modulo result is exactly intervalSeconds, we're at the boundary
    if (secondsInInterval === intervalSeconds) secondsInInterval = 0;

    var minute = 0;
    var displaySeconds = secondsInInterval;

    if (!is30SecGame) {
      minute = Math.floor(secondsInInterval / 60);
      displaySeconds = secondsInInterval % 60;
    }

    var seconds1 = Math.floor(displaySeconds / 10);
    var seconds2 = displaySeconds % 10;

    return { minute, seconds1, seconds2, secondsInInterval };
  };

  // --- Interval 1: Update timer display every second ---
  function updateTimerDisplay() {
    const { minute, seconds1, seconds2 } = getTimeMSS();
    if (is30SecGame) {
      $(".TimeLeft__C-time div:eq(1)").text("0");
    } else {
      $(".TimeLeft__C-time div:eq(1)").text(minute);
    }
    $(".TimeLeft__C-time div:eq(3)").text(seconds1);
    $(".TimeLeft__C-time div:eq(4)").text(seconds2);
  }
  updateTimerDisplay(); // immediate first call
  countDownInterval1 = setInterval(updateTimerDisplay, 1000);

  // --- Interval 2: Audio alerts (every second) ---
  countDownInterval2 = setInterval(() => {
    const { minute, seconds1, seconds2, secondsInInterval } = getTimeMSS();
    const check_volume = localStorage.getItem("volume");

    const isLastFiveSeconds = is30SecGame
      ? secondsInInterval <= 5
      : (minute == 0 && seconds1 == 0 && seconds2 <= 5);

    if (isLastFiveSeconds) {
      if (clicked && check_volume == "on") { playAudio1(); }
    }

    const alertTime = is30SecGame ? 25 : 55;
    const currentDisplaySeconds = seconds1 * 10 + seconds2;
    if ((is30SecGame && secondsInInterval == alertTime) ||
      (!is30SecGame && minute == 0 && currentDisplaySeconds == 55)) {
      if (clicked && check_volume == "on") { playAudio2(); }
    }
  }, 1000);

  // --- Interval 3: Betting lock overlay (every second) ---
  countDownInterval3 = setInterval(function () {
    const { minute, seconds1, seconds2, secondsInInterval } = getTimeMSS();

    const isLastFiveSeconds = is30SecGame
      ? secondsInInterval <= 5
      : (minute == 0 && seconds1 == 0 && seconds2 <= 5);

    if (isLastFiveSeconds) {
      $(".van-overlay").fadeOut();
      $(".popup-join").fadeOut();
      $(".Betting__C-mark").css("display", "flex");
      $(".Betting__C-mark div:eq(0)").text(seconds1);
      $(".Betting__C-mark div:eq(1)").text(seconds2);
    } else {
      $(".Betting__C-mark").css("display", "none");
    }
  }, 1000);
}
