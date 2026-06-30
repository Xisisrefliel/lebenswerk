import type { SlotFormProps } from '../formRegistry.js';
import type { Skill, SkillChild } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../state/resumeStore.js';
import { Button } from '../../../ui/Button.js';
import { Field } from '../../../ui/Field.js';
import { ToggleGroup } from '../../../ui/ToggleGroup.js';
import { generateId } from '../../../utils/generateId.js';
import { useSlotComponentOption } from '../useSlotComponentOption.js';

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

export function SkillsForm({ slotName, componentId }: SlotFormProps) {
  const { t } = useTranslation();
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);
  const [columnsStr, setColumnsStr] = useSlotComponentOption(
    slotName,
    componentId,
    'columns',
    'auto',
  );

  const updateSkills = (items: Skill[]) => {
    setResume({ ...resume, skills: items });
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
        <div className="py-4 text-center text-xs uppercase tracking-wider text-muted">
          {t('editor.noEntries', { defaultValue: 'No entries yet.' })}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {resume.skills.map((skill) =>
          isGroup(skill) ? (
            <div
              key={skill.id}
              className="flex flex-col gap-2 border border-line-strong bg-canvas p-3"
            >
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Field
                    label={t('skills.groupName')}
                    value={skill.name}
                    onChange={(e) => {
                      patch(skill.id, { name: e.target.value });
                    }}
                  />
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  className="mb-1"
                  onClick={() => {
                    remove(skill.id);
                  }}
                >
                  {t('actions.remove')}
                </Button>
              </div>

              <div className="flex flex-col gap-1.5 border-l-2 border-line-strong pl-3">
                {skill.children.map((child) => (
                  <div key={child.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={child.name}
                      onChange={(e) => {
                        patchChild(skill.id, child.id, { name: e.target.value });
                      }}
                      placeholder={t('skills.childPlaceholder')}
                      className="min-w-0 flex-1 border border-line-strong bg-surface px-2 py-1 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        removeChild(skill.id, child.id);
                      }}
                      className="shrink-0 p-0.5 text-muted transition-colors hover:text-red-500"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="self-start"
                  onClick={() => {
                    addChild(skill.id);
                  }}
                >
                  + {t('skills.addChild')}
                </Button>
              </div>
            </div>
          ) : (
            <div key={skill.id} className="flex items-end gap-2">
              <div className="flex-1">
                <Field
                  label={t('skills.name')}
                  value={skill.name}
                  onChange={(e) => {
                    patch(skill.id, { name: e.target.value });
                  }}
                />
              </div>
              <Button
                variant="danger"
                size="sm"
                className="mb-1"
                onClick={() => {
                  remove(skill.id);
                }}
              >
                {t('actions.remove')}
              </Button>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
