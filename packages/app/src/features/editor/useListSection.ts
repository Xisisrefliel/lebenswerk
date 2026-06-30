import type { Resume } from '@cv/core';
import { useCallback, useEffect, useRef } from 'react';
import { useResumeStore } from '../../state/resumeStore.js';

type ArrayKeys = {
  [K in keyof Resume]: Resume[K] extends readonly unknown[] ? K : never;
}[keyof Resume];

export function useListSection<T extends { id: string }>(key: ArrayKeys, emptyItem: () => T) {
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);

  const items = resume[key] as unknown as T[];

  const set = useCallback(
    (updated: T[]) => {
      setResume({ ...resume, [key]: updated });
    },
    [resume, key, setResume],
  );

  const add = useCallback(() => {
    set([...items, emptyItem()]);
  }, [items, set, emptyItem]);

  const remove = useCallback(
    (id: string) => {
      set(items.filter((i) => i.id !== id));
    },
    [items, set],
  );

  const patch = useCallback(
    (id: string, partial: Partial<T>) => {
      set(items.map((i) => (i.id === id ? { ...i, ...partial } : i)));
    },
    [items, set],
  );

  // Auto-add one empty entry when the list is empty on first render
  const didAutoAdd = useRef(false);
  useEffect(() => {
    if (items.length === 0 && !didAutoAdd.current) {
      didAutoAdd.current = true;
      add();
    }
  }, [items.length, add]);

  return { items, add, remove, patch };
}
