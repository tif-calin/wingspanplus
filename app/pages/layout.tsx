import { styled } from '@linaria/react';
import { Outlet } from 'react-router';
import RainbowText from '~/components/RainbowText';

const Page = styled.div`
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' fill-opacity='0.05' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  display: flex;
   align-items: center;
   flex-direction: column;
   gap: 1rem;
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
    & > * {
      padding: 1rem;
    }
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
          <h1>
            <RainbowText text="WingFans" />
          </h1>
        </a>
      </header>
      <main>
        <Outlet />
      </main>
      {children}
      <footer className="disclaimer island">
        <span>
          WingFans is a fan project and has no official connection with Wingspan or Stonemaier Games.
        </span>
      </footer>
    </Page>
  )
};

export default Layout;
