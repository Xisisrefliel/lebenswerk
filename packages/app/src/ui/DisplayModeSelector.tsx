import { useTranslation } from 'react-i18next';
import { ToggleGroup } from './ToggleGroup.js';

const MODES = ['text', 'bar', 'stars', 'dots'] as const;

interface DisplayModeSelectorProps {
  value: string;
  onChange: (mode: string) => void;
}

export function DisplayModeSelector({ value, onChange }: DisplayModeSelectorProps) {
  const { t } = useTranslation();

  const options = MODES.map((mode) => ({
    value: mode,
    label: t(`designer.skillMode_${mode}`),
  }));

  return <ToggleGroup options={options} value={value} onChange={onChange} />;
}
