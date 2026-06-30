import type { SlotFormProps } from '../formRegistry.js';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../state/resumeStore.js';
import { RichTextField } from '../../../ui/RichTextField.js';

export function SummaryForm(props: SlotFormProps) {
  void props;
  const { t } = useTranslation();
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);

  const update = (summary: string) => {
    setResume({ ...resume, basics: { ...resume.basics, summary } });
  };

  return (
    <div className="flex flex-col gap-3">
      <RichTextField
        label={t('summary.description')}
        value={resume.basics.summary ?? ''}
        onChange={update}
      />
    </div>
  );
}
