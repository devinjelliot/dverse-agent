// Description: Helper functions for Ably
// src/utils/ablyHelper.ts
import * as Ably from "ably/promises";

const initAblyClient = (authUrl: string, clientId: string) => {
    const ablyClient = new Ably.Realtime({
      authUrl: authUrl,
      clientId: clientId,
    });
    return ablyClient;
  };
  
const createAblyChannel = (client: Ably.Realtime, clientId: string) => {
    const channel = client.channels.get(clientId);
    return channel;
};

const publishToAblyChannel = async (
  channel: Ably.Types.RealtimeChannelPromise,
  eventName: string,
  data: any
) => {
  try {
    await channel.publish(eventName, data);
  } catch (err) {
    const error = err as Ably.Types.ErrorInfo;
    console.error(`Error publishing to Ably channel: ${error.message}`);
    throw err;
  }
};

export { createAblyChannel, publishToAblyChannel, initAblyClient };
