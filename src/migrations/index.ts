import * as migration_20260317_061117 from './20260317_061117';
import * as migration_20260317_155832 from './20260317_155832';
import * as migration_20260317_163359 from './20260317_163359';
import * as migration_20260317_180300 from './20260317_180300';
import * as migration_20260318_161820 from './20260318_161820';
import * as migration_20260318_181856 from './20260318_181856';
import * as migration_20260318_191703 from './20260318_191703';

export const migrations = [
  {
    up: migration_20260317_061117.up,
    down: migration_20260317_061117.down,
    name: '20260317_061117',
  },
  {
    up: migration_20260317_155832.up,
    down: migration_20260317_155832.down,
    name: '20260317_155832',
  },
  {
    up: migration_20260317_163359.up,
    down: migration_20260317_163359.down,
    name: '20260317_163359',
  },
  {
    up: migration_20260317_180300.up,
    down: migration_20260317_180300.down,
    name: '20260317_180300',
  },
  {
    up: migration_20260318_161820.up,
    down: migration_20260318_161820.down,
    name: '20260318_161820',
  },
  {
    up: migration_20260318_181856.up,
    down: migration_20260318_181856.down,
    name: '20260318_181856',
  },
  {
    up: migration_20260318_191703.up,
    down: migration_20260318_191703.down,
    name: '20260318_191703'
  },
];
