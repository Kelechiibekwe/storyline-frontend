import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { IconType } from "react-icons";
import { FiCheck, FiLoader, FiX } from "react-icons/fi";

// export const Example = () => {
//   return (
//     <div className="grid min-h-[200px] place-content-center bg-neutral-900 p-4">
//       <LoadAndErrorButton />
//     </div>
//   );
// };

export const LoadAndErrorButton = () => {
  const [variant, setVariant] = useState<
    "neutral" | "loading" | "error" | "success"
  >("neutral");

  const classNames =
    variant === "neutral"
      ? "bg-indigo-500 hover:bg-indigo-600"
      : variant === "error"
      ? "bg-red-500"
      : variant === "success"
      ? "bg-green-500"
      : "bg-indigo-300 pointer-events-none";

  const handleClick = () => {
    if (variant !== "neutral") return;

    setVariant("loading");
    setTimeout(() => {
      setVariant(Math.random() > 0.5 ? "success" : "error");

      setTimeout(() => {
        setVariant("neutral");
      }, 2500);
    }, 1500);
  };

  return (
    <motion.button
      disabled={variant !== "neutral"}
      onClick={handleClick}
      className={`relative rounded-full px-4 py-2 font-medium text-white text-sm transition-all ${classNames}`}
    >
      <motion.span
        animate={{
          y: variant === "neutral" ? 0 : 6,
          opacity: variant === "neutral" ? 1 : 0,
        }}
        className="flex flex-row gap-1 items-center"
      >
        <Plus size={16} />
        New Story
      </motion.span>
      <IconOverlay Icon={FiLoader} visible={variant === "loading"} spin />
      <IconOverlay Icon={FiX} visible={variant === "error"} />
      <IconOverlay Icon={FiCheck} visible={variant === "success"} />
    </motion.button>
  );
};

const IconOverlay = ({
  Icon,
  visible,
  spin = false,
}: {
  Icon: IconType;
  visible: boolean;
  spin?: boolean;
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{
            y: -12,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: 12,
            opacity: 0,
          }}
          className="absolute inset-0 grid place-content-center"
        >
          <Icon className={`text-xl duration-300 ${spin && "animate-spin"}`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
