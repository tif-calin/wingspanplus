import { styled } from '@linaria/react';
import type { ReactNode } from 'react';

const StyledInfoSection = styled.span`
  font-size: 0.8rem;
  line-height: 1;

  & > *:first-child {
    display: block;
    font-size: 1rem;
    font-weight: 500;

    &::after { content: ':'; }
  }

  & .content {
    max-height: calc(100px + 5vh);
    overflow: auto;
  }
`;

type Props = {
  title: string;
  children: ReactNode;
};

const InfoSection = ({ title, children }: Props) => (
  <StyledInfoSection>
    <span>{title}</span>
    <div className="content">
      {children}
    </div>
  </StyledInfoSection>
);

export default InfoSection;
