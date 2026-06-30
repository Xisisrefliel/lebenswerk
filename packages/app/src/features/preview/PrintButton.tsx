import { useTranslation } from 'react-i18next';
import { triggerPreviewPrint } from './previewController.js';

export function PrintButton() {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={triggerPreviewPrint}
      className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-black shadow-sm transition-all hover:bg-white/90 active:bg-white/80"
    >
      {t('actions.exportPdf')}
    </button>
  );
}
