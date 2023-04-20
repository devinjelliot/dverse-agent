import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms";
import { templates } from './templates';

export async function createInquiryChain(llm: OpenAI, prompt: string, conversationHistory: string) {
  const inquiryChain = new LLMChain({
    llm, 
    prompt: new PromptTemplate({
      template: templates.inquiryTemplate,
      inputVariables: ["userPrompt", "conversationHistory"],
    }),
  });

  const inquiryChainResult = await inquiryChain.call({ userPrompt: prompt, conversationHistory });
  const inquiry = inquiryChainResult.text;

  return inquiry;
}

export async function createAnswerChain(
  llm: OpenAI,
  summaries: string,
  question: string,
  conversationHistory: string,
  urls: string[],
  callbackManager: any
) {
  const promptTemplate = new PromptTemplate({
    template: templates.qaTemplate,
    inputVariables: ["summaries", "question", "conversationHistory", "urls"],
  });

  const chain = new LLMChain({
    prompt: promptTemplate,
    llm,
  });

  await chain.call({ summaries, question, conversationHistory, urls }, callbackManager);

  return chain;
}
