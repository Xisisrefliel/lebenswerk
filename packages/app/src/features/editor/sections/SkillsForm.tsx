import type { SlotFormProps } from '../formRegistry.js';
import type { Skill, SkillChild } from '@cv/core';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../state/resumeStore.js';
import { Button } from '../../../ui/Button.js';
import { Field } from '../../../ui/Field.js';
import { ToggleGroup } from '../../../ui/ToggleGroup.js';
import { generateId } from '../../../utils/generateId.js';
import { useSlotComponentOption } from '../useSlotComponentOption.js';

function GripIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="5.5" cy="4" r="1.2" />
      <circle cx="10.5" cy="4" r="1.2" />
      <circle cx="5.5" cy="8" r="1.2" />
      <circle cx="10.5" cy="8" r="1.2" />
      <circle cx="5.5" cy="12" r="1.2" />
      <circle cx="10.5" cy="12" r="1.2" />
    </svg>
  );
}

function emptyFlatSkill(): Skill {
  return { id: generateId('skill'), name: '', level: 40, keywords: [], children: [] };
}

function emptyGroup(): Skill {
  return { id: generateId('skill'), name: '', keywords: [], children: [emptyChild()] };
}

function emptyChild(): SkillChild {
  return { id: generateId('sc'), name: '', level: 40 };
}

function isGroup(s: Skill): boolean {
  return s.children.length > 0;
}

const COLUMN_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
] as const;

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => void;
};

