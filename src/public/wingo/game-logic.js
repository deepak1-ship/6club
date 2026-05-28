//------------------game logic (betting, pagination, tabs)-------------------

function initGameLogics({
  GAME_TYPE_ID,
  GAME_NAME,
  My_Bets_Pages,
  Game_History_Pages,
}) {
  selectActiveClock(parseInt(GAME_TYPE_ID));

  //--------------------- Wingo game logic ---------------------

  var pageno = 0;
  var limit = 10;
  var page = 1;

  // --------------------- wingo game logic ---------------------

  function totalMoney() {
    let value = parseInt($("#van-field-1-input").val().trim());
    let money = parseInt(
      $(".Betting__Popup-body-money-main").attr("data-current-money"),
    );
    console.log($("#van-field-1-input").val());
    console.log(money);
    let total = value * money;
    $("#popup_total_bet_money").text(total + ".00");
  }

  const selectPopupXData = () => { };
  $(".van-overlay").fadeOut();
  $(".popup-join").fadeOut();

  function alertBox(join, cssValueNumber, addText) {
    $(".van-overlay").fadeIn();
    $(".popup-join").fadeIn();
    $(".popup-join > div").removeClass();
    $(".popup-join > div").addClass(`Betting__Popup-${cssValueNumber}`);

    let activeXData = $(".Betting__C-multiple-r.active").attr("data-x");
    console.log(activeXData);
    $("#van-field-1-input").val(activeXData);
    $("div.Betting__Popup-body-x-btn").removeClass("bgcolor");
    $(`div.Betting__Popup-body-x-btn[data-x="${activeXData}"]`).addClass(
      "bgcolor",
    );
    $("#join_bet_btn").attr("data-join", join);
    $("#betting_value").html(addText);
    totalMoney();
  }

  $(".Betting__Popup-body-money-btn").off("click.money_btn");
  $(".Betting__Popup-body-money-btn").on("click.money_btn", function (e) {
    e.preventDefault();
    const thisValue = $(this).attr("data-money");
    $(".Betting__Popup-body-money-btn").removeClass("bgcolor");
    $(this).addClass("bgcolor");
    $(".Betting__Popup-body-money-main").attr("data-current-money", thisValue);
    totalMoney();
  });

  $(".Betting__Popup-body-x-btn").off("click.x_btn");
  $(`.Betting__Popup-body-x-btn`).on("click.x_btn", function (e) {
    e.preventDefault();
    const thisValue = $(this).attr("data-x");
    $(".Betting__Popup-body-x-btn").removeClass("bgcolor");
    $(this).addClass("bgcolor");
    $("#van-field-1-input").val(thisValue);
    totalMoney();
  });

  $(".Betting__Popup-minus-btn").off("click.minus_btn");
  $(`.Betting__Popup-minus-btn`).on("click.minus_btn", function (e) {
    e.preventDefault();
    const currentX = parseInt($("#van-field-1-input").val());
    const nextX = currentX === 1 ? 1 : currentX - 1;
    $(".Betting__Popup-body-x-btn").removeClass("bgcolor");
    $(`.Betting__Popup-body-x-btn[data-x="${nextX}"]`).addClass("bgcolor");
    $("#van-field-1-input").val(nextX);
    totalMoney();
  });

  $(".Betting__Popup-plus-btn").off("click.plus_btn");
  $(`.Betting__Popup-plus-btn`).on("click.plus_btn", function (e) {
    e.preventDefault();
    const currentX = parseInt($("#van-field-1-input").val());
    const nextX = currentX + 1;
    $(".Betting__Popup-body-x-btn").removeClass("bgcolor");
    $(`.Betting__Popup-body-x-btn[data-x="${nextX}"]`).addClass("bgcolor");
    $("#van-field-1-input").val(nextX);
    totalMoney();
  });

  $(`#van-field-1-input`).off("change.input");
  $(`#van-field-1-input`).on("change.input", function (e) {
    e.preventDefault();
    const currentX = parseInt($("#van-field-1-input").val());
    $(".Betting__Popup-body-x-btn").removeClass("bgcolor");
    $(`.Betting__Popup-body-x-btn[data-x="${currentX}"]`).addClass("bgcolor");
    totalMoney();
  });

  $("#join_bet_btn").off("click.join_btn");
  $("#join_bet_btn").on("click.join_btn", function (event) {
    event.preventDefault();
    let join = $(this).attr("data-join");
    const currentX = parseInt($("#van-field-1-input").val().trim());
    let money = $(".Betting__Popup-body-money-main").attr("data-current-money");

    if (!join || !currentX || !money) { return; }

    $(this).addClass("block-click");
    $.ajax({
      type: "POST",
      url: "/api/webapi/action/join",
      data: { typeid: GAME_TYPE_ID, join: join, x: currentX, money: money },
      dataType: "json",
      success: function (response) {
        alertMessage(response.message);
        if (response.status === false) return;
        $("#balance_amount").text(`₹ ${formatIndianNumber(response.money)} `);
        $("#bonus_balance_amount").text(
          `₹ ${formatIndianNumber(response.bonus_money)} `,
        );
        initMyBets();
        socket.emit("data-server_2", {
          money: currentX * money,
          join,
          time: Date.now(),
          change: response.change,
        });
      },
    });

    setTimeout(() => {
      $(".van-overlay").fadeOut();
      $(".popup-join").fadeOut();
      $("#join_bet_btn").removeClass("block-click");
    }, 500);
  });

  $("#cancel_bet_btn").off("click.cancel_btn");
  $("#cancel_bet_btn").on("click.cancel_btn", function (event) {
    event.preventDefault();
    $(".van-overlay").fadeOut();
    $(".popup-join").fadeOut();
    $("#join_bet_btn").removeClass("block-click");
  });

  //main button events

  $(".con-box .bet_button").off("click.con_box");
  $(".con-box .bet_button").on("click.con_box", function (e) {
    e.preventDefault();
    let addTop = $(this).attr("data-join");
    let cssValueNumber = $(this).attr("data-css-value");
    let addText = $(this).text();
    alertBox(addTop, cssValueNumber, addText);
  });

  $(".number-box .bet_button").off("click.number_box");
  $(".number-box .bet_button").on("click.number_box", function (e) {
    e.preventDefault();
    let addTop = $(this).attr("data-join");
    let cssValueNumber = $(this).attr("data-css-value");
    let addText = $(this).attr("data-join");
    alertBox(addTop, cssValueNumber, addText);
  });

  $(".btn-box .bet_button").off("click.btn_box");
  $(".btn-box .bet_button").on("click.btn_box", function (e) {
    e.preventDefault();
    let addTop = $(this).attr("data-join");
    let cssValueNumber = $(this).attr("data-css-value");
    let addText = $(this).text();
    alertBox(addTop, cssValueNumber, addText);
  });

  $(".Betting__C-multiple-r").off("click.multiple_r");
  $(".Betting__C-multiple-r").on("click.multiple_r", function (e) {
    e.preventDefault();
    $(".Betting__C-multiple-r").css({
      "background-color": "rgb(240, 240, 240)",
      color: "rgb(0, 0, 0)",
    });
    $(this).css({
      "background-color": "rgb(63 147 104)",
      color: "rgb(255, 255, 255)",
    });
    $(".Betting__C-multiple-r").removeClass("active");
    $(this).addClass("active");
  });

  $(".randomBtn").off("click.multiple_r");
  $(".randomBtn").on("click.multiple_r", async function (e) {
    e.preventDefault();
    let random = 0;
    for (let i = 0; i < 55; i++) {
      random = Math.floor(Math.random() * 10);
      $(".number-box .bet_button").removeClass("active");
      $(`.number-box .bet_button:eq(${random})`).addClass("active");
      await sleep(50);
    }
    alertBox(random, random, random);
  });

  const alertMessage = (text) => {
    const msg = document.createElement("div");
    msg.setAttribute("data-v-1dcba851", "");
    msg.className = "message_alert_root";

    const msgContent = document.createElement("div");
    msgContent.setAttribute("data-v-1dcba851", "");
    msgContent.className = "message_alert_text";
    msgContent.style = "";
    msgContent.textContent = text;

    msg.appendChild(msgContent);
    document.body.appendChild(msg);

    setTimeout(() => {
      msgContent.classList.remove("v-enter-active", "v-enter-to");
      msgContent.classList.add("v-leave-active", "v-leave-to");
      setTimeout(() => { document.body.removeChild(msg); }, 100);
    }, 1000);
  };

  // ------------------------- wingo game logic --------------------end

  // -------------------------- game pagination -----------------------

  const initGameHistoryTab = (page = 1) => {
    let size = 10;
    let offset = page === 1 ? 0 : (page - 1) * size;
    let limit = page * size;

    $.ajax({
      type: "POST",
      url: "/api/webapi/GetNoaverageEmerdList",
      data: { typeid: GAME_TYPE_ID, pageno: offset, pageto: 10, language: "vi" },
      dataType: "json",
      success: function (response) {
        Game_History_Pages = response.page;
        let list_orders = response.data.gameslist;
        $("#period").text(response.period);
        $("#number_result__gameHistory").text(`${page}/${response.page}`);

        if (page == 1) $("#game_history__bottom_nav .previous_page").addClass("disabled");
        else $("#game_history__bottom_nav .previous_page").removeClass("disabled");

        if (page == response.data.page) $("#game_history__bottom_nav .next_page").addClass("disabled");
        else $("#game_history__bottom_nav .next_page").removeClass("disabled");

        $(".Loading").fadeOut(0);
        showGameHistoryData(list_orders);
      },
    });
  };
  initGameHistoryTab();

  const initChartTab = (page = 1) => {
    let size = 10;
    let offset = page === 1 ? 0 : (page - 1) * size;
    let limit = page * size;

    $.ajax({
      type: "POST",
      url: "/api/webapi/GetNoaverageEmerdList",
      data: { typeid: GAME_TYPE_ID, pageno: offset, pageto: 10, language: "vi" },
      dataType: "json",
      success: function (response) {
        Game_History_Pages = response.page;
        let list_orders = response.data.gameslist;
        $("#period").text(response.period);
        $("#number_result__chart").text(`${page}/${response.page}`);

        if (page == 1) $("#chart__bottom_nav .previous_page").addClass("disabled");
        else $("#chart__bottom_nav .previous_page").removeClass("disabled");

        if (page == response.page) $("#chart__bottom_nav .next_page").addClass("disabled");
        else $("#chart__bottom_nav .next_page").removeClass("disabled");

        $(".Loading").fadeOut(0);
        showTrendData(list_orders);
      },
    });
  };
  initChartTab();

  function initMyBets(page = 1) {
    let size = 10;
    let offset = page === 1 ? 0 : (page - 1) * size;
    let limit = page * size;
    $.ajax({
      type: "POST",
      url: "/api/webapi/GetMyEmerdList",
      data: { typeid: GAME_TYPE_ID, pageno: offset, pageto: 10, language: "vi" },
      dataType: "json",
      success: function (response) {
        My_Bets_Pages = response.page;
        let data = response.data.gameslist;
        $("#number_result__myBet").text(`${page}/${response.page}`);

        if (page == 1) $("#my_bets__bottom_nav .previous_page").addClass("disabled");
        else $("#my_bets__bottom_nav .previous_page").removeClass("disabled");

        if (page == response.page) $("#my_bets__bottom_nav .next_page").addClass("disabled");
        else $("#my_bets__bottom_nav .next_page").removeClass("disabled");

        $(".Loading").fadeOut(0);
        showMyBetsData(data);
      },
    });
  }
  initMyBets();

  $("#my_bets__bottom_nav .previous_page").off("click.mb_previous_page");
  $("#my_bets__bottom_nav .previous_page").on("click.mb_previous_page", function (e) {
    e.preventDefault();
    $("#my_bets__bottom_nav .previous_page").addClass("block-click");
    $(".Loading").fadeIn(0);
    const currentPage = parseInt($("#number_result__myBet").text().split("/")[0]);
    const previousPage = 1 <= currentPage - 1 ? currentPage - 1 : currentPage;
    initMyBets(previousPage);
    $(".Loading").fadeOut(0);
    $("#my_bets__bottom_nav .previous_page").removeClass("block-click");
  });

  $("#my_bets__bottom_nav .next_page").off("click.mb_next_page");
  $("#my_bets__bottom_nav .next_page").on("click.mb_next_page", function (e) {
    e.preventDefault();
    $("#my_bets__bottom_nav .previous_page").addClass("block-click");
    $(".Loading").fadeIn(0);
    const currentPage = parseInt($("#number_result__myBet").text().split("/")[0]);
    const nextPage = My_Bets_Pages >= currentPage + 1 ? currentPage + 1 : currentPage;
    initMyBets(nextPage);
    $(".Loading").fadeOut(0);
    $("#my_bets__bottom_nav .previous_page").removeClass("block-click");
  });

  $("#game_history__bottom_nav .previous_page").off("click.gh_previous_page");
  $("#game_history__bottom_nav .previous_page").on("click.gh_previous_page", function (e) {
    e.preventDefault();
    $("#game_history__bottom_nav .previous_page").addClass("block-click");
    $(".Loading").fadeIn(0);
    const currentPage = parseInt($("#number_result__gameHistory").text().split("/")[0]);
    const previousPage = 1 <= currentPage - 1 ? currentPage - 1 : currentPage;
    initGameHistoryTab(previousPage);
    $(".Loading").fadeOut(0);
    $("#game_history__bottom_nav .previous_page").removeClass("block-click");
  });

  $("#game_history__bottom_nav .next_page").off("click.gh_next_page");
  $("#game_history__bottom_nav .next_page").on("click.gh_next_page", function (e) {
    e.preventDefault();
    $("#game_history__bottom_nav .next_page").addClass("block-click");
    $(".Loading").fadeIn(0);
    const currentPage = parseInt($("#number_result__gameHistory").text().split("/")[0]);
    const nextPage = Game_History_Pages >= currentPage + 1 ? currentPage + 1 : currentPage;
    initGameHistoryTab(nextPage);
    $(".Loading").fadeOut(0);
    $("#game_history__bottom_nav .next_page").removeClass("block-click");
  });

  $("#chart__bottom_nav .previous_page").off("click.ch_previous_page");
  $("#chart__bottom_nav .previous_page").on("click.ch_previous_page", function (e) {
    e.preventDefault();
    $("#chart__bottom_nav .previous_page").addClass("block-click");
    $(".Loading").fadeIn(0);
    const currentPage = parseInt($("#number_result__chart").text().split("/")[0]);
    const previousPage = 1 <= currentPage - 1 ? currentPage - 1 : currentPage;
    initChartTab(previousPage);
    $(".Loading").fadeOut(0);
    $("#chart__bottom_nav .previous_page").removeClass("block-click");
  });

  $("#chart__bottom_nav .next_page").off("click.ch_next_page");
  $("#chart__bottom_nav .next_page").on("click.ch_next_page", function (e) {
    e.preventDefault();
    $("#chart__bottom_nav .next_page").addClass("block-click");
    $(".Loading").fadeIn(0);
    const currentPage = parseInt($("#number_result__chart").text().split("/")[0]);
    const nextPage = Game_History_Pages >= currentPage + 1 ? currentPage + 1 : currentPage;
    initChartTab(nextPage);
    $(".Loading").fadeOut(0);
    $("#chart__bottom_nav .next_page").removeClass("block-click");
  });

  // -------------------------------- pagination -----------------------------end

  $(".van-notice-bar__wrap .van-notice-bar__content").css({
    "transition-duration": "48.9715s",
    transform: "translateX(-2448.57px)",
  });

  setInterval(() => {
    $(".van-notice-bar__wrap .van-notice-bar__content").css({
      "transition-duration": "0s",
      transform: "translateX(0)",
    });
    setTimeout(() => {
      $(".van-notice-bar__wrap .van-notice-bar__content").css({
        "transition-duration": "48.9715s",
        transform: "translateX(-2448.57px)",
      });
    }, 100);
  }, 48000);

  $(".van-button--default").off("click.van_button");
  $(".van-button--default").on("click.van_button", function (e) {
    e.preventDefault();
    $(".van-popup-vf, .van-overlay").fadeOut(100);
  });

  $(".circular").off("click.circular");
  $(".circular").on("click.circular", function (e) {
    e.preventDefault();
    $(".van-popup-vf, .van-overlay").fadeIn(100);
  });

  // ------------------ Tab handling Logic -------------------

  const TAB_NAME_MAP = {
    GAME_HISTORY: "GAME_HISTORY",
    TREND: "TREND",
    MY_BETS: "MY_BETS",
    STRATEGY: "STRATEGY",
  };

  const setActiveTab = (selectedTabName) => {
    $("#game_history_tab").removeClass("active");
    $("#trend_tab").removeClass("active");
    $("#my_bets_tab").removeClass("active");
    $("#strategy_tab").removeClass("active");

    $("#game_history_tab_button").removeClass("action");
    $("#trend_tab_button").removeClass("action");
    $("#my_bets_tab_button").removeClass("action");
    $("#strategy_tab_button").removeClass("action");

    if (TAB_NAME_MAP.GAME_HISTORY === selectedTabName) {
      $("#game_history_tab").addClass("active");
      $("#game_history_tab_button").addClass("action");
    }
    if (TAB_NAME_MAP.TREND === selectedTabName) {
      $("#trend_tab").addClass("active");
      $("#trend_tab_button").addClass("action");
    }
    if (TAB_NAME_MAP.MY_BETS === selectedTabName) {
      $("#my_bets_tab").addClass("active");
      $("#my_bets_tab_button").addClass("action");
    }
    if (TAB_NAME_MAP.STRATEGY === selectedTabName) {
      $("#strategy_tab").addClass("active");
      $("#strategy_tab_button").addClass("action");
    }
  };

  $("#game_history_tab_button").off("click.game_history_tab_button");
  $("#game_history_tab_button").on("click.game_history_tab_button", function (e) {
    e.preventDefault();
    setActiveTab(TAB_NAME_MAP.GAME_HISTORY);
    initGameHistoryTab();
  });

  $("#trend_tab_button").off("click.trend_tab_button");
  $("#trend_tab_button").on("click.trend_tab_button", function (e) {
    e.preventDefault();
    setActiveTab(TAB_NAME_MAP.TREND);
    initChartTab();
  });

  $("#my_bets_tab_button").off("click.my_bets_tab_button");
  $("#my_bets_tab_button").on("click.my_bets_tab_button", function (e) {
    e.preventDefault();
    setActiveTab(TAB_NAME_MAP.MY_BETS);
    initMyBets();
  });

  $("#strategy_tab_button").off("click.strategy_tab_button");
  $("#strategy_tab_button").on("click.strategy_tab_button", function (e) {
    e.preventDefault();
    setActiveTab(TAB_NAME_MAP.STRATEGY);
  });

  // ------------------ Tab handling Logic -------------------end

  //--------------------- Wingo game logic ---------------------
}
