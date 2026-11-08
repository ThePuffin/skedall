import { fuzzySearchOptions } from './fuzzySearch';

const teams = [
  { id: 'NJD', label: 'New Jersey Devils' },
  { id: 'NYK', label: 'New York Knicks' },
  { id: 'UTA', label: 'Utah Jazz' },
  { id: 'NOP', label: 'New Orleans Pelicans' },
];

describe('fuzzySearchOptions', () => {
  it.each([
    ['newjersey', 'NJD'],
    ['new jerzey', 'NJD'],
    ['nou jersey', 'NJD'],
    ['jarsey', 'NJD'],
    ['jarz', 'UTA'],
  ])('ranks the closest team first for "%s"', (query, expectedId) => {
    const results = fuzzySearchOptions(query, teams);

    expect(results[0]?.option.id).toBe(expectedId);
  });

  it('ranks a close word match ahead of unrelated labels', () => {
    const options = [
      { id: 'AUS', label: 'Australia' },
      { id: 'BEL', label: 'Belgium' },
      { id: 'CAN', label: 'Canada' },
      { id: 'CZE', label: 'Czechia' },
      { id: 'NJD', label: 'New Jersey Devils' },
    ];

    const results = fuzzySearchOptions('jarsey', options);

    expect(results[0]?.option.id).toBe('NJD');
    expect(results[0]?.distance).toBe(1);
    expect(results.some(({ option }) => ['AUS', 'BEL', 'CAN', 'CZE'].includes(option.id))).toBe(false);
  });

  it('suggests both MLB and MLS for "mlf"', () => {
    const leagues = [
      { id: 'MLB', label: 'MLB' },
      { id: 'MLS', label: 'MLS' },
      { id: 'NBA', label: 'NBA' },
    ];

    const results = fuzzySearchOptions('mlf', leagues);

    expect(results.slice(0, 2).map(({ option }) => option.id)).toEqual([
      'MLB',
      'MLS',
    ]);
  });
});
