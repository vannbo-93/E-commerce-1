/** @format */
import CategoryCard from "./CategoryCard";
import camer from "../../images/allProducts/camera.png";
import controller from "../../images/allProducts/controller.png";
import drone from "../../images/allProducts/drone.png";
import headset from "../../images/allProducts/headset.png";
import homespeaker from "../../images/allProducts/homespeaker.png";
import keyboard from "../../images/allProducts/keyboard.png";
import microphone from "../../images/allProducts/microphone.png";
import powerbank from "../../images/allProducts/powerbank.png";
import projector from "../../images/allProducts/projector.png";
import smartphone from "../../images/allProducts/smartphone.png";
import smartphone1 from "../../images/allProducts/smartphone1.png";
import smartring from "../../images/allProducts/smartring.png";
import smartwatch from "../../images/allProducts/smartwatch.png";
import speaker from "../../images/allProducts/speaker.png";
import tracker from "../../images/allProducts/tracker.png";
import vacuum from "../../images/allProducts/vacuum.png";
import wificamera from "../../images/allProducts/wificamera.png";
import wirelesscharger from "../../images/allProducts/wirelesscharger.png";
import wirelessearbuds from "../../images/allProducts/wirelessearbuds.png";
import wirelessheadphones from "../../images/allProducts/wirelessheadphones.png";

const CategoryContainer = () => {
  return (
    <div className="my-3 min-h-screen" dir="ltr">
      <div>
        <div className="flex items-center justify-center gap-4 py-3">
          <span className="h-px flex-1 max-w-24 bg-sky-500" />
          <h2 className="text-lg font-semibold text-gray-900">All Category</h2>
          <span className="h-px flex-1 max-w-24 bg-sky-500" />
        </div>
        <div className="grid grid-cols-4 gap-4 my-2 mx-12">
          <CategoryCard title="camer" img={camer} />
          <CategoryCard title="controller" img={controller} />
          <CategoryCard title="drone" img={drone} />
          <CategoryCard title="headset" img={headset} />
          <CategoryCard title="homespeaker" img={homespeaker} />
          <CategoryCard title="keyboard" img={keyboard} />
          <CategoryCard title="microphone" img={microphone} />
          <CategoryCard title="powerbank" img={powerbank} />
          <CategoryCard title="smartphone" img={smartphone} />
          <CategoryCard title="projector" img={projector} />
          <CategoryCard title="smartphone1" img={smartphone1} />
          <CategoryCard title="smartwatch" img={smartwatch} />
          <CategoryCard title="speaker" img={speaker} />
          <CategoryCard title="tracker" img={tracker} />
          <CategoryCard title="vacuum" img={vacuum} />
          <CategoryCard title="wificamera" img={wificamera} />
          <CategoryCard title="wirelesscharger" img={wirelesscharger} />
          <CategoryCard title="wirelessearbuds" img={wirelessearbuds} />
          <CategoryCard title="wirelessheadphones" img={wirelessheadphones} />
          <CategoryCard title="smartring" img={smartring} />
        </div>
      </div>
    </div>
  );
};
export default CategoryContainer;
