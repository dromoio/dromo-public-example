import { useEffect, useState } from "react";
import copyTextToClipboard from "../util/copyTextToClipboard";
import Typography, { VARIANTS } from "../common/Typography";
import SyntaxHighlighter from "react-syntax-highlighter";
import { ReactComponent as CopyIcon } from "../assets/icons/copy.svg";
import { tomorrowNightBlue } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const CodeBlock = ({
  children,
  onCopy,
  codeType,
  showCopyButton = true,
}: {
  children: string;
  codeType: "javascript" | "json";
  onCopy?: () => void;
  showCopyButton?: boolean;
}) => {
  const [copiedText, setCopiedText] = useState(false);

  const handleCopyToClipboard = () => {
    copyTextToClipboard(children);
    setCopiedText(true);
    if (onCopy) {
      onCopy();
    }
  };

  useEffect(() => {
    if (copiedText) {
      setTimeout(() => {
        setCopiedText(false);
      }, 1000);
    }
  }, [copiedText]);

  return (
    <div className="relative">
      {showCopyButton && (
        <div className="flex bg-[#102a44] w-full items-center justify-end rounded-t-lg border-t p-2">
          <button
            onClick={handleCopyToClipboard}
            className="grid items-center overflow-hidden pl-2 text-gray-300 transition-all hover:text-white"
            style={{
              gridTemplateColumns: copiedText ? "24px 1fr" : "24px 0fr",
            }}
          >
            <CopyIcon className="h-5 w-5" />

            <span className="w-full overflow-hidden">
              <Typography
                variant={VARIANTS.BODY2}
                className="w-full whitespace-nowrap text-xs text-inherit"
              >
                Copied
              </Typography>
            </span>
          </button>
        </div>
      )}
      <SyntaxHighlighter
        language={codeType}
        style={tomorrowNightBlue}
        customStyle={{
          padding: "1rem",
          borderBottomLeftRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
          ...(showCopyButton
            ? {}
            : {
                borderTopLeftRadius: "0.5rem",
                borderTopRightRadius: "0.5rem",
              }),
          fontSize: "0.9rem",
          lineHeight: "1.5rem",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          backgroundColor: "#102A43",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};
