import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import OAuthTokens from "./OAuthTokens";
import OAuthConfig from "./OAuthConfig";
import {
  generateCodeVerifier,
  fetchAccessToken,
  tokenIntrospection,
  refreshAccessToken,
} from "../api/OAuth.js";

function OAuthMain() {
  const location = useLocation();
  const navigate = useNavigate();

  const callbackEndpoint = "callback";

  const defaultConfigState = {
    authorizationServer: "http://localhost:8080/realms/test",
    authorizeEndpoint: "/protocol/openid-connect/auth",
    tokenEndpoint: "/protocol/openid-connect/token",
    tokenIntrospectionEndpoint: "/protocol/openid-connect/token/introspect",
    logoutEndpoint: "/protocol/openid-connect/logout",

    usePkce: true,

    responseType: "code",
    clientId: "client1",
    clientSecret: "",
    scope: "openid email profile",
    audience: "",
    state: "",
    redirectUri: "",
  };

  const defaultOauthResponse = {
    idToken: "",
    accessToken: "",
    refreshToken: "",
    receivedState: "",
    decodedIdToken: "",
    decodedAccessToken: "",
    decodedRefreshToken: "",
  };

  const [oAuthConfig, setOAuthConfig] = useState(defaultConfigState);
  const [oAuthResponse, setOAuthResponse] = useState(defaultOauthResponse);
  const [authCode, setAuthCode] = useState("");
  const [pkceCodeVerifier, setPkceCodeVerifier] = useState(
    generateCodeVerifier(),
  );

  function loadOAuthConfig() {
    let config = localStorage.getItem("oauthConfig");
    if (!config) {
      let configState = {
        ...defaultConfigState,
        redirectUri: window.location.href + callbackEndpoint,
      };
      config = JSON.stringify(configState);
      localStorage.setItem("oauthConfig", config);
    }

    let parsedConfig = JSON.parse(config);
    setOAuthConfig(parsedConfig);
  }

  function resetConfig() {
    console.log("Resetting OAuth Config");

    navigate("/", { replace: true });
    setOAuthResponse(defaultOauthResponse);

    localStorage.removeItem("oauthConfig");
    loadOAuthConfig();
  }

  function handleOAuthConfigChange(e) {
    const { id, value } = e.target;
    setOAuthConfig((prevOauth) => {
      let newOauth = {
        ...prevOauth,
        [id]: value,
      };

      localStorage.setItem("oauthConfig", JSON.stringify(newOauth));
      return newOauth;
    });
  }

  function setOAuthResponseValue(name, value) {
    setOAuthResponse((prevOauth) => ({
      ...prevOauth,
      [name]: value,
    }));
  }

  async function updateTokenValues(data) {
    if (data.id_token) {
      try {
        setOAuthResponseValue("idToken", data.id_token);
        setOAuthResponseValue("decodedIdToken", jwtDecode(data.id_token));
      } catch (error) {
        console.log(
          `Unable to parse JWT token, trying introspection (${error})`,
        );
        let response = await tokenIntrospection(oAuthConfig, data.id_token);
        setOAuthResponseValue("decodedIdToken", response);
      }
    }

    if (data.access_token) {
      try {
        setOAuthResponseValue("accessToken", data.access_token);
        setOAuthResponseValue(
          "decodedAccessToken",
          jwtDecode(data.access_token),
        );
      } catch (error) {
        console.log(
          `Unable to parse JWT token, trying introspection (${error})`,
        );
        let response = await tokenIntrospection(oAuthConfig, data.access_token);
        setOAuthResponseValue("decodedAccessToken", response);
      }
    }

    if (data.refresh_token) {
      try {
        setOAuthResponseValue("refreshToken", data.refresh_token);
        setOAuthResponseValue(
          "decodedRefreshToken",
          jwtDecode(data.refresh_token),
        );
      } catch (error) {
        console.log(
          `Unable to parse JWT token, trying introspection (${error})`,
        );
        let response = await tokenIntrospection(
          oAuthConfig,
          data.refresh_token,
        );
        setOAuthResponseValue("decodedRefreshToken", response);
      }
    }
  }

  async function renewAccessToken() {
    if (!oAuthResponse.refreshToken) {
      console.error("No refresh token available");
      return;
    }
    try {
      let data = await refreshAccessToken(
        oAuthConfig,
        oAuthResponse.refreshToken,
      );
      updateTokenValues(data);
    } catch (error) {
      console.error("Error renewing access token:", error);
    }
  }

  useEffect(() => {
    // Load initial state from local storage
    loadOAuthConfig();

    if (location.pathname === `/${callbackEndpoint}`) {
      // Check if this is the OAuth callback
      const query = new URLSearchParams(location.search);
      const newAuthCode = query.get("code");
      if (newAuthCode) {
        setAuthCode(newAuthCode);
      }

      const state = query.get("state");
      if (state) {
        setOAuthResponseValue("receivedState", state);
      }

      navigate("/", { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (authCode !== "") {
      (async () => {
        try {
          let data = await fetchAccessToken(
            oAuthConfig,
            authCode,
            oAuthConfig.usePkce ? pkceCodeVerifier : null,
          );
          updateTokenValues(data);
        } catch (error) {
          console.error("Error getting token:", error);
        }
        setAuthCode("");
      })();
    }
  }, [authCode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="App">
      <div className="App-header">
        <h2>OAuth2.0 Test Client</h2>
      </div>
      <OAuthConfig
        oauthConfig={oAuthConfig}
        handleOAuthConfigChange={handleOAuthConfigChange}
        pkceCodeVerifier={pkceCodeVerifier}
        resetConfig={resetConfig}
        renewToken={renewAccessToken}
      />
      <hr></hr>
      <OAuthTokens oauthResponse={oAuthResponse} />
      <hr></hr>
    </div>
  );
}

export default OAuthMain;
