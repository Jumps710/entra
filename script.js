const msalConfig = {
  auth: {
    clientId: 'ここにあなたのclientId',
    authority: 'https://login.microsoftonline.com/ここにあなたのtenantId',
    redirectUri: 'https://jumps710.github.io/entra/'
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

const loginRequest = {
  scopes: ["openid", "profile", "email"]
};

async function signInAndGetProfile() {
  try {
    const popupResult = await msalInstance.loginPopup(loginRequest);
    if (popupResult && popupResult.account) {
      msalInstance.setActiveAccount(popupResult.account);
    }
    handleResponse(popupResult);
  } catch (popupError) {
    console.error('Popup login failed', popupError);
  }
}

function handleResponse(response) {
  if (response) {
    showShortcuts();
  }
}

function showShortcuts() {
  const linkArea = document.getElementById('link-area');
  linkArea.innerHTML = `
    <a href="https://line.worksmobile.com/more?version=v28" class="shortcut-button" target="_blank">LINE WORKS</a>
    <a href="lineworksRoger://join?version=12" class="shortcut-button">ラジャー</a>
    <a href="https://jumps710.github.io/erp" class="shortcut-button" target="_blank">基幹システム</a>
  `;
}

window.onload = async () => {
  if (window.opener == null) {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      handleResponse({ account: accounts[0] });
    } else {
      signInAndGetProfile();
    }
  } else {
    console.log('Popup window detected, skipping sign-in.');
  }
};
