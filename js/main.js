const list__items = document.querySelector("#list__items");
const itemTemplate = document.querySelector("#itemTemplate");
const cards = document.querySelector("#cards");
const cardTemplate = document.querySelector("#cardTemplate");
let progressDone = "";
let currentPercentage = 0;
let progressbar__number__counter = "";
let currentPreviewItem = null;
let bound = { x: 0, y: 0 };
let diff = { x: 0, y: 0 };

var lists = [
  {
    name: "Daily List",
    description: "Things to be done in a daily basis",
    lastedit: "02/12/2023 | 18:32:05",
    items: [
      ["item1", true],
      ["item2", true],
      ["item3", false],
    ],
  },
];

// start >
LoadData();

if (window.location.hash != "") {
  hash = window.location.hash.replace("#", "");
}

UpdateMenuCards();
UpdateScreen();

// < start

function UpdateMenuCards() {
  [...cards.children].forEach((currentCard) => {
    if (currentCard.id == "addNewListButton") return;
    currentCard.remove();
  });

  configMenuLists.innerHTML = "";

  for (let i = 0; i < lists.length; i++) {
    const currentList = lists[i];

    CreateNewList(currentList.name, currentList.description, currentList.lastedit);
    CreateNewConfigMenuItem(currentList.name, i);
  }
}

function CreateNewConfigMenuItem(name, pos) {
  let templateContent = configMenuLists__itemTemplate.content;
  let item = templateContent.querySelector(".cards__config").cloneNode(true);

  item.querySelector(".cards__config__title").textContent = name;
  item.setAttribute("data-id", pos);

  const delete__button = item.querySelector(".cards__config__deleteButton");

  delete__button.addEventListener("click", () => {
    let confirmDelete = confirm(
      `Do you really want to delete the LIST "${name}"? [THERE IS NO GOING BACK]`
    );
    if (!confirmDelete) return;

    let confirmType = prompt(
      `Type [confirm] to delete the LIST "${name}" [THERE IS NO GOING BACK]:`
    );
    if (confirmType.toLowerCase() == "confirm") {
      let position = Number(item.dataset.id);
      lists.splice(position, 1);
      SaveData();
      UpdateMenuCards();
    }
  });

  configMenuLists.appendChild(item);
}

function CreateNewList(name, description, lastedit) {
  let templateContent = cardTemplate.content;
  let card = templateContent.querySelector(".card").cloneNode(true);

  card.querySelector(".card__title").textContent = name;

  card.querySelector(".card__description").textContent = description;
  card.querySelector(".card__editTime").textContent = `Edited in: ${lastedit}`;

  card.href = `#${name}`;

  // Calculate date and time

  [day, month, year, hours, minutes] = SplitDateAndTime(lastedit);

  let datetime = NewDateAndTime();
  [dayCurrent, monthCurrent, yearCurrent, hoursCurrent, minutesCurrent] =
    SplitDateAndTime(datetime);

  // Test
  let edittime = "";
  edittime += Format(yearCurrent, year, "year", 0);
  edittime += Format(monthCurrent, month, "month", 12);
  edittime += Format(dayCurrent, day, "day", 0);
  edittime += Format(hoursCurrent, hours, "hour", 24);
  edittime += Format(minutesCurrent, minutes, "minute", 60);

  if (edittime == "") {
    edittime = "Just now";
  }

  card.querySelector(".card__lastEdit").textContent = `Last Edit: ${edittime}`;
  cards.insertBefore(card, addNewListButton);
}

function ShowList() {
  console.log(`ShowList(${hash})`);
  for (let i = 0; i < lists.length; i++) {
    const currentList = lists[i];
    if (currentList.name == hash) {
      listId = i;
    }
  }

  if (listId == null) {
    list__items.textContent = "Error";
    alert("Error");
    return;
  }

  document.title = `To Do List | ${lists[listId].name}`;

  progressbar__fill.style.width = "0%";
  Enable(progressbar);

  [...list__items.children].forEach((element) => {
    if (element.id != "addNewItem") {
      element.remove();
    }
  });

  for (let i = 0; i < lists[listId].items.length; i++) {
    const currentItem = lists[listId].items[i];
    CreateNewItem(currentItem[0], currentItem[1], i);
  }

  currentPercentage = 0;
  UpdateProgressBar();
}

