import { generateCodeChallenge } from "../api/OAuth.js";

export default function OAuthConfig({
  oauthConfig,
  handleOAuthConfigChange,
  pkceCodeVerifier,
  resetConfig,
  renewToken,
}) {
  function handlePkceChange(e) {
    handleOAuthConfigChange({
      target: {
        id: e.target.id,
        value: e.target.checked,
      },
    });
  }

  return (
    <>
      <div className="button-container">
        <button
          className="top-button"
          onClick={() => document.getElementById("oauth-login-form").submit()}
        >
          Login
        </button>
        <button className="top-button" onClick={renewToken}>
          Renew Token
        </button>
        <button
          className="top-button"
          onClick={() => document.getElementById("oauth-logout-form").submit()}
        >
          Logout
        </button>
        <button className="top-button" onClick={resetConfig}>
          Reset
        </button>
      </div>

      <form
        action={
          oauthConfig.authorizationServer + "/" + oauthConfig.logoutEndpoint
        }
        id="oauth-logout-form"
      ></form>
      <hr></hr>
      <div className="form-container">
        <b>
          NOTE: Register the authorized callback on the Authorization Server:{" "}
          {oauthConfig.redirectUri}
        </b>
      </div>
      <hr></hr>

      <div className="form-container">
        <div className="form-row">
          <label htmlFor="authorizationServer" className="form-label">
            Authorization Server:
          </label>
          <input
            type="text"
            id="authorizationServer"
            name="authorizationServer"
            value={oauthConfig.authorizationServer}
            onChange={handleOAuthConfigChange}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <label htmlFor="authorizeEndpoint" className="form-label">
            Authorize Endpoint:
          </label>
          <input
            type="text"
            id="authorizeEndpoint"
            name="authorizeEndpoint"
            value={oauthConfig.authorizeEndpoint}
            onChange={handleOAuthConfigChange}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <label htmlFor="tokenEndpoint" className="form-label">
            Token Endpoint:
          </label>
          <input
            type="text"
            id="tokenEndpoint"
            name="tokenEndpoint"
            value={oauthConfig.tokenEndpoint}
            onChange={handleOAuthConfigChange}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <label htmlFor="tokenIntrospectionEndpoint" className="form-label">
            Token Introspection Endpoint:
          </label>
          <input
            type="text"
            id="tokenIntrospectionEndpoint"
            name="tokenIntrospectionEndpoint"
            value={oauthConfig.tokenIntrospectionEndpoint}
            onChange={handleOAuthConfigChange}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <label htmlFor="logoutEndpoint" className="form-label">
            Logout Endpoint:
          </label>
          <input
            type="text"
            id="logoutEndpoint"
            name="logoutEndpoint"
            value={oauthConfig.logoutEndpoint}
            onChange={handleOAuthConfigChange}
            className="form-input"
          />
        </div>
      </div>

      <hr></hr>

      <div className="form-container">
        <form
          action={
            oauthConfig.authorizationServer +
            "/" +
            oauthConfig.authorizeEndpoint
          }
          id="oauth-login-form"
        >
          <div className="form-row">
            <label htmlFor="clientId" className="form-label">
              Client ID:
            </label>
            <input
              type="text"
              id="clientId"
              name="client_id"
              value={oauthConfig.clientId}
              onChange={handleOAuthConfigChange}
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label htmlFor="clientSecret" className="form-label">
              Client Secret:
            </label>
            <input
              type="text"
              id="clientSecret"
              name="client_secret"
              value={oauthConfig.clientSecret}
              onChange={handleOAuthConfigChange}
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label htmlFor="scope" className="form-label">
              Scope:
            </label>
            <input
              type="text"
              id="scope"
              name="scope"
              value={oauthConfig.scope}
              onChange={handleOAuthConfigChange}
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label htmlFor="audience" className="form-label">
              Audience:
            </label>
            <input
              type="text"
              id="audience"
              name="audience"
              value={oauthConfig.audience}
              onChange={handleOAuthConfigChange}
              className="form-input"
            />
          </div>
          <div className="form-row">
            <label htmlFor="state" className="form-label">
              State:
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={oauthConfig.state}
              onChange={handleOAuthConfigChange}
              className="form-input"
            />
          </div>
          <input
            type="hidden"
            id="redirectUri"
            name="redirect_uri"
            value={oauthConfig.redirectUri}
            className="form-input"
          />
          <input
            type="hidden"
            id="responseType"
            name="response_type"
            value={oauthConfig.responseType}
          />
          {oauthConfig.usePkce && (
            <>
              <input
                type="hidden"
                id="codeChallenge"
                name="code_challenge"
                value={generateCodeChallenge(pkceCodeVerifier)}
                className="form-input"
              />
              <input
                type="hidden"
                id="codeChallengeMethod"
                name="code_challenge_method"
                value="S256"
                className="form-input"
              />
            </>
          )}
        </form>
        <div className="form-row">
          <label htmlFor="pkce" className="form-label">
            PKCE:
          </label>
          <input
            type="checkbox"
            id="usePkce"
            name="usePkce"
            checked={oauthConfig.usePkce}
            onChange={handlePkceChange}
            className="form-input"
          />
        </div>
      </div>
    </>
  );
}
