import '@testing-library/jest-dom';

if (typeof global !== 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;

  Object.defineProperty(globalThis, 'import', {
    value: {
      meta: {
        env: {
          VITE_API_URL: 'http://localhost:3001/api'
        }
      }
    }
  });
}
