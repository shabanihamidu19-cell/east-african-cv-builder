// ============================================
// East African CV & Resume Builder - app.js
// ============================================

let isPremium = false;

// ---------- Entry Templates ----------
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

// ---------- Initialize default entries ----------
document.getElementById('experience-container').innerHTML = createExperienceEntry();
document.getElementById('education-container').innerHTML = createEducationEntry();
document.getElementById('references-container').innerHTML = createReferenceEntry();

// ---------- Add buttons ----------
document.getElementById('add-experience').addEventListener('click', () => {
  document.getElementById('experience-container').insertAdjacentHTML('beforeend', createExperienceEntry());
  updatePreview();
});

document.getElementById('add-education').addEventListener('click', () => {
  document.getElementById('education-container').insertAdjacentHTML('beforeend', createEducationEntry());
  updatePreview();
});

document.getElementById('add-reference').addEventListener('click', () => {
  document.getElementById('references-container').insertAdjacentHTML('beforeend', createReferenceEntry());
  updatePreview();
});

// ---------- Remove entry (event delegation) ----------
document.getElementById('cv-form').addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-entry')) {
    const entry = e.target.closest('.entry');
    if (entry) {
      entry.remove();
      updatePreview();
    }
  }
});

// ---------- Live Preview Update ----------
function updatePreview() {
  const name = document.getElementById('fullName').value.trim() || 'Your Full Name';
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const location = document.getElementById('location').value.trim();
  const linkedin = document.getElementById('linkedin').value.trim();
  const summary = document.getElementById('summary').value.trim();
  const skills = document.getElementById('skills').value.trim();

  // Collect experiences
  const experiences = Array.from(document.querySelectorAll('.experience-entry')).map(entry => ({
    title: entry.querySelector('.job-title')?.value.trim() || '',
    company: entry.querySelector('.company')?.value.trim() || '',
    dates: entry.querySelector('.dates')?.value.trim() || '',
    desc: entry.querySelector('.description')?.value.trim() || ''
  })).filter(e => e.title || e.company);

  // Collect education
  const education = Array.from(document.querySelectorAll('.education-entry')).map(entry => ({
    degree: entry.querySelector('.degree')?.value.trim() || '',
    institution: entry.querySelector('.institution')?.value.trim() || '',
    years: entry.querySelector('.years')?.value.trim() || ''
  })).filter(e => e.degree || e.institution);

  // Collect references
  const references = Array.from(document.querySelectorAll('.reference-entry')).map(entry => ({
    name: entry.querySelector('.ref-name')?.value.trim() || '',
    position: entry.querySelector('.ref-position')?.value.trim() || '',
    contact: entry.querySelector('.ref-contact')?.value.trim() || ''
  })).filter(r => r.name);

  // Build contact line
  const contactParts = [email, phone, location, linkedin].filter(Boolean);
  const contactLine = contactParts.join('  •  ');

  let html = `
    <header class="cv-header">
      <h1>${escapeHtml(name)}</h1>
      ${contactLine ? `<p class="contact">${escapeHtml(contactLine)}</p>` : ''}
    </header>
  `;

  if (summary) {
    html += `
      <section class="cv-section">
        <h2>Professional Summary</h2>
        <p>${escapeHtml(summary)}</p>
      </section>
    `;
  }

  if (experiences.length > 0) {
    html += `<section class="cv-section"><h2>Work Experience</h2>`;
    experiences.forEach(exp => {
      html += `
        <div class="job">
          <h3>${escapeHtml(exp.title)}${exp.company ? ` — ${escapeHtml(exp.company)}` : ''}</h3>
          ${exp.dates ? `<p class="dates">${escapeHtml(exp.dates)}</p>` : ''}
          ${exp.desc ? `<p>${escapeHtml(exp.desc)}</p>` : ''}
        </div>
      `;
    });
    html += `</section>`;
  }

  if (education.length > 0) {
    html += `<section class="cv-section"><h2>Education</h2>`;
    education.forEach(edu => {
      html += `
        <div class="edu">
          <h3>${escapeHtml(edu.degree)}${edu.institution ? ` — ${escapeHtml(edu.institution)}` : ''}</h3>
          ${edu.years ? `<p class="dates">${escapeHtml(edu.years)}</p>` : ''}
        </div>
      `;
    });
    html += `</section>`;
  }

  if (skills) {
    html += `
      <section class="cv-section">
        <h2>Skills</h2>
        <p class="skills-list">${escapeHtml(skills)}</p>
      </section>
    `;
  }

  if (references.length > 0) {
    html += `<section class="cv-section"><h2>References</h2>`;
    references.forEach(ref => {
      html += `
        <div class="ref">
          <p><strong>${escapeHtml(ref.name)}</strong>${ref.position ? ` — ${escapeHtml(ref.position)}` : ''}</p>
          ${ref.contact ? `<p>${escapeHtml(ref.contact)}</p>` : ''}
        </div>
      `;
    });
    html += `</section>`;
  }

  // Inject content while preserving the watermark element
  const preview = document.getElementById('cv-preview');
  const watermark = document.getElementById('watermark');

  preview.innerHTML = html;
  if (watermark) {
    preview.appendChild(watermark);
  }

  // Re-apply premium state
  updatePremiumUI();
}

// ---------- Monetization: Premium Toggle ----------
function updatePremiumUI() {
  const watermark = document.getElementById('watermark');
  if (!watermark) return;

  if (isPremium) {
    watermark.classList.add('hidden');
  } else {
    watermark.classList.remove('hidden');
  }
}

document.getElementById('toggle-premium').addEventListener('click', () => {
  isPremium = !isPremium;
  updatePremiumUI();
  const btn = document.getElementById('toggle-premium');
  btn.textContent = isPremium ? 'Premium Active (Demo)' : 'Toggle Premium (Demo)';
});

// ---------- PDF Download ----------
document.getElementById('download-pdf').addEventListener('click', () => {
  const element = document.getElementById('cv-preview');
  const name = document.getElementById('fullName').value.trim() || 'My_CV';
  const safeName = name.replace(/[^a-z0-9]/gi, '_').substring(0, 40);

  const opt = {
    margin:       [8, 8, 8, 8],
    filename:     `${safeName}_East_African_CV.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      letterRendering: true
    },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Show loading state
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

// ---------- Live updates ----------
document.getElementById('cv-form').addEventListener('input', updatePreview);
document.getElementById('cv-form').addEventListener('change', updatePreview);

// Initial render
updatePreview();