function CreateNewItem(content, checked, pos) {
  let templateContent = itemTemplate.content;
  // let item = templateContent.querySelector(".itemDiv").cloneNode(true);
  let item = templateContent.querySelector(".item").cloneNode(true);

  // item.querySelector(".item").setAttribute("data-id", pos);
  item.setAttribute("data-id", pos);

  let identifier = `item${pos}`;

  const item__dragabblebutton = item.querySelector(".item__dragabblebutton");
  const item__checkbox = item.querySelector(".item__checkbox");
  const item__label = item.querySelector(".item__label");
  const item__input = item.querySelector(".item__input");
  // Actions
  const item__edit = item.querySelector(".item__edit");
  const item__delete = item.querySelector(".item__delete");
  const item__moveup = item.querySelector(".item__moveup");
  const item__movedown = item.querySelector(".item__movedown");

  item__checkbox.setAttribute("name", identifier);
  item__checkbox.setAttribute("id", identifier);
  if (checked) {
    item__checkbox.setAttribute("checked", "");
  }

  item__label.setAttribute("for", identifier);
  item__label.textContent = content;
  item__input.value = content;

  if (!isMobile) {
    // item__dragabblebutton.addEventListener("touchstart", (e) => {
    //   let touch = e.touches[0];
    //   StartDragging(item, e, touch.clientX, touch.clientY);
    //   document.body.style.overflow = "hidden";
    //   document.body.addEventListener("touchmove", BodyTouchmove(item, e, pos));
    //   document.body.addEventListener("touchend", BodyTouchend(item, e, pos));
    // });
    item.addEventListener("dragstart", (e) => {
      StartDragging(item, e, e.clientX, e.clientY);
    });

    item.addEventListener("drag", (e) => {
      Dragging(item, e.clientY, pos);
    });

    item.addEventListener("dragend", (e) => {
      EndDragging(item, e.clientY, pos);
    });
  }

  item__edit.addEventListener("click", () => {
    EditItem(item);

    item__input.focus();
  });

  item__label.addEventListener("dblclick", (e) => {
    EditItem(item);

    item__input.focus();
  });

  item__input.addEventListener("keydown", (e) => {
    if (e.key != "Enter" && e.key != "Escape") return;

    if (e.key == "Enter") {
      EditItem(item);
    } else {
      item__input.value = item__label.textContent;
      EditItem(item);
    }
  });

  item__delete.addEventListener("click", () => {
    let ConfirmDelete = confirm(`Do really want to delete this card? [${item__label.textContent}]`);
    if (!ConfirmDelete) return;

    lists[listId].items.splice(pos, 1);
    SaveData();

    Disable(item);
    ShowList();
  });

  item__checkbox.addEventListener("click", () => {
    lists[listId].items[pos][1] = item__checkbox.checked;
    SaveData();

    UpdateProgressBar();
  });

  if (pos == 0) {
    Disable(item__moveup, false);
  } else {
    item__moveup.addEventListener("click", () => {
      if (pos == 0) return;

      console.log(pos);
      let temp = lists[listId].items[pos - 1];
      lists[listId].items[pos - 1] = lists[listId].items[pos];
      lists[listId].items[pos] = temp;
      SaveData();
      ShowList();
    });
  }

  if (pos == lists[listId].items.length - 1) {
    Disable(item__movedown, false);
  } else {
    item__movedown.addEventListener("click", () => {
      if (pos >= lists[listId].items.length - 1) return;

      console.log(pos);
      let temp = lists[listId].items[pos + 1];
      lists[listId].items[pos + 1] = lists[listId].items[pos];
      lists[listId].items[pos] = temp;
      SaveData();
      ShowList();
    });
  }

  list__items.insertBefore(item, addNewItem);

  UpdateProgressBar();
}

