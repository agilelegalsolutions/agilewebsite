import test from 'node:test';
import assert from 'node:assert';

test('Security & Validation logic checks', async (t) => {
  // Test input sanitization
  const cleanInput = (msg) => {
    if (!msg || typeof msg !== 'string') return null;
    const trimmed = msg.trim();
    if (trimmed.length < 1 || trimmed.length > 400) return null;
    return trimmed;
  };

  assert.strictEqual(cleanInput(''), null);
  assert.strictEqual(cleanInput('   '), null);
  assert.strictEqual(cleanInput('a'.repeat(401)), null);
  assert.strictEqual(cleanInput('What is Class 42?'), 'What is Class 42?');

  // Test origin check logic
  const allowed = [
    'https://www.agiletrademarkfiling.com',
    'https://agiletrademarkfiling.com',
    'http://localhost:3000'
  ];
  const isAllowed = (origin) => allowed.includes(origin) || (origin && origin.startsWith('http://localhost:'));

  assert.strictEqual(isAllowed('https://www.agiletrademarkfiling.com'), true);
  assert.strictEqual(isAllowed('https://agiletrademarkfiling.com'), true);
  assert.strictEqual(isAllowed('http://localhost:8080'), true);
  assert.strictEqual(isAllowed('https://malicious-site.com'), false);
  assert.strictEqual(isAllowed('https://fake-agiletrademarkfiling.com'), false);
});
