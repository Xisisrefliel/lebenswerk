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
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 8.5l4-4 4 4" />
              </svg>
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
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 5.5l4 4 4-4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                removeParagraph(i);
              }}
              className="rounded p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-red"
              title={t('coverLetterEditor.removeParagraph')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 3l8 8M11 3l-8 8" />
              </svg>
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
