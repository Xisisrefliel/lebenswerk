import { CaretDownIcon, CaretUpIcon, XIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useCoverLetterStore } from '../../../state/coverLetterStore.js';
import { Button } from '../../../ui/Button.js';
import { RichTextField } from '../../../ui/RichTextField.js';

export function ParagraphList() {
  const { t } = useTranslation();
  const paragraphs = useCoverLetterStore((s) => s.coverLetter.paragraphs);
  const addParagraph = useCoverLetterStore((s) => s.addParagraph);
  const removeParagraph = useCoverLetterStore((s) => s.removeParagraph);
  const updateParagraph = useCoverLetterStore((s) => s.updateParagraph);
  const moveParagraph = useCoverLetterStore((s) => s.moveParagraph);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium text-muted">{t('coverLetterEditor.paragraphs')}</span>
      {paragraphs.map((p, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              disabled={i === 0}
              onClick={() => {
                moveParagraph(i, i - 1);
              }}
              className="rounded p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink disabled:opacity-30"
              title={t('designer.moveUp')}
            >
              <CaretUpIcon className="h-3.5 w-3.5" weight="bold" />
            </button>
            <button
              type="button"
              disabled={i === paragraphs.length - 1}
              onClick={() => {
                moveParagraph(i, i + 1);
              }}
              className="rounded p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink disabled:opacity-30"
              title={t('designer.moveDown')}
            >
              <CaretDownIcon className="h-3.5 w-3.5" weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => {
                removeParagraph(i);
              }}
              className="rounded p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-red"
              title={t('coverLetterEditor.removeParagraph')}
            >
              <XIcon className="h-3.5 w-3.5" weight="bold" />
            </button>
          </div>
          <RichTextField
            label={`${i + 1}.`}
            value={p}
            onChange={(html) => {
              updateParagraph(i, html);
            }}
          />
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={addParagraph}>
        {t('coverLetterEditor.addParagraph')}
      </Button>
    </div>
  );
}
