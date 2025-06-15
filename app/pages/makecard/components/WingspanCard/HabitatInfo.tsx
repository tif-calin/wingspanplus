import { styled } from '@linaria/react';
import type { FoodEnum, HabitatEnum } from '../../types';
import TextWithIcons from './TextWithIcons';

const Container = styled.div`
  background-color: #c7c1b3;
  border: .5px solid #74685e;
   border-top-style: none;
  border-radius: 1mm;
   border-top-left-radius: 0;
   border-top-right-radius: 0;
  display: flex;
   align-items: center;
   flex-direction: column;
  font-size: 3.5mm;
  margin-left: 3.75mm;
  width: 27.6%;
  height: 100%;

  & > *:first-child {
    display: inline-flex;
     align-items: flex-end;
     justify-content: center;
     flex-direction: row-reverse;
     flex-wrap: wrap;
    height: 65%;
    position: relative;

    & > *:nth-child(3) {
      position: absolute;
      bottom: calc(25% + 1.5px);
      left: calc(25% + 1.5px);
    }
  }
  & > *:last-child { height: 35%; }
`;

const HabitatIcon = styled.picture`
  padding: 1px;
  width: 45%;
`;

const FoodRow = styled(TextWithIcons)``;

type FoodCost = `[${FoodEnum}]`;
type FoodStringSplit = ' + ' | ' / ';
type FoodString = `${FoodCost}${`${FoodStringSplit}${FoodCost}` | ''}`

type Props = {
  foodCost: FoodString;
  habitats: HabitatEnum[];
};

const HabitatInfo = ({ foodCost, habitats }: Props) => {
  return (
    <Container>
      <div>
        {habitats.map(habitat => (
          <HabitatIcon key={habitat}>
            <img
              alt={`${habitat} habitat`}
              src={`/assets/${habitat}.png`}
            />
          </HabitatIcon>
        ))}
      </div>
      <FoodRow text={foodCost.replaceAll(' ', '')} />
    </Container>
  );
};

export default HabitatInfo;
