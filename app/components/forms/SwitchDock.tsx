import { styled } from '@linaria/react';
import { useId } from 'react';

const Container = styled.fieldset<{ gridSpan: number }>`
  --clr-bg: #fff;

  background-color: var(--clr-bg);
  border: 2px solid var(--clr-border);
   border-radius: 0.15rem;
  display: flex;
   flex-grow: 1;
  grid-column: span ${props => props.gridSpan};
  padding: 0;
  position: relative;

  & > legend {
    background: var(--clr-bg);
    font-size: 0.8em;
    position: absolute;
     left: 0.25rem;
     top: -0.75rem;
  }

  & > label {
    display: flex;
     gap: 0.25rem;
    justify-content: center;
    padding: 0.25rem 0.5rem;
  }
`;

type Props = {
  label: string;
  options: Array<{ value: string; label: string; defaultChecked?: boolean }>;
  gridSpan?: number;
};

const SwitchDock = (props: Props) => {
  const id = useId();

  return (
    <Container id={id} gridSpan={props.gridSpan || 12}>
      <legend className="label">
        {props.label}
      </legend>

      {props.options.map(opt => (
        <label key={opt.value}>
          <input
            defaultChecked={opt.defaultChecked}
            key={opt.value + opt.defaultChecked}
            name={opt.value}
            type="checkbox"
          />
          {opt.label}
        </label>
      ))}
    </Container>
  )
};

export default SwitchDock;
