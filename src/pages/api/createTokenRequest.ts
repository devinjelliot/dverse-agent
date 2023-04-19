// This is an API route that creates a token request for a given client ID
// It is called by the client-side chatbot component
// It uses the Ably library to create a token request
// It is called by the client-side chatbot component
// src/pages/api/createTokenRequest.ts
import Ably from "ably/promises";
import { NextApiRequest, NextApiResponse } from "next";

let options: Ably.Types.ClientOptions = { key: process.env.ABLY_API_KEY };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Handling createTokenRequest..."); 
  try {
    const client = new Ably.Realtime(options);
    const tokenRequestData = await client.auth.createTokenRequest({ clientId: req.query.clientId as string });
    console.log(tokenRequestData);
    res.status(200).json(tokenRequestData);
  } catch (error) {
    console.error("Error in createTokenRequest:", error);
    res.status(500).json({ error: "Failed to create token request" });
  }
}
