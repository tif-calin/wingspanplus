import { styled } from '@linaria/react';
import { useId, type HTMLInputTypeAttribute, type InputHTMLAttributes } from 'react';

const InputStyled = styled.div<{ gridSpan: number }>`
  background-color: #fff;
  border: 2px solid #455;
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

  &.success > input:valid:not(:placeholder-shown) + .label { color: #3a5; }
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
      background: #fff;
      font-size: 0.8em;
      left: 0.25rem;
      padding: 0 0.25rem;
      top: -0.75rem;
      z-index: 0;
    }
    &:valid:not(:placeholder-shown) + .label { color: #99a; }
    &:invalid + .label { color: #c44; }
  }

  & > select {
    flex-grow: 0;
    border: none;
    outline: none;
    border-left: 1px solid #455;
    padding-left: 0.25rem;
    background-color: #fcfcfc;
  }
`;

type Props = {
  defaultValue?: InputHTMLAttributes<HTMLInputElement>['value'];
  /** Required. Should be unique within form. */
  fieldName: string;
  /** If the displayed title should be something other than the fieldName */
  fieldTitle?: string;
  /**
   * How many columns (out of 12) the input should span.
   * @default 12
   */
  gridSpan?: number;
  /** @default "text" */
  inputType: HTMLInputTypeAttribute;
  /** Success state turns label text green. */
  status?: 'disabled' | 'error' | 'success';
} & InputHTMLAttributes<HTMLInputElement>;

const Input = (props: Props) => {
  const {
    inputType = 'text',
    fieldName,
    fieldTitle,
    gridSpan = 12,
    status,
    ...inputProps
  } = props;

  const id = useId();

  return (
    <InputStyled gridSpan={gridSpan} className={status}>
      <input id={id} name={fieldName} type={inputType} placeholder="&nbsp;" {...inputProps} />
      <label className="label" htmlFor={id}>{fieldTitle || fieldName}</label>
    </InputStyled>
  );
};

export default Input;
