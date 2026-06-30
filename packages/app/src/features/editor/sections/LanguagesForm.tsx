import type { SlotFormProps } from '../formRegistry.js';
import type { Language } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../ui/Button.js';
import { Field } from '../../../ui/Field.js';
import { ListFormHeader } from '../../../ui/ListFormHeader.js';
import { Select } from '../../../ui/Select.js';
import { generateId } from '../../../utils/generateId.js';
import { useListSection } from '../useListSection.js';

const FLUENCY_LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'native'] as const;

function emptyLanguage(): Language {
  return {
    id: generateId('lang'),
    language: '',
    fluency: 'b1',
  };
}

export function LanguagesForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const { items, add, remove, patch } = useListSection<Language>('languages', emptyLanguage);

  const fluencyOptions = FLUENCY_LEVELS.map((f) => ({
    value: f,
    label: t(`languages.fluency_${f}`),
  }));

  return (
    <div className="flex flex-col gap-3">
      <ListFormHeader count={items.length} onAdd={add} />

      <div className="flex flex-col gap-2">
        {items.map((l) => (
          <div key={l.id} className="flex items-end gap-2">
            <div className="flex-1">
              <Field
                label={t('languages.language')}
                value={l.language}
                onChange={(e) => {
                  patch(l.id, { language: e.target.value });
                }}
              />
            </div>
            <Select
              label={t('languages.fluency')}
              value={l.fluency ?? 'b1'}
              onChange={(e) => {
                patch(l.id, { fluency: e.target.value as Language['fluency'] });
              }}
              options={fluencyOptions}
            />
            <Button
              variant="danger"
              size="sm"
              className="mb-1"
              onClick={() => {
                remove(l.id);
              }}
            >
              {t('actions.remove')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
