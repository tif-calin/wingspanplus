import { styled } from '@linaria/react';
import TextWithIcons from './TextWithIcons';

const Wrapper = styled.div`
  background: rgb(var(--power-color-brown));
  border: 2.5mm solid;
   border-image: url("/assets/brown.webp");
   border-image-slice: 10;
   border-image-width: 0.5;
  display: -webkit-box;
   align-items: center;
  line-height: 1;
  min-height: 16mm;

  & > span:first-child {
    font-weight: 500;
  }
`;

type Props = {
  kind: 'WHEN ACTIVATED' | 'ONCE BETWEEN TURNS' | 'WHEN PLAYED' | 'ROUND END' | 'GAME END';
  text: string;
};

const Power = ({ text, kind }: Props) => {
  return (
    <Wrapper>
      <span>{kind}</span>: <TextWithIcons text={text} />
    </Wrapper>
  );
};

export default Power;
