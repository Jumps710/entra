const msalConfig = {
  auth: {
    clientId: '13307932-eddc-4846-9c3f-4335c59fa874',
    authority: 'https://login.microsoftonline.com/46b73b41-8843-4155-9082-47fa70788d0c',
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
    await msalInstance.loginRedirect(loginRequest);
  } catch (error) {
    console.error('Redirect login failed', error);
  }
}


function handleResponse(response) {
  if (response) {
    showShortcuts();
  }
}

function showShortcuts() {
  const account = msalInstance.getActiveAccount();
  const linkArea = document.getElementById('link-area');
  let welcomeMessage = '';

  if (account && account.username) {
    const username = account.username.toLowerCase();

    if (username.includes('honsha')) {
      welcomeMessage = '本社スタッフさん、ポータルへようこそ！';
    } else if (username.includes('tenpo')) {
      welcomeMessage = '店舗スタッフさん、ポータルへようこそ！';
    } else {
      welcomeMessage = 'ポータルへようこそ！';
    }
  } else {
    welcomeMessage = 'ポータルへようこそ！';
  }

  linkArea.innerHTML = `
    <h2>${welcomeMessage}</h2>
    <a href="https://line.worksmobile.com/more?version=v28" class="shortcut-button" target="_blank">LINE WORKS</a>
    <a href="lineworksRoger://join?version=12" class="shortcut-button">ラジャー</a>
    <a href="https://jumps710.github.io/erp" class="shortcut-button" target="_blank">基幹システム</a>
  `;
}


window.onload = async () => {
  try {
    const response = await msalInstance.handleRedirectPromise();

    if (response !== null) {
      console.log('Redirect response received', response);
      msalInstance.setActiveAccount(response.account);
      handleResponse(response);
    } else {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
        handleResponse({ account: accounts[0] });
      } else {
        console.log('No account, starting redirect login...');
        signInAndGetProfile();
      }
    }
  } catch (error) {
    console.error('Error handling redirect response', error);
  }
};

