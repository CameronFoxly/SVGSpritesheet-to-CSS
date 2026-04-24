import { useState, useMemo } from 'react';
import { SettingsPanel } from '@/components/SettingsPanel';
import { AnimationPreview } from '@/components/AnimationPreview';
import { CSSOutput } from '@/components/CSSOutput';
import type { HoldFrameEntry } from '@/components/SettingsPanel';
import type { SpriteConfig } from '@/lib/css-generator';

function App() {
  const [frameCount, setFrameCount] = useState(1);
  const [frameWidth, setFrameWidth] = useState(64);
  const [frameHeight, setFrameHeight] = useState(64);
  const [fps, setFps] = useState(12);
  const [holdFrames, setHoldFrames] = useState<HoldFrameEntry[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState('spritesheet.svg');

  const handleFileLoad = (url: string, fileName: string) => {
    setImageUrl(url);
    setImageFileName(fileName);
  };

  const config: SpriteConfig = useMemo(
    () => ({
      frameCount,
      frameWidth,
      frameHeight,
      fps,
      holdFrames: holdFrames.map((hf) => ({ frame: hf.frame, duration: hf.duration })),
      imageFileName,
    }),
    [frameCount, frameWidth, frameHeight, fps, holdFrames, imageFileName]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b px-6 py-3">
        <h1 className="text-xl font-bold">SVG Spritesheet → CSS</h1>
      </header>
      <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-screen-2xl mx-auto">
        {/* Left: Settings */}
        <aside className="w-full lg:w-80 shrink-0">
          <SettingsPanel
            frameCount={frameCount}
            setFrameCount={setFrameCount}
            frameWidth={frameWidth}
            setFrameWidth={setFrameWidth}
            frameHeight={frameHeight}
            setFrameHeight={setFrameHeight}
            fps={fps}
            setFps={setFps}
            holdFrames={holdFrames}
            setHoldFrames={setHoldFrames}
            onFileLoad={handleFileLoad}
          />
        </aside>
        {/* Right: Preview + Output */}
        <main className="flex-1 space-y-4 min-w-0">
          <AnimationPreview config={config} imageUrl={imageUrl} />
          <CSSOutput config={config} />
        </main>
      </div>
    </div>
  );
}

export default App;
