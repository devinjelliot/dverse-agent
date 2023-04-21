// This is an API route that creates a token request for a given client ID
// It is called by the client-side chatbot component
// It uses the Ably library to create a token request
// src/pages/api/createTokenRequest.ts
import Ably from "ably/promises";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientId = req.query.clientId as string;
  console.log("createTokenRequest called with clientId:", clientId);


  try {
    const ably = new Ably.Realtime({key: process.env.ABLY_API_KEY as string});
    const tokenRequestData = await ably.auth.createTokenRequest({ clientId: clientId });
    console.log("try block for token request", tokenRequestData);
    res.status(200).json(tokenRequestData);
  } catch (error) {
    console.error("Error in createTokenRequest:", error);
    res.status(500).json({ error: "Failed to create token request" });
  }
}
