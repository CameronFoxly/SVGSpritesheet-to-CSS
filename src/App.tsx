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
      <header className="border-b px-6 py-3 flex items-center gap-3">
        <a
          href="https://github.com/CameronFoxly/SVGSpritesheet-to-CSS"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.338c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
          </svg>
        </a>
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
