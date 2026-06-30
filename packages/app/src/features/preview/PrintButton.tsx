import { useTranslation } from 'react-i18next';
import { triggerPreviewPrint } from './previewController.js';

export function PrintButton() {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={triggerPreviewPrint}
      className="bg-accent px-2 py-1 text-xs font-bold uppercase tracking-wider text-black hover:bg-accent/90"
    >
      {t('actions.exportPdf')}
    </button>
  );
}