function EditItem(item) {
  const item__dragabblebutton = item.querySelector(".item__dragabblebutton");
  // const item__checkbox = item.querySelector(".item__checkbox");
  const item__label = item.querySelector(".item__label");
  const item__input = item.querySelector(".item__input");
  // Actions
  const item__edit = item.querySelector(".item__edit");
  const item__delete = item.querySelector(".item__delete");
  const item__moveup = item.querySelector(".item__moveup");
  const item__movedown = item.querySelector(".item__movedown");

  if (item.hasAttribute("data-editing")) {
    Enable(item__label);
    Disable(item__input);

    Enable(item__dragabblebutton);
    Enable(item__delete);
    Enable(item__moveup);
    Enable(item__movedown);

    item.removeAttribute("data-editing");
    item__edit.classList.remove("save");
    // Finished editing save
    item__label.textContent = item__input.value;

    // const posarray = item.querySelector(".item").dataset.id;
    const posarray = item.dataset.id;
    lists[listId].items[posarray][0] = item__input.value;
    SaveData();

    // console.log(item);
    // console.log(posarray);
    // console.log(listId);
  } else {
    Disable(item__label);
    Enable(item__input);

    Disable(item__dragabblebutton, false);
    Disable(item__delete, false);
    Disable(item__moveup, false);
    Disable(item__movedown, false);

    item.setAttribute("data-editing", "");
    item__edit.classList.add("save");
    // Started editing load label value
    item__input.value = item__label.textContent;
    item__input.select();
  }
}

function UpdateProgressBar() {
  const currentListItems = lists[listId].items;
  let totalItems = currentListItems.length;
  let checked = 0;

  for (let i = 0; i < currentListItems.length; i++) {
    if (currentListItems[i][1] == true) {
      checked++;
    }
  }

  let fraction = checked / totalItems;
  let percentage = Math.round(fraction * 100);

  if (fraction < 0.01) {
    // less than 1%
    progressbar__fill.style.border = "0em solid transparent";
  } else {
    progressbar__fill.style.border = "";
  }

  progressbar__fill.style.width = percentage + "%";
  progressbar__fill.style.backgroundColor = `hsla(110, 46%, ${10 + Clamp(32 * fraction)}%)`;
  // progressbar__number.textContent = percentage + "%";

  let current = currentPercentage;
  let type = 1;

  if (current > percentage) {
    type = -1;
  }

  let incrementBy = 20;

  clearInterval(progressbar__number__counter);

  progressbar__number__counter = setInterval(() => {
    current += type;
    progressbar__number.textContent = current + "%";

    if (type == 1) {
      if (current >= percentage) {
        progressbar__number.textContent = Math.round(percentage) + "%";
        clearInterval(progressbar__number__counter);
      }
    } else {
      if (current <= percentage) {
        progressbar__number.textContent = Math.round(percentage) + "%";
        clearInterval(progressbar__number__counter);
      }
    }

    incrementBy = Clamp(incrementBy++, 15, 100);
  }, incrementBy);

  clearTimeout(progressDone);
  progressbar.removeAttribute("data-progress-done");

  if (fraction > 0.9) {
    setTimeout(() => {
      progressbar.setAttribute("data-progress-done", "");
      progressDone = setTimeout(() => {
        progressbar.removeAttribute("data-progress-done");
      }, 8000);
    }, 1);
  }

  currentPercentage = percentage;
}

/* item functions */
function StartDragging(item, e, clientX, clientY) {
  console.log("StartDragging");
  let x = clientX;
  let y = clientY;
  const frompoint = document.elementFromPoint(x, y);

  if (frompoint.classList[0] != "item__dragabblebutton") {
    e.preventDefault();
    return;
  }

  // console.log("currentPreviewItem", currentPreviewItem);
  if (currentPreviewItem == null) {
    // console.log(
    //   "%cCHANGE currentPreviewItem",
    //   "padding: 0.5em; background: hsla(0, 100%, 50%, 0.2)"
    // );
    currentPreviewItem = item.cloneNode(true);
  }

  let itemBounds = item.getBoundingClientRect();
  bound.x = itemBounds.x;
  bound.y = itemBounds.y;
  diff.x = x - bound.x;
  diff.y = y - bound.y;

  currentPreviewItem.classList.add("preview");
  currentPreviewItem.style.left = `${bound.x}px`;
  currentPreviewItem.style.top = `${bound.y}px`;

  document.body.appendChild(currentPreviewItem);

  item.classList.add("dragging");
}

