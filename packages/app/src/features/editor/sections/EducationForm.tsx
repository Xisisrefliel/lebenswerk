import type { SlotFormProps } from '../formRegistry.js';
import type { Education } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { Field } from '../../../ui/Field.js';
import { ListFormHeader } from '../../../ui/ListFormHeader.js';
import { ListItemCard } from '../../../ui/ListItemCard.js';
import { RichTextField } from '../../../ui/RichTextField.js';
import { generateId } from '../../../utils/generateId.js';
import { SECTION_BY_ID } from '../sectionConfig.js';
import { useListSection } from '../useListSection.js';

function emptyEducation(): Education {
  return {
    id: generateId('edu'),
    institution: '',
    area: '',
    studyType: '',
    startDate: '',
    endDate: '',
    courses: [],
  };
}

const sectionDef = SECTION_BY_ID.get('education');
const summarize = sectionDef?.summarize ?? (() => '');

export function EducationForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const { items, add, remove, patch } = useListSection<Education>('education', emptyEducation);

  return (
    <div className="flex flex-col gap-3">
      <ListFormHeader count={items.length} onAdd={add} />

      <div className="flex flex-col">
        {items.map((e) => (
          <ListItemCard
            key={e.id}
            summary={summarize(e as unknown as Record<string, unknown>, t)}
            defaultOpen={!e.institution && !e.studyType}
            onRemove={() => {
              remove(e.id);
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label={t('education.degree')}
                  value={e.studyType ?? ''}
                  onChange={(ev) => {
                    patch(e.id, { studyType: ev.target.value });
                  }}
                />
                <Field
                  label={t('education.institution')}
                  value={e.institution}
                  onChange={(ev) => {
                    patch(e.id, { institution: ev.target.value });
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label={t('education.fieldOfStudy')}
                  value={e.area ?? ''}
                  onChange={(ev) => {
                    patch(e.id, { area: ev.target.value });
                  }}
                />
                <Field
                  label={t('education.grade')}
                  value={e.score ?? ''}
                  onChange={(ev) => {
                    patch(e.id, { score: ev.target.value });
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label={t('education.startDate')}
                  placeholder="YYYY-MM"
                  value={e.startDate ?? ''}
                  onChange={(ev) => {
                    patch(e.id, { startDate: ev.target.value });
                  }}
                />
                <Field
                  label={t('education.endDate')}
                  placeholder="YYYY-MM"
                  value={e.endDate ?? ''}
                  onChange={(ev) => {
                    patch(e.id, { endDate: ev.target.value });
                  }}
                />
              </div>
              <Field
                label={t('education.location')}
                value={e.location ?? ''}
                onChange={(ev) => {
                  patch(e.id, { location: ev.target.value });
                }}
              />
              <RichTextField
                label={t('education.description')}
                value={e.description ?? ''}
                onChange={(html) => {
                  patch(e.id, { description: html });
                }}
              />
            </div>
          </ListItemCard>
        ))}
      </div>
    </div>
  );
}
