// This is an API route that creates a token request for a given client ID
// It is called by the client-side chatbot component
// It uses the Ably library to create a token request
// src/pages/api/createTokenRequest.ts
import Ably from "ably/promises";
import { NextApiRequest, NextApiResponse } from "next";
import middleware from "./middleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await middleware.run(req, res);
  const clientId = decodeURIComponent(req.query.clientId as string);
  console.log("createTokenRequest called with clientId:", clientId);


  try {
    const ably = new Ably.Rest({key: process.env.ABLY_API_KEY as string});
    const tokenRequestData = await ably.auth.createTokenRequest({ clientId: clientId });
    res.status(200).send(tokenRequestData);
  } catch (error) {
    res.status(500).json({ error: "Failed to create token request" });
  }
}
