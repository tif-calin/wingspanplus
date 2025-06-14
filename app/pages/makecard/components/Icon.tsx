import { styled } from '@linaria/react';

type Food = 'fish' | 'fruit' | 'invertebrate' | 'nectar' | 'no-food' | 'rodent' | 'seed' | 'wild';
type PowerTag = 'bonus-card' | 'flocking' | 'predator';
type Nest = 'bowl' | 'cavity' | 'ground' | 'platform' | 'star';
type Habitat = 'forest' | 'grassland' | 'wetland';

type InlineText = 'dice' | 'egg';
type Ui = 'smallegg' | 'point' | 'wingspan';

type Props = {
  altText: string;
  icon: Food | PowerTag | Nest | Habitat | InlineText | Ui;
};

const Wrapper = styled.picture`
  display: inline-block;
`;

const Icon = ({ altText, icon }: Props) => {
  return (
    <Wrapper>
      <img
        alt={altText}
        src={`/assets/${icon}.png`}
      />
    </Wrapper>
  );
};

export default Icon;
