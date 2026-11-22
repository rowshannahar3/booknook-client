import HeroSlider from "../HeroSlider";
import NewArrivals from "../NewArrivals";
import ShelfTiles from "../ShelfTiles";
import HowItWorks from "../HowItWorks";

// Banner/slider + New Arrivals + exactly 2 extra static sections (Browse by Shelf, How Borrowing Works).
export default function HomeView() {
  return (
    <>
      <HeroSlider />
      <NewArrivals />
      <ShelfTiles />
      <HowItWorks />
    </>
  );
}