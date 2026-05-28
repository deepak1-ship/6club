//------------------display / rendering-------------------

const displayResultHandler = ({ status, amount, period, result }) => {
  let colorDisplay = "";
  let bsDisplay = "";

  if (parseInt(result) % 2 === 0) { colorDisplay = "Red"; }
  else { colorDisplay = "Green"; }
  if (parseInt(result) === 5) { colorDisplay = "Purple Green"; }
  if (parseInt(result) === 0) { colorDisplay = "Purple Red"; }
  if (parseInt(result) >= 5) { bsDisplay = "Big"; }
  else { bsDisplay = "Small"; }

  $("#lottery_results_box").removeClass();
  $("#lottery_results_box").addClass(`WinningTip__C-body-l2 type${result}`);
  $("#popup_color_display").html(colorDisplay);
  $("#popup_num_display").html(result);
  $("#popup_bs_display").html(bsDisplay);
  $("#popup_game_details").html(`Period: Win Go ${getGameLabel(GAME_TYPE_ID)} ${period}`);

  if (status === STATUS_MAP.WIN) {
    $("#popup_win_rupees_display").html(`${amount}`);
    $("#popup_greeting_display").html(`Congratulations`);
    $("#popup_background").removeClass("isL");
    $("#popup_greeting_display").removeClass("isL");
    $("#popup_win_rupees_display").css("display", "block");
    $("#popup_win_symbol").css("display", "block");
    $("#popup_loss_symbol").css("display", "none");
  } else if (status === STATUS_MAP.LOSS) {
    $("#popup_greeting_display").html(`Sorry`);
    $("#popup_background").addClass("isL");
    $("#popup_greeting_display").addClass("isL");
    $("#popup_win_rupees_display").css("display", "none");
    $("#popup_win_symbol").css("display", "none");
    $("#popup_loss_symbol").css("display", "block");
  }

  $("#popup_modal").css("display", "block");
};

function drawChartLineInCanvas(topBoxNumber, bottomBoxNumber, canvasId) {
  const myCanvas = document.getElementById(canvasId);
  let boxXList = [10, 40, 70, 100, 128, 157, 186, 215, 244, 273];
  const ctx0 = myCanvas.getContext("2d");
  ctx0.strokeStyle = "#B1835A";
  ctx0.beginPath();
  ctx0.moveTo(boxXList[topBoxNumber], 21);
  ctx0.lineTo(boxXList[bottomBoxNumber], 128);
  ctx0.stroke();
}

function selectActiveClock(currentTime) {
  document.querySelector(".min_t_1").classList.remove("active");
  document.querySelector(".min_t_3").classList.remove("active");
  document.querySelector(".min_t_5").classList.remove("active");
  document.querySelector(".min_t_10").classList.remove("active");

  switch (parseInt(currentTime)) {
    case 1: document.querySelector(".min_t_1").classList.add("active"); break;
    case 3: document.querySelector(".min_t_3").classList.add("active"); break;
    case 5: document.querySelector(".min_t_5").classList.add("active"); break;
    case 10: document.querySelector(".min_t_10").classList.add("active"); break;
    default: throw new Error("Invalid time");
  }
}

const displayLast5Result = ({ results }) => {
  $(".TimeLeft__C-num").html(
    results
      .map((result) => `<div data-v-3e4c6499 class="n${result}"></div>`)
      .join(" "),
  );
};

