const sanitizeHtml = require('sanitize-html');

const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>"'&]/g, (c) => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;','&':'&amp;'}[c]));
};

const sanitizeContent = (html) => sanitizeHtml(html, {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3']),
  allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, img: ['src','alt'] }
});

module.exports = { sanitizeInput, sanitizeContent };
