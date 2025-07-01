"use client";

import { useState, useRef, useEffect } from 'react';
import { Copy, Lock, Unlock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getContrastingTextColor, isValidHex } from '@/lib/color-utils';
import type { Color } from '@/types';
import { cn } from '@/lib/utils';

interface ColorColumnProps {
  color: Color;
  onToggleLock: () => void;
  onColorChange: (newHex: string) => void;
}

export function ColorColumn({ color, onToggleLock, onColorChange }: ColorColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(color.hex);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(color.hex);
  }, [color.hex]);

  const handleCopy = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    toast({
      title: `Copied ${color.hex} to clipboard!`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditBlur = () => {
    if (isValidHex(inputValue)) {
      onColorChange(inputValue);
    } else {
      setInputValue(color.hex);
      toast({
        title: "Invalid HEX code",
        description: "Please enter a valid 6-digit hex code.",
        variant: "destructive"
      });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEditBlur();
    }
    if (e.key === 'Escape') {
      setInputValue(color.hex);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const textColorClass = getContrastingTextColor(color.hex);

  return (
    <div
      className="relative flex-1 flex items-center justify-between px-4 md:px-8 transition-colors duration-500"
      style={{ backgroundColor: color.hex }}
    >
      <div className={cn("flex items-center gap-4", textColorClass)}>
        {isEditing ? (
          <Input
            ref={inputRef}
            type="text"
            value={inputValue.toUpperCase()}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleEditBlur}
            onKeyDown={handleKeyDown}
            className={cn(
                "w-32 bg-transparent text-center font-mono text-2xl font-bold h-auto p-2",
                "border-2 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-2",
                textColorClass,
                textColorClass === 'text-white' 
                ? 'border-white/20 focus-visible:border-white/50 focus-visible:ring-white/50' 
                : 'border-black/20 focus-visible:border-black/50 focus-visible:ring-black/50'
            )}
          />
        ) : (
          <h2
            className="text-2xl font-bold font-mono cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {color.hex.toUpperCase()}
          </h2>
        )}
      </div>

      <div className="flex items-center justify-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleCopy} className={cn("hover:bg-white/20", textColorClass)}>
          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          <span className="sr-only">Copy color</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleLock} className={cn("hover:bg-white/20", textColorClass)}>
          {color.isLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
          <span className="sr-only">{color.isLocked ? 'Unlock color' : 'Lock color'}</span>
        </Button>
      </div>
    </div>
  );
}
