// MSAL設定
const msalConfig = {
  auth: {
    clientId: 'ここにあなたのアプリケーションID', 
    authority: 'https://login.microsoftonline.com/ここにあなたのテナントID',
    redirectUri: 'https://あなたのgithub.io/リポジトリ名/' // ← 必ずGitHub PagesのURLに合わせる
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
