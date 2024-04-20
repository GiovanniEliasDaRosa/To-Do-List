const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  // console.log(isMobile);
  document.body.setAttribute("data-mobile", "");
}

// Menus
const menu = document.querySelector("#menu");
const list = document.querySelector("#list");

// OpenConfigLists menu
const openConfigLists = document.querySelector("#openConfigLists");
const configListsMenu = document.querySelector("#configListsMenu");
openConfigLists.addEventListener("click", () => {
  if (listId == null) {
    Enable(configListsMenu);
  } else {
    currentList = lists[listId];
    configureListMenuDiv__name.value = currentList.name;
    configureListMenuDiv__description.value = currentList.description;
    Enable(configureListMenu);
    configureListMenuDiv__name.focus();
  }
});

// OpenConfigCurrentList menu

const openConfigCurrentList = document.querySelector("#openConfigCurrentList");
const configCurrentListMenu = document.querySelector("#configCurrentListMenu");
openConfigCurrentList.addEventListener("click", () => {
  currentList = lists[listId];
  configureListMenuDiv__name.value = currentList.name;
  configureListMenuDiv__description.value = currentList.description;
  Enable(configCurrentListMenu);
  configureListMenuDiv__name.focus();
});

const screen__div__actions__close = [...document.querySelectorAll(".screen__div__actions__close")];

screen__div__actions__close.forEach((closeButton) => {
  closeButton.addEventListener("click", () => {
    Disable(closeButton.parentElement.parentElement.parentElement.parentElement);
  });
});

// LIST
// list - list name
const list__name = document.querySelector("#list__name");

// list - add item
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

// MENU
// menu - add card
const addNewListButton = document.querySelector("#addNewListButton");

const addNewListMenu = document.querySelector("#addNewListMenu");
const addNewListMenu__name = document.querySelector("#addNewListMenu__name");
const addNewListMenu__description = document.querySelector("#addNewListMenu__description");
const configMenu__CreateButton = document.querySelector("#configMenu__CreateButton");

const configureListMenu = document.querySelector("#configureListMenu");
const configureListMenuDiv__name = document.querySelector("#configureListMenuDiv__name");
const configureListMenuDiv__description = document.querySelector(
  "#configureListMenuDiv__description"
);
const configureListMenuDiv__SaveButton = document.querySelector(
  "#configureListMenuDiv__SaveButton"
);

configMenu__CreateButton.addEventListener("click", () => {
  if (TestIsEmpty(addNewListMenu__name.value)) return;
  if (TestIsEmpty(addNewListMenu__description.value)) return;
  let newlist = {
    name: addNewListMenu__name.value,
    description: addNewListMenu__description.value,
    lastedit: NewDateAndTime(),
    items: [["First item", false]],
  };

  lists.push(newlist);

  SaveData();
  UpdateMenuCards();
  Disable(addNewListMenu);

  // CreateNewCard();
});

addNewListButton.addEventListener("click", () => {
  Enable(addNewListMenu);
  addNewListMenu__name.focus();
});

// menu - save the editing list
configureListMenuDiv__SaveButton.addEventListener("click", () => {
  if (TestIsEmpty(configureListMenuDiv__name.value)) return;
  if (TestIsEmpty(configureListMenuDiv__description.value)) return;

  lists[listId].name = configureListMenuDiv__name.value;
  lists[listId].description = configureListMenuDiv__description.value;
  // lists[listId].lastedit = NewDateAndTime();

  Disable(configCurrentListMenu);

  window.location.hash = `#${configureListMenuDiv__name.value}`;

  SaveData();

  UpdateMenuCards();
  UpdateScreen();
});

// screen div cards
const configMenuLists__itemTemplate = document.querySelector("#configMenuLists__itemTemplate");
const configMenuLists__item = document.querySelector("#configMenuLists__item");

// Progressbar
const progressbar = document.querySelector("#progressbar");
const progressbar__fill = document.querySelector("#progressbar__fill");
const progressbar__number = document.querySelector("#progressbar__number");

// openSideBar
const openSideBar = document.querySelector("#openSideBar");
const closeSideBar = document.querySelector("#closeSideBar");
const lists__sidebar = document.querySelector("#lists__sidebar");
const lists__sidebar__dark = document.querySelector("#lists__sidebar__dark");
let startSideBarPosX = 0;
let sideBarPosX = 0;
let sideBarIsOpen = false;

if (isMobile) {
  window.addEventListener("touchstart", (e) => {
    StartTouching(e.touches[0].clientX, e.touches[0].target, e);
  });

  window.addEventListener("touchend", (e) => {
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

function StartTouching(x, target, e) {
  if (listId == null) return;

  if (target != null) {
    if (target.classList[0] == "item__dragabblebutton") {
      return;
    }
  }

  document.body.setAttribute("data-user-dont-select", "");

  startSideBarPosX = x;
  sideBarPosX = x;

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

  sideBarPosX = x;

  let difference = sideBarPosX - startSideBarPosX;
  let calc = -100;
  sideBarIsOpen = false;
  let disable = false;

  document.body.removeAttribute("data-user-dont-select");
  lists__sidebar.classList.add("animate");
  lists__sidebar__dark.classList.add("animate");

  if (difference > 40) {
    calc = 0;
    sideBarIsOpen = true;
  } else {
    disable = true;
  }

  if (target == "openSideBar") {
    calc = -100;
  } else if (target == "openSideBar") {
    calc = 0;
  }

  lists__sidebar.style.transform = `TranslateX(${calc}%)`;
  lists__sidebar__dark.style.opacity = calc / 100 + 1;

  if (target == "openSideBar") {
    Enable(lists__sidebar);
    Enable(lists__sidebar__dark);
    calc = 0;
    sideBarIsOpen = true;
    disable = false;
  } else if (target == "openSideBar") {
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

    if (disable == true) {
      Disable(lists__sidebar);
      Disable(lists__sidebar__dark);
    }

    sideBarPosX = 0;
    startSideBarPosX = 0;
  }, 200);

  // last update

  // if cancel
  // Disable(lists__sidebar);
  // Disable(lists__sidebar__dark);
  if (isMobile) {
    window.removeEventListener("touchmove", TouchMoved);
  } else {
    window.removeEventListener("mousemove", MouseMoved);
  }
}

function MouseMoved(e) {
  sideBarPosX = e.clientX;

  let difference = sideBarPosX - startSideBarPosX;

  if (Math.abs(difference) > 10) {
    Enable(lists__sidebar);
    Enable(lists__sidebar__dark);
  }

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
  // lists__sidebar__dark
  let difference = sideBarPosX - 20 - startSideBarPosX;
  let calc = 0;
  if (sideBarIsOpen) {
    calc = Clamp(difference, -100, 0);
  } else {
    calc = Clamp(difference - 100, -100, 0);
  }
  // console.log("difference: ", difference);
  // console.log("calc", calc);
  lists__sidebar.style.transform = `TranslateX(${calc}%)`;
  lists__sidebar__dark.style.opacity = calc / 100 + 1;
}

// Configure the menus
Enable(menu);
Disable(list);
Disable(addNewListMenu);
Disable(configListsMenu);
Disable(configCurrentListMenu);
Disable(lists__sidebar);
Disable(lists__sidebar__dark);
