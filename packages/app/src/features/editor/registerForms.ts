import { registerForm } from './formRegistry.js';
import { CertificatesForm } from './sections/CertificatesForm.js';
import { ContactInfoForm } from './sections/ContactInfoForm.js';
import { CustomSectionForm } from './sections/CustomSectionForm.js';
import { EducationForm } from './sections/EducationForm.js';
import { InterestsForm } from './sections/InterestsForm.js';
import { LanguagesForm } from './sections/LanguagesForm.js';
import { LetterContactForm } from './sections/LetterContactForm.js';
import { LetterPhotoForm } from './sections/LetterPhotoForm.js';
import { LetterTitleForm } from './sections/LetterTitleForm.js';
import { PersonalInfoForm } from './sections/PersonalInfoForm.js';
import { PhotoForm } from './sections/PhotoForm.js';
import { ProjectsForm } from './sections/ProjectsForm.js';
import { SkillsForm } from './sections/SkillsForm.js';
import { SummaryForm } from './sections/SummaryForm.js';
import { WorkForm } from './sections/WorkForm.js';

/**
 * Registers all built-in editor forms with the form registry.
 * Must be called once at app startup.
 *
 * To add a new component's form, add a `registerForm()` call here.
 */
export function registerAllForms(): void {
  registerForm('photo', PhotoForm);
  registerForm('personal-info', PersonalInfoForm);
  registerForm('contact-info', ContactInfoForm);
  registerForm('summary', SummaryForm);
  registerForm('experience-list', WorkForm);
  registerForm('education-list', EducationForm);
  registerForm('skills-list', SkillsForm);
  registerForm('languages-list', LanguagesForm);
  registerForm('projects-list', ProjectsForm);
  registerForm('certificates-list', CertificatesForm);
  registerForm('interests-list', InterestsForm);
  registerForm('custom-section', CustomSectionForm);
  registerForm('letter-photo', LetterPhotoForm);
  registerForm('letter-title', LetterTitleForm);
  registerForm('letter-contact', LetterContactForm);
}
