import { MessageInput } from "@chatscope/chat-ui-kit-react";

interface InputBoxProps {
  onSend: () => void;
  onChange: (e: any, text: string) => void;
  isLoading?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ onSend, onChange, isLoading }) => {
  return (
    <div className="fixed-input bg-[#1f1f1f] p-4 rounded-lg shadow-md text-[#ffffff]">
      <MessageInput
        className= "bg-[#1f1f1f] p-4 rounded-lg shadow-md text-[#ffffff]"
        placeholder="Type whatever the fuck you want!"
        onSend={onSend}
        onChange={onChange}
        sendButton={true}
        autoFocus
        disabled={isLoading}
      />
    </div>
  );
};

export default InputBox;
