// This is the API endpoint that handles the chatbot
// It also uses the Ably realtime messaging service to stream
// the response to the client
// The client is a React app that uses the Ably React Hooks
// library to subscribe to the Ably channel and display the
// response in real time
// pages/api/chat.ts
import { PineconeClient } from "@pinecone-database/pinecone";
import Ably ,{ Realtime, Types } from "ably/promises";
import { CallbackManager } from "langchain/callbacks";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models";
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { OpenAI } from "langchain/llms";
import { PromptTemplate } from "langchain/prompts";
import type { NextApiRequest, NextApiResponse } from 'next';
import { uuid } from 'uuidv4';
import { summarizeLongDocument } from './summarizer';
import { ConversationLog } from './conversationLog';
import { Metadata, getMatchesFromEmbeddings } from './matches';
import { templates } from './templates';
import { initAblyClient, createAblyChannel } from "../../utils/ablyHelper";

const llm = new OpenAI({});
let pinecone: PineconeClient | null = null;

const initPineconeClient = async () => {
  pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

interface HandleRequestParams {
  prompt: string;
  clientId: string;
  authUrl: string;
}

const handleRequest = async (params: HandleRequestParams) => {
  const { prompt, clientId, authUrl } = params;

  if (!pinecone) {
    await initPineconeClient();
  }

  let summarizedCount = 0;
  //let ably: Ably.Realtime | null = null;

  try {
    const ably = new Ably.Realtime({ authUrl: '/api/createTokenRequest'})
    //const ablyClient = initAblyClient(authUrl, clientId);
    console.log(`fuck me for client ID ${clientId}`);
    console.log(`Ably client initialized for client ID ${clientId}`);
    console.log(`Ably client initialized for client ID ${authUrl}`);
    const channel = createAblyChannel(ably, `clientId:${clientId}`) as Types.RealtimeChannelPromise;
    const interactionId = uuid();

    // Retrieve the conversation log and save the user's prompt
    const conversationLog = new ConversationLog(clientId);
    const conversationHistory = await conversationLog.getConversation({ limit: 10 });
    await conversationLog.addEntry({ entry: prompt, speaker: "user" });

    const publishStatus = async (message: string) => {
      await publishToAblyChannel(channel, "status", { message });
    };

    // Build an LLM chain that will improve the user prompt
    const inquiryChain = new LLMChain({
      llm, prompt: new PromptTemplate({
        template: templates.inquiryTemplate,
        inputVariables: ["userPrompt", "conversationHistory"],
      })
    });
    
    const inquiryChainResult = await inquiryChain.call({ userPrompt: prompt, conversationHistory });
    const inquiry = inquiryChainResult.text;

    // Embed the user's intent and query the Pinecone index
    const embedder = new OpenAIEmbeddings({
      modelName: "text-embedding-ada-002"
    });

    const publishToAblyChannel = async (
      channel: Types.RealtimeChannelPromise, 
      name: string, 
      data: any) => {
        try {
          await channel.publish(name, data);
        } catch (error) {
          console.error(error);
        }
    };

    const embeddings = await embedder.embedQuery(inquiry);
    await publishStatus("Embedding your inquiry...");

    const matches = await getMatchesFromEmbeddings(embeddings, pinecone!, 3);
    await publishStatus("Finding matches...");

    const urls = matches && Array.from(new Set(matches.map(match => {
      const metadata = match.metadata as Metadata;
      const { url } = metadata;
      return url;
    })));

    const fullDocuments = matches && Array.from(
      matches.reduce((map, match) => {
        const metadata = match.metadata as Metadata;
        const { text, url } = metadata;
        if (!map.has(url)) {
          map.set(url, text);
        }
        return map;
      }, new Map())
    ).map(([_, text]) => text);

    const chunkedDocs = matches && Array.from(new Set(matches.map(match => {
      const metadata = match.metadata as Metadata;
      const { chunk } = metadata;
      return chunk;
    })));

    const onSummaryDone = (summary: string) => {
      summarizedCount += 1;
      publishStatus(`Done summarizing ${summarizedCount} documents`);
    };

    const summary = await summarizeLongDocument(fullDocuments!.join("\n"), inquiry, onSummaryDone);
    console.log(summary);

    await publishStatus("Documents are summarized. Forming final answer...");

    // Prepare a QA chain and call it with the document summaries and the user's prompt
    const promptTemplate = new PromptTemplate({
      template: templates.qaTemplate,
      inputVariables: ["summaries", "question", "conversationHistory", "urls"],
    });

    const chat = new ChatOpenAI({
      streaming: true,
      verbose: true,
      modelName: "gpt-3.5-turbo",
      callbackManager: CallbackManager.fromHandlers({
        async handleLLMNewToken(token) {
          console.log(token);
          channel.publish({
            data: {
              event: "response",
              token: token,
              interactionId,
            },
          });
        },
        async handleLLMEnd(result) {
          channel.publish({
            data: {
              event: "responseEnd",
              token: "END",
              interactionId,
            },
          });
        },
      }),
    });

    const chain = new LLMChain({
      prompt: promptTemplate,
      llm: chat,
    });

    await chain.call({
      summaries: summary,
      question: prompt,
      conversationHistory,
      urls,
    });

  } catch (error) {
    //@ts-ignore
    console.error(error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { body } = req;
  const { prompt, authUrl, clientId } = body;

  if (!clientId) {
    res.status(400).json({ "error": "Client ID is missing or undefined" });
    return;
  }
  
  await handleRequest({ prompt, clientId, authUrl });
  res.status(200).json({ "message": "started" });
}

