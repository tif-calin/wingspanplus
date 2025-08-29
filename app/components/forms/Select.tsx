import { styled } from '@linaria/react';
import type { DetailedHTMLProps, SelectHTMLAttributes } from 'react';
import { memo } from 'react';

const SelectWrapper = styled.div<{ gridSpan: number }>`
  grid-column: span ${props => props.gridSpan};
`;

type Props = {
  /**
   * How many columns (out of 12) the input should span.
   * @default 12
   */
  gridSpan?: number;
  options: Array<{ value: string; label: string }>;
} & DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

const Select = (props: Props) => {
  const {
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
    </SelectWrapper>
  );
};

export default memo(Select);
