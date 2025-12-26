import { useCallback, useState, type MouseEventHandler } from 'react';
import Button from '~/components/forms/Button';
import download from 'downloadjs';
import * as htmlToImage from '@jpinsonneau/html-to-image';
import { styled } from '@linaria/react';

const ButtonDock = styled.div`
  display: flex;
  width: 100%;

  & > button {
    border-right: 0;
     border-top-right-radius: 0;
     border-bottom-right-radius: 0;
    flex-grow: 1;
  }

  & > select {
    background-color: #fff;
    border: 2px solid #455;
    border-left-width: 1px;
    border-radius: 0.15rem;
     border-top-left-radius: 0;
     border-bottom-left-radius: 0;
  }
`;

type Props = {
  elementId: string;
  fileName: string;
};

const OPTIONS = [
  { value: 'toSvg', label: 'SVG' },
  { value: 'toPng', label: 'PNG' },
  { value: 'toJpeg', label: 'JPEG' },
] as const;

type Method = typeof OPTIONS[number]['value'];

const DownloadButton = ({ elementId, fileName }: Props) => {
  const [downloadAs, setDownloadAs] = useState<Method>('toJpeg');

  const handleClickDownload = useCallback<MouseEventHandler<HTMLButtonElement>>(async _event => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const date = new Date().toISOString().split('T')[0];
    const uniqFileName = `${fileName}-${date}.png`;

    htmlToImage[downloadAs](element).then(
      async dataUrl => download(dataUrl, uniqFileName)
    );
  }, [downloadAs, elementId, fileName]);

  return (
    <ButtonDock>
      <Button onClick={handleClickDownload}>Download as ...</Button>
      <select defaultValue={downloadAs} onChange={e => setDownloadAs(e.target.value as 'toSvg' | 'toPng' | 'toJpeg')}>
        {OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </ButtonDock>
  )
};

export default DownloadButton;
