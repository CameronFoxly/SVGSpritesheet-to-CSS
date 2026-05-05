import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { SpriteConfig } from '@/lib/css-generator';
import { generatePreviewKeyframes, generatePreviewStyle } from '@/lib/css-generator';

type PlayMode = 'loop' | 'once' | 'paused';

interface AnimationPreviewProps {
  config: SpriteConfig;
  imageUrl: string | null;
}

export function AnimationPreview({ config, imageUrl }: AnimationPreviewProps) {
  const [playMode, setPlayMode] = useState<PlayMode>('loop');
  const [animKey, setAnimKey] = useState(0);
  const [zoom, setZoom] = useState(1);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  const keyframesCSS = useMemo(
    () => generatePreviewKeyframes(config),
    [config]
  );

  const previewStyle = useMemo(
    () =>
      imageUrl
        ? generatePreviewStyle(config, imageUrl, playMode)
        : null,
    [config, imageUrl, playMode]
  );

  // Inject keyframes into a <style> tag
  useEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.createElement('style');
      document.head.appendChild(styleRef.current);
    }
    styleRef.current.textContent = keyframesCSS;
    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [keyframesCSS]);

  const handlePlayOnce = () => {
    setPlayMode('once');
    setAnimKey((k) => k + 1);
  };

  const handleLoop = () => {
    setPlayMode('loop');
    setAnimKey((k) => k + 1);
  };

  const handlePause = () => {
    setPlayMode('paused');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview Area */}
        <div className="flex items-center justify-center min-h-[200px] bg-[repeating-conic-gradient(#e5e5e5_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] rounded-lg border p-4 overflow-auto">
          {imageUrl && previewStyle ? (
            <div
              key={animKey}
              style={{
                ...previewStyle,
                transform: `scale(${zoom})`,
                transformOrigin: 'center',
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Import an SVG spritesheet to preview
            </p>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground shrink-0 w-12">{zoom.toFixed(1)}x</span>
          <Slider
            min={0.5}
            max={10}
            step={0.5}
            value={[zoom]}
            onValueChange={(val) => setZoom(Array.isArray(val) ? val[0] : val)}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(1)}
            disabled={zoom === 1}
          >
            Reset
          </Button>
        </div>

        {/* Transport Controls */}
        <div className="flex gap-2 justify-center">
          <Button
            variant={playMode === 'once' ? 'default' : 'outline'}
            size="sm"
            onClick={handlePlayOnce}
          >
            Play Once
          </Button>
          <Button
            variant={playMode === 'loop' ? 'default' : 'outline'}
            size="sm"
            onClick={handleLoop}
          >
            Loop
          </Button>
          <Button
            variant={playMode === 'paused' ? 'default' : 'outline'}
            size="sm"
            onClick={handlePause}
          >
            Pause
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
