export interface HoldFrame {
  frame: number; // 1-based frame number
  duration: number; // hold duration in frames (at the project FPS)
}

export interface SpriteConfig {
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  fps: number;
  holdFrames: HoldFrame[];
  imageFileName: string;
}

export function generateCSS(config: SpriteConfig): string {
  const { frameCount, frameWidth, frameHeight, fps, holdFrames, imageFileName } = config;
  if (frameCount <= 0 || frameWidth <= 0 || frameHeight <= 0 || fps <= 0) return '';

  const totalSheetHeight = frameCount * frameHeight;

  // Build a map of frame number -> hold duration (in extra frames)
  const holdMap = new Map<number, number>();
  for (const hf of holdFrames) {
    if (hf.frame >= 1 && hf.frame <= frameCount && hf.duration > 0) {
      holdMap.set(hf.frame, hf.duration);
    }
  }

  const hasHolds = holdMap.size > 0;

  if (!hasHolds) {
    // Simple steps() animation - no hold frames
    const duration = frameCount / fps;
    return `.sprite {
  width: ${frameWidth}px;
  height: ${frameHeight}px;
  background-image: url('${imageFileName}');
  background-size: ${frameWidth}px ${totalSheetHeight}px;
  background-repeat: no-repeat;
  animation: sprite-anim ${duration.toFixed(4)}s steps(${frameCount}) infinite;
}

@keyframes sprite-anim {
  from { background-position: 0 0; }
  to { background-position: 0 -${totalSheetHeight}px; }
}`;
  }

  // Complex keyframes with hold frames
  // Total "logical frames" = normal frames (1 each) + extra hold frames
  let totalLogicalFrames = 0;
  for (let i = 1; i <= frameCount; i++) {
    totalLogicalFrames += 1 + (holdMap.get(i) ?? 0);
  }

  const duration = totalLogicalFrames / fps;

  // Build keyframe stops
  // Each frame occupies a percentage range. We use steps(1) so the
  // background jumps at each keyframe stop.
  const lines: string[] = [];
  let logicalIndex = 0;

  for (let i = 1; i <= frameCount; i++) {
    const pct = ((logicalIndex / totalLogicalFrames) * 100);
    const yOffset = -(i - 1) * frameHeight;
    lines.push(`  ${pct.toFixed(4)}% { background-position: 0 ${yOffset}px; }`);
    logicalIndex += 1 + (holdMap.get(i) ?? 0);
  }

  // Final stop to loop cleanly
  lines.push(`  100% { background-position: 0 -${totalSheetHeight}px; }`);

  return `.sprite {
  width: ${frameWidth}px;
  height: ${frameHeight}px;
  background-image: url('${imageFileName}');
  background-size: ${frameWidth}px ${totalSheetHeight}px;
  background-repeat: no-repeat;
  animation: sprite-anim ${duration.toFixed(4)}s steps(1) infinite;
}

@keyframes sprite-anim {
${lines.join('\n')}
}`;
}

export function generatePreviewStyle(
  config: SpriteConfig,
  imageUrl: string,
  playMode: 'loop' | 'once' | 'paused'
): React.CSSProperties & Record<string, string> {
  const { frameCount, frameWidth, frameHeight, fps, holdFrames } = config;
  if (frameCount <= 0 || frameWidth <= 0 || frameHeight <= 0 || fps <= 0) {
    return {} as React.CSSProperties & Record<string, string>;
  }

  const totalSheetHeight = frameCount * frameHeight;

  const holdMap = new Map<number, number>();
  for (const hf of holdFrames) {
    if (hf.frame >= 1 && hf.frame <= frameCount && hf.duration > 0) {
      holdMap.set(hf.frame, hf.duration);
    }
  }

  const hasHolds = holdMap.size > 0;

  let totalLogicalFrames = frameCount;
  if (hasHolds) {
    totalLogicalFrames = 0;
    for (let i = 1; i <= frameCount; i++) {
      totalLogicalFrames += 1 + (holdMap.get(i) ?? 0);
    }
  }

  const duration = totalLogicalFrames / fps;
  const iterationCount = playMode === 'once' ? '1' : 'infinite';
  const playState = playMode === 'paused' ? 'paused' : 'running';

  const timingFunction = hasHolds ? 'steps(1)' : `steps(${frameCount})`;

  return {
    width: `${frameWidth}px`,
    height: `${frameHeight}px`,
    backgroundImage: `url('${imageUrl}')`,
    backgroundSize: `${frameWidth}px ${totalSheetHeight}px`,
    backgroundRepeat: 'no-repeat',
    animationName: 'sprite-anim',
    animationDuration: `${duration.toFixed(4)}s`,
    animationTimingFunction: timingFunction,
    animationIterationCount: iterationCount,
    animationPlayState: playState,
    animationFillMode: 'none',
  } as React.CSSProperties & Record<string, string>;
}

export function generatePreviewKeyframes(config: SpriteConfig): string {
  const { frameCount, frameHeight, holdFrames } = config;
  if (frameCount <= 0 || frameHeight <= 0) return '';

  const totalSheetHeight = frameCount * frameHeight;

  const holdMap = new Map<number, number>();
  for (const hf of holdFrames) {
    if (hf.frame >= 1 && hf.frame <= frameCount && hf.duration > 0) {
      holdMap.set(hf.frame, hf.duration);
    }
  }

  const hasHolds = holdMap.size > 0;

  if (!hasHolds) {
    return `@keyframes sprite-anim {
  from { background-position: 0 0; }
  to { background-position: 0 -${totalSheetHeight}px; }
}`;
  }

  let totalLogicalFrames = 0;
  for (let i = 1; i <= frameCount; i++) {
    totalLogicalFrames += 1 + (holdMap.get(i) ?? 0);
  }

  const lines: string[] = [];
  let logicalIndex = 0;
  for (let i = 1; i <= frameCount; i++) {
    const pct = ((logicalIndex / totalLogicalFrames) * 100);
    const yOffset = -(i - 1) * frameHeight;
    lines.push(`  ${pct.toFixed(4)}% { background-position: 0 ${yOffset}px; }`);
    logicalIndex += 1 + (holdMap.get(i) ?? 0);
  }
  lines.push(`  100% { background-position: 0 -${totalSheetHeight}px; }`);

  return `@keyframes sprite-anim {
${lines.join('\n')}
}`;
}