function Dragging(item, clientY, pos) {
  // console.log(`Dragging(item, ${clientY}, ${pos})`);

  let x = bound.x;
  let y = clientY - diff.y;

  if (clientY == 0) {
    y = -128;
  }

  currentPreviewItem.style.left = `${x}px`;
  currentPreviewItem.style.top = `${y}px`;

  const frompoint = document.elementFromPoint(x, clientY);

  if (frompoint == null || frompoint.classList[0] != "item") {
    // console.log("%cNONE FOUND", "padding: 0.5em; background: hsla(0, 100%, 50%, 0.2)");
    return;
  }

  let wantedpos = Number(frompoint.dataset.id);

  if (pos == wantedpos) return;

  let positem = Number(list__items.children[pos].dataset.id);
  let wantedpositem = Number(list__items.children[wantedpos].dataset.id);

  // console.log(pos, wantedpos);
  // console.log(positem, wantedpositem);

  if (positem > wantedpositem) {
    list__items.insertBefore(item, frompoint);
  } else if (positem < wantedpositem) {
    list__items.insertBefore(frompoint, item);
  }
}

function EndDragging(item, clientY, pos) {
  let save = true;
  console.log("EndDragging");
  item.classList.remove("dragging");

  let x = bound.x;
  const frompoint = document.elementFromPoint(x, clientY);
  if (frompoint == null || frompoint.classList[0] != "item") save = false;

  let wantedpos = null;

  let y = clientY - diff.y;
  currentPreviewItem.style.left = `${x}px`;
  currentPreviewItem.style.top = `${y}px`;

  bound.x = 0;
  bound.y = 0;
  diff.x = 0;
  diff.y = 0;

  let test = [...list__items.children];

  for (let i = 0; i < test.length - 1; i++) {
    const child = test[i];

    if (child == item) wantedpos = i;

    child.setAttribute("data-id", i);
    let checkbox = child.querySelector(".item__checkbox").checked;
    let label = child.querySelector(".item__label").textContent;
    lists[listId].items[i] = [label, checkbox];
  }

  if (save) {
    SaveData();
    ShowList();
  }

  let changed = [...list__items.children][wantedpos];
  let wantedY = changed.getBoundingClientRect().y;
  changed.classList.add("animatedrop");

  currentPreviewItem.style.transition = "top 0.5s ease-out, opacity 0.5s ease-out 0.5s";

  let dragabblebuttons = [...list__items.querySelectorAll(".item__dragabblebutton")];
  dragabblebuttons.forEach((drag) => {
    Disable(drag, false);
  });

  setTimeout(() => {
    currentPreviewItem.style.top = `${wantedY}px`;
    currentPreviewItem.style.opacity = "0";
  }, 100);

  setTimeout(() => {
    changed.classList.remove("animatedrop");

    currentPreviewItem.remove();
    currentPreviewItem = null;

    dragabblebuttons.forEach((drag) => {
      Enable(drag, false);
    });
  }, 1100);
}

/* body functions */
function BodyTouchmove(e) {
  // console.log("BodyTouchmove", e);
  const item = e.touches[0].target.parentElement;
  const pos = Number(item.dataset.id);

  Dragging(item, e.touches[0].clientY, pos);
}

function BodyTouchend(e) {
  // console.log("BodyTouchend", e);
  let hangedTouches = e.changedTouches[0];
  const item = hangedTouches.target.parentElement;
  const pos = Number(item.dataset.id);

  EndDragging(item, hangedTouches.clientY, pos);
  document.body.style.overflow = "";

  window.removeEventListener("touchmove", BodyTouchmove);
}
