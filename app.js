// AfriCV by KCL PLATFORM TZ - Full Features
// ATS Score, Job Tailor, Examples, WhatsApp, 5 Templates, Cover Letter, Suggestions

let photoDataUrl = null;
let currentTemplate = 'classic';

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function createExperienceEntry(data = {}) {
  return `<div class="entry experience-entry">
    <label>Job Title <input type="text" class="job-title" value="${escapeHtml(data.title || '')}" placeholder="e.g. Sales Assistant"></label>
    <label>Company <input type="text" class="company" value="${escapeHtml(data.company || '')}" placeholder="e.g. CRDB Bank"></label>
    <label>Dates <input type="text" class="dates" value="${escapeHtml(data.dates || '')}" placeholder="Jan 2022 – Present"></label>
    <label>Description <textarea class="description" rows="3" placeholder="Key achievements...">${escapeHtml(data.desc || '')}</textarea></label>
    <button type="button" class="remove-entry">Remove</button>
  </div>`;
}
function createEducationEntry(data = {}) {
  return `<div class="entry education-entry">
    <label>Degree <input type="text" class="degree" value="${escapeHtml(data.degree || '')}" placeholder="e.g. BBA"></label>
    <label>Institution <input type="text" class="institution" value="${escapeHtml(data.institution || '')}" placeholder="e.g. UDSM"></label>
    <label>Years <input type="text" class="years" value="${escapeHtml(data.years || '')}" placeholder="2019 – 2023"></label>
    <button type="button" class="remove-entry">Remove</button>
  </div>`;
}
function createCertificationEntry(data = {}) {
  return `<div class="entry certification-entry">
    <label>Name <input type="text" class="cert-name" value="${escapeHtml(data.name || '')}" placeholder="e.g. Microsoft Office"></label>
    <label>Issuer <input type="text" class="cert-issuer" value="${escapeHtml(data.issuer || '')}" placeholder="e.g. Microsoft"></label>
    <label>Year <input type="text" class="cert-year" value="${escapeHtml(data.year || '')}" placeholder="2024"></label>
    <button type="button" class="remove-entry">Remove</button>
  </div>`;
}
function createReferenceEntry(data = {}) {
  return `<div class="entry reference-entry">
    <label>Name <input type="text" class="ref-name" value="${escapeHtml(data.name || '')}" placeholder="e.g. John Mwakasege"></label>
    <label>Position <input type="text" class="ref-position" value="${escapeHtml(data.position || '')}" placeholder="e.g. Supervisor"></label>
    <label>Contact <input type="text" class="ref-contact" value="${escapeHtml(data.contact || '')}" placeholder="Phone or Email"></label>
    <button type="button" class="remove-entry">Remove</button>
  </div>`;
}

document.getElementById('experience-container').innerHTML = createExperienceEntry();
document.getElementById('education-container').innerHTML = createEducationEntry();
document.getElementById('certifications-container').innerHTML = createCertificationEntry();
document.getElementById('references-container').innerHTML = createReferenceEntry();

document.getElementById('add-experience').onclick = () => { document.getElementById('experience-container').insertAdjacentHTML('beforeend', createExperienceEntry()); updatePreview(); };
document.getElementById('add-education').onclick = () => { document.getElementById('education-container').insertAdjacentHTML('beforeend', createEducationEntry()); updatePreview(); };
document.getElementById('add-certification').onclick = () => { document.getElementById('certifications-container').insertAdjacentHTML('beforeend', createCertificationEntry()); updatePreview(); };
document.getElementById('add-reference').onclick = () => { document.getElementById('references-container').insertAdjacentHTML('beforeend', createReferenceEntry()); updatePreview(); };

document.getElementById('cv-form').addEventListener('click', e => {
  if (e.target.classList.contains('remove-entry')) { e.target.closest('.entry')?.remove(); updatePreview(); }
});

const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const removePhotoBtn = document.getElementById('removePhoto');

photoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { alert('Photo max 2MB'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    photoDataUrl = ev.target.result;
    photoPreview.src = photoDataUrl;
    photoPreview.style.display = 'block';
    removePhotoBtn.style.display = 'inline-block';
    updatePreview();
  };
  reader.readAsDataURL(file);
});
removePhotoBtn.onclick = () => {
  photoDataUrl = null;
  photoPreview.style.display = 'none';
  removePhotoBtn.style.display = 'none';
  photoInput.value = '';
  updatePreview();
};

