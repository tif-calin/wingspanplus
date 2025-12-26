import { styled } from '@linaria/react';
import { memo, useId } from 'react';
import type { HtmlInputAttributes } from './types';

const InputStyled = styled.div<{ gridSpan: number }>`
  --clr-bg: #fff;
  --clr-border: #455;
  --clr-label: #99a;
  --clr-success: #3a5;
  --clr-error: #c44;
  --clr-focus: var(var(--clr-focus), --oc-orange-4);

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
     top: 0.125rem;
     left: 0.5rem;
    transition: top 0.15s ease-in-out;
     transition-property: color, top;
    white-space: nowrap;
    z-index: 1;
  }

  &:focus-within {
    border-color: #0000;
    outline: 2px dashed var(--clr-focus);

    & > .label {
      outline: 1px solid var(--clr-focus);
    }
  }

  &.success > :where(input, textarea):valid:not(:placeholder-shown) + .label { color: var(--clr-success); }
  & > :where(input, textarea) {
    background: none;
    border: none;
    flex-grow: 1;
    line-height: 1.25;
    max-width: 100%;
    outline: none;
    padding: 0.25rem 0.5rem;
    z-index: 1;

    &:focus + .label,
    &:not(:placeholder-shown) + .label {
      background: var(--clr-bg);
      font-size: 0.8em;
      line-height: 1;
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
  /** Success state turns label text green. */
  status?: 'disabled' | 'error' | 'success';
  /** By default 'className' is passed to the underlying input element. */
  wrapperClassName?: string;
} & (
  | ({ kind: 'number' | 'text'; } & HtmlInputAttributes<HTMLInputElement, 'name' | 'type'>)
  | ({ kind: 'select'; options: Array<{ value: string; label: string }>; } & HtmlInputAttributes<HTMLSelectElement, 'name'>)
  | ({ kind: 'textarea'; } & HtmlInputAttributes<HTMLTextAreaElement, 'name'>)
);

const Input = (props: Props) => {
  const {
    label,
    gridSpan = 12,
    status,
    wrapperClassName,
    ...inputProps
  } = props;

  const id = useId();

  return (
    <InputStyled gridSpan={gridSpan} className={`${status} ${wrapperClassName}`}>
      {inputProps.kind === 'number' && (
        <input id={id} placeholder="&nbsp;" {...inputProps} />
      )}
      {inputProps.kind === 'select' && (
        <select id={id} {...inputProps}>
          {inputProps.options?.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
      {inputProps.kind === 'text' && (
        <input id={id} placeholder="&nbsp;" {...inputProps} />
      )}
      {inputProps.kind === 'textarea' && (
        <textarea id={id} placeholder="&nbsp;" {...inputProps} />
      )}
      <label className="label" htmlFor={id}>
        {label || inputProps.placeholder || inputProps.name}
      </label>
    </InputStyled>
  );
};

export default memo(Input);
