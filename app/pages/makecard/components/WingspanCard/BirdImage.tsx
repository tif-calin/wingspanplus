import { styled } from '@linaria/react';
import { useEffect, useState } from 'react';
import removeBackgroundFromUrl from '../../utils/removeBackgroundFromUrl';

type Props = {
  altText: string;
  imageSrc: string;
  removeBg?: boolean;
  scale?: number;
  translateX?: number;
  translateY?: number;
};

const Wrapper = styled.picture<{
  scale?: number;
  translateX?: number;
  translateY?: number;
}>`
  transform:
    scale(${p => p.scale || 1})
    translate(${p => p.translateX || 0}%, ${p => p.translateY || 0}%)
  ;
`;

const BirdImage = ( { altText, imageSrc, removeBg, scale, translateX, translateY }: Props) => {
  const [src, setSrc] = useState(imageSrc);

  useEffect(() => {
    if (removeBg) removeBackgroundFromUrl(imageSrc).then(setSrc);
  }, [imageSrc, removeBg]);

  return (
    <Wrapper style={{ transform: `scale(${scale || 1}) translate(${translateX || 0}%, ${translateY || 0}%)` }}>
      {src && <img src={src} alt={altText} />}
    </Wrapper>
  );
};

export default BirdImage;
