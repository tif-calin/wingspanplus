import styled from 'styled-components';

const ExternalLink = styled(({ children, ...props }: any) => <a target="_blank" rel="noopener noreferrer" {...props} >{children}</a>)`
  transition: color 0.1s;
  color: var(--oc-indigo-4);

  &:hover { color: unset; }
`;

export default ExternalLink;
