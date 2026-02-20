'use client';

import {CursorComment} from '@/components/cursor-comment';
import {FloatingToolbar, useAnnotationsEnabled} from '@/components/floating-toolbar';

export function CursorToolbar() {
  const {enabled, toggle} = useAnnotationsEnabled();

  return (
    <>
      {enabled && <CursorComment />}
      <FloatingToolbar enabled={enabled} onToggle={toggle} />
    </>
  );
}
