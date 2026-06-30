import { useTranslation } from 'react-i18next';
import { Button } from './Button.js';

interface ListFormHeaderProps {
  count: number;
  onAdd: () => void;
}

export function ListFormHeader({ count, onAdd }: ListFormHeaderProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          {count}{' '}
          {count === 1
            ? t('editor.entry', { defaultValue: 'entry' })
            : t('editor.entries', { defaultValue: 'entries' })}
        </span>
        <Button variant="secondary" size="sm" onClick={onAdd}>
          + {t('actions.add')}
        </Button>
      </div>

      {count === 0 && (
        <div className="py-4 text-center text-xs uppercase tracking-wider text-muted">
          {t('editor.noEntries', { defaultValue: 'No entries yet.' })}
        </div>
      )}
    </>
  );
}
