import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import SquadPreview from '../components/SquadPreview.jsx';
import Fixtures from '../components/Fixtures.jsx';
import PlayerSpotlight from '../components/PlayerSpotlight.jsx';
import KingsStats from '../components/KingsStats.jsx';
import PointsTable from '../components/PointsTable.jsx';
import Gallery from '../components/Gallery.jsx';
import Anthem from '../components/Anthem.jsx';
import Partners from '../components/Partners.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <SquadPreview />
      <Fixtures />
      <PlayerSpotlight />
      <KingsStats />
      <PointsTable />
      <Gallery />
      <Anthem />
      <Partners />
    </>
  );
}
