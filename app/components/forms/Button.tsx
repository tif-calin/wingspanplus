import { styled } from '@linaria/react';

const StyledButton = styled.button`
  background-color: #fff;
  border: 2px solid var(--clr-border);
   border-radius: 0.15rem;
  font-weight: 700;
  padding: 0 0.5rem;
  transition: background-color 0.15s ease;
   transition-property: color, background-color;

  &:hover {
    background-color: var(--clr-border);
    color: var(--clr-bg);
  }

  &:focus-within {
    border-color: #0000;
    outline: 2px dashed var(--clr-focus);
  }
`;

type Props = {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: Props) => {
  const {
    className,
    children,
    ...buttonAttrs
  } = props;

  return (
    <StyledButton className={className} {...buttonAttrs}>
      {children}
    </StyledButton>
  );
};

Button.Styled = StyledButton;
export default Button;
