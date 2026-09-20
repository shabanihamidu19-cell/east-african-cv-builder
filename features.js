// Extra features: LinkedIn, DOCX, Clear Form
(function () {
  const btnLi = document.getElementById('btn-linkedin');
  if (!btnLi) return;

  btnLi.onclick = () => {
    document.querySelectorAll('.smart-panel').forEach(p => p.style.display = 'none');
    document.getElementById('linkedin-panel').style.display = 'block';
  };

  document.getElementById('gen-linkedin').onclick = () => {
    const name = document.getElementById('fullName').value.trim() || 'Professional';
    const skills = document.getElementById('skills').value.trim();
    const location = document.getElementById('location').value.trim() || 'East Africa';
    const summary = document.getElementById('summary').value.trim();
    const exp = document.querySelector('.experience-entry .job-title')?.value.trim() || '';
    const company = document.querySelector('.experience-entry .company')?.value.trim() || '';

    let headline = '';
    if (exp && company) {
      headline = exp + ' at ' + company + ' | ' + (skills.split(',').slice(0, 3).map(s => s.trim()).join(' · ') || 'Open to opportunities');
    } else if (skills) {
      headline = name.split(' ').slice(-1)[0] + ' | ' + skills.split(',').slice(0, 4).map(s => s.trim()).join(' · ') + ' | ' + location;
    } else {
      headline = name + ' | Open to opportunities | ' + location;
    }
    if (headline.length > 220) headline = headline.substring(0, 217) + '...';

    const about = summary || (name + ' is a professional based in ' + location + (skills ? ' with skills in ' + skills.split(',').slice(0, 5).map(s => s.trim()).join(', ') : '') + '. Passionate about growth and delivering results.');

    document.getElementById('li-headline').value = headline;
    document.getElementById('li-about').value = about;
  };

  document.getElementById('copy-headline').onclick = () => {
    const t = document.getElementById('li-headline');
    t.select();
    navigator.clipboard.writeText(t.value).then(() => alert('Headline copied!')).catch(() => alert('Select and copy manually'));
  };
  document.getElementById('copy-about').onclick = () => {
    const t = document.getElementById('li-about');
    t.select();
    navigator.clipboard.writeText(t.value).then(() => alert('About copied!')).catch(() => alert('Select and copy manually'));
  };

  document.getElementById('download-docx').onclick = () => {
    const name = (document.getElementById('fullName').value.trim() || 'My_CV').replace(/[^a-z0-9]/gi, '_').substring(0, 40);
    const preview = document.getElementById('cv-preview');
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' +
      'body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.4;color:#222;margin:20px;}' +
      'h1{font-size:18pt;margin-bottom:4px;}h2{font-size:12pt;text-transform:uppercase;border-bottom:1px solid #333;padding-bottom:2px;margin-top:14px;}' +
      'h3{font-size:11pt;margin:6px 0 2px;}.contact{font-size:10pt;color:#444;}.dates{font-size:9pt;font-style:italic;color:#555;}' +
      '</style></head><body>' + preview.innerHTML + '</body></html>';
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name + '_AfriCV.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  document.getElementById('clear-form').onclick = () => {
    if (!confirm('Clear all form data?')) return;
    document.getElementById('cv-form').reset();
    if (typeof photoDataUrl !== 'undefined') photoDataUrl = null;
    const pp = document.getElementById('photoPreview');
    const rp = document.getElementById('removePhoto');
    const pi = document.getElementById('photoInput');
    if (pp) pp.style.display = 'none';
    if (rp) rp.style.display = 'none';
    if (pi) pi.value = '';
    if (typeof createExperienceEntry === 'function') {
      document.getElementById('experience-container').innerHTML = createExperienceEntry();
      document.getElementById('education-container').innerHTML = createEducationEntry();
      document.getElementById('certifications-container').innerHTML = createCertificationEntry();
      document.getElementById('references-container').innerHTML = createReferenceEntry();
    }
    if (typeof currentTemplate !== 'undefined') currentTemplate = 'classic';
    const radio = document.querySelector('input[name="template"][value="classic"]');
    if (radio) radio.checked = true;
    if (typeof updatePreview === 'function') updatePreview();
  };
})();
