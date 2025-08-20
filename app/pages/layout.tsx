import { styled } from '@linaria/react';
import { Outlet } from 'react-router';

const Page = styled.div`
  display: flex;
   align-items: center;
   flex-direction: column;
   gap: 0.5rem;
  margin: auto;
  min-height: 100vh;
  padding: 1rem;

  & > *:where(header, main, footer) {
    display: flex;
     flex-direction: column;
     gap: 1rem;
    width: 100%;
     max-width: min(calc(275px + 55%), calc(100vw - 4rem));
     min-width: 275px;
  }

  & > header a { color: inherit; }
  & > main {
    flex-grow: 1;
    & > .island { flex-grow: 1; }
  }

  & .island {
    --shadow-color: 0deg 0% 80%;
     box-shadow: var(--shadow-inset-medium), inset 0 0 2px hsl(var(--shadow-color));
    background-color: var(--clr-fg);
    border-radius: 0.125rem;
    padding: 1rem;
  }

  & > .disclaimer {
    font-size: 0.75rem;
    font-weight: 200;
  }
`;

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Page>
      <header className='island'>
        <a href="/">
          <h1>WingFans</h1>
        </a>
      </header>
      <main>
        <Outlet />
      </main>
      {children}
      <footer className="disclaimer island">
        WingspanPlusPlus a fan project and has no official connection with Wingspan or Stonemaier Games.
      </footer>
    </Page>
  )
};

export default Layout;
