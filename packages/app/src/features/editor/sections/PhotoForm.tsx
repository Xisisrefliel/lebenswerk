import type { SlotFormProps } from '../formRegistry.js';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../state/resumeStore.js';
import { Button } from '../../../ui/Button.js';
import { ToggleGroup } from '../../../ui/ToggleGroup.js';
import { isValidImageFile, processPhotoFile } from '../../../utils/imageUtils.js';
import { useSlotComponentOption } from '../useSlotComponentOption.js';

export function PhotoForm({ slotName, componentId }: SlotFormProps) {
  const { t } = useTranslation();
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [shape, setShape] = useSlotComponentOption(slotName, componentId, 'shape', 'circle');
  const [size, setSize] = useSlotComponentOption(slotName, componentId, 'size', 'md');

  const basics = resume.basics;
  const update = (image: string) => {
    setResume({ ...resume, basics: { ...basics, image } });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isValidImageFile(file)) {
      alert(t('basics.imageInvalidType'));
      return;
    }
    update(await processPhotoFile(file));
  };

  const hasImage = !!basics.image;
  const isDataUrl = basics.image?.startsWith('data:');

  return (
    <div className="flex flex-col gap-3">
      {/* Upload / preview */}
      <div className="flex items-start gap-3">
        {hasImage && (
          <img
            src={basics.image}
            alt={basics.name}
            className="h-16 w-16 shrink-0 border border-line-strong object-cover"
          />
        )}
        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              void handleFileUpload(e);
            }}
            className="hidden"
          />
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            {t('basics.imageUpload')}
          </Button>
          {!isDataUrl && (
            <input
              type="url"
              placeholder={t('basics.imageUrlPlaceholder')}
              value={basics.image ?? ''}
              onChange={(e) => {
                update(e.target.value);
              }}
              className="border border-line-strong bg-surface px-2 py-1 text-sm text-ink focus:border-accent focus:outline-none"
            />
          )}
          {hasImage && (
            <Button
              variant="danger"
              size="sm"
              className="self-start"
              onClick={() => {
                update('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              {t('basics.imageRemove')}
            </Button>
          )}
        </div>
      </div>

      {/* Shape */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          {t('photo.shape')}
        </span>
        <ToggleGroup
          options={[
            { value: 'circle', label: t('photo.shape_circle') },
            { value: 'rounded', label: t('photo.shape_rounded') },
            { value: 'square', label: t('photo.shape_square') },
          ]}
          value={shape}
          onChange={setShape}
        />
      </div>

      {/* Size */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          {t('photo.size')}
        </span>
        <ToggleGroup
          options={[
            { value: 'sm', label: t('photo.size_sm') },
            { value: 'md', label: t('photo.size_md') },
            { value: 'lg', label: t('photo.size_lg') },
          ]}
          value={size}
          onChange={setSize}
        />
      </div>
    </div>
  );
}
