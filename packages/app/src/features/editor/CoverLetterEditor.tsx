import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoverLetterStore } from '../../state/coverLetterStore.js';
import { Button } from '../../ui/Button.js';
import { Field } from '../../ui/Field.js';
import { SignaturePad } from '../../ui/SignaturePad.js';
import { Toggle } from '../../ui/Toggle.js';
import { ToggleGroup } from '../../ui/ToggleGroup.js';
import { isValidImageFile, processSignatureFile } from '../../utils/imageUtils.js';
import { LetterSection } from './cover-letter/LetterSection.js';
import { ParagraphList } from './cover-letter/ParagraphList.js';

export function CoverLetterEditor() {
  const { t } = useTranslation();
  const cl = useCoverLetterStore((s) => s.coverLetter);
  const patchCoverLetter = useCoverLetterStore((s) => s.patchCoverLetter);
  const patchRecipient = useCoverLetterStore((s) => s.patchRecipient);
  const patchSender = useCoverLetterStore((s) => s.patchSender);
  const setDin5008Form = useCoverLetterStore((s) => s.setDin5008Form);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isValidImageFile(file)) {
      alert(t('coverLetterEditor.signatureInvalidType'));
      return;
    }
    const dataUrl = await processSignatureFile(file);
    patchCoverLetter({ signatureImage: dataUrl });
  };

  const updateRecipientLocation = (patch: Record<string, string>) => {
    patchRecipient({ location: { ...cl.recipient.location, ...patch } });
  };

  const updateSenderLocation = (patch: Record<string, string>) => {
    patchSender({ location: { ...cl.sender.location, ...patch } });
  };

  const sender = cl.sender;

  return (
    <div className="flex flex-col gap-3">
      {/* DIN 5008 Settings */}
      <LetterSection title={t('coverLetterEditor.din5008Form')}>
        <ToggleGroup
          options={[
            { value: 'B', label: t('coverLetterEditor.formB') },
            { value: 'A', label: t('coverLetterEditor.formA') },
          ]}
          value={cl.din5008Form}
          onChange={(v) => {
            setDin5008Form(v);
          }}
        />
        <Toggle
          checked={cl.showFoldMarks}
          onChange={(checked) => {
            patchCoverLetter({ showFoldMarks: checked });
          }}
          label={t('coverLetterEditor.showFoldMarks')}
        />
      </LetterSection>

      {/* Sender */}
      <LetterSection title={t('coverLetterEditor.senderTitle')}>
        <Field
          label={t('coverLetterEditor.name')}
          value={sender.name}
          onChange={(e) => {
            patchSender({ name: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.company')}
          value={sender.company ?? ''}
          onChange={(e) => {
            patchSender({ company: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.address')}
          value={sender.location?.address ?? ''}
          onChange={(e) => {
            updateSenderLocation({ address: e.target.value });
          }}
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Field
            label={t('coverLetterEditor.postalCode')}
            value={sender.location?.postalCode ?? ''}
            onChange={(e) => {
              updateSenderLocation({ postalCode: e.target.value });
            }}
          />
          <div className="sm:col-span-2">
            <Field
              label={t('coverLetterEditor.city')}
              value={sender.location?.city ?? ''}
              onChange={(e) => {
                updateSenderLocation({ city: e.target.value });
              }}
            />
          </div>
        </div>
        <Field
          label={t('coverLetterEditor.country')}
          value={sender.location?.countryCode ?? ''}
          placeholder="DE"
          onChange={(e) => {
            updateSenderLocation({ countryCode: e.target.value });
          }}
        />
      </LetterSection>

      {/* Recipient */}
      <LetterSection title={t('coverLetterEditor.recipientTitle')}>
        <Toggle
          checked={cl.showSenderInfo}
          onChange={(checked) => {
            patchCoverLetter({ showSenderInfo: checked });
          }}
          label={t('coverLetterEditor.showSenderInfo')}
        />
        <Field
          label={t('coverLetterEditor.company')}
          value={cl.recipient.company ?? ''}
          onChange={(e) => {
            patchRecipient({ company: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.name')}
          value={cl.recipient.name}
          onChange={(e) => {
            patchRecipient({ name: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.address')}
          value={cl.recipient.location?.address ?? ''}
          onChange={(e) => {
            updateRecipientLocation({ address: e.target.value });
          }}
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Field
            label={t('coverLetterEditor.postalCode')}
            value={cl.recipient.location?.postalCode ?? ''}
            onChange={(e) => {
              updateRecipientLocation({ postalCode: e.target.value });
            }}
          />
          <div className="sm:col-span-2">
            <Field
              label={t('coverLetterEditor.city')}
              value={cl.recipient.location?.city ?? ''}
              onChange={(e) => {
                updateRecipientLocation({ city: e.target.value });
              }}
            />
          </div>
        </div>
        <Field
          label={t('coverLetterEditor.country')}
          value={cl.recipient.location?.countryCode ?? ''}
          placeholder="DE"
          onChange={(e) => {
            updateRecipientLocation({ countryCode: e.target.value });
          }}
        />
      </LetterSection>

      {/* Letter Details */}
      <LetterSection title={t('coverLetterEditor.metaTitle')}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Field
            label={t('coverLetterEditor.place')}
            value={cl.place ?? ''}
            onChange={(e) => {
              patchCoverLetter({ place: e.target.value });
            }}
          />
          <Field
            label={t('coverLetterEditor.date')}
            type="date"
            value={cl.date ?? ''}
            onChange={(e) => {
              patchCoverLetter({ date: e.target.value });
            }}
          />
        </div>
        <Field
          label={t('coverLetterEditor.subject')}
          value={cl.subject}
          onChange={(e) => {
            patchCoverLetter({ subject: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.reference')}
          value={cl.reference}
          placeholder={t('coverLetterEditor.referencePlaceholder')}
          onChange={(e) => {
            patchCoverLetter({ reference: e.target.value });
          }}
        />
      </LetterSection>

      {/* Body */}
      <LetterSection title={t('coverLetterEditor.bodyTitle')}>
        <Field
          label={t('coverLetterEditor.salutation')}
          value={cl.salutation}
          placeholder={t('coverLetterEditor.salutationPlaceholder')}
          onChange={(e) => {
            patchCoverLetter({ salutation: e.target.value });
          }}
        />
        <ParagraphList />
      </LetterSection>

      {/* Closing & Signature */}
      <LetterSection title={t('coverLetterEditor.closingTitle')}>
        <Field
          label={t('coverLetterEditor.closing')}
          value={cl.closing}
          placeholder={t('coverLetterEditor.closingPlaceholder')}
          onChange={(e) => {
            patchCoverLetter({ closing: e.target.value });
          }}
        />
        <Field
          label={t('coverLetterEditor.signatureName')}
          value={cl.signatureName ?? ''}
          onChange={(e) => {
            patchCoverLetter({ signatureName: e.target.value });
          }}
        />

        <div className="flex flex-col gap-2 text-sm">
          <span className="text-xs font-medium text-muted">
            {t('coverLetterEditor.signatureImage')}
          </span>
          {cl.signatureImage ? (
            <div className="flex items-center gap-3">
              <img src={cl.signatureImage} alt="" className="h-10 rounded border border-line-strong" />
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  patchCoverLetter({ signatureImage: undefined });
                }}
              >
                {t('coverLetterEditor.removeSignature')}
              </Button>
            </div>
          ) : (
            <SignatureInput
              onSave={(url) => {
                patchCoverLetter({ signatureImage: url });
              }}
              signatureInputRef={signatureInputRef}
              handleSignatureUpload={(e) => {
                void handleSignatureUpload(e);
              }}
            />
          )}
        </div>
      </LetterSection>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SignatureInput — toggle between upload and draw modes
// ---------------------------------------------------------------------------

function SignatureInput({
  onSave,
  signatureInputRef,
  handleSignatureUpload,
}: {
  onSave: (url: string) => void;
  signatureInputRef: React.RefObject<HTMLInputElement | null>;
  handleSignatureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'upload' | 'draw'>('draw');

  return (
    <div className="flex flex-col gap-2">
      <ToggleGroup
        options={[
          { value: 'draw', label: t('coverLetterEditor.signatureDrawMode') },
          { value: 'upload', label: t('coverLetterEditor.signatureUploadMode') },
        ]}
        value={mode}
        onChange={(v) => {
          setMode(v);
        }}
      />
      {mode === 'draw' ? (
        <SignaturePad onSave={onSave} />
      ) : (
        <>
          <input
            ref={signatureInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleSignatureUpload}
          />
          <Button variant="secondary" size="sm" onClick={() => signatureInputRef.current?.click()}>
            {t('coverLetterEditor.uploadSignature')}
          </Button>
        </>
      )}
    </div>
  );
}
