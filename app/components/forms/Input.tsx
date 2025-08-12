import { styled } from '@linaria/react';
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';

const InputStyled = styled.fieldset`
  background-color: #fff;
  border: 2px solid #455;
   border-radius: 0.15rem;
  display: flex;
   flex-grow: 1;
  padding: 0;
  position: relative;

  & > legend {
    border-radius: 0.15rem;
    pointer-events: none;
    position: absolute;
     top: calc(50% - 0.75rem);
     left: 0.5rem;
    transition: all 0.15s ease-in-out;
    z-index: 1;
  }

  & > input {
    background: none;
    border: none;
    flex-grow: 1;
    outline: none;
    padding: 0.25rem 0.5rem;
    width: 4rem;
    z-index: 1;

    &:focus + legend,
    &:not(:placeholder-shown) + legend {
      background: #fff;
      font-size: 0.8em;
      left: 0.25rem;
      padding: 0 0.25rem;
      top: -0.75rem;
      z-index: 0;
    }

    &:valid:not(:placeholder-shown) + legend { color: #99a; }
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
  /** @default "text" */
  inputType: HTMLInputTypeAttribute;
  // /** Success state turns label text green. */
  // isValid?: boolean;
};

const Input = (props: Props) => {
  const {
    defaultValue,
    inputType = 'text',
    fieldName,
    fieldTitle,
  } = props;

  return (
    <InputStyled>
      <input name={fieldName} type={inputType} placeholder="&nbsp;" defaultValue={defaultValue} />
      <legend>{fieldTitle || fieldName}</legend>
    </InputStyled>
  );
};

export default Input;
