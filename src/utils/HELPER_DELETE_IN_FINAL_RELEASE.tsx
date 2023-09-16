import {
  AiOutlineFacebook as IconFacebook,
  AiOutlineInstagram as IconInstagram,
  AiOutlineYoutube as IconYoutube,
} from "react-icons/ai";

import ImgKsetLogo from "~/assets/images/logo/kset-logo.svg";

export const RANDOM_SITES = [
  "https://sliding.toys/mystic-square/8-puzzle/daily/",
  "https://longdogechallenge.com/",
  "https://maze.toys/mazes/mini/daily/",
  "https://optical.toys",
  "https://paint.toys/",
  "https://puginarug.com",
  "https://alwaysjudgeabookbyitscover.com",
  "https://clicking.toys/peg-solitaire/english/",
  "https://weirdorconfusing.com/",
  "https://checkbox.toys/scale/",
  "https://binarypiano.com/",
  "https://mondrianandme.com/",
  "https://onesquareminesweeper.com/",
  "https://cursoreffects.com",
  "http://floatingqrcode.com/",
  "https://thatsthefinger.com/",
  "https://cant-not-tweet-this.com/",
  "http://heeeeeeeey.com/",
  "http://corndog.io/",
  "http://eelslap.com/",
  "http://www.staggeringbeauty.com/",
  "http://burymewithmymoney.com/",
  "https://smashthewalls.com/",
  "https://jacksonpollock.org/",
  "http://endless.horse/",
  "http://drawing.garden/",
  "https://www.trypap.com/",
  "http://www.republiquedesmangues.fr/",
  "http://www.movenowthinklater.com/",
  "https://sliding.toys/klotski/easy-street/",
  "https://paint.toys/calligram/",
  "https://checkboxrace.com/",
  "http://www.rrrgggbbb.com/",
  "http://www.koalastothemax.com/",
  "https://rotatingsandwiches.com/",
  "http://www.everydayim.com/",
  "http://randomcolour.com/",
  "http://maninthedark.com/",
  "http://cat-bounce.com/",
  "http://chrismckenzie.com/",
  "https://thezen.zone/",
  "http://ninjaflex.com/",
  "http://ihasabucket.com/",
  "http://corndogoncorndog.com/",
  "http://www.hackertyper.com/",
  "https://pointerpointer.com",
  "http://imaninja.com/",
  "http://www.partridgegetslucky.com/",
  "http://www.ismycomputeron.com/",
  "http://www.nullingthevoid.com/",
  "http://www.muchbetterthanthis.com/",
  "http://www.yesnoif.com/",
  "http://lacquerlacquer.com",
  "http://potatoortomato.com/",
  "http://iamawesome.com/",
  "https://strobe.cool/",
  "http://thisisnotajumpscare.com/",
  "http://doughnutkitten.com/",
  "http://crouton.net/",
  "http://corgiorgy.com/",
  "http://www.wutdafuk.com/",
  "http://unicodesnowmanforyou.com/",
  "http://chillestmonkey.com/",
  "http://scroll-o-meter.club/",
  "http://www.crossdivisions.com/",
  "http://tencents.info/",
  "https://boringboringboring.com/",
  "http://www.patience-is-a-virtue.org/",
  "http://pixelsfighting.com/",
  "http://isitwhite.com/",
  "https://existentialcrisis.com/",
  "http://onemillionlols.com/",
  "http://www.omfgdogs.com/",
  "http://oct82.com/",
  "http://chihuahuaspin.com/",
  "http://www.blankwindows.com/",
  "http://tunnelsnakes.com/",
  "http://www.trashloop.com/",
  "http://spaceis.cool/",
  "http://www.doublepressure.com/",
  "http://www.donothingfor2minutes.com/",
  "http://buildshruggie.com/",
  "http://buzzybuzz.biz/",
  "http://yeahlemons.com/",
  "http://wowenwilsonquiz.com",
  "https://thepigeon.org/",
  "http://notdayoftheweek.com/",
  "http://www.amialright.com/",
  "https://greatbignothing.com/",
  "https://zoomquilt.org/",
  "https://dadlaughbutton.com/",
  "https://remoji.com/",
  "http://papertoilet.com/",
  "https://loopedforinfinity.com/",
  "https://end.city/",
  "https://www.bouncingdvdlogo.com/",
  "https://toms.toys",
  "https://clicking.toys/flip-grid/neat-nine/3-holes/",
  "https://optical.toys/are-they-moving-rainbows/",
].sort(() => Math.random() - 0.5);

