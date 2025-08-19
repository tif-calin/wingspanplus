import InfoSection from './InfoSection';

type Props = { classification: string[]; };

const Taxonomy = ({ classification }: Props) => {
  return classification.length ? (
    <InfoSection title="taxonomy">
      {classification.map((name, index) => {
        const isLast = index === classification.length - 1;

        return (
          <span key={name} style={isLast ? { fontStyle: 'italic' } : {}}>{name}{isLast ? '' : ' > '}</span>
        );
      })}
    </InfoSection>
  ) : null;
};

export default Taxonomy;
