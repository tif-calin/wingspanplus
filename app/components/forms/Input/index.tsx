import { styled } from '@linaria/react';
import { memo, useId } from 'react';
import type { HtmlInputAttributes } from './types';

const InputStyled = styled.div<{ gridSpan: number }>`
  --clr-bg: #fff;
  --clr-border: #455;
  --clr-label: #99a;
  --clr-success: #3a5;
  --clr-error: #c44;

  background-color: var(--clr-bg);
  border: 2px solid var(--clr-border);
   border-radius: 0.15rem;
  display: flex;
   flex-grow: 1;
  grid-column: span ${props => props.gridSpan};
  padding: 0;
  position: relative;

  & > .label {
    border-radius: 0.15rem;
    pointer-events: none;
    position: absolute;
     top: calc(50% - 0.75rem);
     left: 0.5rem;
    transition: all 0.15s ease-in-out;
    z-index: 1;
  }

  &.success > input:valid:not(:placeholder-shown) + .label { color: var(--clr-success); }
  & > input {
    background: none;
    border: none;
    flex-grow: 1;
    outline: none;
    padding: 0.25rem 0.5rem;
    width: 4rem;
    z-index: 1;

    &:focus + .label,
    &:not(:placeholder-shown) + .label {
      background: var(--clr-bg);
      font-size: 0.8em;
      left: 0.25rem;
      padding: 0 0.25rem;
      top: -0.75rem;
      z-index: 0;
    }
    &:valid:not(:placeholder-shown) + .label { color: var(--clr-label); }
    &:invalid + .label { color: var(--clr-error); }
  }
`;

type Props = {
  /** Label for the input field */
  label: string;
  /**
   * How many columns (out of 12) the input should span.
   * @default 12
   */
  gridSpan?: number;
  /** Type of input UI */
  kind: 'text' | 'number' | 'select' | 'textarea';
  /** Success state turns label text green. */
  status?: 'disabled' | 'error' | 'success';
} & HtmlInputAttributes<HTMLInputElement, 'name' | 'type'>;

const Input = (props: Props) => {
  const {
    kind: _kind, // TODO
    label,
    gridSpan = 12,
    status,
    ...inputProps
  } = props;

  const id = useId();

  return (
    <InputStyled gridSpan={gridSpan} className={status}>
      <input id={id} placeholder="&nbsp;" {...inputProps} />
      <label className="label" htmlFor={id}>
        {label || inputProps.placeholder || inputProps.name}
      </label>
    </InputStyled>
  );
};

export default memo(Input);
