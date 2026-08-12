import {
  OfficialOutage,
  filterOfficialOutages,
  officialOutageRegions,
  todayYmd,
  upcomingOfficialOutages
} from './official-outage.model';

describe('official-outage.model helpers', () => {
  const outage = (over: Partial<OfficialOutage>): OfficialOutage => ({
    provider: 'eneo', country: 'CM', region: 'Centre', ville: 'Yaoundé', quartier: 'Bastos',
    reason: '', progDate: '2099-01-02', startTime: '08:00', endTime: '17:00', ...over
  });

  it('todayYmd formate en YYYY-MM-DD', () => {
    expect(todayYmd(new Date(2026, 7, 11))).toBe('2026-08-11');
  });

  it('upcomingOfficialOutages garde aujourd\'hui et le futur, trié par date puis heure', () => {
    const outages = [
      outage({ progDate: '2026-08-15', startTime: '13:00' }),
      outage({ progDate: '2026-08-10' }),               // passé → écarté
      outage({ progDate: '2026-08-11', startTime: '09:00' }), // aujourd'hui → gardé
      outage({ progDate: '2026-08-15', startTime: '08:00' }),
    ];
    const result = upcomingOfficialOutages(outages, '2026-08-11');
    expect(result.map(o => o.progDate + ' ' + o.startTime)).toEqual([
      '2026-08-11 09:00', '2026-08-15 08:00', '2026-08-15 13:00'
    ]);
  });

  it('officialOutageRegions déduplique et trie', () => {
    const regions = officialOutageRegions([
      outage({ region: 'Littoral' }), outage({}), outage({ region: 'Littoral' }), outage({ region: '' })
    ]);
    expect(regions).toEqual(['Centre', 'Littoral']);
  });

  it('filterOfficialOutages croise région et recherche insensible à la casse', () => {
    const outages = [outage({}), outage({ region: 'Littoral', ville: 'Douala', quartier: 'Akwa' })];
    expect(filterOfficialOutages(outages, 'Littoral', '').length).toBe(1);
    expect(filterOfficialOutages(outages, null, 'AKWA')[0].quartier).toBe('Akwa');
    expect(filterOfficialOutages(outages, 'Centre', 'akwa').length).toBe(0);
  });
});
