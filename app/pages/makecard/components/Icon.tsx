import { styled } from '@linaria/react';
import type { FoodEnum, HabitatEnum, InlineTextEnum, NestEnum, PowerTagEnum, UiEnum } from '../types';
import { useCallback, useState, type ReactNode } from 'react';

type IconFileName =
  | (FoodEnum | PowerTagEnum | NestEnum | HabitatEnum | InlineTextEnum | UiEnum)
  | 'fan-made' | `range-maps/${string}`

type Props = {
  altText: string;
  className?: string;
  fallback?: ReactNode;
  icon: IconFileName;
};

const Wrapper = styled.picture`
  display: inline-block;
`;

const Icon = ({ altText, className, fallback, icon }: Props) => {
  const [shouldFallback, setShouldFallback] = useState(false);

  const handleNoImage = useCallback(
    () => setShouldFallback(true),
    []
  );

  return shouldFallback ? fallback : (
    <Wrapper className={className}>
      <img
        alt={altText}
        onError={handleNoImage}
        src={`/assets/${icon}.png`}
      />
    </Wrapper>
  );
};

export default Icon;
