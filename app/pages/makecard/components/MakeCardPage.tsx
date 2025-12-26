import { styled } from '@linaria/react';
import WingspanCard from './WingspanCard';
import FONTS from '../utils/fonts';
import FormCardCreator from './CardMakerForm';
import useCardGallery from '../hooks/useCardGallery';
import GalleryItem, { AddNewCardItem } from './CardGallery/GalleryItem';
import { useCallback, useState, type ComponentProps } from 'react';

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
  const { handleAdd, handleDelete, handleUpdate, cardGallery } = useCardGallery();
  const [selectedId, setSelectedId] = useState(cardGallery[0]?.id);

  const handleSaveSelectedCard = useCallback(
    (newVals: ComponentProps<typeof WingspanCard>) => handleUpdate(selectedId, newVals),
    [handleUpdate, selectedId]
  );

  return (
    <>
      <Content className='island'>
        <ContentTitle>Maker</ContentTitle>
        <FormCardCreator
          key={selectedId}
          id={selectedId}
          onSave={handleSaveSelectedCard}
          savedValues={cardGallery.find(card => card.id === selectedId)!}
        />
      </Content>
      <Content className='island'>
        <ContentTitle>Gallery</ContentTitle>
        <div className="gallery">
          <AddNewCardItem onClick={handleAdd} />
          {cardGallery.map(bird => (
            <GalleryItem key={bird.id} cardId={bird.id} handleDelete={handleDelete} handleSelect={setSelectedId}>
              <WingspanCard key={bird.id} {...bird} />
            </GalleryItem>
          ))}
        </div>
      </Content>
    </>
  )
};

export default MakeCardPage;
