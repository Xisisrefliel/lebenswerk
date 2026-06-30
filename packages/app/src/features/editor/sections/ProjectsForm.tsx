import type { SlotFormProps } from '../formRegistry.js';
import type { Project } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { Field } from '../../../ui/Field.js';
import { ListFormHeader } from '../../../ui/ListFormHeader.js';
import { ListItemCard } from '../../../ui/ListItemCard.js';
import { RichTextField } from '../../../ui/RichTextField.js';
import { TagInput } from '../../../ui/TagInput.js';
import { generateId } from '../../../utils/generateId.js';
import { SECTION_BY_ID } from '../sectionConfig.js';
import { useListSection } from '../useListSection.js';

function emptyProject(): Project {
  return {
    id: generateId('proj'),
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    highlights: [],
    keywords: [],
  };
}

const sectionDef = SECTION_BY_ID.get('projects');
const summarize = sectionDef?.summarize ?? (() => '');

export function ProjectsForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const { items, add, remove, patch } = useListSection<Project>('projects', emptyProject);

  return (
    <div className="flex flex-col gap-3">
      <ListFormHeader count={items.length} onAdd={add} />

      <div className="flex flex-col">
        {items.map((p) => (
          <ListItemCard
            key={p.id}
            summary={summarize(p as unknown as Record<string, unknown>, t)}
            defaultOpen={!p.name}
            onRemove={() => {
              remove(p.id);
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Field
                  label={t('projects.name')}
                  value={p.name}
                  onChange={(e) => {
                    patch(p.id, { name: e.target.value });
                  }}
                />
                <Field
                  label={t('projects.url')}
                  type="url"
                  value={p.url ?? ''}
                  onChange={(e) => {
                    patch(p.id, { url: e.target.value });
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Field
                  label={t('projects.startDate')}
                  placeholder="YYYY-MM"
                  value={p.startDate ?? ''}
                  onChange={(e) => {
                    patch(p.id, { startDate: e.target.value });
                  }}
                />
                <Field
                  label={t('projects.endDate')}
                  placeholder="YYYY-MM"
                  value={p.endDate ?? ''}
                  onChange={(e) => {
                    patch(p.id, { endDate: e.target.value });
                  }}
                />
              </div>
              <RichTextField
                label={t('projects.description')}
                value={p.description ?? ''}
                onChange={(html) => {
                  patch(p.id, { description: html });
                }}
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wider text-muted">
                  {t('projects.keywords')}
                </label>
                <TagInput
                  tags={p.keywords}
                  onChange={(keywords) => {
                    patch(p.id, { keywords });
                  }}
                  placeholder={t('projects.keywordsPlaceholder')}
                />
              </div>
            </div>
          </ListItemCard>
        ))}
      </div>
    </div>
  );
}
