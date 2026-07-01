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
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => {
          downloadJson();
        }}
        className="border border-line-strong bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-white/25 hover:bg-white/[0.06]"
      >
        {t('actions.exportJson')}
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="border border-line-strong bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-white/25 hover:bg-white/[0.06]"
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
