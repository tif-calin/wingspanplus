import { styled } from '@linaria/react';

const Styled = styled.span`
  filter: saturate(0.55) brightness(0.05);
  transition-properties: filter;
  transition-duration: 2s;
  transition-timing-function: cubic-bezier(0, 0.9, 0.8, 0.99);

  &:hover {
    filter: saturate(1) brightness(1) hue-rotate(1440deg);
  }
`;

const colors = [
  'red', 'pink', 'grape', 'violet', 'indigo', 'blue',
  'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'
];

type Props = { text: string; };

const RainbowText = ({ text }: Props) => (
  <Styled>
    {text.split('').map((char, i) => (
      <span key={i} style={{ color: `var(--oc-${colors[i % colors.length]}-4)` }}>
        {char}
      </span>
    ))}
  </Styled>
);

export default RainbowText;
