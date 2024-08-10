import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";
import OAuthMain from "./OAuthMain";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("OAuthMain Component", () => {
  let mockNavigate;

  const defaultConfig = {
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
    redirectUri: "http://localhost/callback",
  };

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    jest.spyOn(window.localStorage.__proto__, "getItem");
    jest.spyOn(window.localStorage.__proto__, "setItem");
  });

  test("resetConfig clears local storage", () => {
    render(
      <MemoryRouter>
        <OAuthMain />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Reset"));

    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    expect(localStorage.getItem("oauthConfig")).toEqual(
      JSON.stringify(defaultConfig),
    );
  });
});
