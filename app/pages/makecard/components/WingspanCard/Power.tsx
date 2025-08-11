import { styled } from '@linaria/react';
import TextWithInlineIcons from './TextWithInlineIcons';

const Wrapper = styled.div`
  /* s2.svgbox.net/pen-brushes.svg?ic=brush-6&color=ffff43 */
  background: rgb(var(--power-color-brown));
  border: 2.5mm solid;
   border-image: url("/assets/brown.webp");
   border-image-slice: 10;
   border-image-width: 0.5;
  display: -webkit-box;
   align-items: center;
  font-family: var(--fnt-condensed);
  line-height: 1;
  min-height: 16mm;

  & > span:first-child {
    font-weight: 500;
  }
`;

const PowerText = styled.span`
  & img {
    filter: drop-shadow(0 0 0.3mm #fff) brightness(0.95);
  }
`;

type Props = {
  kind: 'WHEN ACTIVATED' | 'ONCE BETWEEN TURNS' | 'WHEN PLAYED' | 'ROUND END' | 'GAME END';
  text: string;
};

const Power = ({ text, kind }: Props) => {
  return (
    <Wrapper>
      <span>{kind}</span>: <PowerText><TextWithInlineIcons text={text} /></PowerText>
    </Wrapper>
  );
};

export default Power;
