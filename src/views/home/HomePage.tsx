import React from 'react';
import styled from 'styled-components';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: calc(var(--gutter) / 2);

  & > .content {
    background-color: #fbfbfb;
    flex-grow: 1;
    padding: 1.5rem;
    border-radius: 0.25rem;
    --shadow-color: 0deg 0% 80%;
    box-shadow: var(--shadow-inset-medium), inset 0 0 2px hsl(var(--shadow-color));
  }
`;

interface Props {};

const HomePage = (_: Props): React.ReactElement => {
  return (
    <>
      <Page>
        <h1>Home Page</h1>
        <div
          className="content"
        >This is the home page</div>
      </Page>
    </>
  );
};

export default HomePage;
