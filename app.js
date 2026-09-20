// ============================================
// East African CV & Resume Builder - app.js
// Full version: Photo, Languages, Certs, LocalStorage,
// 3 Templates, Cover Letter, Premium
// ============================================

let isPremium = false;
let photoDataUrl = null;
let currentTemplate = 'classic';

function createExperienceEntry(data = {}) {
  return `
    <div class="entry experience-entry">
      <label>Job Title
        <input type="text" class="job-title" value="${escapeHtml(data.title || '')}" placeholder="e.g. Sales Assistant">
      </label>
      <label>Company
        <input type="text" class="company" value="${escapeHtml(data.company || '')}" placeholder="e.g. CRDB Bank">
      </label>
      <label>Dates
        <input type="text" class="dates" value="${escapeHtml(data.dates || '')}" placeholder="Jan 2022 – Present">
      </label>
      <label>Description / Achievements
        <textarea class="description" rows="3" placeholder="Key responsibilities and achievements...">${escapeHtml(data.desc || '')}</textarea>
      </label>
      <button type="button" class="remove-entry">Remove</button>
    </div>
  `;
}

function createEducationEntry(data = {}) {
  return `
    <div class="entry education-entry">
      <label>Degree / Certificate
        <input type="text" class="degree" value="${escapeHtml(data.degree || '')}" placeholder="e.g. Bachelor of Business Administration">
      </label>
      <label>Institution
        <input type="text" class="institution" value="${escapeHtml(data.institution || '')}" placeholder="e.g. University of Dar es Salaam">
      </label>
      <label>Years
        <input type="text" class="years" value="${escapeHtml(data.years || '')}" placeholder="2019 – 2023">
      </label>
      <button type="button" class="remove-entry">Remove</button>
    </div>
  `;
}

function createCertificationEntry(data = {}) {
  return `
    <div class="entry certification-entry">
      <label>Certification / Training Name
        <input type="text" class="cert-name" value="${escapeHtml(data.name || '')}" placeholder="e.g. Microsoft Office Specialist, VETA Certificate">
      </label>
      <label>Issuer / Institution
        <input type="text" class="cert-issuer" value="${escapeHtml(data.issuer || '')}" placeholder="e.g. Microsoft, VETA, Google">
      </label>
      <label>Year
        <input type="text" class="cert-year" value="${escapeHtml(data.year || '')}" placeholder="2024">
      </label>
      <button type="button" class="remove-entry">Remove</button>
    </div>
  `;
}

