import * as React from "react";
import { render } from "react-dom";
import App from "./App";
import { AuthClient } from "@dfinity/auth-client"; //@dfinity/authentication and @dfinity/identity

const init = async () => {
  const authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  } else {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: () => {
        handleAuthenticated(authClient);
      },
    });
  }
}

async function handleAuthenticated(authClient) {
  const identity = await authClient.getIdentity();
  const userPrincipal = identity._principal.toString();
  console.log("userPrincipal: ", userPrincipal);
  render(<App />, document.getElementById("app"));
}

init();


