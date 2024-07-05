const list = document.querySelector("#list");

// Basic
const list__items = document.querySelector("#list__items");
const itemTemplate = document.querySelector("#itemTemplate");
const cards = document.querySelector("#cards");
const cardTemplate = document.querySelector("#cardTemplate");
const loadingSpinner = document.querySelector("#loadingSpinner");

let progressDone = "";
let currentPercentage = 0;
let progressbar__number__counter = "";
let currentPreviewItem = null;
let bound = { x: 0, y: 0 };
let diff = { x: 0, y: 0 };
let updatingMenuTimeout = "";

var lists = [
  {
    name: "Daily List",
    description: "Things to be done in a daily basis",
    lastedit: NewDateAndTime(),
    items: [
      ["item 1", true],
      ["item 2", false],
      ["item 3", false],
    ],
  },
];

// List name
const list__name = document.querySelector("#list__name");

// Add item
const addNewItem__input = document.querySelector("#addNewItem__input");
const addNewItem__button = document.querySelector("#addNewItem__button");

addNewItem__button.addEventListener("click", () => {
  TryCreateNewItem();
});

addNewItem__input.addEventListener("keydown", (e) => {
  if (e.key != "Enter") return;
  TryCreateNewItem();
});

function TryCreateNewItem() {
  if (TestIsEmpty(addNewItem__input.value)) return;

  lists[listId].items.push([addNewItem__input.value, false]);
  SaveData();
  CreateNewItem(addNewItem__input.value, false, lists[listId].items.length - 1);

  addNewItem__input.value = "";
  addNewItem__input.focus();
}

const gotomenubutton = document.querySelector("#gotomenubutton");

gotomenubutton.addEventListener("click", () => {
  let editingACard = false;
  let childs = [...list__items.children];

  for (let i = 0; i < childs.length - 1; i++) {
    const child = childs[i];

    if (child.dataset.editing != "") continue;
    SaveItem(childs[i]);
    editingACard = true;
  }

  if (editingACard) {
    clearTimeout(timeouttosave);
  }

  window.location.hash = "#";
  UpdateMenuCards();
});

// Progressbar
const progressbar = document.querySelector("#progressbar");
const progressbar__fill = document.querySelector("#progressbar__fill");
const progressbar__number = document.querySelector("#progressbar__number");

// Side Bar
const openSideBar = document.querySelector("#openSideBar");
const closeSideBar = document.querySelector("#closeSideBar");
const lists__sidebar = document.querySelector("#lists__sidebar");
const lists__sidebar__dark = document.querySelector("#lists__sidebar__dark");
let startSideBarPosX = 0;
let sideBarPosX = 0;
let sideBarIsOpen = false;
let timeouttosave = "";

if (isMobile) {
  window.addEventListener("touchstart", (e) => {
    StartTouching(e.touches[0].clientX, e.touches[0].target, e);
  });

  window.addEventListener("touchend", (e) => {
    if (document.querySelector(".item.dragging") != null) {
      // we were just dragging an item just now
      BodyTouchend(e);
      return;
    }

    EndTouching(e.changedTouches[0].clientX, e.changedTouches[0].target.id);
  });
} else {
  window.addEventListener("mousedown", (e) => {
    StartTouching(e.clientX, e.target);
  });

  window.addEventListener("mouseup", (e) => {
    EndTouching(e.clientX, e.target.id);
  });
}

function StartTouching(x, target, e = null) {
  if (listId == null) return;

  if (target != null) {
    if (target.classList[0] == "item__dragabblebutton") {
      // console.log("Drag Button"); // [tag:itemdrag]
      // console.log(" - target.classList[0] == 'item__dragabblebutton' | ENTER"); // [tag:itemdrag]
      if (isMobile) {
        // console.log(" - - isMobile' | ENTER"); // [tag:itemdrag]
        // console.warn("STARTTOUCHING"); // [tag:itemdrag]
        const item = target.parentElement;
        const pos = Number(item.dataset.id);
        StartDragging(item, e, e.touches[0].clientX, e.touches[0].clientY);
        document.body.style.overflow = "hidden";

        window.addEventListener("touchmove", BodyTouchmove);
      }
      return;
    }
  }

  startSideBarPosX = x;
  sideBarPosX = x;

  if (!isMobile && x > 32 && !sideBarIsOpen) {
    startSideBarPosX = 0;
    sideBarPosX = 0;
    return;
  }

  document.body.setAttribute("data-user-dont-select", "");

  if (isMobile) {
    window.removeEventListener("touchmove", TouchMoved);
    window.addEventListener("touchmove", TouchMoved);
  } else {
    window.removeEventListener("mousemove", MouseMoved);
    window.addEventListener("mousemove", MouseMoved);
  }
}

