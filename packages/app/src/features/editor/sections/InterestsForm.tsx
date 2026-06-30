import type { SlotFormProps } from '../formRegistry.js';
import type { Interest } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../ui/Button.js';
import { Field } from '../../../ui/Field.js';
import { ListFormHeader } from '../../../ui/ListFormHeader.js';
import { generateId } from '../../../utils/generateId.js';
import { useListSection } from '../useListSection.js';

function emptyInterest(): Interest {
  return {
    id: generateId('int'),
    name: '',
    keywords: [],
  };
}

export function InterestsForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const { items, add, remove, patch } = useListSection<Interest>('interests', emptyInterest);

  return (
    <div className="flex flex-col gap-3">
      <ListFormHeader count={items.length} onAdd={add} />

      <div className="flex flex-col gap-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-end gap-2">
            <div className="flex-1">
              <Field
                label={t('interests.name')}
                value={i.name}
                onChange={(e) => {
                  patch(i.id, { name: e.target.value });
                }}
              />
            </div>
            <Button
              variant="danger"
              size="sm"
              className="mb-1"
              onClick={() => {
                remove(i.id);
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
