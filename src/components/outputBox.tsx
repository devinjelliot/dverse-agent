import {
    ChatContainer,
    ConversationHeader,
    Message,
    MessageList,
    TypingIndicator,
  } from "@chatscope/chat-ui-kit-react";
  import ReactMarkdown from "react-markdown";
  import * as timeago from "timeago.js";
  
  interface OutputBoxProps {
    botIsTyping: boolean;
    statusMessage: string;
    conversation: any[];
  }
  
  const OutputBox: React.FC<OutputBoxProps> = ({ botIsTyping, statusMessage, conversation }) => {
    return (
      <div className="fixed-output bg-[#1f1f1f] p-4 rounded-lg shadow-md text-[#ffffff]">
        <ChatContainer>
          <ConversationHeader className="text-[#e5e4eb]">
            <ConversationHeader.Actions></ConversationHeader.Actions>
            <ConversationHeader.Content
              userName="Backpack Chatbot"
              info={statusMessage}
            />
          </ConversationHeader>
          <MessageList
            typingIndicator={
              botIsTyping ? <TypingIndicator content="BP is typing" /> : null
            }
          >
            {conversation.map((entry, index) => (
              <Message
                key={index}
                style={{ width: "90%" }}
                model={{
                  type: "custom",
                  sender: entry.speaker,
                  position: "single",
                  direction:
                    entry.speaker === "bot" ? "incoming" : "outgoing",
                }}
              >
                <Message.CustomContent>
                  <ReactMarkdown>{entry.message}</ReactMarkdown>
                </Message.CustomContent>
                <Message.Footer
                  sentTime={timeago.format(entry.date)}
                  sender={entry.speaker === "bot" ? "BP" : "You"}
                />
              </Message>
            ))}
          </MessageList>
        </ChatContainer>
      </div>
    );
  };
  
  export default OutputBox;
  