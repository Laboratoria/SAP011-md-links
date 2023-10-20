const { mdLinks, validateLink, normalizeURL } = require('../src/mdLinks.js');

describe('normalizeURL', () => {
  it('should add "http://" to URLs that do not have a protocol', () => {
    const url = 'www.example.com';
    expect(normalizeURL(url)).toBe('http://www.example.com');
  });

  it('should not modify URLs that already have a protocol', () => {
    const url = 'https://www.example.com';
    expect(normalizeURL(url)).toBe('https://www.example.com');
  });
});

describe('validateLink', () => {
  it('should resolve with "ok" status for a valid link (e.g., status code 200)', async () => {
    const link = { href: 'https://example.com' };
    const result = await validateLink(link);
    expect(result.ok).toBe('ok');
    expect(result.status).toBe(200);
  });

  it('should resolve with "fail" status for a link with a non-2xx status code', async () => {
    const link = { href: 'https://example.com/404' };
    const result = await validateLink(link);
    expect(result.ok).toBe('fail');
    expect(result.status).toBe(404);
  });

  it('should resolve with "fail" status for a link with a network error', async () => {
    const link = { href: 'https://nonexistenturl' };
    const result = await validateLink(link);
    expect(result.ok).toBe('fail');
    expect(result.status).toBe('N/A');
  });
});

describe('mdLinks', () => {
  it('should resolve with an array of links when not using options', async () => {
    const filePath = 'teste.md';
    const options = {};
    const result = await mdLinks(filePath, options);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should resolve with an array of validated links when using "validate" option', async () => {
    const filePath = 'teste.md';
    const options = { validate: true };
    const result = await mdLinks(filePath, options);
    expect(Array.isArray(result)).toBe(true);
    result.forEach((link) => {
      expect(link.ok === 'ok' || link.ok === 'fail').toBe(true);
    });
  });

  it('should resolve with statistics when using "stats" option', async () => {
    const filePath = 'teste.md';
    const options = { stats: true };
    const result = await mdLinks(filePath, options);
    expect(result.total).toBeDefined();
    expect(result.unique).toBeDefined();
    expect(result.broken).toBeDefined();
  });
});