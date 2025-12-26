import { styled } from '@linaria/react';
import { memo, useCallback, useEffect, useId, useState, type ChangeEventHandler, type ComponentProps } from 'react';
import FormGridLayout from '~/components/forms/FormGridLayout';
import Input from '~/components/forms/Input';
import { getPhotos } from '~/utils/services/inaturalist';
import type WingspanCard from '../WingspanCard';

const PhotoSelectorWrapper = styled.div`
  border: 2px dashed var(--clr-border);
   border-radius: 0.15rem;
  grid-column: span 12;
  padding: 1rem;

  & .hidden {
    pointer-events: none;
    display: none;
    opacity: 0;
    visibility: hidden;
  }

  & .photo-slider {
    display: flex;
    gap: 1rem;
    margin: -0.25rem;
    overflow-x: auto;
    padding: 0.25rem;

    & img {
      aspect-ratio: 1 / 1;
      min-width: 100px;
    }

    & input[type="radio"] {
      display: none;
    }

    & label:has(input[type="radio"]:checked) {
      box-shadow: 0 0 0 0.25rem var(--clr-focus);
    }
  }
`;

const ControlSection = styled(FormGridLayout)`
  border: none;
   gap: 1rem;
  margin-top: 1rem;

  & .removebg-checkbox {
    display: flex;
     gap: 0.25rem;
     justify-content: center;
    grid-column: span 4;
    padding: 0.25rem 0.5rem;
    white-space: nowrap;
  }
`;

type Props = {
  handleChange: (ev: { currentTarget: HTMLFormElement, target: HTMLInputElement }) => void;
  inaturalistId: string;
} & ComponentProps<typeof WingspanCard>['photo'];

const PhotoSelector = ({ handleChange, inaturalistId, ...photo }: Props) => {
  const [photoOptions, setPhotoOptions] = useState<Awaited<ReturnType<typeof getPhotos>>>([]);

  const urlInputId = useId();

  useEffect(() => {
    getPhotos(inaturalistId).then(result => setPhotoOptions(result));
  }, [inaturalistId]);

  const handleSelectPhoto = useCallback<ChangeEventHandler<HTMLInputElement>>(ev => {
    ev.stopPropagation();

    const photoId = Number(ev.currentTarget.value);
    const photoUrl = photoOptions.find(photo => photo.id === photoId)?.url?.replace('square', 'original');
    console.log('photoId', photoUrl);

    const urlInput = document.getElementById(urlInputId) as HTMLInputElement | null;
    if (urlInput && urlInput.form) {
      urlInput.value = photoUrl || '';
      handleChange({ currentTarget: urlInput.form, target: urlInput });
    };
  }, [handleChange, photoOptions, urlInputId]);

  return (
    <PhotoSelectorWrapper>
      <div className="photo-slider">
        {photoOptions.map(photoOption => (
          <label key={photoOption.id}>
            <input
              name="photo-selection"
              onChange={handleSelectPhoto}
              type="radio"
              value={photoOption.id}
              checked={photo.url?.includes(`/${photoOption.id}/`)}
            />
            <img src={photoOption.url} alt={photoOption.license_code} />
          </label>
        ))}
      </div>
      <ControlSection>
        <Input
          id={urlInputId}
          defaultValue={photo.url || ''}
          gridSpan={8}
          kind="text"
          label="URL"
          name="photo.url"
          type="text"
        />
        <label className="removebg-checkbox">
          <input
            defaultChecked={photo.removeBg}
            key={`photo.removeBg${photo.removeBg}`}
            type="checkbox"
            name="photo.removeBg"
          />
          Remove Background
        </label>
        <Input
          defaultValue={photo.scale || 1}
          gridSpan={4}
          kind="number"
          label="Scale"
          name="photo.scale"
          step={0.05}
          type="number"
        />
        <Input
          defaultValue={photo.translateX || 0}
          gridSpan={4}
          kind="number"
          label="X Translation"
          name="photo.translateX"
          type="number"
        />
        <Input
          defaultValue={photo.translateY || 0}
          gridSpan={4}
          kind="number"
          label="Y Translation"
          name="photo.translateY"
          type="number"
        />
      </ControlSection>
    </PhotoSelectorWrapper>
  );
};

export default memo(PhotoSelector);
