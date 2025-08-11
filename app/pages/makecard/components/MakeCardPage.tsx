import { styled } from '@linaria/react';
import WingspanCard from './WingspanCard';
import type { ComponentProps } from 'react';
import FONTS from '../utils/fonts';

const Content = styled.main`
  ${FONTS}

  display: flex;
   align-items: center;
   justify-content: center;

  & .gallery {
    display: flex;
    gap: 1rem;
    max-width: 100%;
    overflow-x: scroll;
    padding: 1rem;

    & > * {
      flex: none;
    }
  }
`;

const EXAMPLES = [
  {
    eggCapacity: 4,
    flavor: 'The Muscovy is the only domestic duck breed whose ancestors are not mallards.',
    foodCost: '[invertebrate] / [seed]',
    habitats: ['wetland'],
    nameCommon: 'Mallard',
    nameLatin: 'Anas platyrhynchos', // https://navarog.github.io/wingsearch/card/166
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
    habitats: ['forest', 'grassland', 'wetland'],
    nameCommon: 'Common Buzzard',
    nameLatin: 'Buteo buteo', // https://navarog.github.io/wingsearch/card/78
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
    habitats: ['grassland', 'wetland'],
    nameCommon: 'Canada Goose',
    nameLatin: 'Branta canadensis', // https://navarog.github.io/wingsearch/card/60
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

const MakeCardPage = () => {
  return (
    <>
      <header><h1>makecard</h1></header>
      <Content>
        <div className="gallery">
          {EXAMPLES.map(bird => (
            <WingspanCard key={bird.nameCommon} {...bird} />
          ))}
        </div>
      </Content>
    </>
  )
};

export default MakeCardPage;
