import { styled } from '@linaria/react';
import TextWithInlineIcons from './TextWithInlineIcons';
import { useMemo } from 'react';

const PowerWrapper = styled.div`
  /* TODO: DSM mode for background */
  /* s2.svgbox.net/pen-brushes.svg?ic=brush-6&color=ffff43 */
  /* background: rgb(var(--power-color-brown));
  border: 2.5mm solid;
   border-image: url("/assets/brown.png");
   border-image-slice: 10;
   border-image-width: 0.5; */
  background-size: 100% 100%;
  padding: 2.5mm;
  display: -webkit-box;
   align-items: center;
  font-family: var(--fnt-condensed);
  line-height: 1;
  min-height: 16mm; // TODO: DSM mode makes this variable instead of fixed?

  & > span:first-child {
    font-weight: 500;
  }
`;

const PowerText = styled.span`
  & img {
    filter: drop-shadow(0 0 0.3mm #fff) brightness(0.95);
  }
`;

export const POWER_COLOR_LOOKUP: Record<Props['kind'], string | null> = {
  'GAME END': 'yellow',
  'NONE': null,
  'ONCE BETWEEN TURNS': 'pink',
  'ROUND END': 'teal',
  'WHEN ACTIVATED': 'brown',
  'WHEN PLAYED': null,
};

type Props = {
  kind: 'WHEN ACTIVATED' | 'ONCE BETWEEN TURNS' | 'WHEN PLAYED' | 'ROUND END' | 'GAME END' | 'NONE';
  tag?: 'predator' | 'flocking' | 'bonus';
  text: string;
};

const Power = ({ text, kind }: Props) => {
  const color = POWER_COLOR_LOOKUP[kind];
  const style = useMemo(() => color ? { backgroundImage: `url("/assets/${color}.png")` } : undefined, [color]);

  if (kind === 'NONE') return null;
  return (
    <PowerWrapper style={style}>
      <span>{kind}</span>: <PowerText><TextWithInlineIcons text={text} /></PowerText>
    </PowerWrapper>
  );
};

export default Power;
