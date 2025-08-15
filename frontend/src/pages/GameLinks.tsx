import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

const games = [
  { name: "FireKirin", image: "/jpg/fire.jpg", link: "https://firekirin.com/" },
  {
    name: "OrionStar",
    image: "/jpg/orion.jpg",
    link: "http://start.orionstars.vip:8580/",
  },
  { name: "Juwa", image: "/jpg/juwa.jpg", link: "https://dl.juwa777.com/" },
  // { name: "Game", image: "/jpg/gamee.jpg", link:"" },
  {
    name: "Game Vault",
    image: "/jpg/vault.jpg",
    link: "https://download.gamevault999.com/",
  },
  { name: "CasinoRoyale", image: "/jpg/royale.jpg", link: "nolink" },
  {
    name: "VegasSweep",
    image: "/jpg/vegas.jpg",
    link: "https://m.lasvegassweeps.com/",
  },
  {
    name: "MilkyWay",
    image: "/jpg/milkyways.jpg",
    link: "https://milkywayapp.xyz/",
  },
  {
    name: "Ultra Panda",
    image: "/jpg/panda.jpg",
    link: "https://www.ultrapanda.mobi/",
  },
  {
    name: "Cash Frenzy",
    image: "/jpg/frenzy.jpg",
    link: "https://www.cashfrenzy777.com/",
  },
  { name: "PandaMaster", image: "/jpg/pandamaster.jpg", link: "nolink" },
  {
    name: "V Blink",
    image: "/jpg/vblink.jpg",
    link: "https://www.vblink777.club/",
  },
  {
    name: "River Sweeps",
    image: "/jpg/reversweeps.png",
    link: "https://bet777.eu/",
  },
  {
    name: "HighStake",
    image: "/jpg/highstake.jpg",
    link: "https://dl.highstakesweeps.com/",
  },
  {
    name: "Vegas X",
    image: "/jpg/vegasx.png",
    link: "https://www.vegas-x.org/",
  },
  { name: "Ace Book", image: "/jpg/ace.jpg", link: "nolink" },
  {
    name: "Blue Dragon",
    image: "/jpg/dragons.jpg",
    link: "http://app.bluedragon777.com/",
  },
  {
    name: "Para",
    image: "/jpg/para.jpg",
    link: "https://download.paracasino.net/",
  },
  { name: "River Monster", image: "/jpg/river.png", link: "https://rm777.net/" },
  {
    name: "Moolah",
    image: "/jpg/moolah.jpg",
    link: "https://moolah.vip:8888/",
    adminlink: " https://moolah.vip:8781/Agent.aspx",
  },
  { name: "Sirus", image: "/jpg/sirus.jpg", link: "nolink" },
  {
    name: "Mega Spin",
    image: "/jpg/megaspin.jpg",
    link: "https://www.megaspinsweeps.com/",
  },
  { name: "Egames", image: "/jpg/egames.jpg", link: "nolink" },
  { name: "Loot", image: "/jpg/loot.jpg", link: "https://m.lootgame777.com/" },
  {
    name: "Egnite",
    image: "/jpg/ignite.jpg",
    link: "https://download.casinoignite.vip/",
  },
  {
    name: "Game Room",
    image: "/jpg/gameroom.png",
    link: "https://www.gameroom777.com/",
    adminlink: "http://dl.gameroom777.com/",
  },
  { name: "Yolo", image: "/jpg/yolo.png", link: "https://yolo777.game/" },
  {
    name: "Mafia",
    image: "/jpg/mafia.png",
    link: "https://www.mafia77777.com/",
    adminlink: "http://dl.mafia77777.com",
  },

  {
    name: "Cash Machine",
    image: "/jpg/cashmachine.png",
    link: "https://www.cashmachine777.com/",
    adminlink: "http://agentserver.cashmachine777.com:8003/",
  },
  {
    name: "Joker",
    image: "/jpg/joker.png",
    link: "https://www.joker777.win/",
    adminlink: "http://agent.joker777.win:8003/admin",
  },
  {
    name: "Billion Balls",
    image: "/jpg/billionballs.png",
    link: "https://billionballs.club/",
  },
];

