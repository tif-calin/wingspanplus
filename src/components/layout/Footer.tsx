import React from 'react';
import styled from 'styled-components';
import ExternalLink from '../ExternalLink';

const REPO_URL = 
  process.env.REACT_APP_REPO_URL
  || 'https://github.com/tif-calin/culiboot'
;

const StyledFooter = styled.footer`
  padding: calc(var(--gutter) / 2);

  & a {
    margin-top: calc(1rem + 1vh);
    gap: 0.25rem;

    opacity: 0.5;
    transition: opacity 0.15s;

    &:hover {
      opacity: 1;
    }

    &::before, &::after {
      content: "\\2620";
    }
  }
`;

interface Props {
  path?: string;
};

const Footer= ({ path }: Props): React.ReactElement => {
  return (
    <StyledFooter>
      <ExternalLink 
        href={path ? `${REPO_URL}/tree/main/${path}` : REPO_URL}
      >steal this</ExternalLink>
    </StyledFooter>
  );
};

export default Footer;
