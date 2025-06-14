import { styled } from '@linaria/react';
import Icon from '../Icon';

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

const FoodRow = styled.span`
  font-size: 0.5rem;
  display: inline-flex;
   align-items: center;
  padding-top: auto;

  & *:is(img, picture) {
    display: inline;
    vertical-align: middle;
    width: 2.8mm;
  }
`;

type Props = {
  habitats: ('forest' | 'grassland' | 'wetland')[];
};

const HabitatInfo = ({ habitats }: Props) => {
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
      <FoodRow>
        <Icon altText="seed food" icon="seed" />
        +
        <Icon altText="rodent food" icon="rodent" />
      </FoodRow>
    </Container>
  );
};

export default HabitatInfo;
