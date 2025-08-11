import { styled } from '@linaria/react';
import Input from '~/components/forms/Input';
import WingspanCard from './WingspanCard';

const Container = styled.div`
  display: flex;
   gap: 1rem;
  width: 100%;
`;

const Preview = styled.output`
`;

const FormWrapper = styled.form`
  --black: #273f3f;
  --offwhite: #fcfcfc;

  border-left: 1px solid var(--black);
  flex-grow: 1;
  height: 100%;
  position: relative;
  padding: 1rem;
  gap: 0.75rem;
  background-color: var(--offwhite);

  display: flex;
   flex-direction: column;
`;

const FormCardCreator = () => {
  return (
    <Container>
      <Preview>
        <WingspanCard
          eggCapacity={3}
          flavor='A tautonym in ornithology is a name that is repeated, such as "Cardinalis cardinalis".'
          foodCost='[fruit]'
          habitats={['forest']}
          nameCommon='Northern Cardinal'
          nameLatin="Cardinalis cardinalis"
          nestKind="bowl"
          photo={{ url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/539236654/original.jpg' }}
          power={{ kind: 'GAME END', text: 'Win.' }}
          victoryPoints={5}
          wingspan={25}
        />
      </Preview>
      <FormWrapper>
        <Input inputType="text" fieldName="nameLatin" fieldTitle="Latin Name" />
        <Input inputType="number" fieldName="eggCapacity" fieldTitle="Egg Capacity" />
      </FormWrapper>
    </Container>
  );
};

export default FormCardCreator;
