"use client";

import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";

type ClipboardButtonProps = {
  textToCopy: string;
  children: ReactNode;
} & ButtonProps;

export function ClipboardButton({
  textToCopy,
  children,
  ...props
}: ClipboardButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <Button onClick={handleCopy} {...props}>
      {isCopied ? <Check /> : <Copy />}
      {children}
    </Button>
  );
}
