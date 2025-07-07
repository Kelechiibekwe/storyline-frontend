import { motion } from "framer-motion";
import { useState } from "react";
import { IconType } from "react-icons";
import {
  FiArrowUp,
  FiChevronLeft,
  FiChevronRight,
  FiLink,
  FiTarget,
  FiTool,
  FiUpload,
} from "react-icons/fi";
import { FiEdit, FiMessageCircle, FiMic, FiHeadphones } from 'react-icons/fi';

const CollapseCardFeatures = () => {
  const [position, setPosition] = useState(0);

  const shiftLeft = () => {
    if (position > 0) {
      setPosition((pv) => pv - 1);
    }
  };

  const shiftRight = () => {
    if (position < features.length - 1) {
      setPosition((pv) => pv + 1);
    }
  };

  return (
    <section id="features" className="overflow-hidden px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex justify-between gap-4">
          <h2 className="text-4xl font-bold leading-[1.2] md:text-5xl">
            It's awesome. <span className="text-neutral-400">Here's why.</span>
          </h2>
          <div className="flex gap-2">
            <button
              className="h-fit bg-gray-900 p-4 rounded-xl text-2xl text-white transition-colors hover:bg-neutral-700"
              onClick={shiftLeft}
            >
              <FiChevronLeft />
            </button>
            <button
              className="h-fit bg-gray-900 p-4 rounded-xl text-2xl text-white transition-colors hover:bg-neutral-700"
              onClick={shiftRight}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          {features.map((feat, index) => (
            <Feature {...feat} key={index} position={position} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FeatureProps {
  position: number;
  index: number;
  title: string;
  description: string;
  Icon: IconType;
}

const Feature = ({
  position,
  index,
  title,
  description,
  Icon,
}: FeatureProps) => {
  const translateAmt =
    position >= index ? index * 100 : index * 100 - 100 * (index - position);

  return (
    <motion.div
      animate={{ x: `${-translateAmt}%` }}
      transition={{
        ease: "easeInOut",
        duration: 0.35,
      }}
      className={`relative flex rounded-xl min-h-[250px] w-10/12 max-w-lg shrink-0 flex-col justify-between overflow-hidden p-8 shadow-lg md:w-3/5 ${
        index % 2 ? "bg-gray-900 text-white" : " bg-white"
      }`}
    >
      <Icon className="absolute right-2 top-2 text-7xl opacity-20" />
      <h3 className="mb-8 text-3xl font-bold">{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

export default CollapseCardFeatures;

const features = [
    {
      title: "Podcast Your Life",
      Icon: FiHeadphones,
      description:
        "Transform your daily journals into podcasts—your thoughts, now streaming.",
    },
    {
      title: "Prompts That Get You",
      Icon: FiEdit,
      description:
        "Thoughtful, personalized prompts—never stare at an empty page again.",
    },
    {
      title: "Reflect, Interact, Grow",
      Icon: FiMessageCircle ,
      description:
        "Engage deeper with interactive journaling that sparks meaningful reflection.",
    },
    {
      title: "Real Voices",
      Icon: FiMic,
      description:
        "Ultra-realistic text-to-speech turns your entries into lifelike narrations.",
    },
  ];