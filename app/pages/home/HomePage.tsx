import ExternalLink from '../../components/ExternalLink';
import { Link } from 'react-router';

const HomePage = () => {
  return (
    <div className='island'>
      <p>
        This is the home page for <ExternalLink href="https://culi.page/">Culi&apos;s</ExternalLink> helper site for <ExternalLink href="https://boardgamegeek.com/boardgame/266192/wingspan">the Wingspan boardgame</ExternalLink>.
      </p>
      <p>
        Check out <Link to="/makecard">the card maker</Link> to create your own custom bird cards!
      </p>
    </div>
  );
};

export default HomePage;
