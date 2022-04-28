import * as React from "react";
import { render } from "react-dom";
import App from "./App";
import { AuthClient } from "@dfinity/auth-client";

const init = async () => {
  const authClient = await AuthClient.create();

  authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: () => {
        render(<App />, document.getElementById("app"));
      },
  });
}

init();