document.querySelectorAll('input[name="template"]').forEach(r => {
  r.addEventListener('change', e => { currentTemplate = e.target.value; applyTemplate(); updatePreview(); });
});
function applyTemplate() {
  document.getElementById('cv-preview').className = 'cv-document template-' + currentTemplate;
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
  const experiences = [...document.querySelectorAll('.experience-entry')].map(e => ({
    title: e.querySelector('.job-title')?.value.trim() || '', company: e.querySelector('.company')?.value.trim() || '',
    dates: e.querySelector('.dates')?.value.trim() || '', desc: e.querySelector('.description')?.value.trim() || ''
  })).filter(e => e.title || e.company);
  const education = [...document.querySelectorAll('.education-entry')].map(e => ({
    degree: e.querySelector('.degree')?.value.trim() || '', institution: e.querySelector('.institution')?.value.trim() || '', years: e.querySelector('.years')?.value.trim() || ''
  })).filter(e => e.degree || e.institution);
  const certifications = [...document.querySelectorAll('.certification-entry')].map(e => ({
    name: e.querySelector('.cert-name')?.value.trim() || '', issuer: e.querySelector('.cert-issuer')?.value.trim() || '', year: e.querySelector('.cert-year')?.value.trim() || ''
  })).filter(c => c.name);
  const references = [...document.querySelectorAll('.reference-entry')].map(e => ({
    name: e.querySelector('.ref-name')?.value.trim() || '', position: e.querySelector('.ref-position')?.value.trim() || '', contact: e.querySelector('.ref-contact')?.value.trim() || ''
  })).filter(r => r.name);
  const contact = [email, phone, location, linkedin].filter(Boolean).join('  •  ');
  let html = photoDataUrl
    ? `<header class="cv-header has-photo"><div class="header-text"><h1>${escapeHtml(name)}</h1>${contact ? `<p class="contact">${escapeHtml(contact)}</p>` : ''}</div><img src="${photoDataUrl}" class="cv-photo" alt=""></header>`
    : `<header class="cv-header"><h1>${escapeHtml(name)}</h1>${contact ? `<p class="contact">${escapeHtml(contact)}</p>` : ''}</header>`;
  if (summary) html += `<section class="cv-section"><h2>Professional Summary</h2><p>${escapeHtml(summary)}</p></section>`;
  if (experiences.length) {
    html += `<section class="cv-section"><h2>Work Experience</h2>`;
    experiences.forEach(exp => { html += `<div class="job"><h3>${escapeHtml(exp.title)}${exp.company ? ` — ${escapeHtml(exp.company)}` : ''}</h3>${exp.dates ? `<p class="dates">${escapeHtml(exp.dates)}</p>` : ''}${exp.desc ? `<p>${escapeHtml(exp.desc)}</p>` : ''}</div>`; });
    html += `</section>`;
  }
  if (education.length) {
    html += `<section class="cv-section"><h2>Education</h2>`;
    education.forEach(edu => { html += `<div class="edu"><h3>${escapeHtml(edu.degree)}${edu.institution ? ` — ${escapeHtml(edu.institution)}` : ''}</h3>${edu.years ? `<p class="dates">${escapeHtml(edu.years)}</p>` : ''}</div>`; });
    html += `</section>`;
  }
  if (skills) html += `<section class="cv-section"><h2>Skills</h2><p class="skills-list">${escapeHtml(skills)}</p></section>`;
  if (languages) html += `<section class="cv-section"><h2>Languages</h2><p class="skills-list">${escapeHtml(languages)}</p></section>`;
  if (certifications.length) {
    html += `<section class="cv-section"><h2>Certifications & Training</h2>`;
    certifications.forEach(c => { html += `<div class="edu"><h3>${escapeHtml(c.name)}${c.issuer ? ` — ${escapeHtml(c.issuer)}` : ''}</h3>${c.year ? `<p class="dates">${escapeHtml(c.year)}</p>` : ''}</div>`; });
    html += `</section>`;
  }
  if (references.length) {
    html += `<section class="cv-section"><h2>References</h2>`;
    references.forEach(r => { html += `<div class="ref"><p><strong>${escapeHtml(r.name)}</strong>${r.position ? ` — ${escapeHtml(r.position)}` : ''}</p>${r.contact ? `<p>${escapeHtml(r.contact)}</p>` : ''}</div>`; });
    html += `</section>`;
  }
  document.getElementById('cv-preview').innerHTML = html;
  applyTemplate();
}

