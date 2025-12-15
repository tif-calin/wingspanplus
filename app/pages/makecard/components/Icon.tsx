import { styled } from '@linaria/react';
import type { FoodEnum, HabitatEnum, InlineTextEnum, NestEnum, PowerTagEnum, UiEnum } from '../types';

type Props = {
  altText: string;
  icon: FoodEnum | PowerTagEnum | NestEnum | HabitatEnum | InlineTextEnum | UiEnum | 'fan-made';
};

const Wrapper = styled.picture`
  display: inline-block;
`;

const Icon = ({ altText, icon }: Props) => {
  return (
    <Wrapper className=''>
      <img
        alt={altText}
        src={`/assets/${icon}.png`}
      />
    </Wrapper>
  );
};

export default Icon;
