// This file is used to wrap the entire app with the FingerprintJS Pro React SDK
// and configure the Ably React Hooks package.
// The FingerprintJS Pro React SDK is used to get the visitor ID for the current user.
// The Ably React Hooks package is used to subscribe to the Ably channel for the current user and update the conversation state accordingly.
// The visitor ID is used to identify the user in the Ably channel.
// The Ably channel is used to send messages to the chatbot and receive responses from the chatbot.
// src/pages/_app.tsx
import type { AppProps } from "next/app";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";
import { configureAbly } from "@ably-labs/react-hooks";
import "../styles/globals.css";

const fpjsPublicApiKey: string = process.env.FINGERPRINT as string;

const prefix = process.env.NEXT_PUBLIC_API_ROOT as string;
const clientId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

configureAbly({ authUrl: `${prefix}/createTokenRequest?clientId=${encodeURIComponent(clientId)}` as string, clientId: clientId, log: {level: 4} });
console.log("clientId apptsx:", clientId);
console.log("STRINGIFY apptsx:", JSON.stringify({ authUrl: `${prefix}/createTokenRequest?clientId=${encodeURIComponent(clientId)}` as string, clientId: clientId, log: {level: 4} }));

export default function App({ Component, pageProps }: AppProps) {

  return (
    <FpjsProvider loadOptions={{ apiKey: fpjsPublicApiKey }}>
        <Component {...pageProps} />
    </FpjsProvider>
  );
}
