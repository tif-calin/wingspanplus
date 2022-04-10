import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import RainbowText from '../RainbowText';

const SITE = 
  process.env.REACT_APP_SITE_TITLE
  || process.env.REACT_APP_NAME
;

const StyledHeader = styled.header`
  margin-top: calc(var(--gutter) / 2);

  & > * {
    flex-wrap: wrap;
  }

  & .site-title {
    flex-grow: 1;
    font-weight: 800;
    filter: saturate(0.55) brightness(0.25);
    transition: all 2s cubic-bezier(0, 0.9, 0.8, 0.99);

    &:hover {
      filter: saturate(1) brightness(1) hue-rotate(1440deg);
    }
  }

  & .crumb {
    margin-left: 0.25rem;
    &::before {
      content: '> ';
    }
  }
`;

interface Props {
  crumbs?: string[];
};

const crumbs: string[] = [];

const Header: React.FC<Props> = () => {
  return (
    <StyledHeader>
      <span className="breadcrumbs">
        {SITE && (
          <Link to="/">
            <span className="site-title"><RainbowText text={SITE} /></span>
          </Link>
        )}
        {!!crumbs?.length && crumbs.map((crumb, i) => (
          <Link key={crumb} className="crumb" to={crumbs.slice(0, i + 1).join('/')}>
            <span>{crumb}</span>
          </Link>
        ))}
      </span>
    </StyledHeader>
  );
};

export default Header;