function calcATSScore() {
  let score = 0; const tips = [];
  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const summary = document.getElementById('summary').value.trim();
  const skills = document.getElementById('skills').value.trim();
  const languages = document.getElementById('languages').value.trim();
  const exps = [...document.querySelectorAll('.experience-entry')].filter(e => e.querySelector('.job-title')?.value.trim());
  const edus = [...document.querySelectorAll('.education-entry')].filter(e => e.querySelector('.degree')?.value.trim());
  const refs = [...document.querySelectorAll('.reference-entry')].filter(e => e.querySelector('.ref-name')?.value.trim());
  if (name) score += 10; else tips.push('Add your full name');
  if (email && email.includes('@')) score += 10; else tips.push('Add a professional email');
  if (phone) score += 8; else tips.push('Add a phone number (+255 format preferred)');
  if (summary && summary.length > 40) score += 15; else tips.push('Write a clear professional summary (2-4 sentences)');
  if (exps.length >= 1) score += 20; else tips.push('Add at least one work experience');
  if (edus.length >= 1) score += 12; else tips.push('Add your education');
  if (skills && skills.split(',').length >= 3) score += 12; else tips.push('List at least 3 skills');
  if (languages) score += 8; else tips.push('Add languages (English + Kiswahili is strong)');
  if (refs.length >= 1) score += 5; else tips.push('Add 1-2 references (expected in East Africa)');
  if (summary.length > 100) score += 5;
  if (exps.some(e => (e.querySelector('.description')?.value || '').length > 30)) score += 5;
  return { score: Math.min(100, score), tips };
}

document.getElementById('btn-ats').onclick = () => {
  document.querySelectorAll('.smart-panel').forEach(p => p.style.display = 'none');
  document.getElementById('ats-panel').style.display = 'block';
  const { score, tips } = calcATSScore();
  document.getElementById('ats-score-num').textContent = score;
  document.getElementById('ats-tips').innerHTML = tips.length ? tips.map(t => `<li>${t}</li>`).join('') : '<li>Great! Your CV looks solid for ATS.</li>';
};

document.getElementById('btn-tailor').onclick = () => {
  document.querySelectorAll('.smart-panel').forEach(p => p.style.display = 'none');
  document.getElementById('tailor-panel').style.display = 'block';
};

document.getElementById('run-tailor').onclick = () => {
  const jd = document.getElementById('job-description').value.toLowerCase();
  if (!jd || jd.length < 20) { alert('Paste a job description first'); return; }
  const cvText = [document.getElementById('summary').value, document.getElementById('skills').value, document.getElementById('languages').value,
    ...[...document.querySelectorAll('.job-title, .company, .description, .degree, .cert-name')].map(el => el.value)].join(' ').toLowerCase();
  const stop = new Set(['with','that','this','from','have','will','your','their','about','which','would','should','could','been','were','they','them','than','then','also','into','only','other','over','such','more','most','some','what','when','where','while','there','these','those','being','through','under','after','before','between']);
  const words = jd.match(/[a-z]{4,}/g) || [];
  const freq = {};
  words.forEach(w => { if (!stop.has(w)) freq[w] = (freq[w] || 0) + 1; });
  const keywords = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0, 20).map(e => e[0]);
  const matched = keywords.filter(k => cvText.includes(k));
  const missing = keywords.filter(k => !cvText.includes(k)).slice(0, 8);
  const pct = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0;
  const res = document.getElementById('tailor-results');
  res.style.display = 'block';
  res.innerHTML = `<p><strong>Match: ${pct}%</strong> (${matched.length}/${keywords.length} keywords)</p><p style="margin-top:0.4rem"><strong>Found:</strong> ${matched.slice(0,10).join(', ') || '—'}</p><p style="margin-top:0.4rem"><strong>Consider adding:</strong> ${missing.join(', ') || 'None — good coverage!'}</p>`;
};

