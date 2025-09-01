import { styled } from '@linaria/react';
import type { DetailedHTMLProps, SelectHTMLAttributes } from 'react';
import { memo } from 'react';

const SelectWrapper = styled.div<{ gridSpan: number }>`
  background-color: #fff;
  border: 2px solid #455;
   border-radius: 0.15rem;
  display: flex;
   flex-grow: 1;
  grid-column: span ${props => props.gridSpan};
  padding: 0;
  position: relative;

  & > select {
    background: none;
    border: none;
    flex-grow: 1;
    outline: none;
    padding: 0.25rem 0.5rem;
  }

  & > .label {
    border-radius: 0.15rem;
    background: #fff;
    color: #99a;
    font-size: 0.8em;
    padding: 0 0.25rem;
    pointer-events: none;
    position: absolute;
     top: -0.75rem;
     left: 0.25rem;
    transition: all 0.15s ease-in-out;
    z-index: 0;
  }
`;

type HtmlSelectProps = DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
type Props = {
  label: string;
  /**
   * How many columns (out of 12) the input should span.
   * @default 12
   */
  gridSpan?: number;
  options: Array<{ value: string; label: string }>;
} & HtmlSelectProps & Pick<Required<HtmlSelectProps>, 'name'>;

const Select = (props: Props) => {
  const {
    label,
    gridSpan = 12,
    options,
    ...selectProps
  } = props;

  return (
    <SelectWrapper gridSpan={gridSpan}>
      <select {...selectProps}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label className="label">{label}</label>
    </SelectWrapper>
  );
};

export default memo(Select);
