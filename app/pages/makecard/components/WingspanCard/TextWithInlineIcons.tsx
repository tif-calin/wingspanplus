import { useMemo, type ReactNode } from 'react';
import Icon from '../Icon';
import { styled } from '@linaria/react';
import { ALL_KEYWORDS, KEYWORD_SYNONYMS } from '../../types';

const SPECIAL_REGEX_STRING = `\\[(${ALL_KEYWORDS.join('|')})\\]`;
const SPECIAL_REGEX = new RegExp(SPECIAL_REGEX_STRING, 'g');

const Wrapper = styled.span`
  & img {
    display: inline-block;
    line-height: 0;
    vertical-align: sub;
    width: 1em;
  }
`;

type Props = {
  className?: string;
  text: string;
};

/**
 * Intended for both food cost and power text.
 *
 * @example "Draw a [card]."
 */
const TextWithInlineIcons = ({ text }: Props) => {
  const parsed = useMemo<ReactNode[]>(() => {
    return text.split(SPECIAL_REGEX).map((part, index) => {

      if (index % 2) {
        const keyword = KEYWORD_SYNONYMS[part] || part;
        return <Icon key={index} altText={part} icon={keyword} />
      }
      else return part;
    })
  }, [text]);

  return <Wrapper>{parsed}</Wrapper>;
};

export default TextWithInlineIcons;