const EXAMPLES = {
  graduate: { fullName: 'Neema Amani Mwita', email: 'neema.mwita@gmail.com', phone: '+255 712 345 678', location: 'Dar es Salaam, Tanzania',
    summary: 'Recent Bachelor of Business Administration graduate from the University of Dar es Salaam with strong skills in communication, Microsoft Office and customer service. Eager to contribute to a dynamic organization and grow professionally.',
    skills: 'Microsoft Office, Communication, Customer Service, Teamwork, Time Management, Data Entry', languages: 'English - Fluent, Kiswahili - Native',
    experiences: [{ title: 'Intern – Customer Service', company: 'Vodacom Tanzania', dates: 'Jun 2023 – Sep 2023', desc: 'Assisted customers with inquiries and resolved issues.' }],
    education: [{ degree: 'Bachelor of Business Administration', institution: 'University of Dar es Salaam', years: '2020 – 2024' }],
    certifications: [{ name: 'Microsoft Office Specialist', issuer: 'Microsoft', year: '2023' }],
    references: [{ name: 'Mr. James Kimaro', position: 'Supervisor, Vodacom', contact: '+255 755 111 222' }] },
  experienced: { fullName: 'Josephat M. Nkwabi', email: 'josephat.nkwabi@gmail.com', phone: '+255 754 987 654', location: 'Arusha, Tanzania',
    summary: 'Results-driven professional with 6+ years of experience in sales and operations. Proven track record of exceeding targets across East Africa.',
    skills: 'Sales Management, Negotiation, CRM, Leadership, Report Writing, MS Excel', languages: 'English - Fluent, Kiswahili - Native',
    experiences: [{ title: 'Sales Manager', company: 'Azam Group', dates: '2021 – Present', desc: 'Led a team of 8. Increased regional sales by 28% in 2023.' }],
    education: [{ degree: 'Diploma in Business Management', institution: 'Institute of Accountancy Arusha', years: '2015 – 2017' }],
    certifications: [{ name: 'Sales Leadership Certificate', issuer: 'Tanzania Institute of Sales', year: '2022' }],
    references: [{ name: 'Ms. Grace Lyimo', position: 'Regional Manager, Azam', contact: 'grace.lyimo@azam.co.tz' }] },
  bank: { fullName: 'Amina Hassan Juma', email: 'amina.hjuma@gmail.com', phone: '+255 713 222 333', location: 'Dar es Salaam, Tanzania',
    summary: 'Banking professional with 4 years experience in customer relationship management and retail banking. Strong knowledge of KYC and banking products.',
    skills: 'Customer Relationship, KYC, Cash Handling, Banking Products, Microsoft Office', languages: 'English - Fluent, Kiswahili - Native',
    experiences: [{ title: 'Customer Service Officer', company: 'CRDB Bank', dates: '2020 – Present', desc: 'Handled daily transactions and KYC compliance.' }],
    education: [{ degree: 'Bachelor of Commerce (Finance)', institution: 'Mzumbe University', years: '2016 – 2019' }],
    certifications: [{ name: 'Certificate in Banking Operations', issuer: 'Tanzania Institute of Bankers', year: '2021' }],
    references: [{ name: 'Mr. Peter Mushi', position: 'Branch Manager, CRDB', contact: '+255 755 444 555' }] },
  teacher: { fullName: 'Sarah W. Mwakasege', email: 'sarah.mwakasege@gmail.com', phone: '+255 756 888 999', location: 'Mwanza, Tanzania',
    summary: 'Dedicated secondary school teacher with 5 years experience teaching English and Literature. Passionate about student development.',
    skills: 'Classroom Management, Lesson Planning, Assessment, Communication, Mentoring', languages: 'English - Fluent, Kiswahili - Native',
    experiences: [{ title: 'English Teacher', company: 'Nyanza Secondary School', dates: '2019 – Present', desc: 'Taught Form 1–4 English. Improved pass rates by 18%.' }],
    education: [{ degree: 'Bachelor of Arts with Education', institution: 'University of Dar es Salaam', years: '2014 – 2018' }],
    certifications: [{ name: 'Teaching Methodology Certificate', issuer: 'Ministry of Education', year: '2019' }],
    references: [{ name: 'Mr. Daniel Ngowi', position: 'Head of School', contact: '+255 754 333 111' }] }
};

document.getElementById('btn-examples').onclick = () => {
  document.querySelectorAll('.smart-panel').forEach(p => p.style.display = 'none');
  document.getElementById('examples-panel').style.display = 'block';
};

