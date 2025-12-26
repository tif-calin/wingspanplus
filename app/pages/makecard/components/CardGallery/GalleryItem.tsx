import { useCallback, type Dispatch, type MouseEventHandler, type SetStateAction } from 'react';
import type useCardGallery from '../../hooks/useCardGallery';
import { styled } from '@linaria/react';
import { EmptyCard } from '../WingspanCard';
import Button from '~/components/forms/Button';

const Control = styled.button`
  background-color: transparent;
  border: none;
  margin: 0;
  padding: 0;
  position: relative;
  text-align: unset;

  .delete-button {
    border: none;
    display: none;
    position: absolute;
     top: 0;
     right: 0;
    background-color: var(--oc-red-7);
    height: 1.5em;
    z-index: 4;
  }

  &:where(:hover, :focus-within) {
    filter: brightness(1.05);

    & .delete-button {
      display: block;
    }
  }
`;

type Props = {
  children: React.ReactNode;
  cardId: string;
  handleDelete: ReturnType<typeof useCardGallery>['handleDelete'];
  handleSelect: Dispatch<SetStateAction<string>>;
};

const GalleryItem = ({ children, cardId, handleDelete, handleSelect }: Props) => {
  const handleClick = useCallback(
    () => handleSelect(cardId),
    [cardId, handleSelect]
  );

  const handleDeleteClick = useCallback<MouseEventHandler<HTMLButtonElement>>(event => {
    event.stopPropagation();
    handleDelete(cardId);
  }, [cardId, handleDelete]);

  return (
    <Control onClick={handleClick}>
      <Button className='delete-button' onClick={handleDeleteClick}>delete</Button>
      {children}
    </Control>
  );
};

export default GalleryItem;

const AddNewCardWrapper = styled(Control)`
  &::after {
    content: '+';

    aspect-ratio: 1;
     width: 10rem;
    background: #fff;
    border-radius: 50%;
    color: #f6f6f2;
    display: flex;
     align-items: center;
     justify-content: center;
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1;
    position: absolute;
     top: 50%;
     left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  &:hover::after {
    content: 'Add New Card';
    font-size: 1.5rem;
    color: var(--clr-txt);
  }
`;

export const AddNewCardItem = ({ onClick }: { onClick: MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <AddNewCardWrapper onClick={onClick}>
      <EmptyCard />
    </AddNewCardWrapper>
  );
};
