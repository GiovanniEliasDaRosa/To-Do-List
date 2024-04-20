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

  // alert(`List found: '${hash}'`);
  console.log(`List found: '${hash}'`);
  Disable(menu);
  Enable(list);

  list__name.innerText = hash;

  ShowList();
}

function EnableMenu() {
  document.title = "To Do List";
  Disable(lists__sidebar);
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
    console.log(
      `%cUpdateMenuCards(${updates})`,
      "padding: 1em; border: solid 0.1em hsla(0, 0%, 100%, 0.5); border-radius: 0.5em"
    );

    // 30 * 2 * (minutes I want)
    // 2 * 30 for minutes and multiply for how many minutes
    // (60 / 30) = 2
    if (updates >= 2 * 2) {
      clearInterval(menuInterval);
      console.log(
        "%cTIMEOUT Of 2 MINUTES",
        "padding: 1em; border: solid 0.1em hsla(0, 0%, 100%, 0.5); border-radius: 0.5em; background: hsla(0, 50%, 50%, 0.5)"
      );
    }
    // }, 1000 * 30);
  }, 1000 * 30);
}

// 1000 * 30 = 30000 = 30s
// 30 * 30 = 900s = 15m
// 900 = 15
// 30x = 5
/*
  45000 = 450x
  x = 45000/450
  x = 4500/45
  x = 100
*/

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

function ListNotFoundError() {
  EnableMenu();

  let message = `[ERROR] Couldn't find a list with the name "${hash}", redirecting to homescreen`;
  console.warn(message);
  window.location.hash = "";
  alert(message);
}
