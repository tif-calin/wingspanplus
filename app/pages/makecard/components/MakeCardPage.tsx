import { styled } from '@linaria/react';
import WingspanCard from './WingspanCard';
import FONTS from '../utils/fonts';
import FormCardCreator from './CardMakerForm';
import { EXAMPLES } from './CardMakerForm/default-cards';

const Content = styled.div`
  ${FONTS}

  --clr-border: #455;
  --clr-focus: #fed23c;
  --clr-primary: #6bc4c1;

  accent-color: var(--clr-focus);
  display: flex;
   align-items: center;
   justify-content: center;
  position: relative;

  & .gallery {
    display: flex;
    gap: 1rem;
    max-width: 100%;
    overflow-x: scroll;

    & > * {
      flex: none;
    }
  }
`;

const ContentTitle = styled.h2`
  font-size: 1.25rem;
  position: absolute;
   right: calc(100% + 2.6rem);
   top: -1rem;
  rotate: -90deg;
   transform-origin: top right;
   text-align: end;
  text-transform: uppercase;
  white-space: nowrap;
  width: 25%;
`;

const MakeCardPage = () => {
  return (
    <>
      <Content className='island'>
        <ContentTitle>
          Maker
        </ContentTitle>
        <FormCardCreator />
      </Content>
      <Content className='island'>
        <ContentTitle>Gallery</ContentTitle>
        <div className="gallery">
          {EXAMPLES.map(bird => (
            <WingspanCard key={bird.nameCommon} {...bird} />
          ))}
        </div>
      </Content>
    </>
  )
};

export default MakeCardPage;
