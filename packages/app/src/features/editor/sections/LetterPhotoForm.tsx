import type { SlotFormProps } from '../formRegistry.js';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../ui/Button.js';
import { ToggleGroup } from '../../../ui/ToggleGroup.js';
import { isValidImageFile, processPhotoFile } from '../../../utils/imageUtils.js';
import { useZoneComponentOptions } from '../useZoneComponentOptions.js';

/**
 * Editor form for the LetterPhoto component.
 * Stores image in component options — independent of resume and sender.
 */
export function LetterPhotoForm({ slotName, componentId }: SlotFormProps) {
  const { t } = useTranslation();
  const [options, patchOptions] = useZoneComponentOptions(slotName, componentId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const shape = (options.shape as string | undefined) ?? 'circle';
  const image = (options.image as string | undefined) ?? '';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isValidImageFile(file)) {
      alert(t('basics.imageInvalidType'));
      return;
    }
    patchOptions({ image: await processPhotoFile(file) });
  };

  const hasImage = !!image;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        {hasImage && (
          <img
            src={image}
            alt=""
            className="h-12 w-12 shrink-0 border border-line-strong object-cover"
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
          <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
            {t('basics.imageUpload')}
          </Button>
          {hasImage && (
            <Button
              variant="danger"
              size="sm"
              className="self-start"
              onClick={() => {
                patchOptions({ image: '' });
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              {t('basics.imageRemove')}
            </Button>
          )}
        </div>
      </div>

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
          onChange={(v) => {
            patchOptions({ shape: v });
          }}
        />
      </div>
    </div>
  );
}