export function SkillsForm({ slotName, componentId }: SlotFormProps) {
  const { t } = useTranslation();
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);
  const rowDrag = useRef<RowDragState | null>(null);
  const [columnsStr, setColumnsStr] = useSlotComponentOption(
    slotName,
    componentId,
    'columns',
    'auto',
  );

  const updateSkills = (items: Skill[], animate = false) => {
    const apply = () => {
      setResume({ ...resume, skills: items });
    };
    const viewTransitionDocument = document as ViewTransitionDocument;

    if (animate && viewTransitionDocument.startViewTransition) {
      viewTransitionDocument.startViewTransition(apply);
      return;
    }

    apply();
  };
  const addFlat = () => {
    updateSkills([...resume.skills, emptyFlatSkill()]);
  };
  const addGroup = () => {
    updateSkills([...resume.skills, emptyGroup()]);
  };
  const remove = (id: string) => {
    updateSkills(resume.skills.filter((s) => s.id !== id));
  };
  const patch = (id: string, p: Partial<Skill>) => {
    updateSkills(resume.skills.map((s) => (s.id === id ? { ...s, ...p } : s)));
  };

  const addChild = (groupId: string) => {
    updateSkills(
      resume.skills.map((s) =>
        s.id === groupId ? { ...s, children: [...s.children, emptyChild()] } : s,
      ),
    );
  };

  const removeChild = (groupId: string, childId: string) => {
    updateSkills(
      resume.skills.map((s) =>
        s.id === groupId ? { ...s, children: s.children.filter((c) => c.id !== childId) } : s,
      ),
    );
  };

  const patchChild = (groupId: string, childId: string, p: Partial<SkillChild>) => {
    updateSkills(
      resume.skills.map((s) =>
        s.id === groupId
          ? { ...s, children: s.children.map((c) => (c.id === childId ? { ...c, ...p } : c)) }
          : s,
      ),
    );
  };

  const reorderSkills = (from: number, to: number) => {
    if (from === to) return;
    const next = resume.skills.slice();
    const [moved] = next.splice(from, 1);
    if (moved) next.splice(to, 0, moved);
    updateSkills(next, true);
  };

  const reorderChildren = (groupId: string, from: number, to: number) => {
    if (from === to) return;
    const nextSkills = resume.skills.map((s) => {
      if (s.id !== groupId) return s;
      const next = s.children.slice();
      const [moved] = next.splice(from, 1);
      if (moved) next.splice(to, 0, moved);
      return { ...s, children: next };
    });

    updateSkills(nextSkills, true);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <Button variant="secondary" size="sm" onClick={addFlat}>
            + {t('skills.addSkill')}
          </Button>
          <Button variant="secondary" size="sm" onClick={addGroup}>
            + {t('skills.addGroup')}
          </Button>
        </div>
      </div>

      {slotName === 'main' && (
        <div className="flex flex-wrap items-center gap-3">
          <ToggleGroup
            options={COLUMN_OPTIONS as unknown as { value: string; label: string }[]}
            value={columnsStr}
            onChange={setColumnsStr}
          />
        </div>
      )}

      {resume.skills.length === 0 && (
        <div className="py-6 text-center text-sm text-muted/70">
          {t('editor.noEntries', { defaultValue: 'No entries yet.' })}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {resume.skills.map((skill, i) =>
          isGroup(skill) ? (
            <GroupRow
              key={skill.id}
              skill={skill}
              index={i}
              dragRef={rowDrag}
              onReorder={reorderSkills}
              onPatch={patch}
              onRemove={remove}
              onAddChild={addChild}
              onRemoveChild={removeChild}
              onPatchChild={patchChild}
              onReorderChild={reorderChildren}
            />
          ) : (
            <FlatRow
              key={skill.id}
              skill={skill}
              index={i}
              dragRef={rowDrag}
              onReorder={reorderSkills}
              onPatch={patch}
              onRemove={remove}
            />
          ),
        )}
      </div>
    </div>
  );
}

type RowDragState = { from: number; type: 'flat' | 'group' };
type MutableRef<T> = { current: T };

function FlatRow({
  skill,
  index,
  dragRef,
  onReorder,
  onPatch,
  onRemove,
}: {
  skill: Skill;
  index: number;
  dragRef: MutableRef<RowDragState | null>;
  onReorder: (from: number, to: number) => void;
  onPatch: (id: string, p: Partial<Skill>) => void;
  onRemove: (id: string) => void;
}) {
  const { t } = useTranslation();
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [over, setOver] = useState(false);

  return (
    <div
      ref={rowRef}
      className={`flex items-end gap-2 rounded-md border border-transparent p-1.5 transition-all ${over ? 'border-blue/50 bg-white/[0.04]' : ''} ${dragging ? 'scale-[0.99] border-blue/50 bg-white/[0.06] opacity-60 shadow-lg shadow-black/20' : ''}`}
      style={{ viewTransitionName: `skill-${skill.id}` }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
        const data = dragRef.current;
        if (data && data.from !== index) {
          onReorder(data.from, index);
          dragRef.current = { ...data, from: index };
        }
      }}
      onDragLeave={() => {
        setOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        dragRef.current = null;
      }}
    >
      <div
        draggable
        onDragStart={(e) => {
          dragRef.current = { from: index, type: 'flat' };
          setDragging(true);
          if (rowRef.current) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setDragImage(rowRef.current, 12, 18);
          }
        }}
        onDragEnd={() => {
          dragRef.current = null;
          setDragging(false);
          setOver(false);
        }}
        title={t('actions.dragToSort', { defaultValue: 'Drag to sort' })}
        className="mb-1.5 flex h-9 w-5 shrink-0 cursor-grab items-center justify-center text-muted/60 transition-colors hover:text-ink active:cursor-grabbing"
      >
        <GripIcon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1">
        <Field
          label={t('skills.name')}
          value={skill.name}
          onChange={(e) => {
            onPatch(skill.id, { name: e.target.value });
          }}
        />
      </div>
      <Button
        variant="danger"
        size="sm"
        className="mb-1"
        onClick={() => {
          onRemove(skill.id);
        }}
      >
        {t('actions.remove')}
      </Button>
    </div>
  );
}

