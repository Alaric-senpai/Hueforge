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
  className?: string;
}

export function ColorColumn({ color, onToggleLock, onColorChange, className }: ColorColumnProps) {
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
      className={cn(
        "relative flex items-center justify-center transition-colors duration-500 rounded-lg overflow-hidden group cursor-pointer",
        className
      )}
      style={{ backgroundColor: color.hex }}
      onClick={() => !isEditing && setIsEditing(true)}
    >
      {isEditing ? (
          <Input
            ref={inputRef}
            type="text"
            value={inputValue.toUpperCase()}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleEditBlur}
            onKeyDown={handleKeyDown}
            className={cn(
                "w-32 bg-background/80 backdrop-blur-sm text-center font-mono text-2xl font-bold h-auto p-2 z-20",
                "border-2 rounded-lg"
            )}
        />
      ) : (
        <h2 className={cn("text-2xl font-bold font-mono", textColorClass)}>
            {color.hex.toUpperCase()}
        </h2>
      )}

      <div className={cn(
        "absolute bottom-2 right-2 z-10 flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity", 
        isEditing && "opacity-100"
      )}>
        <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); handleCopy();}} className={cn("hover:bg-white/20 h-8 w-8", textColorClass)}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">Copy color</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); onToggleLock();}} className={cn("hover:bg-white/20 h-8 w-8", textColorClass)}>
          {color.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          <span className="sr-only">{color.isLocked ? 'Unlock color' : 'Lock color'}</span>
        </Button>
      </div>
    </div>
  );
}
