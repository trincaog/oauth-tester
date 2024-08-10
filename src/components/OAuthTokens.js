function OAuthTokens({ oauthResponse }) {
  function hasResponse() {
    return (
      oauthResponse.accessToken !== "" ||
      oauthResponse.idToken !== "" ||
      oauthResponse.refreshToken !== ""
    );
  }

  return (
    <>
      {hasResponse() && (
        <div className="form-container">
          {oauthResponse.decodedIdToken !== "" && (
            <div className="form-row">
              <label className="form-label">Decoded ID Token:</label>
              <pre className="token-container">
                {JSON.stringify(oauthResponse.decodedIdToken, null, 2)}
              </pre>
            </div>
          )}
          {oauthResponse.decodedAccessToken !== "" && (
            <div className="form-row">
              <label className="form-label">Decoded Access Token:</label>
              <pre className="token-container">
                {JSON.stringify(oauthResponse.decodedAccessToken, null, 2)}
              </pre>
            </div>
          )}
          {oauthResponse.decodedRefreshToken !== "" && (
            <div className="form-row">
              <label className="form-label">Decoded Refresh Token:</label>
              <pre className="token-container">
                {JSON.stringify(oauthResponse.decodedRefreshToken, null, 2)}
              </pre>
            </div>
          )}
          <div className="form-row">
            <label htmlFor="receivedState" className="form-label">
              Received State:
            </label>
            <input
              type="text"
              id="receivedState"
              name="receivedState"
              value={oauthResponse.receivedState}
              className="form-input"
              readOnly
            />
          </div>
          <div className="form-row">
            <label htmlFor="idToken" className="form-label">
              ID Token:
            </label>
            <textarea
              id="idToken"
              name="idToken"
              rows={2}
              cols={80}
              value={oauthResponse.idToken}
              className="form-input"
              readOnly
            />
          </div>
          <div className="form-row">
            <label htmlFor="accessToken" className="form-label">
              Access Token:
            </label>
            <textarea
              id="accessToken"
              name="accessToken"
              rows={2}
              cols={80}
              value={oauthResponse.accessToken}
              className="form-input"
              readOnly
            />
          </div>
          <div className="form-row">
            <label htmlFor="refreshToken" className="form-label">
              Refresh Token:
            </label>
            <textarea
              id="refreshToken"
              name="refreshToken"
              rows={2}
              cols={80}
              value={oauthResponse.refreshToken}
              className="form-input"
              readOnly
            />
          </div>
        </div>
      )}
    </>
  );
}

export default OAuthTokens;
