// Fill these in from your EmailJS account (emailjs.com → Email Services /
// Email Templates / Account → API Keys) before deploying.
var EMAILJS_PUBLIC_KEY = 'Jq1Bou9RSDXSZzABH';
var EMAILJS_SERVICE_ID = 'service_bbyqphe';
var EMAILJS_TEMPLATE_ID = 'template_d2n3qg5';
emailjs.init(EMAILJS_PUBLIC_KEY);

function validate() {
  var valid = true;

  // Name
  var name = $('#f-name').val().trim();
  if (name.length < 3) {
    $('#ff-name').addClass('has-error'); valid = false;
  } else { $('#ff-name').removeClass('has-error'); }

  // Email
  var email = $('#f-email').val().trim();
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    $('#ff-email').addClass('has-error'); valid = false;
  } else { $('#ff-email').removeClass('has-error'); }

  // Service
  if (!$('#f-service').val()) {
    $('#ff-service').addClass('has-error'); valid = false;
  } else { $('#ff-service').removeClass('has-error'); }

  // Message
  var msg = $('#f-msg').val().trim();
  if (msg.length < 20) {
    $('#ff-msg').addClass('has-error'); valid = false;
  } else { $('#ff-msg').removeClass('has-error'); }

  return valid;
}

$('#contact-form input, #contact-form textarea, #contact-form select').on('blur input change', validate);

$('#submit-btn').on('click', function () {
  if (!validate()) {
    showToast('Please fix the form errors.', '⚠️');
    return;
  }

  var name = $('#f-name').val().trim();
  var email = $('#f-email').val().trim();
  var service = $('#f-service').val();
  var message = $('#f-msg').val().trim();

  var $btn = $(this).prop('disabled', true).text('Sending…');
  var $pb = $('#progress-bar').show();
  var $pf = $('#progress-fill');
  var $fb = $('#form-feedback').hide().removeClass('success error');

  var pct = 0;
  var interval = setInterval(function () {
    pct += Math.random() * 15;
    if (pct > 90) pct = 90;
    $pf.css('width', pct + '%');
  }, 100);

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    name: name,
    email: email,
    service: service,
    message: message
  }).then(function () {
    clearInterval(interval);
    $pf.css('width', '100%');
    setTimeout(function () {
      $pb.hide(); $pf.css('width', '0%');
      $fb.addClass('success')
        .html('✅ Message sent! I\'ll reply within 24 hours.')
        .fadeIn(300);
      $btn.prop('disabled', false).text('Send Message →');
      showToast('Form submitted successfully!', '✅');
      $('#contact-form input, #contact-form textarea, #contact-form select').val('');
      $('#contact-form .form-field').removeClass('has-error');
    }, 400);
  }).catch(function (err) {
    clearInterval(interval);
    $pb.hide(); $pf.css('width', '0%');
    $fb.addClass('error')
      .html('⚠️ Something went wrong — please try again or email me directly.')
      .fadeIn(300);
    $btn.prop('disabled', false).text('Send Message →');
    showToast('Message failed to send.', '⚠️');
    console.error('EmailJS send failed:', err);
  });
});
