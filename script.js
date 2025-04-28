// MSAL設定
const msalConfig = {
  auth: {
    clientId: '13307932-eddc-4846-9c3f-4335c59fa874', 
    authority: 'https://login.microsoftonline.com/46b73b41-8843-4155-9082-47fa70788d0c',
    redirectUri: 'https://jumps710.github.io/entra/' // ← 必ずGitHub PagesのURLに合わせる
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

// サインイン関数
async function signInAndGetProfile() {
  try {
    const popupResult = await msalInstance.loginPopup(loginRequest);
    console.log('Popup login success:', popupResult);

    if (popupResult && popupResult.account) {
      msalInstance.setActiveAccount(popupResult.account);
    }

    handleResponse(popupResult);
  } catch (popupError) {
    console.error('Popup login failed', popupError);
  }
}

// 認証後の処理
function handleResponse(response) {
  if (response) {
    const account = response.account;
    if (account) {
      const linkArea = document.getElementById('link-area');
      linkArea.innerHTML = `
        <h2>ようこそ、${account.name} さん</h2>
        <p>メールアドレス: ${account.username}</p>
      `;
    }
  }
}

function logout() {
  msalInstance.logoutRedirect();
}


// ページロード時
window.onload = async () => {
  if (window.opener == null) {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      console.log('既にサインイン済み、handleResponseへ');
      handleResponse({ account: accounts[0] });
    } else {
      console.log('未サインイン、signInAndGetProfile開始');
      signInAndGetProfile();
    }
  } else {
    console.log('Popup window detected, skipping sign-in.');
  }
};
