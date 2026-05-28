//------------------my bets display-------------------
function showMyBetsData(list_orders) {
  let containerId = `#my_bets_data_container`;

  if (list_orders.length == 0) {
    return $(containerId).html(`
   <div data-v-a9660e98="" class="van-empty">
       <div class="van-empty__image">
           <img src="/images/empty-image-default.png" />
       </div>
       <p class="van-empty__description">No Data</p>
   </div>
   `);
  }

  let html = list_orders
    .map((list_order, index) => {
      let join = list_order.bet;
      let selected = "";
      let color = "";
      if (join == "l") { color = "l-big"; selected = "Big"; }
      else if (join == "n") { color = "l-small"; selected = "Small"; }
      else if (join == "t") { color = "l-violet"; selected = "Violet"; }
      else if (join == "d") { color = "l-red"; selected = "Red"; }
      else if (join == "x") { color = "l-green"; selected = "Green"; }
      else if (join == "0") { color = "l-0"; selected = "0"; }
      else if (join == "5") { color = "l-5"; selected = "5"; }
      else if (Number(join) % 2 == 0) { color = "l-red"; selected = Number(join); }
      else if (Number(join) % 2 != 0) { color = "l-green"; selected = Number(join); }

      if ((!isNumber(join) && join == "l") || join == "n") {
        checkJoin = `${selected}`;
      } else {
        checkJoin = `<span data-v-a9660e98="">${isNumber(join) ? join : ""}</span>`;
      }

      return `
            <div data-v-373b3197="" class="MyGameRecordList__C-item" index="${index}" onclick="openGameBetDetails(${index})">
               <div data-v-373b3197="" class="MyGameRecordList__C-item-l MyGameRecordList__C-item-${color}">${checkJoin}</div>
               <div data-v-373b3197="" class="MyGameRecordList__C-item-m">
                  <div data-v-373b3197="" class="MyGameRecordList__C-item-m-top">${list_order.stage}</div>
                  <div data-v-373b3197="" class="MyGameRecordList__C-item-m-bottom">${timerJoin(list_order.time)}</div>
               </div>

              ${list_order.status === 0
          ? ""
          : `<div data-v-373b3197="" class="MyGameRecordList__C-item-r ${list_order.status == 1 ? "success" : ""}">
                  <div data-v-373b3197="" class="${list_order.status === 1 ? "success" : ""}">${list_order.status == 1 ? "Success" : list_order.status == 2 ? "Failed" : ""}</div>
                  <span data-v-373b3197="">${list_order.status === 1
            ? '<span data-v-a9660e98="" class="success"> + ₹ ' + parseFloat(list_order.get).toFixed(2) + " </span>"
            : '<span data-v-a9660e98="" class="fail"> - ₹ ' + parseFloat(list_order.money).toFixed(2) + "</span>"
          }</span>
                  </div>`
        }
            </div>
            <div data-v-373b3197="" class="MyGameRecordList__C-detail details_box_${index}" style="display: none;">
               <div data-v-373b3197="" class="MyGameRecordList__C-detail-text">Details</div>
               <div data-v-373b3197="" class="MyGameRecordList__C-detail-line">
                  Order number
                  <div data-v-373b3197="">${list_order.id_product} <img data-v-373b3197="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAhFBMVEUAAABRUVFQUFBRUVFRUVFRUVFRUVFRUVFQUFBRUVFQUFBRUVFQUFBQUFBRUVFRUVFSUlJSUlJRUVFQUFBSUlJRUVFRUVFRUVFRUVFRUVFRUVFQUFBRUVFRUVFRUVFRUVFQUFBRUVFRUVFRUVFQUFBQUFBQUFBSUlJYWFhJSUlQUFBRUVGJ3MxyAAAAK3RSTlMAv0B6VerZrqiblYmCaGJIOiQdFg/79vDl39TKxbq0oY9zblxONC4pCQTPqkRvegAAAWZJREFUeNrtz0duw0AQAEGSzjnnnIP+/z8ffJOBgRfgiCts9Qca1UmSNGZDP0FDN37DbIJAQH4DAQGJAwEBiQMBAYlbTsjQLWcgtQVSWyC1BVJbILUFUlsgtdUQZJiyMSGzKRsTclbwBQEpgJwXfEFACiAXBV8QkALIWsEXBKRFyGXBF2QKSD/k1WdCruYhXV4gTUHWQUBAQsg1CEgO5BukMsgNCEgO5BYEJAfSg4CAhJA7EJAcyD0ISA5kAwQEJIRsgoCAhJAHEJAcyBYICEgI2QYBAQkhjyAgOZAdEBCQELILAgISQlZAQEDagDyBgORAnkFAciB7ICAgIWQfBAQkhLyAgORAVkEWC+nnWlbI30Bqh7yCgORADkBAQMIGEBCQNiCHICAgYW8gIDmQdxCQHMgHCEgO5AgEBCTsGKRySGog/+ik4AsC0iLktOALAtIi5LPgCwJS0FfBFwSkpH7COkmSMvoBUQl8xsUGEfcAAAAASUVORK5CYII=" /></div>
               </div>
               <div data-v-373b3197="" class="MyGameRecordList__C-detail-line">
                  Period
                  <div data-v-373b3197="">${list_order.stage}</div>
               </div>
               <div data-v-373b3197="" class="MyGameRecordList__C-detail-line">
                  Purchase amount
                  <div data-v-373b3197="">₹${parseFloat(list_order.fee + list_order.money).toFixed(2)}</div>
               </div>
               <div data-v-373b3197="" class="MyGameRecordList__C-detail-line">
                  Quantity
                  <div data-v-373b3197="">${parseFloat(list_order.amount).toFixed(2)}</div>
               </div>
               <div data-v-373b3197="" class="MyGameRecordList__C-detail-line">
                  Amount after tax
                  <div data-v-373b3197="" class="red">₹${parseFloat(list_order.money).toFixed(2)}</div>
               </div>
               <div data-v-373b3197="" class="MyGameRecordList__C-detail-line">
                  Tax
                  <div data-v-373b3197="">₹${parseFloat(list_order.fee).toFixed(2)}</div>
               </div>
               <div data-v-373b3197="" class="MyGameRecordList__C-detail-line" style="display: ${list_order.status == 0 ? "none" : ""}">
                  Result
                  <div data-v-373b3197="" class="numList">
                     ${list_order.result}
                  </div>
               </div>
               <div data-v-373b3197="" class="MyGameRecordList__C-detail-line">
                  Select
                  <div data-v-373b3197="">
                     ${selected}
                  </div>
               </div>
               <div data-v-373b3197="" class="MyGameRecordList__C-detail-line" style="display:${list_order.status == 0 ? "none" : ""};">
                  Status
                  <div data-v-373b3197="" class="${list_order.status == 1 ? "green" : "red"}">${list_order.status == 1 ? "Success" : "Failed"}</div>
               </div>
               <div data-v-373b3197="" class="MyGameRecordList__C-detail-line" style="display:${list_order.status == 0 ? "none" : ""};">
                  Win/lose
                  <div data-v-373b3197="" class="${list_order.status == 1 ? "green" : "red"}">${list_order.status == 1 ? `₹${list_order.get}` : `- ₹${list_order.fee + list_order.money}`}</div>
               </div>
               <div data-v-373b3197="" class="MyGameRecordList__C-detail-line">
                  Order time
                  <div data-v-373b3197="">${timerJoin(list_order.time)}</div>
               </div>
            </div>
         `;
    })
    .join(" ");

  $(containerId).html(html);
}
