import { test } from 'node:test';
import assert from 'node:assert/strict';
import { daySchedule, iqamahTime, boardDay, nextEvent } from '../src/engine.js';

const cfg = {
  location: { latitude: 43.6532, longitude: -79.3832 },
  calculation: { method: 'NorthAmerica', madhab: 'Hanafi' },
  iqamah: { fajr: '+20', dhuhr: '13:30', asr: '+15', maghrib: '+5', isha: '+15' },
  iqamahRoundMinutes: 5,
  jumuah: ['13:15', '13:45'],
  rolloverAfterIshaMinutes: 60,
};
const at = (h, m) => new Date(2026, 10, 12, h, m); // Thursday 12 Nov 2026, local time

test('offset rule rounds up to the step', () => {
  assert.deepEqual(iqamahTime(at(13, 2), '+10', 5), at(13, 15));
  assert.deepEqual(iqamahTime(at(13, 5), '+10', 5), at(13, 15));
});

test('fixed rule never lands before adhan', () => {
  assert.deepEqual(iqamahTime(at(13, 0), '13:30'), at(13, 30));
  assert.deepEqual(iqamahTime(at(13, 40), '13:30'), at(13, 40));
});

test('bad rules throw a readable error', () => {
  assert.throws(() => iqamahTime(at(13, 0), '1:30pm'), /Bad iqamah rule/);
  assert.throws(() => daySchedule(at(12, 0), { ...cfg, location: {} }), /latitude/);
});

test('prayers come out in order with iqamah after adhan', () => {
  const rows = daySchedule(at(12, 0), cfg);
  assert.deepEqual(rows.map((r) => r.key), ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']);
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i].adhan > rows[i - 1].adhan);
  for (const r of rows) for (const q of r.iqamah) assert.ok(q >= r.adhan);
  assert.equal(rows[1].iqamah.length, 0);
});

test('Friday swaps Dhuhr for Jumuah with every khutbah time', () => {
  const fri = daySchedule(new Date(2026, 10, 13, 9), cfg);
  assert.equal(fri[2].key, 'jumuah');
  assert.equal(fri[2].iqamah.length, 2);
});

test('board flips to tomorrow only after Isha iqamah plus the rollover', () => {
  const isha = daySchedule(at(12, 0), cfg)[5].iqamah[0];
  const before = new Date(isha.getTime() + 59 * 60000);
  const after = new Date(isha.getTime() + 61 * 60000);
  assert.equal(boardDay(before, cfg).date.getDate(), 12);
  assert.equal(boardDay(after, cfg).date.getDate(), 13);
});

test('next event after the last iqamah is tomorrow\'s Fajr', () => {
  const isha = daySchedule(at(12, 0), cfg)[5].iqamah[0];
  const e = nextEvent(new Date(isha.getTime() + 60000), cfg);
  assert.equal(e.key, 'fajr');
  assert.equal(e.at.getDate(), 13);
});

test('between adhan and iqamah the next event is the iqamah', () => {
  const asr = daySchedule(at(12, 0), cfg)[3];
  const e = nextEvent(new Date(asr.adhan.getTime() + 60000), cfg);
  assert.equal(e.key, 'asr');
  assert.equal(e.type, 'iqamah');
});
