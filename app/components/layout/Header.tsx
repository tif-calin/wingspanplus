import React from 'react';
import { styled } from "@linaria/react";
import RainbowText from '../RainbowText';
import { Link } from 'react-router';

const SITE =
  process.env.REACT_APP_SITE_TITLE
  || process.env.REACT_APP_NAME
;

const StyledHeader = styled.header`
  margin-top: calc(var(--gutter) / 2);

  & .site-title {
    width: 100%;
    font-weight: 800;
    filter: saturate(0.55) brightness(0.25);
    transition: all 2s cubic-bezier(0, 0.9, 0.8, 0.99);

    &:hover {
      filter: saturate(1) brightness(1) hue-rotate(1440deg);
    }
  }
`;

interface Props {};

const Header: React.FC<Props> = () => {
  return (
    <StyledHeader>
      {SITE && (
        <Link to="/">
          <span className="site-title"><RainbowText text={SITE} /></span>
        </Link>
      )}
    </StyledHeader>
  );
};

export default Header;
