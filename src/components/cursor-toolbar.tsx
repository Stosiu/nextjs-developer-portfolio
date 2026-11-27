'use client';

import {CursorComment} from '@/components/cursor-comment';
import {FloatingToolbar, useAnnotationsEnabled} from '@/components/floating-toolbar';

export function CursorToolbar({countryCount}: {countryCount: number}) {
  const {enabled, toggle} = useAnnotationsEnabled();

  return (
    <>
      {enabled && <CursorComment countryCount={countryCount} />}
      <FloatingToolbar enabled={enabled} onToggle={toggle} />
    </>
  );
}
