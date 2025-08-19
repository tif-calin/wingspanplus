import React from 'react';
import ExternalLink from '../../components/ExternalLink';
import { Link } from 'react-router';

const HomePage = () => {
  return (
    <>
      <header>
        <h1>Wingfanz</h1>
      </header>
      <main className='island'>
        <p>
          This is the home page for <ExternalLink href="https://culi.page/">Culi&apos;s</ExternalLink> helper site for <ExternalLink href="https://boardgamegeek.com/boardgame/266192/wingspan">the Wingspan boardgame</ExternalLink>.
        </p>
        <p>
          Check out <Link to="/makecard">the card maker</Link> to create your own custom bird cards!
        </p>
        {/* <p>
          There are <ExternalLink href="https://www.catalogueoflife.org/data/taxon/V2">10,599 species of birds in 230 families described in the Catalogue of Life</ExternalLink>. For comparison, there&apos;s 6,025 species across 161 families  of <ExternalLink href="https://www.catalogueoflife.org/data/taxon/6224G">mammals</ExternalLink>. <ExternalLink href="https://www.catalogueoflife.org/data/taxon/45C">Reptiles</ExternalLink> have 11,300 species described but only 73 families. The 230 families of birds are divided into 42 orders with Passiformes containing 59.4% of all bird species (the second largest order, Apodiformes, only contains 4.6% of all birds! Apodiformes contains swifts, treeswifts, and hummingbirds).
        </p>
        <p>
          Wingspan&apos;s base game comes with 170 birds along with a booster pack of 10 additional cards. The European expansion pack adds 81 new birds; Oceania expansion adds 95; and the Asia expansion adds 90 more. Which makes a total of {DATA.length + 90} bird cards. You can search through these cards using Navarog&apos;s beautiful site <ExternalLink href="https://navarog.github.io/wingsearch/">Wingsearch</ExternalLink>. It's also worth noting the Fan Art pack which provided alternative illustrations for 255 birds across the first 3 expansions.
        </p>
        <p>
          So how well does Wingspan represent that real diversity of birds? The largest order, Passeriformes, make up 59.4% of all birds, but there are only 157 Wingspan cards representing birds in this order, which accounts for 44.2% of Wingspan cards. There are 17 orders that have at least 3 birds represented by Wingspan cards. The most overrepresented of these is the waterfowl order, Anseriformes, which includes ducks, geese, and swans. Waterfowl make up 1.55% of all bird species, but account for 7.04% (25) of Wingspan bird cards. Of these 17 orders, there are 6 orders (including waterfowl) that account for at least twice as large a proportion of Wingspan cards as the proportion of real species they represent. These orders are:
          <ul>
            <li>Accipitriformes (hawks, eagles, vultures, kites, etc): 7.61% vs. 2.49%</li>
            <li>Anseriformes (waterfowl): 7.04%	vs 1.55%</li>
            <li>Pelecaniformes (ibises, pelicans, and herons): 4.79%	vs. 1.07%</li>
            <li>Suliformes (cormorants, boobies, frigatebirds, shags, darters): 1.69%	vs. 0.53%</li>
            <li>Falconiformes (falcons): 1.41%	vs. 0.62%</li>
            <li>Podicipediformes (grebes): 0.85% vs. 0.22%</li>
          </ul>
        </p>
        <p>
          15 of the 42 orders are not represented at all in Wingspan. The largest of these is Tinamiformes which contains 47 species tinamous. They are ground-dwelling and usually quite sedentary ratites from South and Central America.
        </p> */}
      </main>
    </>
  );
};

export default HomePage;
