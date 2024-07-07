const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  document.body.setAttribute("data-mobile", "");
}

/* Enable & Disable elements */
function Enable(element) {
  element.removeAttribute("aria-disabled");
  element.removeAttribute("disabled");
  element.style.display = "";
}

function Disable(element, hide = true) {
  element.setAttribute("aria-disabled", "true");
  element.setAttribute("disabled", "");
  if (hide) {
    element.style.display = "none";
  }
}

/* Save & Load data */
function SaveData() {
  if (listId != null) {
    lists[listId].lastedit = NewDateAndTime();
  }

  let compiled = JSON.stringify(lists);

  localStorage.setItem("lists", compiled);
}

function LoadData() {
  let lockedsidebargot = localStorage.getItem("lockedsidebar");

  if (lockedsidebargot != null) {
    lockedsidebar = lockedsidebargot == "true" ? true : false;
    if (lockedsidebar) {
      lockedsidebar = false;
      Enable(lists__sidebar);
      lockSideBar.click();
    }
  }

  let listgot = localStorage.getItem("lists");

  if (listgot == null) return;

  try {
    lists = JSON.parse(listgot);
  } catch (e) {
    console.log("Erro trying to parse");
    console.error(e);
    return;
  }
}

/* Date and time managers */
Date.prototype.today = function () {
  return (
    (this.getDate() < 10 ? "0" : "") +
    this.getDate() +
    "/" +
    (this.getMonth() + 1 < 10 ? "0" : "") +
    (this.getMonth() + 1) +
    "/" +
    this.getFullYear()
  );
};

Date.prototype.timeNow = function () {
  return (
    (this.getHours() < 10 ? "0" : "") +
    this.getHours() +
    ":" +
    (this.getMinutes() < 10 ? "0" : "") +
    this.getMinutes() +
    ":" +
    (this.getSeconds() < 10 ? "0" : "") +
    this.getSeconds()
  );
};

function NewDateAndTime() {
  let newDate = new Date();
  return newDate.today() + " | " + newDate.timeNow();
}

function Format(now, saved, complete, typeadd) {
  let difference = saved - now;

  if (difference != 0) {
    if (now > saved) {
      difference = now - saved;
    }

    return `${difference}${complete}${difference > 1 ? "s" : ""} `;
  }
  return "";
}

function SplitDateAndTime(dateAndTime) {
  let splited = dateAndTime.split(" | ");
  let calendar = splited[0].split("/");
  let time = splited[1].split(":");

  return [
    Number(calendar[0]),
    Number(calendar[1]),
    Number(calendar[2]),
    Number(time[0]),
    Number(time[1]),
  ];
}

/* Basic functions */
function TestIsEmpty(text) {
  return text.trim().length == 0;
}

function Clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

/* Custom */
function CustomLog(text) {
  console.log(
    `%c${text}`,
    "padding: 1em; border: solid 0.1em hsla(0, 0%, 100%, 0.5); border-radius: 0.5em; background: hsla(0, 50%, 50%, 0.5)"
  );
}
