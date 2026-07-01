import { useTranslation } from 'react-i18next';
import { useActiveDesign, useDesignStore } from '../../state/designStore.js';

export function DocumentTypeSwitch() {
  const { t } = useTranslation();
  const design = useActiveDesign();
  const activeDocumentType = useDesignStore((s) => s.activeDocumentType);
  const setActiveDocumentType = useDesignStore((s) => s.setActiveDocumentType);

  if (!design || design.documentTypes.length <= 1) return null;

  const options = design.documentTypes.map((dt) => ({
    value: dt,
    label: t(`documentTypes.${dt}`),
  }));

  return (
    <div
      role="tablist"
      aria-label={t('workspace.documentType', { defaultValue: 'Dokumenttyp' })}
      className="grid min-w-0 overflow-hidden border border-line-strong bg-white/[0.025]"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const selected = activeDocumentType === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => {
              setActiveDocumentType(option.value);
            }}
            className={`min-w-0 border-r border-line px-3 py-1.5 text-center text-xs font-medium leading-none transition-colors last:border-r-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/55 ${
              selected
                ? 'bg-white/[0.09] text-ink'
                : 'text-muted hover:bg-white/[0.045] hover:text-ink'
            }`}
          >
            <span className="block truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
