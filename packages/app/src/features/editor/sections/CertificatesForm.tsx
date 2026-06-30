import type { SlotFormProps } from '../formRegistry.js';
import type { Certificate } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { Field } from '../../../ui/Field.js';
import { ListFormHeader } from '../../../ui/ListFormHeader.js';
import { ListItemCard } from '../../../ui/ListItemCard.js';
import { generateId } from '../../../utils/generateId.js';
import { SECTION_BY_ID } from '../sectionConfig.js';
import { useListSection } from '../useListSection.js';

function emptyCertificate(): Certificate {
  return {
    id: generateId('cert'),
    name: '',
    issuer: '',
    date: '',
  };
}

const sectionDef = SECTION_BY_ID.get('certificates');
const summarize = sectionDef?.summarize ?? (() => '');

export function CertificatesForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const { items, add, remove, patch } = useListSection<Certificate>(
    'certificates',
    emptyCertificate,
  );

  return (
    <div className="flex flex-col gap-3">
      <ListFormHeader count={items.length} onAdd={add} />

      <div className="flex flex-col">
        {items.map((c) => (
          <ListItemCard
            key={c.id}
            summary={summarize(c as unknown as Record<string, unknown>, t)}
            defaultOpen={!c.name}
            onRemove={() => {
              remove(c.id);
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label={t('certificates.name')}
                  value={c.name}
                  onChange={(e) => {
                    patch(c.id, { name: e.target.value });
                  }}
                />
                <Field
                  label={t('certificates.issuer')}
                  value={c.issuer ?? ''}
                  onChange={(e) => {
                    patch(c.id, { issuer: e.target.value });
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label={t('certificates.date')}
                  placeholder="YYYY-MM"
                  value={c.date ?? ''}
                  onChange={(e) => {
                    patch(c.id, { date: e.target.value });
                  }}
                />
                <Field
                  label={t('certificates.url')}
                  type="url"
                  value={c.url ?? ''}
                  onChange={(e) => {
                    patch(c.id, { url: e.target.value });
                  }}
                />
              </div>
            </div>
          </ListItemCard>
        ))}
      </div>
    </div>
  );
}
