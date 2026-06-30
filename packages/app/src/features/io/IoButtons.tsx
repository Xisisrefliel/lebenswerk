import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadJson, importJsonFile } from './io.js';

export function IoButtons() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await importJsonFile(file);
    } catch (err) {
      window.alert(`Import failed: ${(err as Error).message}`);
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => {
          downloadJson();
        }}
        className="border border-line-strong bg-surface px-2 py-1 text-xs font-medium uppercase tracking-wider text-ink hover:border-accent"
      >
        {t('actions.exportJson')}
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="border border-line-strong bg-surface px-2 py-1 text-xs font-medium uppercase tracking-wider text-ink hover:border-accent"
      >
        {t('actions.importJson')}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          void handleImport(e);
        }}
      />
    </div>
  );
}