function EndTouching(x, target) {
  if (listId == null) return;

  if (document.querySelector(".item.dragging") != null) return;

  if (isMobile) {
    window.removeEventListener("touchmove", TouchMoved);
  } else {
    window.removeEventListener("mousemove", MouseMoved);
  }

  if (startSideBarPosX != 0) {
    sideBarPosX = x;
  }

  let difference = sideBarPosX - startSideBarPosX;
  let calc = -100;
  sideBarIsOpen = false;
  let disable = false;

  if (target == "lists__sidebar" && Math.abs(difference) < 4) return;

  document.body.removeAttribute("data-user-dont-select");
  lists__sidebar.classList.add("animate");
  lists__sidebar__dark.classList.add("animate");

  if (difference > 40) {
    calc = 0;
  } else {
    disable = true;
  }

  if (target == "openSideBar") {
    calc = -100;
  } else if (target == "closeSideBar") {
    calc = 0;
  }

  lists__sidebar.style.transform = `TranslateX(${calc}%)`;
  lists__sidebar__dark.style.opacity = calc / 100 + 1;

  if (target == "openSideBar") {
    calc = 0;
    sideBarIsOpen = true;
    disable = false;
  } else if (target == "closeSideBar") {
    calc = -100;
    sideBarIsOpen = false;
    disable = true;
  }

  setTimeout(() => {
    lists__sidebar.style.transform = `TranslateX(${calc}%)`;
    lists__sidebar__dark.style.opacity = calc / 100 + 1;
  }, 10);

  setTimeout(() => {
    lists__sidebar.classList.remove("animate");
    lists__sidebar__dark.classList.remove("animate");

    if (disable) {
      Disable(lists__sidebar);
      Disable(lists__sidebar__dark);
      sideBarIsOpen = false;
    } else {
      sideBarIsOpen = true;
    }

    sideBarPosX = 0;
    startSideBarPosX = 0;
  }, 200);
}

function MouseMoved(e) {
  sideBarPosX = e.clientX;

  // let difference = sideBarPosX - startSideBarPosX;
  // if (Math.abs(difference) > 10)

  Enable(lists__sidebar);
  Enable(lists__sidebar__dark);

  UpdateSideBar();
}

function TouchMoved(e) {
  sideBarPosX = e.changedTouches[0].clientX;

  let difference = sideBarPosX - startSideBarPosX;

  if (Math.abs(difference) > 20) {
    Enable(lists__sidebar);
    Enable(lists__sidebar__dark);
  }

  UpdateSideBar();
}

function UpdateSideBar() {
  let difference = sideBarPosX - 20 - startSideBarPosX;
  let calc = 0;
  if (sideBarIsOpen) {
    calc = Clamp(difference, -100, 0);
  } else {
    calc = Clamp(difference - 100, -100, 0);
  }
  lists__sidebar.style.transform = `TranslateX(${calc}%)`;
  lists__sidebar__dark.style.opacity = calc / 100 + 1;
}

openSideBar.addEventListener("click", () => {
  Enable(lists__sidebar);
  Enable(lists__sidebar__dark);
  EndTouching(0, "openSideBar");

  closeSideBar.focus();
});

closeSideBar.addEventListener("click", () => {
  EndTouching(0, "closeSideBar");

  openSideBar.focus();
});

// Show Items from current List
function ShowList() {
  // console.log(`ShowList(${hash})`); // [tag:route]
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

  let totalItems = lists[listId].items.length;
  let checked = 0;

  for (let i = 0; i < totalItems; i++) {
    const currentItem = lists[listId].items[i];
    if (currentItem[1] == true) {
      checked++;
    }
    CreateNewItem(currentItem[0], currentItem[1], i);
  }

  currentPercentage = Math.round((checked / totalItems) * 100);
  UpdateProgressBar();
}

