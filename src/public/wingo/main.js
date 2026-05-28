// =============================================================
// main.js — Orchestrator
// Loaded AFTER: helpers.js, audio.js, timer.js, display.js,
//               my-bets-display.js, game-logic.js, socket-handler.js
// =============================================================

// Auth token passed from Vue app via ?t= URL param (for APK iframe context)
const _iframeToken = new URLSearchParams(window.location.search).get('t');
if (_iframeToken) {
  $.ajaxSetup({ headers: { Authorization: `Bearer ${_iframeToken}` } });
  axios.defaults.headers.common['Authorization'] = `Bearer ${_iframeToken}`;
}

// Map game type IDs to their new display labels
const GAME_LABELS = {
  "1": "30 SEC",
  "3": "1 MIN",
  "5": "3 MIN",
  "10": "5 MIN",
};

const getGameLabel = (gameType) => {
  return GAME_LABELS[gameType] || "30 SEC";
};

const getGameType = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameType = urlParams.get("game_type") || "1";
  $("#game_type_status").text(getGameLabel(gameType));
  return gameType;
};

let GAME_TYPE_ID = getGameType();
let GAME_NAME = GAME_TYPE_ID === "1" ? "wingo" : `wingo${GAME_TYPE_ID}`;

let My_Bets_Pages = 1;
let Game_History_Pages = 1;

// ---- Game type switching ----
const selectActiveClockByGameType = (gameTypeId) => {
  GAME_TYPE_ID = `${gameTypeId}`;
  GAME_NAME = GAME_TYPE_ID === "1" ? "wingo" : `wingo${GAME_TYPE_ID}`;

  // Persist selection in URL so it survives socket events & page refreshes
  const url = new URL(window.location);
  url.searchParams.set("game_type", GAME_TYPE_ID);
  window.history.replaceState({}, "", url);
  initGameLogics({
    GAME_TYPE_ID,
    GAME_NAME,
    My_Bets_Pages,
    Game_History_Pages,
  });
  clearInterval(countDownInterval1);
  clearInterval(countDownInterval2);
  clearInterval(countDownInterval3);
  countDownTimer({ GAME_TYPE_ID });
  console.log(GAME_TYPE_ID);
  document.getElementById('timeType').textContent = `Win Go ${getGameLabel(GAME_TYPE_ID)}`;
  document.getElementById('betting_popup_title').textContent = `Win Go ${getGameLabel(GAME_TYPE_ID)}`;
};

// ---- Initial game setup ----
initGameLogics({ GAME_TYPE_ID, GAME_NAME, My_Bets_Pages, Game_History_Pages });
document.getElementById('timeType').textContent = `Win Go ${getGameLabel(GAME_TYPE_ID)}`;
document.getElementById('betting_popup_title').textContent = `Win Go ${getGameLabel(GAME_TYPE_ID)}`;

// ---- Start countdown on page load ----
window.onload = function () {
  countDownTimer({ GAME_TYPE_ID });
};

// ---- Fetch initial user balance ----
fetch("/api/webapi/GetUserInfo", _iframeToken ? { headers: { Authorization: `Bearer ${_iframeToken}` } } : {})
  .then((response) => response.json())
  .then((data) => {
    $(".Loading").fadeOut(0);
    if (data.status === false) {
      unsetCookie();
      return false;
    }
    $("#balance_amount").text(`₹ ${formatIndianNumber(data.data.money_user)} `);
    $("#bonus_balance_amount").text(
      `₹ ${formatIndianNumber(data.data.bonus_money)} `,
    );
  });

// ---- Reload balance button ----
$(".reload_money").click(function (e) {
  e.preventDefault();
  $(this).addClass("action block-click");
  setTimeout(() => {
    $(this).removeClass("action block-click");
  }, 3000);
  fetch("/api/webapi/GetUserInfo", _iframeToken ? { headers: { Authorization: `Bearer ${_iframeToken}` } } : {})
    .then((response) => response.json())
    .then((data) => {
      if (data.status === false) {
        unsetCookie();
        return false;
      }
      $("#balance_amount").text(
        `₹ ${formatIndianNumber(data.data.money_user)} `,
      );
      $("#bonus_balance_amount").text(
        `₹ ${formatIndianNumber(data.data.bonus_money)} `,
      );
    });
});
