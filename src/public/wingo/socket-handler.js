//------------------socket.io event handling-------------------

var socket = io();
var pageno = 0;
var limit = 10;
var page = 1;

const STATUS_MAP = {
  WIN: "win",
  LOSS: "loss",
  NONE: "none",
};

socket.on("data-server", async function (msg) {
  try {
    // Don't re-read game type from URL here — it overwrites the user's
    // in-memory tab selection.  GAME_TYPE_ID / GAME_NAME are already set
    // correctly by selectActiveClockByGameType().
    if (msg.data[0].game != GAME_NAME) {
      return;
    }

    $(".Loading").fadeIn(0);

    const params = new URLSearchParams();
    params.append("typeid", GAME_TYPE_ID);
    params.append("pageno", "0");
    params.append("pageto", "10");
    params.append("language", "vi");

    const betList = axios({
      method: "POST",
      url: "/api/webapi/GetMyEmerdList",
      data: params,
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });

    const gameList = axios({
      method: "POST",
      url: "/api/webapi/GetNoaverageEmerdList",
      data: params,
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });

    const [betDataResponse, gameDataResponse] = await Promise.all([
      betList,
      gameList,
    ]);

    const betListData = betDataResponse.data?.data?.gameslist;
    const gameListData = gameDataResponse.data?.data?.gameslist;

    const lastGame = gameListData?.[0];

    const lastGameBets = betListData?.filter(
      (game) => game.stage === lastGame?.period,
    );

    const lostGames = lastGameBets?.filter((game) => game.get === 0);
    const lostGamesMoney = lostGames?.reduce(
      (acc, game) => acc + game.money,
      0,
    );
    const winGames = lastGameBets?.filter((game) => game.get > 0);
    const winGamesMoney = winGames?.reduce((acc, game) => acc + game.get, 0);

    let format = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    });

    let number = parseInt(winGamesMoney, 10);
    let formattedNumber = format.format(number);

    if (lastGameBets.length > 0) {
      if (winGamesMoney > 0) {
        displayResultHandler({
          status: STATUS_MAP.WIN,
          amount: formattedNumber,
          period: lastGame?.period,
          result: lastGame?.amount,
        });
      } else {
        displayResultHandler({
          status: STATUS_MAP.LOSS,
          amount: lostGamesMoney,
          period: lastGame?.period,
          result: lastGame?.amount,
        });
      }
    } else {
      // displayResultHandler({
      //    status: STATUS_MAP.NONE,
      //    period: lastGame?.period,
      //    result: lastGame?.amount,
      // });
    }

    $("#period").text(gameDataResponse.data.period);
    $("#number_result__gameHistory").text(`1/${gameDataResponse.data.page}`);
    $("#number_result__myBet").text(`1/${betDataResponse.data.page}`);
    showGameHistoryData(gameListData);
    showTrendData(gameListData);
    showMyBetsData(betListData);

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

    $(".Loading").fadeOut(0);
  } catch (error) {
    console.log(error);
  }
});
