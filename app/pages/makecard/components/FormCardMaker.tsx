import { styled } from '@linaria/react';
import Input from '~/components/forms/Input';
import WingspanCard from './WingspanCard';
import { memo, useState, type DOMAttributes } from 'react';
import Button from '~/components/forms/Button';
import { matchLatinName } from '../utils/http/checklistbank';

// TODO(BTN0): figure out if Linaria can take in the actual component :(
//             e.g. the way styled-components does `styled(Button)`
const StyledButton = styled(Button.Styled)`
  align-self: flex-end;
  background-color: hsl(178, 43%, 40%);
  color: white;
  font-weight: 700;
  transition: background-color 0.2s ease;
  width: fit-content;

  &:hover {
    background-color: #6bc4c1;
  }
`;

const Container = styled.div`
  font-size: 1rem;
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
  const [classification, setClassification] = useState<string[]>([]);

  const handleValidateLatin: DOMAttributes<HTMLButtonElement>['onClick'] = async (ev) => {
    const form = ev.currentTarget.form;
    if (!form) throw new Error('Form not found');
    const formData = new FormData(form);
    const latinName = formData.get('nameLatin');
    console.log(latinName);
    if (typeof latinName !== 'string') throw new Error('Invalid Latin name');
    const data = await matchLatinName(latinName);
    if (!data.match) return;

    const { name, classification } = data.usage;

    const classRankIndex = classification.findIndex((c) => c.rank === 'class');
    const newClassification = classification
      .slice(0, classRankIndex + 1)
      .map((c) => c.name)
      .reverse();
    newClassification.push(`${name[0]}. ${name.split(/\s/).at(-1) || ''}`);

    setClassification(newClassification);
  };

  return (
    <Container>
      <Preview>
        <WingspanCard
          eggCapacity={3}
          flavor='Gadwalls are known for their ability to steal food from diving ducks.'
          foodCost='[fish] + [fish]'
          habitats={['wetland']}
          nameCommon='Gadwall'
          nameLatin="Mareca strepera"
          nestKind="ground"
          photo={{ url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/395500578/original.jpg', removeBg: true }}
          power={{ kind: 'GAME END', text: 'Win.' }}
          victoryPoints={5}
          wingspan={25}
        />
      </Preview>
      <FormWrapper action={console.log}>
        <Input inputType="text" fieldName="nameLatin" fieldTitle="Latin Name" />
        <StyledButton type="button" onClick={handleValidateLatin}>validate &rarr;</StyledButton>
        {!!classification.length && <span style={{ fontSize: '0.8rem' }}>
            {classification.map((name, index) => {
              const isLast = index === classification.length - 1;

              return (
                <span key={name} style={isLast ? { fontStyle: 'italic' } : {}}>{name}{isLast ? '' : ' > '}</span>
              );
            })}
        </span>}
      </FormWrapper>
    </Container>
  );
};

export default memo(FormCardCreator);
