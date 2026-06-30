import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveDesign, useDesignStore } from '../../state/designStore.js';
import { DesignerPanel } from '../designer/DesignerPanel.js';
import { CoverLetterEditor } from './CoverLetterEditor.js';
import { SlotTabPanel } from './SlotTabPanel.js';

const SETTINGS_TAB = '__settings__';

export function SlotTabs() {
  const { t } = useTranslation();
  const design = useActiveDesign();
  const activeDocumentType = useDesignStore((s) => s.activeDocumentType);

  const slotNames = design ? Object.keys(design.slots) : [];
  const allTabs = [...slotNames, SETTINGS_TAB];
  const [activeTab, setActiveTab] = useState(slotNames[0] ?? SETTINGS_TAB);

  const resolvedTab = allTabs.includes(activeTab) ? activeTab : (slotNames[0] ?? SETTINGS_TAB);

  if (!design) return null;

  if (activeDocumentType === 'anschreiben') {
    return (
      <div className="flex flex-col gap-3">
        <CoverLetterEditor />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <TabBar tabs={allTabs} activeTab={resolvedTab} onTabChange={setActiveTab} t={t} />

      {resolvedTab === SETTINGS_TAB ? (
        <DesignerPanel />
      ) : (
        design.slots[resolvedTab] && (
          <SlotTabPanel slotName={resolvedTab} slotDef={design.slots[resolvedTab]} />
        )
      )}
    </div>
  );
}

function TabBar({
  tabs,
  activeTab,
  onTabChange,
  t,
}: {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-line-strong bg-white/[0.03] p-0.5">
      {tabs.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => {
            onTabChange(name);
          }}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
            activeTab === name
              ? 'bg-white/[0.1] text-ink shadow-sm'
              : 'text-muted hover:text-ink hover:bg-white/[0.04]'
          }`}
        >
          {name === SETTINGS_TAB ? t('tabs.settings') : t(`slots.${name}`, { defaultValue: name })}
        </button>
      ))}
    </div>
  );
}
