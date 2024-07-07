var hash = "";
var listId = null;
let menuInterval = "";
let blurTimeout = "";
let updates = 0;

window.addEventListener(
  "hashchange",
  () => {
    UpdateScreen();
  },
  false
);

function UpdateScreen() {
  clearInterval(menuInterval);
  updates = 0;
  let loadedhash = window.location.hash;
  if (loadedhash == "" || loadedhash == "#") {
    listId = null;
    EnableMenu();
    return;
  }

  hash = loadedhash.replace("#", "");
  try {
    hash = decodeURI(hash);
  } catch (e) {
    ListNotFoundError();
    return;
  }

  let found = false;

  for (let i = 0; i < lists.length; i++) {
    const currentList = lists[i];

    if (hash == currentList.name) {
      found = true;
      break;
    }
  }

  if (!found) {
    // [ Challenge ] some type of algorithm to see if there is any words closer to that you want to look for
    ListNotFoundError();
    return;
  }

  // console.log(`List found: '${hash}'`); // [tag:route]
  Disable(menu);
  Enable(list);

  list__name.innerText = hash;

  ShowList();
}

function EnableMenu() {
  document.title = "To Do List";
  if (!lockedsidebar) {
    Disable(lists__sidebar);
  }
  Disable(lists__sidebar__dark);

  EnableMenuInterval();
  Enable(menu);
  Disable(list);
  Disable(progressbar);
}

function EnableMenuInterval() {
  menuInterval = setInterval(() => {
    UpdateMenuCards();
    updates++;
    CustomLog(`UpdateMenuCards(${updates})`);

    /*
      1000 * 30 = 30,000ms
      30,000ms -> 30s
      / Each 30 seconds equals to 2 times per half minute
      60 / 30 = 2
      / We want 2 minutes, so multiply by 2
      2 * 2 = 4

      // 4 cycles of 30 seconds is equal to 2 cycles of 1 minute
      / 4 cycles / 2 = 2 cycles of 1 minute
      4 / 2 = 2 minutes
    */

    if (updates >= 2 * 2) {
      clearInterval(menuInterval);
      CustomLog("TIMEOUT Of 2 MINUTES");
    }
  }, 1000 * 30);
}

function ListNotFoundError() {
  EnableMenu();

  let message = `[ERROR] Couldn't find a list with the name "${hash}", redirecting to homescreen`;
  console.warn(message);
  window.location.hash = "";
  alert(message);
}

// Windon Manager
window.addEventListener("blur", () => {
  clearTimeout(blurTimeout);
  blurTimeout = setTimeout(() => {
    clearInterval(menuInterval);
    updates = 0;
  }, 3000);
});

window.addEventListener("focus", () => {
  clearInterval(menuInterval);
  updates = 0;

  EnableMenuInterval();
  UpdateMenuCards();
});

// < start >
LoadData();

if (window.location.hash != "") {
  hash = window.location.hash.replace("#", "");
}

UpdateMenuCards();
UpdateScreen();
// </ start >
