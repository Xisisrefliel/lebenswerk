import type { SlotFormProps } from '../formRegistry.js';
import type { CustomSection } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../state/resumeStore.js';
import { Button } from '../../../ui/Button.js';
import { Field } from '../../../ui/Field.js';
import { RichTextField } from '../../../ui/RichTextField.js';
import { generateId } from '../../../utils/generateId.js';

function emptySection(): CustomSection {
  return { id: generateId('custom'), title: '', items: [] };
}

function emptyItem() {
  return { id: generateId('item'), heading: '', body: '' };
}

export function CustomSectionForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);

  const update = (sections: CustomSection[]) => {
    setResume({ ...resume, custom: sections });
  };
  const addSection = () => {
    update([...resume.custom, emptySection()]);
  };
  const removeSection = (id: string) => {
    update(resume.custom.filter((s) => s.id !== id));
  };
  const patchSection = (id: string, p: Partial<CustomSection>) => {
    update(resume.custom.map((s) => (s.id === id ? { ...s, ...p } : s)));
  };

  const addItem = (sectionId: string) => {
    update(
      resume.custom.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, emptyItem()] } : s,
      ),
    );
  };

  const removeItem = (sectionId: string, itemId: string) => {
    update(
      resume.custom.map((s) =>
        s.id === sectionId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s,
      ),
    );
  };

  const patchItem = (sectionId: string, itemId: string, p: { heading?: string; body?: string }) => {
    update(
      resume.custom.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.map((i) => (i.id === itemId ? { ...i, ...p } : i)) }
          : s,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {resume.custom.map((section) => (
        <div
          key={section.id}
          className="flex flex-col gap-2 border border-line-strong bg-canvas p-3"
        >
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Field
                label={t('custom.sectionTitle')}
                value={section.title}
                onChange={(e) => {
                  patchSection(section.id, { title: e.target.value });
                }}
              />
            </div>
            <Button
              variant="danger"
              size="sm"
              className="mb-1"
              onClick={() => {
                removeSection(section.id);
              }}
            >
              {t('actions.remove')}
            </Button>
          </div>

          {section.items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 border-l-2 border-line-strong pl-3">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Field
                    label={t('custom.itemHeading')}
                    value={item.heading ?? ''}
                    onChange={(e) => {
                      patchItem(section.id, item.id, { heading: e.target.value });
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    removeItem(section.id, item.id);
                  }}
                  className="mb-1 shrink-0 p-0.5 text-muted transition-colors hover:text-red-500"
                >
                  &times;
                </button>
              </div>
              <RichTextField
                label={t('custom.itemBody')}
                value={item.body}
                onChange={(html) => {
                  patchItem(section.id, item.id, { body: html });
                }}
              />
            </div>
          ))}

          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            onClick={() => {
              addItem(section.id);
            }}
          >
            + {t('custom.addItem')}
          </Button>
        </div>
      ))}

      <Button variant="secondary" size="sm" className="self-start" onClick={addSection}>
        + {t('custom.addSection')}
      </Button>
    </div>
  );
}