function createReferenceEntry(data = {}) {
  return `
    <div class="entry reference-entry">
      <label>Name
        <input type="text" class="ref-name" value="${escapeHtml(data.name || '')}" placeholder="e.g. John Mwakasege">
      </label>
      <label>Position / Relationship
        <input type="text" class="ref-position" value="${escapeHtml(data.position || '')}" placeholder="e.g. Former Supervisor">
      </label>
      <label>Contact
        <input type="text" class="ref-contact" value="${escapeHtml(data.contact || '')}" placeholder="Phone or Email">
      </label>
      <button type="button" class="remove-entry">Remove</button>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.getElementById('experience-container').innerHTML = createExperienceEntry();
document.getElementById('education-container').innerHTML = createEducationEntry();
document.getElementById('certifications-container').innerHTML = createCertificationEntry();
document.getElementById('references-container').innerHTML = createReferenceEntry();

document.getElementById('add-experience').addEventListener('click', () => {
  document.getElementById('experience-container').insertAdjacentHTML('beforeend', createExperienceEntry());
  updatePreview();
});
document.getElementById('add-education').addEventListener('click', () => {
  document.getElementById('education-container').insertAdjacentHTML('beforeend', createEducationEntry());
  updatePreview();
});
document.getElementById('add-certification').addEventListener('click', () => {
  document.getElementById('certifications-container').insertAdjacentHTML('beforeend', createCertificationEntry());
  updatePreview();
});
document.getElementById('add-reference').addEventListener('click', () => {
  document.getElementById('references-container').insertAdjacentHTML('beforeend', createReferenceEntry());
  updatePreview();
});

document.getElementById('cv-form').addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-entry')) {
    const entry = e.target.closest('.entry');
    if (entry) { entry.remove(); updatePreview(); }
  }
});

const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const removePhotoBtn = document.getElementById('removePhoto');

photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    alert('Photo is too large. Please use an image under 2MB.');
    photoInput.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    photoDataUrl = event.target.result;
    photoPreview.src = photoDataUrl;
    photoPreview.style.display = 'block';
    removePhotoBtn.style.display = 'inline-block';
    updatePreview();
  };
  reader.readAsDataURL(file);
});

removePhotoBtn.addEventListener('click', () => {
  photoDataUrl = null;
  photoPreview.src = '';
  photoPreview.style.display = 'none';
  removePhotoBtn.style.display = 'none';
  photoInput.value = '';
  updatePreview();
});

document.querySelectorAll('input[name="template"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    currentTemplate = e.target.value;
    applyTemplate();
    updatePreview();
  });
});

function applyTemplate() {
  const preview = document.getElementById('cv-preview');
  preview.classList.remove('template-classic', 'template-modern', 'template-minimal');
  preview.classList.add('template-' + currentTemplate);
}

function updatePreview() {
  const name = document.getElementById('fullName').value.trim() || 'Your Full Name';
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const location = document.getElementById('location').value.trim();
  const linkedin = document.getElementById('linkedin').value.trim();
  const summary = document.getElementById('summary').value.trim();
  const skills = document.getElementById('skills').value.trim();
  const languages = document.getElementById('languages').value.trim();

  const experiences = Array.from(document.querySelectorAll('.experience-entry')).map(entry => ({
    title: entry.querySelector('.job-title')?.value.trim() || '',
    company: entry.querySelector('.company')?.value.trim() || '',
    dates: entry.querySelector('.dates')?.value.trim() || '',
    desc: entry.querySelector('.description')?.value.trim() || ''
  })).filter(e => e.title || e.company);

  const education = Array.from(document.querySelectorAll('.education-entry')).map(entry => ({
    degree: entry.querySelector('.degree')?.value.trim() || '',
    institution: entry.querySelector('.institution')?.value.trim() || '',
    years: entry.querySelector('.years')?.value.trim() || ''
  })).filter(e => e.degree || e.institution);

  const certifications = Array.from(document.querySelectorAll('.certification-entry')).map(entry => ({
    name: entry.querySelector('.cert-name')?.value.trim() || '',
    issuer: entry.querySelector('.cert-issuer')?.value.trim() || '',
    year: entry.querySelector('.cert-year')?.value.trim() || ''
  })).filter(c => c.name);

  const references = Array.from(document.querySelectorAll('.reference-entry')).map(entry => ({
    name: entry.querySelector('.ref-name')?.value.trim() || '',
    position: entry.querySelector('.ref-position')?.value.trim() || '',
    contact: entry.querySelector('.ref-contact')?.value.trim() || ''
  })).filter(r => r.name);

  const contactParts = [email, phone, location, linkedin].filter(Boolean);
  const contactLine = contactParts.join('  •  ');

  let headerHtml = '';
  if (photoDataUrl) {
    headerHtml = `
      <header class="cv-header has-photo">
        <div class="header-text">
          <h1>${escapeHtml(name)}</h1>
          ${contactLine ? `<p class="contact">${escapeHtml(contactLine)}</p>` : ''}
        </div>
        <img src="${photoDataUrl}" class="cv-photo" alt="Profile photo">
      </header>`;
  } else {
    headerHtml = `
      <header class="cv-header">
        <h1>${escapeHtml(name)}</h1>
        ${contactLine ? `<p class="contact">${escapeHtml(contactLine)}</p>` : ''}
      </header>`;
  }

  let html = headerHtml;

  if (summary) html += `<section class="cv-section"><h2>Professional Summary</h2><p>${escapeHtml(summary)}</p></section>`;

  if (experiences.length > 0) {
    html += `<section class="cv-section"><h2>Work Experience</h2>`;
    experiences.forEach(exp => {
      html += `<div class="job"><h3>${escapeHtml(exp.title)}${exp.company ? ` — ${escapeHtml(exp.company)}` : ''}</h3>${exp.dates ? `<p class="dates">${escapeHtml(exp.dates)}</p>` : ''}${exp.desc ? `<p>${escapeHtml(exp.desc)}</p>` : ''}</div>`;
    });
    html += `</section>`;
  }

  if (education.length > 0) {
    html += `<section class="cv-section"><h2>Education</h2>`;
    education.forEach(edu => {
      html += `<div class="edu"><h3>${escapeHtml(edu.degree)}${edu.institution ? ` — ${escapeHtml(edu.institution)}` : ''}</h3>${edu.years ? `<p class="dates">${escapeHtml(edu.years)}</p>` : ''}</div>`;
    });
    html += `</section>`;
  }

  if (skills) html += `<section class="cv-section"><h2>Skills</h2><p class="skills-list">${escapeHtml(skills)}</p></section>`;
  if (languages) html += `<section class="cv-section"><h2>Languages</h2><p class="skills-list">${escapeHtml(languages)}</p></section>`;

  if (certifications.length > 0) {
    html += `<section class="cv-section"><h2>Certifications & Training</h2>`;
    certifications.forEach(cert => {
      html += `<div class="edu"><h3>${escapeHtml(cert.name)}${cert.issuer ? ` — ${escapeHtml(cert.issuer)}` : ''}</h3>${cert.year ? `<p class="dates">${escapeHtml(cert.year)}</p>` : ''}</div>`;
    });
    html += `</section>`;
  }

  if (references.length > 0) {
    html += `<section class="cv-section"><h2>References</h2>`;
    references.forEach(ref => {
      html += `<div class="ref"><p><strong>${escapeHtml(ref.name)}</strong>${ref.position ? ` — ${escapeHtml(ref.position)}` : ''}</p>${ref.contact ? `<p>${escapeHtml(ref.contact)}</p>` : ''}</div>`;
    });
    html += `</section>`;
  }

  const preview = document.getElementById('cv-preview');
  const watermark = document.getElementById('watermark');
  preview.innerHTML = html;
  if (watermark) preview.appendChild(watermark);
  applyTemplate();
  updatePremiumUI();
}

function collectFormData() {
  return {
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    location: document.getElementById('location').value,
    linkedin: document.getElementById('linkedin').value,
    summary: document.getElementById('summary').value,
    skills: document.getElementById('skills').value,
    languages: document.getElementById('languages').value,
    photoDataUrl: photoDataUrl,
    experiences: Array.from(document.querySelectorAll('.experience-entry')).map(entry => ({
      title: entry.querySelector('.job-title')?.value || '',
      company: entry.querySelector('.company')?.value || '',
      dates: entry.querySelector('.dates')?.value || '',
      desc: entry.querySelector('.description')?.value || ''
    })),
    education: Array.from(document.querySelectorAll('.education-entry')).map(entry => ({
      degree: entry.querySelector('.degree')?.value || '',
      institution: entry.querySelector('.institution')?.value || '',
      years: entry.querySelector('.years')?.value || ''
    })),
    certifications: Array.from(document.querySelectorAll('.certification-entry')).map(entry => ({
      name: entry.querySelector('.cert-name')?.value || '',
      issuer: entry.querySelector('.cert-issuer')?.value || '',
      year: entry.querySelector('.cert-year')?.value || ''
    })),
    references: Array.from(document.querySelectorAll('.reference-entry')).map(entry => ({
      name: entry.querySelector('.ref-name')?.value || '',
      position: entry.querySelector('.ref-position')?.value || '',
      contact: entry.querySelector('.ref-contact')?.value || ''
    })),
    isPremium: isPremium,
    currentTemplate: currentTemplate,
    coverJobTitle: document.getElementById('coverJobTitle')?.value || '',
    coverCompany: document.getElementById('coverCompany')?.value || '',
    coverContent: document.getElementById('coverContent')?.value || ''
  };
}

function loadFormData(data) {
  if (!data) return;
  document.getElementById('fullName').value = data.fullName || '';
  document.getElementById('email').value = data.email || '';
  document.getElementById('phone').value = data.phone || '';
  document.getElementById('location').value = data.location || '';
  document.getElementById('linkedin').value = data.linkedin || '';
  document.getElementById('summary').value = data.summary || '';
  document.getElementById('skills').value = data.skills || '';
  document.getElementById('languages').value = data.languages || '';

  if (data.photoDataUrl) {
    photoDataUrl = data.photoDataUrl;
    photoPreview.src = photoDataUrl;
    photoPreview.style.display = 'block';
    removePhotoBtn.style.display = 'inline-block';
  } else {
    photoDataUrl = null;
    photoPreview.style.display = 'none';
    removePhotoBtn.style.display = 'none';
  }

  const expContainer = document.getElementById('experience-container');
  expContainer.innerHTML = '';
  (data.experiences || [{}]).forEach(exp => expContainer.insertAdjacentHTML('beforeend', createExperienceEntry(exp)));

  const eduContainer = document.getElementById('education-container');
  eduContainer.innerHTML = '';
  (data.education || [{}]).forEach(edu => eduContainer.insertAdjacentHTML('beforeend', createEducationEntry(edu)));

  const certContainer = document.getElementById('certifications-container');
  certContainer.innerHTML = '';
  (data.certifications || [{}]).forEach(cert => certContainer.insertAdjacentHTML('beforeend', createCertificationEntry(cert)));

  const refContainer = document.getElementById('references-container');
  refContainer.innerHTML = '';
  (data.references || [{}]).forEach(ref => refContainer.insertAdjacentHTML('beforeend', createReferenceEntry(ref)));

  if (data.coverJobTitle) document.getElementById('coverJobTitle').value = data.coverJobTitle;
  if (data.coverCompany) document.getElementById('coverCompany').value = data.coverCompany;
  if (data.coverContent) document.getElementById('coverContent').value = data.coverContent;

  isPremium = data.isPremium || false;
  currentTemplate = data.currentTemplate || 'classic';
  const radio = document.querySelector(`input[name="template"][value="${currentTemplate}"]`);
  if (radio) radio.checked = true;
  updatePremiumUI();
  updatePreview();
}

document.getElementById('save-cv').addEventListener('click', () => {
  try {
    localStorage.setItem('eastAfricanCV_draft', JSON.stringify(collectFormData()));
    alert('CV draft saved successfully!');
  } catch (err) {
    alert('Could not save. Try removing the photo (storage limit).');
  }
});

document.getElementById('load-cv').addEventListener('click', () => {
  const saved = localStorage.getItem('eastAfricanCV_draft');
  if (!saved) { alert('No saved draft found.'); return; }
  try {
    loadFormData(JSON.parse(saved));
    alert('Draft loaded successfully!');
  } catch (err) { alert('Failed to load draft.'); }
});

function updatePremiumUI() {
  const watermark = document.getElementById('watermark');
  if (watermark) {
    if (isPremium) watermark.classList.add('hidden');
    else watermark.classList.remove('hidden');
  }

  document.querySelectorAll('.premium-only input').forEach(input => {
    input.disabled = !isPremium;
  });
  document.querySelectorAll('.premium-only span').forEach(span => {
    span.textContent = span.textContent.replace(' 🔒', isPremium ? '' : ' 🔒');
  });

  const coverSection = document.getElementById('cover-letter-section');
  if (coverSection) coverSection.style.display = isPremium ? 'block' : 'none';

  const hint = document.getElementById('template-hint');
  if (hint) hint.textContent = isPremium ? 'All templates unlocked' : 'Unlock Modern & Minimal with Premium';

  if (!isPremium && currentTemplate !== 'classic') {
    currentTemplate = 'classic';
    const classicRadio = document.querySelector('input[name="template"][value="classic"]');
    if (classicRadio) classicRadio.checked = true;
    applyTemplate();
  }
}

document.getElementById('toggle-premium').addEventListener('click', () => {
  isPremium = !isPremium;
  updatePremiumUI();
  document.getElementById('toggle-premium').textContent = isPremium ? 'Premium Active ✓' : 'Toggle Premium (Demo)';
  updatePreview();
});

document.getElementById('download-pdf').addEventListener('click', () => {
  const element = document.getElementById('cv-preview');
  const name = document.getElementById('fullName').value.trim() || 'My_CV';
  const safeName = name.replace(/[^a-z0-9]/gi, '_').substring(0, 40);
  const opt = {
    margin: [8, 8, 8, 8],
    filename: `${safeName}_East_African_CV.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  const btn = document.getElementById('download-pdf');
  const originalText = btn.textContent;
  btn.textContent = 'Generating PDF...';
  btn.disabled = true;
  html2pdf().set(opt).from(element).save().then(() => {
    btn.textContent = originalText;
    btn.disabled = false;
  }).catch(() => {
    btn.textContent = originalText;
    btn.disabled = false;
    alert('PDF generation failed. Please try again.');
  });
});

