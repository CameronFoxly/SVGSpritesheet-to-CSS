import { useCallback, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export interface HoldFrameEntry {
  id: number;
  frame: number;
  duration: number;
}

interface SettingsPanelProps {
  frameCount: number;
  setFrameCount: (v: number) => void;
  frameWidth: number;
  setFrameWidth: (v: number) => void;
  frameHeight: number;
  setFrameHeight: (v: number) => void;
  fps: number;
  setFps: (v: number) => void;
  holdFrames: HoldFrameEntry[];
  setHoldFrames: (v: HoldFrameEntry[]) => void;
  onFileLoad: (url: string, fileName: string) => void;
}

export function SettingsPanel({
  frameCount,
  setFrameCount,
  frameWidth,
  setFrameWidth,
  frameHeight,
  setFrameHeight,
  fps,
  setFps,
  holdFrames,
  setHoldFrames,
  onFileLoad,
}: SettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const nextId = useRef(1);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.includes('svg')) return;
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      onFileLoad(url, file.name);
    },
    [onFileLoad]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.includes('svg')) return;
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      onFileLoad(url, file.name);
    },
    [onFileLoad]
  );

  const addHoldFrame = () => {
    setHoldFrames([
      ...holdFrames,
      { id: nextId.current++, frame: 1, duration: 1 },
    ]);
  };

  const updateHoldFrame = (id: number, field: 'frame' | 'duration', value: number) => {
    setHoldFrames(
      holdFrames.map((hf) => (hf.id === id ? { ...hf, [field]: value } : hf))
    );
  };

  const removeHoldFrame = (id: number) => {
    setHoldFrames(holdFrames.filter((hf) => hf.id !== id));
  };

  const totalDuration =
    fps > 0
      ? (() => {
          let logicalFrames = frameCount;
          for (const hf of holdFrames) {
            if (hf.frame >= 1 && hf.frame <= frameCount && hf.duration > 0) {
              logicalFrames += hf.duration;
            }
          }
          return logicalFrames / fps;
        })()
      : 0;

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div>
          <Label>SVG Spritesheet</Label>
          <div
            className="mt-1 border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
            />
            {fileName ? (
              <p className="text-sm text-foreground">{fileName}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Drop an SVG file here or click to browse
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Frame Settings */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="frameCount">Frame Count</Label>
            <Input
              id="frameCount"
              type="number"
              min={1}
              value={frameCount}
              onChange={(e) => setFrameCount(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <div>
            <Label htmlFor="fps">FPS</Label>
            <Input
              id="fps"
              type="number"
              min={1}
              max={120}
              value={fps}
              onChange={(e) => setFps(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <div>
            <Label htmlFor="frameWidth">Frame Width (px)</Label>
            <Input
              id="frameWidth"
              type="number"
              min={1}
              value={frameWidth}
              onChange={(e) => setFrameWidth(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <div>
            <Label htmlFor="frameHeight">Frame Height (px)</Label>
            <Input
              id="frameHeight"
              type="number"
              min={1}
              value={frameHeight}
              onChange={(e) => setFrameHeight(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Total duration: {totalDuration.toFixed(3)}s
        </div>

        <Separator />

        {/* Hold Frames */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Hold Frames</Label>
            <Button variant="outline" size="sm" onClick={addHoldFrame}>
              + Add Hold
            </Button>
          </div>
          {holdFrames.length === 0 && (
            <p className="text-sm text-muted-foreground">No hold frames added.</p>
          )}
          <div className="space-y-2">
            {holdFrames.map((hf) => (
              <div key={hf.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <Label className="text-xs">Frame #</Label>
                  <Input
                    type="number"
                    min={1}
                    max={frameCount}
                    value={hf.frame}
                    onChange={(e) =>
                      updateHoldFrame(hf.id, 'frame', Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Hold (frames)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={hf.duration}
                    onChange={(e) =>
                      updateHoldFrame(hf.id, 'duration', Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeHoldFrame(hf.id)}
                  className="text-destructive shrink-0"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
