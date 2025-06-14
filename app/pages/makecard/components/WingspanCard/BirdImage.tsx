import { styled } from '@linaria/react';

type Props = {
  imageSrc: string;
  altText: string;
  scale?: number;
  translateX?: number;
  translateY?: number;
};

const Wrapper = styled.picture<{
  scale?: number;
  translateX?: number;
  translateY?: number;
}>`
  transform: scale(${p => p.scale || 1}) translate(${p => p.translateX || 0}%, ${p => p.translateY || 0}%);
`;

const BirdImage = ({ imageSrc, scale, translateX, translateY }: Props) => {
  return (
    <Wrapper style={{ transform: `scale(${scale || 1}) translate(${translateX || 0}%, ${translateY || 0}%)` }}>
      <img
        src={imageSrc}
      />
    </Wrapper>
  );
};

export default BirdImage;
