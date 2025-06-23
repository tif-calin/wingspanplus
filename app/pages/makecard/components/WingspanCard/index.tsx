import { styled } from '@linaria/react';
import React, { type ComponentProps } from 'react';
import HabitatInfo from './HabitatInfo';
import removeBackgroundFromUrl from '../../utils/removeBackgroundFromUrl';
import LeftSideBarInfo from './LeftSideBarInfo';
import BirdImage from './BirdImage';
import Icon from '../Icon';
import Power from './Power';

const Wrapper = styled.div`
  /* https://onlinejpgtools.com/find-dominant-jpg-colors */
  --power-color-brown: 192, 116, 51; /* #c07433 */
  --power-color-pink: 247, 157, 172; /* #f79dac */
  --power-color-teal: 107, 196, 193; /* #6bc4c1 */
  --power-color-yellow: 254, 210, 60; /* #fed23c */

  --height: 86.8mm;
  --width: 56.8mm;

  background-color: #f6f6f2;
  border-radius: 3.5mm;
  box-shadow: var(--shadow-elevation-medium), inset 0 0 2px hsl(var(--shadow-color));
  display: flex;
   flex-direction: column;
  font-size: 2.9mm;
  height: var(--height);
   width: var(--width);
  overflow: hidden;

  & > * { position: relative; }
`;

const UpperRow = styled.div`
  display: flex;
   align-items: center;
   gap: 1mm;
  height: calc(var(--height) * 0.22);
  z-index: 2;
`;

const CardName = styled.div`
  display: flex;
   align-items: center;
   flex-direction: column;
   justify-content: center;
  background-color: #f5f6f1;
  border-style: solid none solid solid;
   border-width: 0.15mm;
  flex-grow: 1;
  line-height: 1;
  text-align: center;
  vertical-align: middle;
  min-height: 10.75mm;

  & > *.title {
    display: block;
    font-family: var(--fnt-hand);
    font-size: 3.5mm;
    font-weight: 700;
    width: 100%;
  }

  & > *.latin {
    font-family: var(--fnt-script);
    opacity: 0.9;
  }
`;

const MiddleRow = styled.div`
  position: relative;
  height: calc(var(--height) * 0.5);
  flex-grow: 1;
  width: 100%;

  & .wingspan {
    margin-right: 3.75mm;
    filter: drop-shadow(0 0 0.1mm #f6f6f2);
    position: absolute;
     bottom: 0;
     right: 0;
    line-height: 1;
    text-align: center;
    width: 10mm;
    z-index: 2;
  }

  & > picture {
    position: absolute;
    right: 0;
    z-index: 1;
  }
`;

const BottomRow = styled.div`
  display: flex;
   flex-direction: column;
   justify-content: space-between;
  min-height: fit-content;
  padding: 1mm 0;
  z-index: 2;

  & .flavor {
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
    font-style: italic;
    font-size: 2mm;
    line-height: 1;
    padding: 0 2.5mm;
  }
`;

type Props = {
  flavor?: string;
  nameCommon: string;
  nameLatin: string;
  // TODO: move logic to BirdImage component and make this photo?: ComponentProps<typeof BirdImage>
  photo?: { url: string; removeBg?: boolean; scale?: number; translateX?: number; translateY?: number };
  power?: ComponentProps<typeof Power>;
  wingspan: number | '*';
} & ComponentProps<typeof LeftSideBarInfo> & ComponentProps<typeof HabitatInfo>;

const WingspanCard = React.memo(({
  eggCapacity,
  flavor,
  foodCost,
  habitats,
  nameCommon,
  nameLatin,
  photo,
  power,
  victoryPoints,
  wingspan,
}: Props) => {
  // TODO: move all this to BirdImge component
  const [imageSrc, setImageSrc] = React.useState('');
  React.useEffect(() => {
    if (!photo?.url) return;
    if (imageSrc) return;
    if (photo?.removeBg) removeBackgroundFromUrl(photo?.url).then(setImageSrc);
    else setImageSrc(photo?.url);
  }, []);

  return (
    <Wrapper>
      <UpperRow>
        <HabitatInfo foodCost={foodCost} habitats={habitats} />
        <CardName>
          <span className="title">{nameCommon}</span>
          <span className="latin">{nameLatin}</span>
        </CardName>
      </UpperRow>
      <MiddleRow>
        <LeftSideBarInfo eggCapacity={eggCapacity} victoryPoints={victoryPoints} />
        <BirdImage
          imageSrc={imageSrc}
          altText={`bird photo of ${nameCommon}`}
          scale={photo?.scale}
          translateX={photo?.translateX}
          translateY={photo?.translateY}
        />
        <div className="wingspan">
          {Number.isFinite(wingspan) ? wingspan : '*'}cm
          <Icon icon="wingspan" altText="wingspan icon" />
        </div>
      </MiddleRow>
      <BottomRow>
        {power && <Power {...power} />}
        {flavor &&<div className="flavor">{flavor}</div>}
      </BottomRow>
    </Wrapper>
  )
});

export default WingspanCard;
