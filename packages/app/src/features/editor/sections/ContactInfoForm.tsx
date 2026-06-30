import type { SlotFormProps } from '../formRegistry.js';
import type { Profile } from '@cv/core';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../state/resumeStore.js';
import { Button } from '../../../ui/Button.js';
import { Field } from '../../../ui/Field.js';
import { LocationFields } from '../../../ui/LocationFields.js';
import { Select } from '../../../ui/Select.js';
import { ToggleGroup } from '../../../ui/ToggleGroup.js';
import { useSlotComponentOption } from '../useSlotComponentOption.js';

const NETWORK_SUGGESTIONS = [
  'GitHub',
  'LinkedIn',
  'Xing',
  'Twitter',
  'Instagram',
  'GitLab',
  'StackOverflow',
  'Dribbble',
  'Behance',
  'YouTube',
] as const;

const DISPLAY_STYLE_OPTIONS = [
  { value: 'icons', label: '' },
  { value: 'text', label: '' },
  { value: 'both', label: '' },
] as const;

export function ContactInfoForm({ slotName, componentId }: SlotFormProps) {
  const { t } = useTranslation();
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);
  const [displayStyle, setDisplayStyle] = useSlotComponentOption(
    slotName,
    componentId,
    'displayStyle',
    'both',
  );

  const basics = resume.basics;
  const update = (patch: Partial<typeof basics>) => {
    setResume({ ...resume, basics: { ...basics, ...patch } });
  };

  const addProfile = () => {
    update({ profiles: [...basics.profiles, { network: '', username: '' }] });
  };
  const removeProfile = (idx: number) => {
    update({ profiles: basics.profiles.filter((_, i) => i !== idx) });
  };
  const patchProfile = (idx: number, patch: Partial<Profile>) => {
    update({
      profiles: basics.profiles.map((p, i) => (i === idx ? { ...p, ...patch } : p)),
    });
  };

  const displayStyleOptions = DISPLAY_STYLE_OPTIONS.map((o) => ({
    ...o,
    label: t(`contact.displayStyle_${o.value}`),
  }));

  const networkOptions = [
    { value: '', label: t('contact.selectNetwork') },
    ...NETWORK_SUGGESTIONS.map((n) => ({ value: n, label: n })),
  ];

  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup options={displayStyleOptions} value={displayStyle} onChange={setDisplayStyle} />

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
      <Field
        label={t('basics.url')}
        type="url"
        value={basics.url ?? ''}
        onChange={(e) => {
          update({ url: e.target.value });
        }}
      />
      <LocationFields
        location={basics.location}
        onChange={(location) => {
          update({ location });
        }}
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">{t('contact.profiles')}</span>
          <Button variant="ghost" size="sm" onClick={addProfile}>
            + {t('actions.add')}
          </Button>
        </div>
        {basics.profiles.map((p, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 rounded-lg border border-line-strong bg-white/[0.02] p-3"
          >
            <div className="flex items-end gap-2">
              <Select
                label={t('contact.network')}
                value={p.network}
                onChange={(e) => {
                  patchProfile(idx, { network: e.target.value });
                }}
                options={networkOptions}
              />
              <div className="flex-1">
                <Field
                  label={t('contact.username')}
                  value={p.username ?? ''}
                  placeholder="@username"
                  onChange={(e) => {
                    patchProfile(idx, { username: e.target.value });
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  removeProfile(idx);
                }}
                className="mb-1 shrink-0 rounded p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-red"
              >
                &times;
              </button>
            </div>
            <Field
              label={t('contact.profileUrl')}
              type="url"
              value={p.url ?? ''}
              placeholder="https://github.com/username"
              onChange={(e) => {
                patchProfile(idx, { url: e.target.value });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
