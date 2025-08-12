import { styled } from '@linaria/react';

const StyledButton = styled.button`
  background-color: #fff;
  border: 2px solid #455;
   border-radius: 0.15rem;
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