document.querySelectorAll('.load-example').forEach(btn => {
  btn.onclick = () => {
    const data = EXAMPLES[btn.dataset.example];
    if (!data) return;
    document.getElementById('fullName').value = data.fullName || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('location').value = data.location || '';
    document.getElementById('summary').value = data.summary || '';
    document.getElementById('skills').value = data.skills || '';
    document.getElementById('languages').value = data.languages || '';
    const expC = document.getElementById('experience-container'); expC.innerHTML = '';
    (data.experiences || [{}]).forEach(e => expC.insertAdjacentHTML('beforeend', createExperienceEntry(e)));
    const eduC = document.getElementById('education-container'); eduC.innerHTML = '';
    (data.education || [{}]).forEach(e => eduC.insertAdjacentHTML('beforeend', createEducationEntry(e)));
    const certC = document.getElementById('certifications-container'); certC.innerHTML = '';
    (data.certifications || [{}]).forEach(e => certC.insertAdjacentHTML('beforeend', createCertificationEntry(e)));
    const refC = document.getElementById('references-container'); refC.innerHTML = '';
    (data.references || [{}]).forEach(e => refC.insertAdjacentHTML('beforeend', createReferenceEntry(e)));
    document.getElementById('examples-panel').style.display = 'none';
    updatePreview();
    alert('Example loaded! Edit as you like.');
  };
});

document.querySelectorAll('.close-panel').forEach(btn => { btn.onclick = () => btn.closest('.smart-panel').style.display = 'none'; });

