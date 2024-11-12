// Screens Divs
const configMenuLists__itemTemplate = document.querySelector("#configMenuLists__itemTemplate");
const configMenuLists__item = document.querySelector("#configMenuLists__item");

// Screen
const screens = [...document.querySelectorAll(".screen")];
const screen__div__actions__close = [...document.querySelectorAll(".screen__div__actions__close")];

screen__div__actions__close.forEach((closeButton) => {
  closeButton.addEventListener("click", () => {
    let parent = closeButton.parentElement.parentElement.parentElement.parentElement;
    if (parent.classList.contains("screen__div")) {
      parent = parent.parentElement;
    }
    Disable(parent);

    if (closeButton.id == "configureListMenuDiv__CloseButton") {
      openConfigCurrentList.focus();
    }
  });
});

window.onkeyup = (e) => {
  if (e.key != "Escape") return;

  let openScreen = null;

  screens.forEach((screen) => {
    if (screen.ariaDisabled == null) {
      openScreen = screen.querySelector(".screen__div__actions__close__button");
    }
  });

  if (item__actions.ariaDisabled == null) {
    HideItemActions();
  }

  if (openScreen == null) {
    return;
  }

  openScreen.click();
};

window.onresize = () => {
  if (item__actions.ariaDisabled == null) {
    PositionItemActions(
      document.querySelector(`[data-id='${item__actions.dataset.id}'] > .item__dragabblebutton `)
    );
  }
  if (window.innerWidth < 900) {
    draggableSidebarPos = 32;
  } else {
    draggableSidebarPos = 64;
  }
};

// Global configurations
const globalConfigurationsMenu = document.querySelector("#globalConfigurationsMenu");
const globalConfigurationsMenuDiv__smallUI = document.querySelector(
  "#globalConfigurationsMenuDiv__smallUI"
);
const globalConfigurationsMenuDiv__theme = document.querySelector(
  "#globalConfigurationsMenuDiv__theme"
);
const globalConfigurationsMenuDiv__SaveButton = document.querySelector(
  "#globalConfigurationsMenuDiv__SaveButton"
);
let darkTheme = true;
let smallUI = false;
let animatingTheme = "";

/* screen */
const screentabsbuttons = document.querySelector("#screentabsbuttons");
const screentabbuttons = [...document.querySelectorAll(".screentabbuttons")];

screentabbuttons.forEach((button) => {
  button.onclick = () => {
    if (button.dataset.tabid == null) return;

    let thisMenu = button.parentElement.parentElement.parentElement;
    thisMenu.querySelector("#screentabsbuttons").scrollTo(0, 0);
    Disable(thisMenu);

    for (let i = 0; i < screens.length; i++) {
      const screen = screens[i];
      if (screen.id != button.dataset.tabid) {
        continue;
      }

      // Open wanted menu

      let focusTabPos = 0;
      let screentabbuttonsOnNewMenu = [...screen.querySelectorAll(".screentabbuttons")];
      console.log(thisMenu.id);
      if (thisMenu.id != "globalConfigurationsMenu") {
        screentabbuttonsOnNewMenu[0].setAttribute("data-tabid", thisMenu.id);
        let buttontext = thisMenu.querySelector(".screentabbuttons").innerHTML;
        let title = "Open " + buttontext.trim();
        screentabbuttonsOnNewMenu[0].innerHTML = buttontext;

        screentabbuttonsOnNewMenu[0].title = title;
        focusTabPos = 1;
        UpdateMenuGlobalConfigurations();
      }

      Enable(screen);
      let screentabsbuttons = screen.querySelector("#screentabsbuttons");
      let wantedSelectedTab = screentabbuttonsOnNewMenu[focusTabPos];
      console.log(screentabsbuttons);
      console.log(wantedSelectedTab);

      let xPos =
        wantedSelectedTab.getBoundingClientRect().x - screentabsbuttons.getBoundingClientRect().x;
      screentabsbuttons.scrollTo(xPos, 0);
      console.log(xPos);

      wantedSelectedTab.focus();
    }

    if (!button.classList.contains("selectedtab")) {
      // let screenDiv = button.parentElement.parentElement;
      // console.log(screenDiv);
      // let allTabs = [...screenDiv.querySelectorAll(".screentab")];
      // allTabs.forEach((currentTab) => {
      //   Disable(currentTab);
      // });
      // let wantedtab = allTabs[button.dataset.tabid];
      // Enable(wantedtab);
    }
  };
});

let allscreensTabs = [...document.querySelectorAll(".screehastabs")];

allscreensTabs.forEach((screen) => {
  let screentabs = [...screen.querySelectorAll(".screentab")];
  for (let i = 1; i < screentabs.length; i++) {
    Disable(screentabs[i]);
  }
});

function UpdateMenuGlobalConfigurations() {
  globalConfigurationsMenuDiv__theme.checked = !darkTheme;
  globalConfigurationsMenuDiv__smallUI.checked = smallUI;
}

globalConfigurationsMenuDiv__SaveButton.onclick = () => {
  smallUI = globalConfigurationsMenuDiv__smallUI.checked;
  darkTheme = !globalConfigurationsMenuDiv__theme.checked;

  let theme = darkTheme ? "dark" : "light";

  localStorage.setItem("smallUI", smallUI);
  localStorage.setItem("theme", theme);

  if (smallUI) {
    document.body.setAttribute("data-smallUI", "");
  } else {
    document.body.removeAttribute("data-smallUI");
  }

  clearTimeout(animatingTheme);
  root.classList.add("animateTransition");

  animatingTheme = setTimeout(() => {
    if (darkTheme) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
    }

    animatingTheme = setTimeout(() => {
      root.classList.remove("animateTransition");
    }, 1500);
  }, 100);

  Disable(globalConfigurationsMenu);
};
