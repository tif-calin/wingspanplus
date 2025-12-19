import type { ComponentProps } from 'react';
import type WingspanCard from '../WingspanCard';

export const DEFAULT_CARDS: Array<ComponentProps<typeof WingspanCard>> = [
  // Baja California Hummingbird
  {
    eggCapacity: 2,
    flavor: 'Females build elastic, camouflaged nests using spiderwebs, which stretch as chicks grow.',
    foodCost: '[wild]',
    forest: false,
    grassland: true,
    wetland: false,
    nameCommon: 'Baja California Hummingbird',
    nameLatin: 'Basilinna xantusii',
    nestKind: 'bowl',
    photo: { url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/465744479/original.jpeg', removeBg: true, scale: 1.4, translateX: 19, translateY: 10, },
    power: { kind: 'WHEN ACTIVATED', text: 'All players gain 1 [nectar] from the supply.' },
    victoryPoints: 6,
    wingspan: 11
  },
  // Black Kite
  {
    eggCapacity: 2,
    flavor: 'They are known to carry burning sticks in order to spread wildfires and capture fleeing prey.',
    foodCost: '[rodent]',
    forest: true,
    grassland: true,
    wetland: true,
    nameCommon: 'Black Kite',
    nameLatin: 'Milvus migrans',
    nestKind: 'platform',
    photo: { url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/252849067/original.jpeg', removeBg: true, scale: 0.95, translateX: 5, translateY: -15, },
    power: { kind: 'WHEN ACTIVATED', text: 'Tuck 1 face-up [card] from the tray with a wingspan <60cm under this bird.' },
    victoryPoints: 3,
    wingspan: 134,
  },
  // Gadwall
  {
    eggCapacity: 3,
    flavor: 'Gadwalls are known for their ability to steal food from diving ducks.',
    foodCost: '[fish] + [fish]',
    forest: false,
    grassland: false,
    wetland: true,
    nameCommon: 'Gadwall',
    nameLatin: "Mareca strepera",
    nestKind: "ground",
    // photo: { url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/13452704/original.jpg', removeBg: true, scale: 2.7, translateX: 9, translateY: 11 },
    photo: { url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/185113500/original.jpeg', removeBg: true, scale: 1.4, translateX: -9, translateY: 15, },
    power: { kind: 'ONCE BETWEEN TURNS', text: 'When another player takes the "gain food" action, choose a [wild] they gained from the birdfeeder and cache 1 on this bird from the supply.' },
    victoryPoints: 5,
    wingspan: 90,
  },
];


export const EXAMPLES = [
  {
    eggCapacity: 4,
    flavor: 'The Muscovy is the only domestic duck breed whose ancestors are not mallards.',
    foodCost: '[invertebrate] / [seed]',
    forest: false,
    grassland: false,
    wetland: true,
    nameCommon: 'Mallard',
    nameLatin: 'Anas platyrhynchos', // https://navarog.github.io/wingsearch/card/166
    nestKind: 'ground',
    photo: {
      removeBg: true,
      scale: 0.9,
      translateX: 7,
      url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/441914849/original.jpg',
    },
    power: {
      kind: 'WHEN ACTIVATED',
      text: 'Draw a [card].',
    },
    victoryPoints: 0,
    wingspan: 89,
  },
  {
    eggCapacity: 2,
    flavor: 'Male buzzards make a spectacular breeding display, flying high then spiraling down over and over.',
    foodCost: '[rodent]', // TODO: support asterisks in food costs
    forest: true,
    grassland: true,
    wetland: true,
    nameCommon: 'Common Buzzard',
    nameLatin: 'Buteo buteo', // https://navarog.github.io/wingsearch/card/78
    nestKind: 'platform',
    photo: {
      removeBg: true,
      scale: 1.3,
      translateX: 10,
      translateY: -5,
      url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/343655188/original.jpeg',
    },
    power: {
      kind: 'WHEN PLAYED',
      text: 'Instead of paying any costs, you may play this bird on top of another bird on your player mat. Discard any eggs and food from that bird. It becomes a tucked card.',
    },
    victoryPoints: 4,
    wingspan: 123,
  },
  {
    eggCapacity: 3,
    flavor: 'The oldest known Canada Goose was at least 33 years old.',
    foodCost: '[seed] + [seed]',
    forest: false,
    grassland: true,
    wetland: true,
    nameCommon: 'Canada Goose',
    nameLatin: 'Branta canadensis', // https://navarog.github.io/wingsearch/card/60
    nestKind: 'ground',
    photo: {
      removeBg: true,
      scale: 0.92,
      translateX: 9,
      translateY: 3,
      url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/76223579/original.jpg',
    },
    power: {
      kind: 'WHEN ACTIVATED',
      text: 'Discard 1 [seed] to tuck 2 [card] from the deck behind this bird.',
    },
    victoryPoints: 3,
    wingspan: 132,
  },
] satisfies ComponentProps<typeof WingspanCard>[];