document.getElementById('download-cover')?.addEventListener('click', () => {
  const name = document.getElementById('fullName').value.trim() || 'Applicant';
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const location = document.getElementById('location').value.trim();
  const jobTitle = document.getElementById('coverJobTitle').value.trim() || 'Position';
  const company = document.getElementById('coverCompany').value.trim() || 'Company';
  const content = document.getElementById('coverContent').value.trim() || 'Dear Hiring Manager,\n\nI am writing to express my interest...';

  const coverEl = document.createElement('div');
  coverEl.style.cssText = 'padding: 20mm; font-family: system-ui, sans-serif; font-size: 11pt; line-height: 1.5; color: #222; max-width: 210mm;';
  coverEl.innerHTML = `
    <div style="margin-bottom: 20px;"><strong>${escapeHtml(name)}</strong><br>
      ${email ? escapeHtml(email) + '<br>' : ''}${phone ? escapeHtml(phone) + '<br>' : ''}${location ? escapeHtml(location) : ''}</div>
    <div style="margin-bottom: 20px;">${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
    <div style="margin-bottom: 20px;">Hiring Manager<br>${escapeHtml(company)}</div>
    <div style="margin-bottom: 16px;"><strong>Re: Application for ${escapeHtml(jobTitle)}</strong></div>
    <div style="white-space: pre-wrap;">${escapeHtml(content)}</div>
    <div style="margin-top: 30px;">Yours sincerely,<br><br>${escapeHtml(name)}</div>`;

  document.body.appendChild(coverEl);
  const opt = {
    margin: [15, 15, 15, 15],
    filename: `${name.replace(/[^a-z0-9]/gi, '_')}_Cover_Letter.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(coverEl).save().then(() => document.body.removeChild(coverEl))
    .catch(() => { document.body.removeChild(coverEl); alert('Cover letter PDF failed.'); });
});

document.getElementById('cv-form').addEventListener('input', updatePreview);
document.getElementById('cv-form').addEventListener('change', updatePreview);

applyTemplate();
updatePreview();
updatePremiumUI();
