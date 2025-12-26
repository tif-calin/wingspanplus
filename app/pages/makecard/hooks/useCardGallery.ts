import { useCallback, type ComponentProps } from 'react';
import { DEFAULT_CARDS, EXAMPLES } from '../components/CardMakerForm/default-cards';
import useLocalStorage from './useLocalStorage';
import type WingspanCard from '../components/WingspanCard';

type Card = { id: string; } & ComponentProps<typeof WingspanCard>;

let id = 0;
const INITIAL_VALUE = [...EXAMPLES, ...DEFAULT_CARDS].map(
  card => ({ id: `${++id}`, ...card })
);

const useCardGallery = () => {
  const [cardGallery, setCardGallery] = useLocalStorage<Card[]>('gallery', INITIAL_VALUE);

  const handleAdd = useCallback(() => {
    const newCard = { id: `${Date.now()}.${++id}` };
    setCardGallery(gallery => [newCard, ...gallery]);
  }, [setCardGallery]);

  const handleDelete = useCallback((id: string) => {
    setCardGallery(cardGallery.filter(card => card.id !== id));
  }, [cardGallery, setCardGallery]);

  const handleUpdate = useCallback((id: string, newVals: Partial<Card>) => {
    const existingCard = cardGallery.find(card => card.id === id);
    if (!existingCard) return;

    setCardGallery(gallery => gallery.map(card => card.id === id ? { ...card, ...newVals } : card));
  }, [cardGallery, setCardGallery]);

  return {
    cardGallery,
    handleAdd,
    handleDelete,
    handleUpdate,
  };
};

export default useCardGallery;