function GroupRow({
  skill,
  index,
  dragRef,
  onReorder,
  onPatch,
  onRemove,
  onAddChild,
  onRemoveChild,
  onPatchChild,
  onReorderChild,
}: {
  skill: Skill;
  index: number;
  dragRef: MutableRef<RowDragState | null>;
  onReorder: (from: number, to: number) => void;
  onPatch: (id: string, p: Partial<Skill>) => void;
  onRemove: (id: string) => void;
  onAddChild: (groupId: string) => void;
  onRemoveChild: (groupId: string, childId: string) => void;
  onPatchChild: (groupId: string, childId: string, p: Partial<SkillChild>) => void;
  onReorderChild: (groupId: string, from: number, to: number) => void;
}) {
  const { t } = useTranslation();
  const rowRef = useRef<HTMLDivElement | null>(null);
  const childDrag = useRef<{ from: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [over, setOver] = useState(false);

  return (
    <div
      ref={rowRef}
      className={`flex flex-col gap-2.5 rounded-lg border border-line-strong bg-white/[0.02] p-3.5 transition-all ${over ? 'border-blue/60 bg-white/[0.04]' : ''} ${dragging ? 'scale-[0.99] border-blue/60 bg-white/[0.06] opacity-60 shadow-lg shadow-black/20' : ''}`}
      style={{ viewTransitionName: `skill-${skill.id}` }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
        const data = dragRef.current;
        if (data && data.from !== index) {
          onReorder(data.from, index);
          dragRef.current = { ...data, from: index };
        }
      }}
      onDragLeave={() => {
        setOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        dragRef.current = null;
      }}
    >
      <div className="flex items-end gap-2">
        <div
          draggable
          onDragStart={(e) => {
            dragRef.current = { from: index, type: 'group' };
            setDragging(true);
            if (rowRef.current) {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setDragImage(rowRef.current, 12, 22);
            }
          }}
          onDragEnd={() => {
            dragRef.current = null;
            setDragging(false);
            setOver(false);
          }}
          title={t('actions.dragToSort', { defaultValue: 'Drag to sort' })}
          className="mb-1.5 flex h-9 w-5 shrink-0 cursor-grab items-center justify-center text-muted/60 transition-colors hover:text-ink active:cursor-grabbing"
        >
          <GripIcon className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1">
          <Field
            label={t('skills.groupName')}
            value={skill.name}
            onChange={(e) => {
              onPatch(skill.id, { name: e.target.value });
            }}
          />
        </div>
        <Button
          variant="danger"
          size="sm"
          className="mb-1"
          onClick={() => {
            onRemove(skill.id);
          }}
        >
          {t('actions.remove')}
        </Button>
      </div>

      <div className="flex flex-col gap-1.5 border-l-2 border-line-strong pl-3">
        {skill.children.map((child, ci) => (
          <ChildRow
            key={child.id}
            child={child}
            index={ci}
            groupId={skill.id}
            dragRef={childDrag}
            onReorder={onReorderChild}
            onPatch={onPatchChild}
            onRemove={onRemoveChild}
          />
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => {
            onAddChild(skill.id);
          }}
        >
          + {t('skills.addChild')}
        </Button>
      </div>
    </div>
  );
}

function ChildRow({
  child,
  index,
  groupId,
  dragRef,
  onReorder,
  onPatch,
  onRemove,
}: {
  child: SkillChild;
  index: number;
  groupId: string;
  dragRef: MutableRef<{ from: number } | null>;
  onReorder: (groupId: string, from: number, to: number) => void;
  onPatch: (groupId: string, childId: string, p: Partial<SkillChild>) => void;
  onRemove: (groupId: string, childId: string) => void;
}) {
  const { t } = useTranslation();
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [over, setOver] = useState(false);

  return (
    <div
      ref={rowRef}
      className={`flex items-center gap-2 rounded-md border border-transparent p-1 transition-all ${over ? 'border-blue/40 bg-white/[0.05]' : ''} ${dragging ? 'scale-[0.99] border-blue/40 bg-white/[0.07] opacity-60 shadow-md shadow-black/15' : ''}`}
      style={{ viewTransitionName: `skill-child-${child.id}` }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
        const data = dragRef.current;
        if (data && data.from !== index) {
          onReorder(groupId, data.from, index);
          dragRef.current = { from: index };
        }
      }}
      onDragLeave={() => {
        setOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        dragRef.current = null;
      }}
    >
      <div
        draggable
        onDragStart={(e) => {
          dragRef.current = { from: index };
          setDragging(true);
          if (rowRef.current) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setDragImage(rowRef.current, 10, 15);
          }
        }}
        onDragEnd={() => {
          dragRef.current = null;
          setDragging(false);
          setOver(false);
        }}
        title={t('actions.dragToSort', { defaultValue: 'Drag to sort' })}
        className="flex h-7 w-4 shrink-0 cursor-grab items-center justify-center text-muted/60 transition-colors hover:text-ink active:cursor-grabbing"
      >
        <GripIcon className="h-3 w-3" />
      </div>
      <input
        type="text"
        value={child.name}
        onChange={(e) => {
          onPatch(groupId, child.id, { name: e.target.value });
        }}
        placeholder={t('skills.childPlaceholder')}
        className="min-w-0 flex-1 rounded-md border border-line-strong bg-white/[0.03] px-2.5 py-1.5 text-sm text-ink transition-colors hover:border-white/25 focus:border-blue focus:outline-none placeholder:text-muted/70"
      />
      <button
        type="button"
        onClick={() => {
          onRemove(groupId, child.id);
        }}
        className="shrink-0 rounded p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-red"
      >
        &times;
      </button>
    </div>
  );
}
