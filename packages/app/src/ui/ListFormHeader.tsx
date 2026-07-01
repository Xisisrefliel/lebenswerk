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
      {count === 0 && (
        <div className="py-6 text-center text-sm text-muted/70">
          {t('editor.noEntries', { defaultValue: 'No entries yet.' })}
        </div>
      )}

      <Button variant="secondary" className="w-full" onClick={onAdd}>
        + {t('actions.add')}
      </Button>
    </>
  );
}
