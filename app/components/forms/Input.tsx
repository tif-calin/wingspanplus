import { styled } from '@linaria/react';
import type { HTMLInputTypeAttribute } from 'react';

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
    width: 4rem;
    z-index: 1;
    border: none;
    outline: none;
    flex-grow: 1;
    padding: 0.25rem 0.5rem;
    background: none;

    &:focus + legend,
    &:not(:placeholder-shown) + legend {
      z-index: 0;
      top: -0.75rem;
      left: 0.25rem;
      background: #fff;
      padding: 0 0.25rem;
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
  fieldName: string;
  /** If the displayed title should be something other than the fieldName */
  fieldTitle?: string;
  /** @default "text" */
  inputType: HTMLInputTypeAttribute;
};

const Input = (props: Props) => {
  const {
    inputType = 'text',
  } = props;

  return (
    <InputStyled>
      <input type={inputType} placeholder="&nbsp;" />
      <legend>{props.fieldTitle || props.fieldName}</legend>
    </InputStyled>
  );
};

export default Input;
