import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SpriteConfig } from '@/lib/css-generator';
import { generateCSS } from '@/lib/css-generator';

interface CSSOutputProps {
  config: SpriteConfig;
}

export function CSSOutput({ config }: CSSOutputProps) {
  const css = useMemo(() => generateCSS(config), [config]);

  const handleCopy = async () => {
    if (!css) return;
    await navigator.clipboard.writeText(css);
  };

  const handleExport = () => {
    if (!css) return;
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sprite-animation.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Generated CSS</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!css}>
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={!css}>
              Export .css
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-auto max-h-[400px] font-mono whitespace-pre-wrap">
          {css || 'Configure settings to generate CSS...'}
        </pre>
      </CardContent>
    </Card>
  );
}
