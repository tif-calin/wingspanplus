import { useMemo, type ReactNode } from 'react';
import Icon from '../Icon';
import { styled } from '@linaria/react';

const SPECIAL_STRINGS = `
  bowl
  cavity
  card
  dice
  egg
  fish
  flocking
  forest
  fruit
  grassland
  ground
  invertebrate
  nectar
  platform
  predator
  rodent
  seed
  star
  wetland
  wild
`.split(/\s+/).filter(Boolean).map(s => `${s.trim()}`);
const SPECIAL_REGEX_STRING = `\\[(${SPECIAL_STRINGS.join('|')})\\]`;
const SPECIAL_REGEX = new RegExp(SPECIAL_REGEX_STRING, 'g');

type Props = {
  className?: string;
  text: string;
};

const Wrapper = styled.span`
  & img {
    display: inline-block;
    width: 1em;
    vertical-align: sub;
  }
`;

/**
 * Intended for both food cost and power text.
 *
 * @example "Draw a [card]."
 */
const TextWithInlineIcons = ({ text }: Props) => {
  const parsed = useMemo<ReactNode[]>(() => {
    return text.split(SPECIAL_REGEX).map((part, index) => {

      // TODO: replace 'as any' with type guard
      return (index % 2) ? <Icon altText={part} icon={part as any} /> : part;
    })
  }, [text])

  return <Wrapper>{parsed}</Wrapper>;
};

export default TextWithInlineIcons;
