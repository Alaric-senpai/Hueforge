import { Header } from "@/components/layout/header";
import { PaletteGenerator } from "@/components/palette-generator";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <PaletteGenerator />
    </div>
  );
}
