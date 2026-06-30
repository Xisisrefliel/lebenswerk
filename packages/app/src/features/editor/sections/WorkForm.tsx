import type { SlotFormProps } from '../formRegistry.js';
import type { Work } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { Field } from '../../../ui/Field.js';
import { ListFormHeader } from '../../../ui/ListFormHeader.js';
import { ListItemCard } from '../../../ui/ListItemCard.js';
import { RichTextField } from '../../../ui/RichTextField.js';
import { Toggle } from '../../../ui/Toggle.js';
import { generateId } from '../../../utils/generateId.js';
import { SECTION_BY_ID } from '../sectionConfig.js';
import { useListSection } from '../useListSection.js';

function emptyWork(): Work {
  return {
    id: generateId('work'),
    name: '',
    position: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    summary: '',
    highlights: [],
    location: '',
  };
}

const sectionDef = SECTION_BY_ID.get('experience');
const summarize = sectionDef?.summarize ?? (() => '');

export function WorkForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const { items, add, remove, patch } = useListSection<Work>('work', emptyWork);

  return (
    <div className="flex flex-col gap-3">
      <ListFormHeader count={items.length} onAdd={add} />

      <div className="flex flex-col">
        {items.map((w) => (
          <ListItemCard
            key={w.id}
            summary={summarize(w as unknown as Record<string, unknown>, t)}
            defaultOpen={!w.name && !w.position}
            onRemove={() => {
              remove(w.id);
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label={t('work.position')}
                  value={w.position ?? ''}
                  onChange={(e) => {
                    patch(w.id, { position: e.target.value });
                  }}
                />
                <Field
                  label={t('work.company')}
                  value={w.name}
                  onChange={(e) => {
                    patch(w.id, { name: e.target.value });
                  }}
                />
              </div>

              <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
                <Field
                  label={t('work.startDate')}
                  placeholder="YYYY-MM"
                  value={w.startDate ?? ''}
                  onChange={(e) => {
                    patch(w.id, { startDate: e.target.value });
                  }}
                />
                <Field
                  label={t('work.endDate')}
                  placeholder="YYYY-MM"
                  value={w.endDate ?? ''}
                  disabled={w.currentlyWorking}
                  onChange={(e) => {
                    patch(w.id, { endDate: e.target.value });
                  }}
                />
                <div className="pb-1">
                  <Toggle
                    checked={w.currentlyWorking}
                    onChange={(checked) => {
                      patch(w.id, {
                        currentlyWorking: checked,
                        ...(checked ? { endDate: '' } : {}),
                      });
                    }}
                    label={t('work.currentlyWorking')}
                  />
                </div>
              </div>

              <Field
                label={t('work.location')}
                value={w.location ?? ''}
                onChange={(e) => {
                  patch(w.id, { location: e.target.value });
                }}
              />

              <RichTextField
                label={t('work.description')}
                value={w.summary ?? ''}
                onChange={(html) => {
                  patch(w.id, { summary: html });
                }}
              />
            </div>
          </ListItemCard>
        ))}
      </div>
    </div>
  );
}
