import { styled } from "@linaria/react";

type Props = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

const ExternalLink = ({ children, ...props }: Props) => <a target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;

const StyledExternalLink = styled(ExternalLink)`
  transition: color 0.1s;
  color: var(--oc-indigo-4);

  &:hover { color: unset; }
`;

export default StyledExternalLink;
