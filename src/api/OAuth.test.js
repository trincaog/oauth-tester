import {
  fetchAccessToken,
  tokenIntrospection,
  refreshAccessToken,
} from "./OAuth.js";

describe("OAuth functions", () => {
  describe("fetchAccessToken", () => {
    it("should fetch access token", async () => {
      const oAuthConfig = {
        redirectUri: "https://example.com/callback",
        clientId: "your-client-id",
        authorizationServer: "https://example.com",
        tokenEndpoint: "token",
      };
      const authCode = "your-auth-code";
      const pkceCodeVerifier = "your-pkce-code-verifier";

      const expectedBody = new URLSearchParams({
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: oAuthConfig.redirectUri,
        client_id: oAuthConfig.clientId,
        code_verifier: pkceCodeVerifier,
      });

      const expectedResponse = { access_token: "your-access-token" };

      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(expectedResponse),
      });

      const response = await fetchAccessToken(
        oAuthConfig,
        authCode,
        pkceCodeVerifier,
      );

      expect(fetch).toHaveBeenCalledWith(
        "https://example.com/token",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: expectedBody,
        }),
      );

      expect(response).toEqual(expectedResponse);
    });
  });

  describe("tokenIntrospection", () => {
    it("should send the correct request", async () => {
      const oAuthConfig = {
        clientId: "test-client-id",
        authorizationServer: "http://localhost",
        tokenIntrospectionEndpoint: "introspect",
        clientSecret: "test-client-secret",
      };
      const token = "test-token";

      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ scope: "test-scope" }),
      });

      let response = await tokenIntrospection(oAuthConfig, token);

      expect(response).toEqual({ scope: "test-scope" });

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost/introspect",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: expect.any(URLSearchParams),
        }),
      );

      const body = new URLSearchParams(fetch.mock.calls[0][1].body);
      expect(body.get("client_id")).toBe(oAuthConfig.clientId);
      expect(body.get("token")).toBe(token);
      expect(body.get("client_secret")).toBe(oAuthConfig.clientSecret);
    });
  });

  describe("refreshAccessToken", () => {
    it("should send the correct request", async () => {
      const oAuthConfig = {
        clientId: "test-client-id",
        authorizationServer: "http://localhost",
        tokenEndpoint: "token",
        clientSecret: "test-client-secret",
      };
      const refreshToken = "test-refresh-token";

      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ access_token: "abcd" }),
      });

      let response = await refreshAccessToken(oAuthConfig, refreshToken);

      expect(response).toEqual({ access_token: "abcd" });

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost/token",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: expect.any(URLSearchParams),
        }),
      );

      const body = new URLSearchParams(fetch.mock.calls[0][1].body);
      expect(body.get("client_id")).toBe(oAuthConfig.clientId);
      expect(body.get("refresh_token")).toBe(refreshToken);
      expect(body.get("client_secret")).toBe(oAuthConfig.clientSecret);
    });
  });
});
