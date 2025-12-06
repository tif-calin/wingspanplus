import { css } from '@linaria/core';
import { useCallback, type MouseEventHandler } from 'react';
import Button from '~/components/forms/Button';
import download from 'downloadjs';
import * as htmlToImage from '@jpinsonneau/html-to-image';

const buttonStyles = css`
  align-self: center;
  font-weight: 700;
  padding: 0 0.5rem;
  width: fit-content;
`;

type Props = {
  elementId: string;
  fileName: string;
};

const DownloadButton = ({ elementId, fileName }: Props) => {
  const handleClickDownload = useCallback<MouseEventHandler<HTMLButtonElement>>(async _event => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const date = new Date().toISOString().split('T')[0];
    const uniqFileName = `${fileName}-${date}.png`;

    htmlToImage.toJpeg(element).then(
      async dataUrl => download(dataUrl, uniqFileName)
    );
  }, [elementId, fileName]);

  return (
    <Button onClick={handleClickDownload} className={buttonStyles}>download &darr;</Button>
  )
};

export default DownloadButton;