document.getElementById('btn-whatsapp').onclick = () => {
  const name = document.getElementById('fullName').value.trim() || 'My CV';
  const text = encodeURIComponent(`Check out my professional CV created with AfriCV (KCL PLATFORM TZ):\n\n${name}\n\nCreate yours free: https://shabanihamidu19-cell.github.io/east-african-cv-builder/`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
};

document.getElementById('suggest-summary').onclick = () => {
  const name = document.getElementById('fullName').value.trim() || 'Professional';
  const skills = document.getElementById('skills').value.trim() || 'key skills';
  const loc = document.getElementById('location').value.trim() || 'East Africa';
  document.getElementById('summary').value = `${name.split(' ')[0]} is a motivated professional based in ${loc} with strong skills in ${skills.split(',').slice(0,3).join(', ').trim()}. Eager to contribute to organizational success and grow within a dynamic team.`;
  updatePreview();
};

document.getElementById('suggest-cover').onclick = () => {
  const name = document.getElementById('fullName').value.trim() || 'Applicant';
  const job = document.getElementById('coverJobTitle').value.trim() || 'the position';
  const company = document.getElementById('coverCompany').value.trim() || 'your organization';
  document.getElementById('coverContent').value = `Dear Hiring Manager,\n\nI am writing to express my interest in the ${job} role at ${company}. With my background and skills, I am confident I can contribute effectively to your team.\n\nI would welcome the opportunity to discuss how my experience aligns with your needs. Thank you for considering my application.\n\nYours sincerely,\n${name}`;
};

function collectFormData() {
  return {
    fullName: document.getElementById('fullName').value, email: document.getElementById('email').value,
    phone: document.getElementById('phone').value, location: document.getElementById('location').value,
    linkedin: document.getElementById('linkedin').value, summary: document.getElementById('summary').value,
    skills: document.getElementById('skills').value, languages: document.getElementById('languages').value, photoDataUrl,
    experiences: [...document.querySelectorAll('.experience-entry')].map(e => ({ title: e.querySelector('.job-title')?.value || '', company: e.querySelector('.company')?.value || '', dates: e.querySelector('.dates')?.value || '', desc: e.querySelector('.description')?.value || '' })),
    education: [...document.querySelectorAll('.education-entry')].map(e => ({ degree: e.querySelector('.degree')?.value || '', institution: e.querySelector('.institution')?.value || '', years: e.querySelector('.years')?.value || '' })),
    certifications: [...document.querySelectorAll('.certification-entry')].map(e => ({ name: e.querySelector('.cert-name')?.value || '', issuer: e.querySelector('.cert-issuer')?.value || '', year: e.querySelector('.cert-year')?.value || '' })),
    references: [...document.querySelectorAll('.reference-entry')].map(e => ({ name: e.querySelector('.ref-name')?.value || '', position: e.querySelector('.ref-position')?.value || '', contact: e.querySelector('.ref-contact')?.value || '' })),
    currentTemplate, coverJobTitle: document.getElementById('coverJobTitle')?.value || '', coverCompany: document.getElementById('coverCompany')?.value || '', coverContent: document.getElementById('coverContent')?.value || ''
  };
}

document.getElementById('save-cv').onclick = () => {
  try { localStorage.setItem('africv_draft', JSON.stringify(collectFormData())); alert('Draft saved!'); }
  catch { alert('Save failed (photo may be too large)'); }
};

document.getElementById('load-cv').onclick = () => {
  const raw = localStorage.getItem('africv_draft');
  if (!raw) { alert('No draft found'); return; }
  try {
    const data = JSON.parse(raw);
    document.getElementById('fullName').value = data.fullName || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('location').value = data.location || '';
    document.getElementById('linkedin').value = data.linkedin || '';
    document.getElementById('summary').value = data.summary || '';
    document.getElementById('skills').value = data.skills || '';
    document.getElementById('languages').value = data.languages || '';
    if (data.photoDataUrl) { photoDataUrl = data.photoDataUrl; photoPreview.src = photoDataUrl; photoPreview.style.display = 'block'; removePhotoBtn.style.display = 'inline-block'; }
    const expC = document.getElementById('experience-container'); expC.innerHTML = '';
    (data.experiences || [{}]).forEach(e => expC.insertAdjacentHTML('beforeend', createExperienceEntry(e)));
    const eduC = document.getElementById('education-container'); eduC.innerHTML = '';
    (data.education || [{}]).forEach(e => eduC.insertAdjacentHTML('beforeend', createEducationEntry(e)));
    const certC = document.getElementById('certifications-container'); certC.innerHTML = '';
    (data.certifications || [{}]).forEach(e => certC.insertAdjacentHTML('beforeend', createCertificationEntry(e)));
    const refC = document.getElementById('references-container'); refC.innerHTML = '';
    (data.references || [{}]).forEach(e => refC.insertAdjacentHTML('beforeend', createReferenceEntry(e)));
    if (data.coverJobTitle) document.getElementById('coverJobTitle').value = data.coverJobTitle;
    if (data.coverCompany) document.getElementById('coverCompany').value = data.coverCompany;
    if (data.coverContent) document.getElementById('coverContent').value = data.coverContent;
    currentTemplate = data.currentTemplate || 'classic';
    const radio = document.querySelector(`input[name="template"][value="${currentTemplate}"]`);
    if (radio) radio.checked = true;
    updatePreview();
    alert('Draft loaded!');
  } catch { alert('Failed to load draft'); }
};

document.getElementById('download-pdf').onclick = () => {
  const el = document.getElementById('cv-preview');
  const name = (document.getElementById('fullName').value.trim() || 'My_CV').replace(/[^a-z0-9]/gi, '_').substring(0, 40);
  const btn = document.getElementById('download-pdf');
  btn.textContent = 'Generating...'; btn.disabled = true;
  html2pdf().set({ margin: [8,8,8,8], filename: `${name}_AfriCV.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(el).save().finally(() => { btn.textContent = 'Download CV PDF'; btn.disabled = false; });
};

document.getElementById('download-cover').onclick = () => {
  const name = document.getElementById('fullName').value.trim() || 'Applicant';
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const location = document.getElementById('location').value.trim();
  const job = document.getElementById('coverJobTitle').value.trim() || 'Position';
  const company = document.getElementById('coverCompany').value.trim() || 'Company';
  const content = document.getElementById('coverContent').value.trim() || 'Dear Hiring Manager,\n\nI am writing to express my interest...';
  const coverEl = document.createElement('div');
  coverEl.style.cssText = 'padding:18mm;font-family:system-ui,sans-serif;font-size:11pt;line-height:1.5;color:#222;max-width:210mm;';
  coverEl.innerHTML = `<div style="margin-bottom:18px"><strong>${escapeHtml(name)}</strong><br>${email?escapeHtml(email)+'<br>':''}${phone?escapeHtml(phone)+'<br>':''}${location?escapeHtml(location):''}</div>
    <div style="margin-bottom:18px">${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div>
    <div style="margin-bottom:18px">Hiring Manager<br>${escapeHtml(company)}</div>
    <div style="margin-bottom:14px"><strong>Re: Application for ${escapeHtml(job)}</strong></div>
    <div style="white-space:pre-wrap">${escapeHtml(content)}</div>
    <div style="margin-top:28px">Yours sincerely,<br><br>${escapeHtml(name)}</div>`;
  document.body.appendChild(coverEl);
  html2pdf().set({ margin: [12,12,12,12], filename: `${name.replace(/[^a-z0-9]/gi,'_')}_Cover_Letter.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(coverEl).save().then(() => document.body.removeChild(coverEl));
};

document.getElementById('cv-form').addEventListener('input', updatePreview);
document.getElementById('cv-form').addEventListener('change', updatePreview);
applyTemplate();
updatePreview();