function CreateNewItem(content, checked, pos) {
  let templateContent = itemTemplate.content;
  // let item = templateContent.querySelector(".itemDiv").cloneNode(true);
  const item = templateContent.querySelector(".item").cloneNode(true);

  // item.querySelector(".item").setAttribute("data-id", pos);
  item.setAttribute("data-id", pos);

  let identifier = `item${pos}`;

  const item__dragabblebutton = item.querySelector(".item__dragabblebutton");
  const item__checkbox = item.querySelector(".item__checkbox");
  // const item__label = item.querySelector(".item__label");
  const item__input = item.querySelector(".item__input");
  // Actions
  // const item__edit = item.querySelector(".item__edit");
  const item__delete = item.querySelector(".item__delete");
  const item__moveup = item.querySelector(".item__moveup");
  const item__movedown = item.querySelector(".item__movedown");

  item__checkbox.setAttribute("name", identifier);
  item__checkbox.setAttribute("id", identifier);
  if (checked) {
    item__checkbox.setAttribute("checked", "");
  }

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

  item__input.addEventListener("keyup", (e) => {
    if (e.key == "Tab") return;

    clearTimeout(timeouttosave);

    if (!item.hasAttribute("data-editing")) {
      Disable(item__dragabblebutton, false);
      Disable(item__delete, false);
      Disable(item__moveup, false);
      Disable(item__movedown, false);

      item.setAttribute("data-editing", "");
    }

    timeouttosave = setTimeout(() => {
      SaveItem(item);
    }, 1000);

    if (e.key == "Enter") {
      SaveItem(item);
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

function SaveItem(item) {
  console.log("save");

  const item__dragabblebutton = item.querySelector(".item__dragabblebutton");
  const item__input = item.querySelector(".item__input");
  const item__delete = item.querySelector(".item__delete");
  const item__moveup = item.querySelector(".item__moveup");
  const item__movedown = item.querySelector(".item__movedown");

  if (item.hasAttribute("data-editing")) {
    Enable(item__dragabblebutton);
    Enable(item__delete);
    Enable(item__moveup);
    Enable(item__movedown);

    item.removeAttribute("data-editing");

    lists[listId].items[item.dataset.id][0] = item__input.value;
    SaveData();
  }
}

// Progress Bar
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

  let current = currentPercentage;
  let type = 1;
  if (current > percentage) {
    type = -1;
  }

  let difference = (percentage - current) / 10;
  let add = difference;

  clearInterval(progressbar__number__counter);

  progressbar__number__counter = setInterval(() => {
    current += add;
    // current += (difference * 4) / (current + add);
    progressbar__number.textContent = Math.round(current) + "%";

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
  }, 50);

  clearTimeout(progressDone);
  progressbar.removeAttribute("data-progress-done");

  if (fraction > 0.95) {
    setTimeout(() => {
      progressbar.setAttribute("data-progress-done", "");
      progressDone = setTimeout(() => {
        progressbar.removeAttribute("data-progress-done");
      }, 8000);
    }, 1);
  }

  currentPercentage = percentage;
}

/* Dragging item Mobile & PC*/
function StartDragging(item, e, clientX, clientY) {
  // console.log("StartDragging"); // [tag:itemdrag]
  let x = clientX;
  let y = clientY;
  const frompoint = document.elementFromPoint(x, clientY);

  if (frompoint.classList[0] != "item__dragabblebutton") {
    e.preventDefault();
    return;
  }

  if (currentPreviewItem == null) {
    currentPreviewItem = item.cloneNode(true);
  }

  let itemBounds = item.getBoundingClientRect();
  bound.x = itemBounds.x;
  bound.y = itemBounds.y;
  diff.x = x - bound.x;
  diff.y = y - bound.y;

  currentPreviewItem.classList.add("preview");
  currentPreviewItem.style.left = `${bound.x}px`;
  currentPreviewItem.style.top = `${bound.y + window.scrollY}px`;

  document.body.appendChild(currentPreviewItem);

  item.classList.add("dragging");
}

function Dragging(item, clientY, pos) {
  // console.log(`Dragging(item, ${clientY}, ${pos})`);
  let x = bound.x;
  let y = clientY + window.scrollY - diff.y;

  if (clientY == 0) {
    y = -128;
  }

  currentPreviewItem.style.left = `${x}px`;
  currentPreviewItem.style.top = `${y}px`;

  const frompoint = document.elementFromPoint(x, clientY - diff.y);

  if (frompoint == null || frompoint.classList[0] != "item") {
    console.log("%cNONE FOUND", "padding: 0.5em; background: hsla(0, 100%, 50%, 0.2)");
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
  console.log("EndDragging"); // [tag:itemdrag]
  let save = true;
  item.classList.remove("dragging");

  let x = bound.x;
  let y = clientY + window.scrollY - diff.y;

  const frompoint = document.elementFromPoint(x, clientY);

  if (frompoint == null || frompoint.classList[0] != "item") {
    save = false;
    console.log("%cNONE FOUND", "padding: 0.5em; background: hsla(0, 100%, 50%, 0.2)");
  }

  let wantedpos = null;

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
  let wantedY = changed.getBoundingClientRect().y + window.scrollY;

  changed.classList.add("animatedrop");

  currentPreviewItem.style.transition = "top 0.5s ease-out, opacity 0.5s ease-out 0.5s";

  let dragabblebuttons = [...list__items.querySelectorAll(".item__dragabblebutton")];
  dragabblebuttons.forEach((drag) => {
    Disable(drag, false);
  });

  setTimeout(() => {
    currentPreviewItem.style.top = `${wantedY}px`;
    currentPreviewItem.style.opacity = "0";
  }, 10);

  setTimeout(() => {
    changed.classList.remove("animatedrop");

    currentPreviewItem.remove();
    currentPreviewItem = null;

    dragabblebuttons.forEach((drag) => {
      Enable(drag, false);
    });
  }, 500);
}

/* Dragging item Mobile */
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

// OpenConfigCurrentList menu
const configureListMenu = document.querySelector("#configureListMenu");
const openConfigCurrentList = document.querySelector("#openConfigCurrentList");
const configCurrentListMenu = document.querySelector("#configCurrentListMenu");
const configureListMenuDiv__name = document.querySelector("#configureListMenuDiv__name");
const configureListMenuDiv__description = document.querySelector(
  "#configureListMenuDiv__description"
);
const configureListMenuDiv__SaveButton = document.querySelector(
  "#configureListMenuDiv__SaveButton"
);

openConfigCurrentList.addEventListener("click", () => {
  currentList = lists[listId];
  configureListMenuDiv__name.value = currentList.name;
  configureListMenuDiv__description.value = currentList.description;
  Enable(configCurrentListMenu);
  configureListMenuDiv__name.focus();
});

// Screen Buttons
// Export
const exportListMenu = document.querySelector("#exportListMenu");
const configureListMenuDiv__ExportButton = document.querySelector(
  "#configureListMenuDiv__ExportButton"
);
configureListMenuDiv__ExportButton.addEventListener("click", () => {
  ExportData();
});

const exportListMenu__GoBackButton = document.querySelector("#exportListMenu__GoBackButton");
// exportListMenuDiv
// screen__div__cards
const exportListMenu__Output = document.querySelector("#exportListMenu__Output");
const exportListMenu__Textarea = document.querySelector("#exportListMenu__Textarea");
const exportListMenu__ClipboardButtton = document.querySelector(
  "#exportListMenu__ClipboardButtton"
);
const exportListMenu__DownloadButton = document.querySelector("#exportListMenu__DownloadButton");
let clipboardTimeout = "";

exportListMenu__GoBackButton.addEventListener("click", () => {
  openConfigCurrentList.click();
});

function ExportData() {
  Enable(exportListMenu);

  exportListMenu__Textarea.value = JSON.stringify(lists[listId]);
  exportListMenu__Textarea.focus();
}

exportListMenu__ClipboardButtton.addEventListener("click", () => {
  exportListMenu__Textarea.select();
  document.execCommand("copy");

  clearTimeout(clipboardTimeout);
  exportListMenu__ClipboardButtton.classList.add("clipboardCheck");

  clipboardTimeout = setTimeout(() => {
    exportListMenu__ClipboardButtton.classList.remove("clipboardCheck");
  }, 1000);
});

exportListMenu__DownloadButton.addEventListener("click", () => {
  // Daily List-19_05_2024 _ 20_07_01

  let lastEdit = lists[listId].lastedit.replaceAll(" _ ", "-");

  var filename = `${lists[listId].name}-${lastEdit}`;
  let text = JSON.stringify(lists[listId], null, 1);

  var element = document.createElement("a");
  element.setAttribute("target", "_blank");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
});

/* import */
const importListMenu = document.querySelector("#importListMenu");
const configureListMenuDiv__ImportButton = document.querySelector(
  "#configureListMenuDiv__ImportButton"
);
const importListMenu__GoBackButton = document.querySelector("#importListMenu__GoBackButton");

const importListMenu__Textarea = document.querySelector("#importListMenu__Textarea");
const importListMenu__ImportButton = document.querySelector("#importListMenu__ImportButton");
const importListMenu__ImportFileButton = document.querySelector(
  "#importListMenu__ImportFileButton"
);
const importListMenu__ImportFileName = document.querySelector("#importListMenu__ImportFileName");
let animatingfilename = "";

importListMenu__GoBackButton.addEventListener("click", () => {
  openConfigCurrentList.click();
});

configureListMenuDiv__ImportButton.addEventListener("click", () => {
  Enable(importListMenu);
});

importListMenu__ImportButton.addEventListener("click", () => {
  let imported = importListMenu__Textarea.value;
  let parsed = null;
  let hasimportedfile = importListMenu__ImportFileButton.files[0] != null;

  try {
    parsed = JSON.parse(imported);
  } catch (e) {
    if (!hasimportedfile) {
      console.error(e);
      return;
    }
  }

  if (parsed == null && !hasimportedfile) {
    return;
  }
  if (hasimportedfile) {
    HandleFiles();
  } else {
    lists[listId] = parsed;
    ShowList();
  }
});

function ImportData(Text, FileName) {
  console.log("Importing Data...");
  console.log(Text, FileName);

  let Result = "";
  let parsed = null;

  try {
    parsed = JSON.parse(Text);
    console.log("parsed", parsed);

    if (parsed == null) {
      console.log("Empty File");
    }
    Result = `Imported ${FileName}`;

    for (let i = 0; i < lists.length; i++) {
      const test = lists[i];
      if (i == listId) continue;

      if (test.name == parsed.name) {
        console.log("test.name == parsed.name");
        parsed.name += "-" + Math.round(Math.random() * 1000000000);
        let tests = 0;

        while (test.name == parsed.name || tests > 100) {
          for (let i = 0; i < lists.length; i++) {
            const test = lists[i];
            if (i == listId) continue;
            if (test.name == parsed.name) {
              parsed.name += "-" + Math.round(Math.random() * 1000000000);
            }
          }
        }

        if (tests > 100) {
          parsed.name += "-" + Math.round(Math.random() * 1000000000000000000);
        }

        console.log(test.name, parsed.name);
      }
    }

    lists[listId] = parsed;
    SaveData();

    window.location.hash = `#${parsed.name}`;
  } catch (e) {
    Result = `<strong>Error file not valid</strong>`;

    // OutputGroup.classList.add("Error");
    // setTimeout(() => {
    //   OutputGroup.classList.remove("Error");
    // }, 1500);

    console.error(e);

    console.warn("Error file not valid"); // error in the above string (in this case, yes)!
    return;
  }

  console.log("Result", Result);
}

importListMenu__ImportFileButton.addEventListener("change", () => {
  HandleFiles(true);
});

async function HandleFiles(viewname = false) {
  console.log("handleFiles");

  const currentFile = importListMenu__ImportFileButton.files[0];
  const FileName = currentFile.name;

  if (viewname) {
    // Run this in when uploading a file to see the name
    importListMenu__ImportFileName.textContent = "";
    clearInterval(animatingfilename);
    let pos = 0;
    let max = FileName.length - 1;
    let lerptime = 1000 / FileName.length;
    animatingfilename = setInterval(() => {
      importListMenu__ImportFileName.textContent += FileName[pos];
      pos++;
      if (pos > max) {
        clearInterval(animatingfilename);
      }
    }, lerptime);
    return;
  } else {
    importListMenu__ImportFileName.textContent = "";
  }

  // importListMenu__ImportFileButton.files[0].text().then((result) => {});

  try {
    const content = await currentFile.text();
    ImportData(content, FileName);
  } catch (error) {
    console.error("Error fetching file:", error);
  }
}

// fileSelector.addEventListener("change", function () {
//   var fr = new FileReader();
//   fr.onload = function () {
//     result = fr.result;
//     ImportData(result, FileName);
//   };
//   fr.readAsText(this.files[0]);
//   let FileName = this.files[0].name;
// });

// const currentFile = this.files[0]; /* now you can work with the file list */

// let FileName = currentFile.name;

// // var fr = new FileReader();
// // let result = fr.readAsText(currentFile);
// // let result = "";
// // let test = await importListMenu__ImportFileButton.files[0].text();
// importListMenu__ImportFileButton.files[0].text().then((result) => {
//   console.log("result", result);
//   console.log("FileName", FileName);
//   console.log("this.files[0]", currentFile);

//   ImportData(result, FileName);
// });
