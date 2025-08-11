import { styled } from '@linaria/react';

const StyledButton = styled.button`
  background-color: #fff;
  border: 2px solid #455;
   border-radius: 0.15rem;
`;

type Props = {
  children: React.ReactNode;
};

const Button = (props: Props) => {
  return (
    <StyledButton>
      {props.children}
    </StyledButton>
  );
};

Button.Styled = StyledButton;
export default Button;
