export function generateCodeVerifier() {
  // Static code verifier for testing - https://tonyxu-io.github.io/pkce-generator/
  return "WlEHgVzsCnCrEIGeWpQSitjjPdwiUttyXiBY0JZwwAU";
}

export function generateCodeChallenge(verifier) {
  if (!verifier) {
    return null;
  }

  // Static code challenge for testing
  return "BDcgtVe4rFyBVjV1PNywwgpe05I3U47HYQ1MunZzx14";
}

export async function fetchAccessToken(
  oAuthConfig,
  authCode,
  pkceCodeVerifier,
) {
  console.log("Fetching Access Token: ", authCode);

  let body = {
    grant_type: "authorization_code",
    code: authCode,
    redirect_uri: oAuthConfig.redirectUri,
    client_id: oAuthConfig.clientId,
  };
  if (oAuthConfig.clientSecret) {
    body["client_secret"] = oAuthConfig.clientSecret;
  }
  if (pkceCodeVerifier) {
    body["code_verifier"] = pkceCodeVerifier;
  }

  let response = await fetch(
    oAuthConfig.authorizationServer + "/" + oAuthConfig.tokenEndpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(body),
    },
  );

  return response.json();
}

export async function tokenIntrospection(oAuthConfig, token) {
  console.log("Token Introspection: " + token);

  let body = {
    client_id: oAuthConfig.clientId,
    token: token,
  };
  if (oAuthConfig.clientSecret) {
    body["client_secret"] = oAuthConfig.clientSecret;
  }

  try {
    let response = await fetch(
      oAuthConfig.authorizationServer +
        "/" +
        oAuthConfig.tokenIntrospectionEndpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(body),
      },
    );

    return response.json();
  } catch (error) {
    console.log("Error in token introspection: ", error);
    return null;
  }
}

export async function refreshAccessToken(oAuthConfig, refreshToken) {
  console.log("Renewing Access Token");

  let body = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: oAuthConfig.clientId,
  };
  if (oAuthConfig.clientSecret) {
    body["client_secret"] = oAuthConfig.clientSecret;
  }

  let response = await fetch(
    oAuthConfig.authorizationServer + "/" + oAuthConfig.tokenEndpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(body),
    },
  );

  return response.json();
}
