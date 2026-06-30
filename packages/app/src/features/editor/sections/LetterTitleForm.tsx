import type { SlotFormProps } from '../formRegistry.js';
import { useTranslation } from 'react-i18next';
import { Field } from '../../../ui/Field.js';
import { useZoneComponentOptions } from '../useZoneComponentOptions.js';

/**
 * Editor form for the LetterTitle component.
 * Stores name + label in component options — independent of resume and sender.
 */
export function LetterTitleForm({ slotName, componentId }: SlotFormProps) {
  const { t } = useTranslation();
  const [options, patchOptions] = useZoneComponentOptions(slotName, componentId);

  const name = (options.name as string | undefined) ?? '';
  const label = (options.label as string | undefined) ?? '';

  return (
    <div className="flex flex-col gap-3">
      <Field
        label={t('basics.name')}
        value={name}
        onChange={(e) => {
          patchOptions({ name: e.target.value });
        }}
      />
      <Field
        label={t('basics.label')}
        value={label}
        onChange={(e) => {
          patchOptions({ label: e.target.value });
        }}
      />
    </div>
  );
}