function showGameHistoryData(list_orders) {
  const containerId = "#game_history_data_container";

  displayLast5Result({
    results: list_orders.slice(0, 5).map((game) => game.amount),
  });

  if (list_orders.length == 0) {
    return $(containerId).html(`
      <div data-v-a9660e98="" class="van-empty">
          <div class="van-empty__image">
              <img src="/images/empty-image-default.png" />
          </div>
          <p class="van-empty__description">No data</p>
      </div>
   `);
  }

  let html = list_orders
    .map((list_order) => {
      let colorHtml = "";
      let colorClass = "";
      if (list_order.amount == 0) {
        colorClass = "mixedColor0";
        colorHtml = `
            <div data-v-c52f94a7="" class="GameRecord__C-origin-I red"></div>
            <div data-v-c52f94a7="" class="GameRecord__C-origin-I violet"></div>
            `;
      } else if (list_order.amount == 5) {
        colorClass = "mixedColor5";
        colorHtml = `
            <div data-v-c52f94a7="" class="GameRecord__C-origin-I green"></div>
            <div data-v-c52f94a7="" class="GameRecord__C-origin-I violet"></div>
            `;
      } else if (list_order.amount % 2 == 0) {
        colorClass = "defaultColor";
        colorHtml = `
            <div data-v-c52f94a7="" class="GameRecord__C-origin-I red"></div>
            `;
      } else {
        colorClass = "greenColor";
        colorHtml = `
               <div data-v-c52f94a7="" class="GameRecord__C-origin-I green"></div>
            `;
      }

      return `
         <div data-v-c52f94a7="" class="van-row">
            <div data-v-c52f94a7="" class="van-col van-col--8">${list_order.period}</div>
            <div data-v-c52f94a7="" class="van-col van-col--5 numcenter"><div data-v-c52f94a7="" class="GameRecord__C-body-num ${colorClass}">${list_order.amount}</div></div>
            <div data-v-c52f94a7="" class="van-col van-col--5"><span data-v-c52f94a7="">${list_order.amount < 5 ? "Small" : "Big"}</span></div>
            <div data-v-c52f94a7="" class="van-col van-col--6">
               <div data-v-c52f94a7="" class="GameRecord__C-origin">
                  ${colorHtml}
               </div>
            </div>
         </div>`;
    })
    .join(" ");

  $(containerId).html(html);
}

function showTrendData(list_orders) {
  const containerId = "#chart_container";

  if (list_orders.length == 0) {
    return $(containerId).html(`
    <div data-v-a9660e98="" class="van-empty">
      <div class="van-empty__image">
        <img src="/images/empty-image-default.png" />
      </div>
      <p class="van-empty__description">No data</p>
    </div>`);
  }

  const html = list_orders
    .map((order, index) => {
      const isBig = parseInt(order.amount) >= 5;
      const NumberList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      const isLastOrder = index === list_orders.length - 1;

      return `
            <div data-v-54016b1c="" issuenumber="${order.period}" number="${order.amount}" colour="${isBig ? "red" : "green"}" rowid="${index}">
               <div data-v-54016b1c="" class="van-row">
                  <div data-v-54016b1c="" class="van-col van-col--8">
                     <div data-v-54016b1c="" class="Trend__C-body2-IssueNumber">${order.period}</div>
                  </div>
                  <div data-v-54016b1c="" class="van-col van-col--16">
                     <div data-v-54016b1c="" class="Trend__C-body2-Num">
                        <canvas data-v-54016b1c="" canvas="" id="myCanvas${index}" class="line-canvas"></canvas>
                        ${NumberList.map((number) => {
        return `<div data-v-54016b1c="" class="Trend__C-body2-Num-item ${order.amount == number ? `action${number}` : ""}">${number}</div>`;
      }).join(" ")}
                        <div data-v-54016b1c="" class="Trend__C-body2-Num-BS ${isBig ? "isB" : ""}">${isBig ? "B" : "S"}</div>
                     </div>
                  </div>
                ${isLastOrder
          ? ""
          : `
                  <script>
                     drawChartLineInCanvas(${order.amount},${list_orders[index + 1].amount}, "myCanvas${index}")
                  </script>`
        }
               </div>
            </div>`;
    })
    .join(" ");

  $(containerId).empty();
  $(containerId).html(html);
}

let currentDisplay = "";
function openGameBetDetails(index) {
  $(`.MyGameRecordList__C-detail`).css("display", "none");

  if (currentDisplay === `details_box_${index}`) {
    $(`.details_box_${index}`).css("display", "none");
    currentDisplay = ``;
  } else {
    $(`.details_box_${index}`).css("display", "block");
    currentDisplay = `details_box_${index}`;
  }
}
