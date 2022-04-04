import React from 'react';
import styled from 'styled-components';
import Footer from './Footer';
import Header from './Header';

const StyledLayout = styled.div`
  --gutter: 1rem;

  display: flex;
  flex-direction: column;

  min-height: 100vh;
  width: 100vw;
  overflow-y: overlay;

  & > :is(header, main, footer) {
    width: 100%;
  
    display: flex;
    flex-direction: column;
    align-items: center;

    & > * {
      min-width: calc(100px + 60vw);
      width: calc(150px + 40vw);
      max-width: calc(900px + 10vw);
    }
  }

  & > :is(header, footer) {
    flex-grow: 0;

    & > * {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  & > main {
    flex-grow: 1;
    height: 100%;

    & > * { flex-grow: 1; }
  }
`;

interface Props {
  path?: string;
  children: React.ReactNode;
};

const Layout = ({ path, children }: Props): React.ReactElement => {
  return (
    <StyledLayout>
      <Header />
      <main>
        {children}
      </main>
      <Footer path={path} />
    </StyledLayout>
  );
};

export default Layout;