export const randomSite = (index = -1) => {
  if (index === -1) {
    return RANDOM_SITES[Math.floor(Math.random() * RANDOM_SITES.length)];
  } else {
    return RANDOM_SITES[index];
  }
};

export const randomSiteIterator = () => {
  let index = 0;
  return {
    next: () => {
      if (index >= RANDOM_SITES.length) {
        index = 0;
      }

      return randomSite(index++);
    },
  };
};

export const SOCIAL_LINKS = [
  {
    icon: <IconInstagram />,
    label: "instagram",
    link: "https://www.instagram.com/klubkset/",
  },
  {
    icon: <IconFacebook />,
    label: "facebook",
    link: "https://www.facebook.com/KSETZg",
  },
  {
    icon: <IconYoutube />,
    label: "youtube",
    link: "http://www.youtube.com/user/KsetVideo",
  },
];

export const PAGE_ABOUT__CIRCLE_INFOS = [
  {
    title: "9 sekcija",
    text: "To je bivša kotlovnica smještena na sjeveroistočnom uglu najboljeg fakulteta na svijetu",
    icon: "https://loremflickr.com/100/100",
  },
  {
    title: "Projekti",
    text: "To je bivša kotlovnica smještena na sjeveroistočnom uglu najboljeg fakulteta na svijetu",
    icon: "https://loremflickr.com/101/101",
  },
  {
    title: "Šta god",
    text: "To je bivša kotlovnica smještena na sjeveroistočnom uglu najboljeg fakulteta na svijetu",
    icon: "https://loremflickr.com/102/102",
  },
];

const sponsorImg = (w: number, h: number) => {
  return {
    src: `https://loremflickr.com/${w}/${h}`,
    meta: {
      width: w,
      height: h,
    },
  };
};

let sponsorsI_ = 0;
const sitesIterator = randomSiteIterator();
export const PAGE_ABOUT__SPONSORS = [
  {
    image: sponsorImg(400, 400),
    name: `Sponzor ${++sponsorsI_}`,
    link: sitesIterator.next(),
  },
  {
    image: sponsorImg(1920, 900),
    name: `Sponzor ${++sponsorsI_}`,
    link: sitesIterator.next(),
  },
  {
    image: sponsorImg(448, 87),
    name: `Sponzor ${++sponsorsI_}`,
    link: sitesIterator.next(),
  },
  {
    image: sponsorImg(300, 157),
    name: `Sponzor ${++sponsorsI_}`,
    link: sitesIterator.next(),
  },
  {
    image: sponsorImg(1001, 1001),
    name: `Sponzor ${++sponsorsI_}`,
    link: sitesIterator.next(),
  },
  {
    image: sponsorImg(150, 150),
    name: `Sponzor ${++sponsorsI_}`,
    link: sitesIterator.next(),
  },
  {
    image: sponsorImg(500, 118),
    name: `Sponzor ${++sponsorsI_}`,
    link: sitesIterator.next(),
  },
  {
    image: sponsorImg(401, 401),
    name: `Sponzor ${++sponsorsI_}`,
    link: sitesIterator.next(),
  },
  {
    image: sponsorImg(1920, 1080),
    name: `Sponzor ${++sponsorsI_}`,
    link: sitesIterator.next(),
  },
];

export const PAGE_ABOUT__DOWNLOAD_ITEMS = [
  {
    title: "Logotip",
    downloadLink: "#",
    preview: ImgKsetLogo as unknown,
  },
  {
    title: "Knjiga standarda",
    downloadLink: "#",
  },
  {
    title: "Letci",
    downloadLink: "#",
  },
];
