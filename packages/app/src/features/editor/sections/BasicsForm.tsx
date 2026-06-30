import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NATIONALITIES } from '../../../data/nationalities.js';
import { useResumeStore } from '../../../state/resumeStore.js';
import { useSettingsStore } from '../../../state/settingsStore.js';
import { Field } from '../../../ui/Field.js';
import { LocationFields } from '../../../ui/LocationFields.js';
import { Select } from '../../../ui/Select.js';
import { isValidImageFile, processPhotoFile } from '../../../utils/imageUtils.js';

export function BasicsForm() {
  const { t } = useTranslation();
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentLocale = useSettingsStore((s) => s.settings.documentLocale);

  const basics = resume.basics;
  const update = (patch: Partial<typeof basics>) => {
    setResume({ ...resume, basics: { ...basics, ...patch } });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isValidImageFile(file)) {
      alert(t('basics.imageInvalidType'));
      return;
    }
    const dataUrl = await processPhotoFile(file);
    update({ image: dataUrl });
  };

  const hasImage = !!basics.image;
  const isDataUrl = basics.image?.startsWith('data:');

  return (
    <section className="flex flex-col gap-3 border border-line-strong bg-surface p-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-ink">{t('basics.title')}</h3>

      {/* Row 1: Name + Job Title */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Field
          label={t('basics.name')}
          value={basics.name}
          onChange={(e) => {
            update({ name: e.target.value });
          }}
        />
        <Field
          label={t('basics.label')}
          value={basics.label ?? ''}
          onChange={(e) => {
            update({ label: e.target.value });
          }}
        />
      </div>

      {/* Row 2: Photo upload */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          {t('basics.image')}
        </span>
        <div className="flex items-start gap-3">
          {hasImage && (
            <img
              src={basics.image}
              alt={basics.name}
              className="h-16 w-16 shrink-0 border border-line-strong object-cover"
            />
          )}
          <div className="flex flex-1 flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                void handleFileUpload(e);
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-line-strong bg-surface px-2 py-1 text-xs font-medium uppercase tracking-wider text-ink hover:border-accent"
            >
              {t('basics.imageUpload')}
            </button>
            {!isDataUrl && (
              <input
                type="url"
                placeholder={t('basics.imageUrlPlaceholder')}
                value={basics.image ?? ''}
                onChange={(e) => {
                  update({ image: e.target.value });
                }}
                className="border border-line-strong bg-surface px-2 py-1 text-sm text-ink focus:border-accent focus:outline-none"
              />
            )}
            {hasImage && (
              <button
                type="button"
                onClick={() => {
                  update({ image: '' });
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="self-start text-xs uppercase tracking-wider text-red-500 hover:text-red-400"
              >
                {t('basics.imageRemove')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Email + Phone */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Field
          label={t('basics.email')}
          type="email"
          value={basics.email ?? ''}
          onChange={(e) => {
            update({ email: e.target.value });
          }}
        />
        <Field
          label={t('basics.phone')}
          value={basics.phone ?? ''}
          onChange={(e) => {
            update({ phone: e.target.value });
          }}
        />
      </div>

      {/* Row 4: Website */}
      <Field
        label={t('basics.url')}
        type="url"
        value={basics.url ?? ''}
        onChange={(e) => {
          update({ url: e.target.value });
        }}
      />

      {/* Row 5: Address */}
      <LocationFields
        location={basics.location}
        onChange={(location) => {
          update({ location });
        }}
      />

      {/* Row 5: Birth Date + Birth Place + Nationality */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Field
          label={t('basics.birthDate')}
          placeholder="YYYY-MM-DD"
          value={basics.birthDate ?? ''}
          onChange={(e) => {
            update({ birthDate: e.target.value });
          }}
        />
        <Field
          label={t('basics.birthPlace')}
          value={basics.birthPlace ?? ''}
          onChange={(e) => {
            update({ birthPlace: e.target.value });
          }}
        />
        <Select
          label={t('basics.nationality')}
          value={basics.nationality ?? ''}
          onChange={(e) => {
            update({ nationality: e.target.value });
          }}
          options={[
            { value: '', label: '' },
            ...NATIONALITIES.map((n) => {
              const value = n[documentLocale];
              return { value, label: value };
            }),
          ]}
        />
      </div>
    </section>
  );
}