const SkeletonCard = () => (
  <div className="flex flex-col items-center text-center rounded-xl py-5 p-4 bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg animate-pulse w-full max-w-[200px] mx-auto">
    <div className="w-full aspect-square rounded-lg bg-gray-400/20 mb-4" />
    <div className="h-6 w-32 bg-gray-400/20 rounded mb-4" />
    <div className="h-10 w-full bg-gray-400/20 rounded" />
  </div>
);

const GameCard = ({
  name,
  image,
  link,
  custom,
}: {
  name: string;
  image: string;
  link?: string;
  custom?: number;
}) => {
  const [loaded, setLoaded] = useState(false);

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.15,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={custom}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center text-center rounded-xl 
  py-3 px-3 sm:py-5 sm:px-4 
  bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg 
  hover:shadow-xl transition-shadow duration-300 
  w-full max-w-[200px] mx-auto"
    >
      <div className="w-full aspect-square rounded-lg overflow-hidden relative">
        {!loaded && (
          <div className="absolute inset-0 bg-gray-400/20 animate-pulse rounded-lg" />
        )}
        <img
          src={image}
          alt={name}
          loading="lazy"
          className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
        />
      </div>

      <p className="mt-3 sm:mt-4 text-primary font-medium text-[16px] sm:text-[22px] truncate max-w-full">
        {name}
      </p>
      {link && (
        <a
  href={link}
  target="_blank"
  rel="noopener noreferrer"
  className="w-full mt-3"
>
  {/* Desktop button (md and up) */}
<button
  className="button-primary w-full max-w-[180px] px-3 py-2 hidden md:flex items-center justify-center 
             hover:scale-105 transition-transform duration-200"
>
  <span className="button-content text-xs md:text-sm whitespace-nowrap">
    PLAY NOW
  </span>
</button>

  
</a>

      )}
    </motion.div>
  );
};

const GameLinks = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"player" | "agent">("player");

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const filteredGames =
    filter === "player"
      ? games.filter((g) => g.link && g.link !== "nolink")
      : games.filter((g) => g.adminlink && g.adminlink !== "nolink");

  return (
    <div className="p-1 sm:p-6 md:p-8 max-w-[1280px] mx-auto">
      <div>
        <p className="text-gradient text-secondary text-[32px] sm:text-[40px] font-bold text-center">
          GAME LINKS
        </p>
        <div className="flex justify-center items-center gap-2 mt-3 flex-wrap">
          <button
            className={`button-primary   ${
              filter === "player" ? "opacity-100" : "opacity-60"
            }`}
            onClick={() => setFilter("player")}
          >
            <span className="button-content">PLAYER LINKS</span>
          </button>

          <button
            className={`button-outline ${
              filter === "agent" ? "opacity-100" : "opacity-60"
            }`}
            onClick={() => setFilter("agent")}
          >
            <span className="button-content">AGENT LINKS</span>
          </button>
        </div>
      </div>

      {/* Games Grid */}
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mt-8 p-1 sm:p-2 md:p-4"
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : filteredGames.map((game, index) => (
              <GameCard
                key={index}
                name={game.name}
                image={game.image}
                link={filter === "player" ? game.link : game.adminlink}
                custom={index}
              />
            ))}
      </motion.div>
      <div className="flex justify-center items-center mt-5">
        <button className="button-outline mt-5 px-3 py-1 sm:px-5 sm:py-2">
          <span className="button-content font-semibold text-[12px] sm:text-[16px] md:text-[18px] whitespace-nowrap">
            MORE GAMES COMING SOON!
          </span>
        </button>
      </div>
    </div>
  );
};

export default GameLinks;
