import { styled } from '@linaria/react';
import { useEffect, useState } from 'react';
import removeBackgroundFromUrl from '../../utils/removeBackgroundFromUrl';

type Props = {
  altText: string;
  url: string;
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

const getSrc = async (url: string, removeBg: boolean) => {
  if (removeBg) return removeBackgroundFromUrl(url);
  return Promise.resolve(url);
};

const BirdImage = ( { altText, url, removeBg, scale, translateX, translateY }: Props) => {
  const [src, setSrc] = useState(url);

  useEffect(() => {
    getSrc(url, !!removeBg).then(setSrc);
  }, [url, removeBg]);

  return (
    <Wrapper style={{ transform: `scale(${scale || 1}) translate(${translateX || 0}%, ${translateY || 0}%)` }}>
      {src && <img key={src} src={src} alt={altText} />}
    </Wrapper>
  );
};

export default BirdImage;
