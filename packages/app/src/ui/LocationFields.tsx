import { useTranslation } from 'react-i18next';
import { Field } from './Field.js';

interface Location {
  address?: string | undefined;
  postalCode?: string | undefined;
  city?: string | undefined;
  countryCode?: string | undefined;
}

interface LocationFieldsProps {
  location: Location | undefined;
  onChange: (location: Location) => void;
}

export function LocationFields({ location, onChange }: LocationFieldsProps) {
  const { t } = useTranslation();
  const loc = location ?? {};

  const patch = (field: Partial<Location>) => {
    onChange({ ...loc, ...field });
  };

  return (
    <>
      <Field
        label={t('basics.address')}
        value={loc.address ?? ''}
        onChange={(e) => {
          patch({ address: e.target.value });
        }}
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Field
          label={t('basics.postalCode')}
          value={loc.postalCode ?? ''}
          onChange={(e) => {
            patch({ postalCode: e.target.value });
          }}
        />
        <div className="sm:col-span-2">
          <Field
            label={t('basics.city')}
            value={loc.city ?? ''}
            onChange={(e) => {
              patch({ city: e.target.value });
            }}
          />
        </div>
      </div>
      <Field
        label={t('basics.countryCode')}
        value={loc.countryCode ?? ''}
        placeholder="DE"
        onChange={(e) => {
          patch({ countryCode: e.target.value });
        }}
      />
    </>
  );
}
