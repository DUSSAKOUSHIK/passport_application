const reqFields = [
  'firstName', 'lastName', 'dob', 'pob', 'aadhaar', 'mobile', 'email',
  'presentAddr', 'city', 'state', 'pin', 'permanentAddr', 'appType',
  'scheme', 'fatherName', 'motherName', 'emergencyName',
  'emergencyPhone', 'maritalStatus', 'nationality'
];

function updateProgress() {
  let filled = 0,
      total = reqFields.length + 2;

  reqFields.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value.trim() && el.offsetParent !== null) filled++;
  });

  if (document.querySelector('input[name="gender"]:checked')) filled++;

  if (
    document.getElementById('declarationCheck').checked &&
    document.getElementById('termsCheck').checked
  ) {
    filled++;
  }

  const pct = Math.round((filled / total) * 100);

  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = pct + '% complete';
}

reqFields.forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateProgress);
});

document.querySelectorAll('input[name="gender"]').forEach(r =>
  r.addEventListener('change', updateProgress)
);

document.getElementById('declarationCheck').addEventListener('change', updateProgress);
document.getElementById('termsCheck').addEventListener('change', updateProgress);

document.getElementById('maritalStatus').addEventListener('change', function () {
  document.getElementById('spouseField').style.display =
    this.value === 'Married' ? 'block' : 'none';
  updateProgress();
});

document.getElementById('appType').addEventListener('change', function () {
  const show =
    this.value === 'Renewal / Re-issue' ||
    this.value === 'Duplicate Passport';

  document.getElementById('prevPassportField').style.display =
    show ? 'block' : 'none';
});

document.getElementById('sameAddress').addEventListener('change', function () {
  const field = document.getElementById('permanentAddrField');
  const perm = document.getElementById('permanentAddr');

  if (this.checked) {
    perm.value = document.getElementById('presentAddr').value;
    field.style.display = 'none';
    perm.removeAttribute('required');
  } else {
    perm.value = '';
    field.style.display = 'block';
    perm.setAttribute('required', '');
  }

  updateProgress();
});

document.getElementById('aadhaar').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 12);
  this.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
});

document.getElementById('pan').addEventListener('input', function () {
  this.value = this.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 10);
});

function validate() {
  let valid = true;

  reqFields.forEach(id => {
    const el = document.getElementById(id);

    if (!el || el.offsetParent === null) return;

    if (!el.value.trim()) {
      el.classList.add('is-invalid');
      el.classList.remove('is-valid');
      valid = false;
    } else {
      el.classList.remove('is-invalid');
      el.classList.add('is-valid');
    }
  });

  if (!document.querySelector('input[name="gender"]:checked')) {
    document.getElementById('genderError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('genderError').style.display = 'none';
  }

  const aadhaar = document.getElementById('aadhaar').value.replace(/\s/g, '');

  if (aadhaar.length !== 12) {
    document.getElementById('aadhaar').classList.add('is-invalid');
    valid = false;
  }

  if (!/^\d{10}$/.test(document.getElementById('mobile').value)) {
    document.getElementById('mobile').classList.add('is-invalid');
    document.getElementById('mobileError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('mobileError').style.display = 'none';
  }

  if (!/^\d{6}$/.test(document.getElementById('pin').value)) {
    document.getElementById('pin').classList.add('is-invalid');
    valid = false;
  }

  if (
    !document.getElementById('declarationCheck').checked ||
    !document.getElementById('termsCheck').checked
  ) {
    document.getElementById('checkError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('checkError').style.display = 'none';
  }

  return valid;
}

document.getElementById('passportForm').addEventListener('submit', function (e) {
  e.preventDefault();

  if (!validate()) {
    const first = document.querySelector('.is-invalid');

    if (first) {
      first.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }

    return;
  }

  const ref =
    'PSP-2026-' +
    Math.random().toString(36).substr(2, 6).toUpperCase();

  document.getElementById('refNumber').textContent = 'REF: ' + ref;
  document.getElementById('formCard').style.display = 'none';
  document.getElementById('successBanner').style.display = 'block';

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

function resetForm() {
  document.getElementById('passportForm').reset();
  document.getElementById('formCard').style.display = 'block';
  document.getElementById('successBanner').style.display = 'none';

  document
    .querySelectorAll('.is-invalid, .is-valid')
    .forEach(el => el.classList.remove('is-invalid', 'is-valid'));

  document.getElementById('permanentAddrField').style.display = 'block';
  document.getElementById('spouseField').style.display = 'none';
  document.getElementById('prevPassportField').style.display = 'none';
  document.getElementById('genderError').style.display = 'none';
  document.getElementById('checkError').style.display = 'none';

  updateProgress();

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

updateProgress();