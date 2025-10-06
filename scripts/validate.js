#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function isISODate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str) && !Number.isNaN(new Date(str).getTime());
}

function isFacebookUrl(u) {
  try {
    const url = new URL(u);
    return /facebook\.com/i.test(url.hostname);
  } catch (e) {
    return false;
  }
}

function validate(filePath) {
  const full = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(full)) {
    console.error('File not found:', full);
    process.exit(2);
  }

  const raw = fs.readFileSync(full, 'utf8');
  let arr;
  try {
    arr = JSON.parse(raw);
  } catch (e) {
    console.error('Invalid JSON:', e.message);
    process.exit(2);
  }

  if (!Array.isArray(arr)) {
    console.error('Expected an array of event objects.');
    process.exit(2);
  }

  const ids = new Set();
  let ok = true;

  arr.forEach((item, idx) => {
    const context = `Item[${idx}]`;
    if (typeof item !== 'object' || item === null) {
      console.error(context, 'must be an object');
      ok = false; return;
    }
    const required = ['id','title','date','location','description','facebook_post','contributor'];
    for (const r of required) {
      if (!item[r] || (typeof item[r] === 'string' && item[r].trim() === '')) {
        console.error(context, `missing or empty required field: ${r}`);
        ok = false;
      }
    }

    if (item.id) {
      if (ids.has(item.id)) {
        console.error(context, 'duplicate id:', item.id);
        ok = false;
      } else {
        ids.add(item.id);
      }
    }

    if (item.date && !isISODate(item.date)) {
      console.error(context, 'date must be ISO YYYY-MM-DD:', item.date);
      ok = false;
    }

    if (item.facebook_post && !/^https?:\/\//i.test(item.facebook_post)) {
      console.error(context, 'facebook_post must be an absolute URL:', item.facebook_post);
      ok = false;
    }

    if (item.facebook_post && !isFacebookUrl(item.facebook_post)) {
      console.warn(context, 'facebook_post does not look like a facebook.com URL:', item.facebook_post);
    }
  });

  if (ok) {
    console.log('Validation passed.');
    process.exit(0);
  } else {
    console.error('Validation failed.');
    process.exit(3);
  }
}

if (require.main === module) {
  const arg = process.argv[2] || 'data/events.json';
  validate(arg);
}
