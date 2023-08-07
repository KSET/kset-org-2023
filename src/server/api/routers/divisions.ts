import { z } from "zod";

import IconBike from "~/assets/images/icons/divisions/bike.jpg";
import IconComp from "~/assets/images/icons/divisions/comp.jpg";
import IconDisco from "~/assets/images/icons/divisions/disco.jpg";
import IconDramska from "~/assets/images/icons/divisions/dramska.jpg";
import IconFoto from "~/assets/images/icons/divisions/foto.jpg";
import IconGlazbena from "~/assets/images/icons/divisions/glazbena.jpg";
import IconPijandure from "~/assets/images/icons/divisions/pijandure.jpg";
import IconTech from "~/assets/images/icons/divisions/tech.jpg";
import IconVideo from "~/assets/images/icons/divisions/video.jpg";

import { createTRPCRouter, publicProcedure } from "../trpc";

type Division = {
  id: unknown;
  slug: string;
  name: string;
  description: string;
  text: string;
  icon: {
    src: string;
    height: number;
    width: number;
    blurSrc?: string;
  };
};

let _id = 1;

const DIVISIONS = [
  {
    slug: "bike",
    name: "Bike",
    description:
      "Biciklističku sekciju, nekoć poznatu i pod imenom bike@KSET, čine članovi koji uživaju u vožnjama planinama, vrhovima šuma, prijevojima, velikoj dozi adrenalina, kao i u odličnom baratanju alatom kojim popravljaju svoje limene ljubimce.",
    text: `
      <p>Organiziraju popravljaonice bicikala ispred KSET-a, natjecanja na trenažerima, edukacije i putovanja biciklima diljem zemlje.</p>

      <p>U ovom izdanju postoje od 2006. godine i od tada su prošli pregršt izleta, kraćih vožnji, utrka, druženja te uspona i padova (u doslovnom i prenesenom smislu).</p>

      <p>Ako ti se sviđa dosad pročitano i stvarno misliš da je bicikl najbolje prijevozno sredstvo - nastavi čitati dalje!</p>

      <p>Pridruži im se jer uz njih možeš:
      <ul>
        <li>voziti po okolici Zagreba (vole Sljeme, ali i druge krajeve pa i udaljene gore)</li>
        <li>koristiti kvalitetni specijalizirani alat za bicikle te sve ostale potrebne masti i odmaščivaće</li>
        <li>sudjelovati na raznim utrkama (par članova su iskusni natjecatelji HR MTB Kupa)</li>
        <li>proći tjelesni na FER-u skupljajući bodove kroz vožnje</li>
        <li>popravljati bicikle i učiti o tome od iskusnijih kolega te sudjelovati u promociji biciklizma</li>
        <li>družiti se, roštiljati i upoznavati ljude sličnih interesa</li>
      </ul>
      Za više informacija javi im se preko Facebook stranice , maila voditelja sekcije ili dođi u KSET i raspitaj se!
      </p>
  `,
    icon: IconBike,
  },
  {
    slug: "disco",
    name: "Disco",
    description:
      "Pitaš se gdje se okupljaju KSET-ovi vrijedni DJ-evi? U Disco sekciji! Od ploča preko mikseta do pokoje srkšene disko kugle, kod njih ima svega.",
    text: `
      <p>Njeguju ljubav prema raznim oblicima i žanrovima glazbe koju redovito puštaju posjetiteljima - bilo da se radi o jutarnjim terminima (kada KSET radi kao kafić) ili o večernjim terminima kada organiziraju slušaonice i puštaju glazbu prije i nakon koncerata.</p>

      <p>Organiziraju i brojne klupske programe <strong>(KSET Caffe, Hard Bass Adidas, Indietones, Maškaraoke...)</strong>, a od programa koji samo naizgled nemaju veze s glazbom valja istaknuti i popularne <strong>Game Nightove i Beer Pong</strong>. Na Game Night turnirima/slušaonicama izazivaju nostalgiju kroz video igre čiji su nam soundtrackovi obilježili mladost (Crash Team Racing, Worms, Tekken, NFS, THPS...), a sportska disciplina u kojoj je cilj ubaciti ping pong loptice u čaše piva redovito puni KSET na Beer Pong tulumima. Njihov najredovitiji program, <strong>KSET Caffe</strong>, tradicionalni je, prepoznatljivi i istovremeno potpuno nepredvidivi program koji je stvoren za zabavu, ples i prisjećanje na stare i malo manje stare treš, pop, hip hop i elektro hitove.</p>

      <p>Ako tvoj dan nije potpun bez glazbe, unaprijed znaš pjesme na radiju i želiš se družiti s ljudima kojima je glazba puno više od popratnog sadržaja, prijavi se na njihov <strong>prijemni ispit</strong> i pridruži im se!</p>

      <p><strong>Disco, disco, party, party! #ddpp i vidimo se u KSET-u!</strong></p>
    `,
    icon: IconDisco,
  },
  {
    slug: "dramska",
    name: "Dramska",
    description:
      "Svoj život vidiš pod svjetlima pozornice? Želiš biti ili ne biti? Zanimaju te drama, gluma ili režija? Na pravom si mjestu - dođi u Dramsku sekciju KSET-a!",
    text: `
      <p>Najmlađa KSET-ova sekcija je, nakon pauze od 20 godina, ponovno pokrenuta 2009. godine. <strong>Okupljaju kazališne entuzijaste koji redovito nastupaju na KSET-ovim daskama</strong> koje život znače, a dovode i druge predstave u naš prostor.</p>

      <p>U potrazi su za novim ljudima koji su zainteresirani za bilo koji dio kazališta - glumu, pisanje, režiju, namještanje reflektora, scenografiju… ako te bilo što od ovog zaintrigiralo, javi im se putem <a href="https://web.facebook.com/dramskakset" target="_blank" rel="noopener noreferrer">Facebooka</a> ili <a href="https://www.instagram.com/dramskaetkset/" target="_blank" rel="noopener noreferrer">Instagrama</a>, pošalji e-mail voditelju sekcije ili jednostavno dođi u KSET i pitaj gdje su!</p>
    `,
    icon: IconDramska,
  },
  {
    slug: "foto",
    name: "Foto",
    description:
      "Život promatraš kroz okular fotoaparata i tražiš druge zaljubljenike u fotografiju i svu magiju koju ona može proizvesti? Jedini ispravni odgovor za tebe je - Fotosekcija KSET-a!",
    text: `
      <p>Prvi zapisi o njenom postojanju protežu se davno prije osnutka KSET-a i sežu najranije do <strong></strong> godine. Danas okupljaju tridesatak članova koji svojim radom i trudom održavaju tradiciju <strong>analogne fotografije</strong>, ali također njeguju i prate moderne tehnike digitalnog fotografiranja. Novi članovi imaju priliku naučiti mnogo o procesu fotografije, od određivanja postavki, preko razvijanja filma sve do razvijanja fotografija u <strong>tamnoj komori</strong>.</p>

      <p>Održavaju <strong>Fototečaj</strong>, a tijekom njegovog teorijskog i praktičnog dijela možeš naučiti male tajne fotografije, a na kraju sudjelovati i u zajedničkoj izložbi polaznika tečaja.</p>

      <p>
        Uz fototečaj, ljubav prema fotografiji šire i preko drugih projekata:
        <ul>
          <li><strong>Jednodnevna fotoradionica</strong> - najosnovnije stvari o (digitalnoj) fotografiji ispričane i isprobane unutar jednog radnog dana za ljude koji su u žurbi.</li>
          <li><strong>Fotomaraton</strong> - višesatni izlet članova sekcije i polaznika tijekom kojeg se ispucava analogni film. Na kraju izleta sudionici imaju priliku sudjelovati u razvijanju vlastitog filma.</li>
          <li><strong>Camera obscura</strong> - radionica izrade vlastitih fotoaparata od raznih kutijica, spremnika i limenki pod vodstvom članova sekcije.</li>
          <li><strong>Fotoputokazi</strong> - godišnji izleti članova Fotosekcije gdje se zapute u nepoznato sa fotoaparatima i dobrom voljom.</li>
          <li><strong>Fotkanje na festivalima</strong> - svako ljeto izaberu nekoliko događaja (npr. Rocklive, SuperUho) koje idu fotografirati, međusobno se podružiti i zajedno obogatiti foto-iskustvo.</li>
        </ul>
      </p>

      <p>Ako te zanima fotografija, ovdje ćeš naći ljude slične sebi koji su fotografiju učinili svojim hobijem, a neki čak i karijerom. Za učlanjenje u Fotosekciju javi im se putem <a href="https://web.facebook.com/fotokset" target="_blank" rel="noopener noreferrer">Facebooka</a> ili <a href="https://www.instagram.com/fotokset/" target="_blank" rel="noopener noreferrer">Instagrama</a>, pošalji mail voditelju sekcije ili se u KSET-u raspitaj gdje su!</p>
    `,
    icon: IconFoto,
  },
  {
    slug: "glazbena",
    name: "Glazbena",
    description:
      "Glazbena sekcija KSET-a brine o realizaciji koncertnog programa, konkretno tehničkoj produkciji. Stage hand iskustvo stvoreno u sekciji mnogi su članovi kasnije iskoristili na većim pozornicama, a neki su upravo u KSET-u započeli svoju karijeru.",
    text: `
      <p>Jedan od bitnijih projekata sekcije je <strong>Čuješ?!</strong>, koncertni program koji ugošćuje i predstavlja mlade nedovoljno poznate izvođače.</p>

      <p>Ovdje možeš naučiti osnove inženjeringa zvuka i obrade zvučnog signala na osobnim računalima.</p>

      <p>Glavne obaveze glazbene sekcije su <strong>kompletna audio produkcija koncerata, održavanje glazbene opreme, sviranje u bendu, lighting i VJ-ing te booking koncerata.</strong></p>

      <p>Naravno, znanje svih ovih stavki nije obveza novog člana - o njima polako učiš od starijih i iskusnih članova kroz tonske probe, raslaganja, druženja… I tako ćeš jednog dana znati sve tajne dobrog zvuka i lighta.</p>

      <p>Ako se želiš pridružiti Glazbenoj sekciji, javi im se putem <a href="https://web.facebook.com/glazbenasekcijaKSET" target="_blank" rel="noopener noreferrer">Facebooka</a> ili <a href="https://www.instagram.com/glazbenakset/" target="_blank" rel="noopener noreferrer">Instagrama</a> pošalji mail voditelju sekcije ili dođi u KSET - velike su šanse da će baš tada biti tonska, netko će učiti postavke lights ili će netko motati kablove.    </p>
    `,
    icon: IconGlazbena,
  },
  {
    slug: "pijandure",
    name: "P.I.J.A.N.D.U.R.E.",
    description:
      "Davne 1976. godine, sastala se grupica ljudi željnih planine i druženja, odmaka od buke grada… ",
    text: `
      <p>Baš tako je nastala Planinarska sekcija, odnosno punog imena - <strong>Planinarsko Izletničko Junačko Antialkoholičarsko Nenad...mašno Društvo Uvjetno Rečeno Elektrotehničara</strong> - P.I.J.A.N.D.U.R.E.</p>

      <p>Organiziraju <strong>Elektroplaninarski rally, planinarsku školicu, kampiranja, roštilje i naravno - izlete.</strong> Idu na puno izleta, jer kako kažu, ništa ne može zamijeniti uživanje u miru i tišini na nekoj planini/šumi/livadi uz tebi drage ljude.</p>

      <p>Sekcija uključuje studente s raznoraznih fakulteta, ne samo FER-a, pa iako im nisu zajednički fakulteti, kao ni svi interesi, dijele želju za ugodnim druženjem i planinarenjem i to je ono što ovu sekciju drži na okupu već dugi niz godina. I sami kažu, sve što rade se radi na osnovi ljubavi - prema izletima, ljudima, druženju, sekciji i KSET-u.</p>

      <p>Ako te zanima ova vesela i prijateljska sekcija, a voliš prirodu i planinarenje, pridruži im se! javi im se putem <a href="https://web.facebook.com/PijandureKSET" target="_blank" rel="noopener noreferrer">Facebooka</a> ili <a href="https://www.instagram.com/pijandure.kset/" target="_blank" rel="noopener noreferrer">Instagrama</a>, pošalji mail voditelju sekcije ili ih probaj pronaći u KSET-u, iako ne garantiramo da baš tada neće biti na izletu.</p>
    `,
    icon: IconPijandure,
  },
  {
    slug: "racunaska",
    name: "Računaska",
    description:
      "Računarska sekcija KSET-a, takozvani Comp, je ona devetina kluba koja brine i o internetu u klubu i o klubu u internetu.",
    text: `
      <p>To prvenstveno znači da brinu o klupskoj mrežnoj infrastrukturi, softverskoj ili hardverskoj. Kada nešto ne valja, oni to popravljaju. Kada nešto valja, pokušavaju naći način kako da valja još više.</p>

      <p>Njihove dužnosti podijeljene su ugrubo u <strong>tri dijela: SysAdmin, Embedded i Web</strong>. Popravljaju servere, igraju se mikrokontrolerima, razvijaju web aplikacije (npr. stranicu na kojoj trenutno čitaš opis o njima), a uz to se puno druže, uče jedni od drugih i zabavljaju.</p>

      <p>Redovito sudjeluju na Danima otvorenih računarskih sustava (DORS/CLUC), konferenciji o različitim open source tehnologijama, a usko su povezani s provođenjem vještina <a href="http://www.fer.unizg.hr/predmet/okosl" target="_blank" rel="noopener noreferrer">'Osnove korištenja operacijskog sustava Linux'</a> i <a href="http://www.fer.unizg.hr/predmet/nkosl" target="_blank" rel="noopener noreferrer">'Napredno korištenje operacijskog sustava Linux'</a> na FER-u, čime rade na edukaciji studenata.</p>

      <p>Svake godine organiziraju <strong>Linux InstallFest</strong> - događaj na kojem svima zainteresiranima pomažu s instalacijom ovog operacijskog sustava, i to distribucije po želji.</p>

      <p>Ako te nešto od ovoga zanima i želiš naučiti više o nekoj od navedenih tehnologija i uputiti se u rad i život kluba, javi im se putem <a href="https://web.facebook.com/CompKSET/" target="_blank" rel="noopener noreferrer">Facebooka</a> ili <a href="https://www.instagram.com/compkset/" target="_blank" rel="noopener noreferrer">Instagrama</a>, pošalji mail voditelju sekcije ili ih pronađi u KSET-u!</p>
    `,
    icon: IconComp,
  },
  {
    slug: "tehnicka",
    name: "Tehnička",
    description:
      'Tehnička sekcija KSET-a postoji od samih početaka kluba (davne 1976. godine), u početku svoga rada pod nazivom "Zavod za manualni rad i preciznu elektroniku".',
    text: `
      <p>Područje rada tehničke sekcije je održavanje cjelokupnog inventara i opreme kluba u (skoro) vrhunskoj formi, što čini lepezu aktivnosti kojima se tehničari bave veoma širokom...Pod to spada redovito virenje ispod poklopca mnogih profesionalnih audio, video i rasvjetnih sustava unutar kluba.</p>

      <p>Bave se projektiranjem i konstruiranjem mnogih (elektroničkih) samogradnji za potrebe kluba ili članova sekcije ili jednostavno - iz zabave. Piljenje, bušenje, rezanje, gletanje, brušenje, spajanje, rastavljanje, mjerenje i lemljenje pojmovi su s kojima se svakodnevno susreću.</p>

      <p>Ako želiš i ti s njima zasukati rukave i naučiti sve što se naučiti da, javi im se putem <a href="https://web.facebook.com/TechKSET" target="_blank" rel="noopener noreferrer">Facebooka</a> ili <a href="https://www.instagram.com/tech.kset/" target="_blank" rel="noopener noreferrer">Instagrama</a>, pošalji mail voditelju sekcije ili posjeti KSET - šanse su velike da ćeš nekog od njih zateći s pilom u ruci.</p>
    `,
    icon: IconTech,
  },
  {
    slug: "video",
    name: "Video",
    description:
      "Članovi video sekcija se bave snimanjem i režijom uživo koncerata u KSET-u, stvaraju kratke igrane filmove, izvještaje studentskih događanja, a organiziraju i razne radionice - za sada uglavnom samo za svoje članove.",
    text: `
      <p>Sigurno znaš za naše projekcije filmove - upravo oni to organiziraju! Spaja ih, jednostavno rečeno, ljubav prema filmu. Režiraju, pišu, produciraju, glume, gledaju, stvaraju mišljenja i, kako sami kažu, rade filmu otprilike sve što mu se napraviti može.</p>

      <p>Među njima ima snimatelja, producenata, glumaca, režisera, montažera, pisaca i kritičara, a sa svojim filmskim uradcima sudjeluju na festivalima gdje su nerijetko primjećeni.</p>

      <p>Ako je i tebi filmska umjetnost u krvi, pridruži im se. Sve što trebaš je javiti im se putem <a href="https://web.facebook.com/ksetvideo" target="_blank" rel="noopener noreferrer">Facebooka</a> ili <a href="https://www.instagram.com/videokset/" target="_blank" rel="noopener noreferrer">Instagrama</a>, poslati mail voditelju sekcije ili ih potražiti po KSET-u!</p>
    `,
    icon: IconVideo,
  },
]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((x) => ({
    ...x,
    id: `${x.name}-${_id++}`,
    text: x.text.trim(),
  })) satisfies Division[];

export const divisionsRouter = createTRPCRouter({
  getDivisions: publicProcedure.query(() => {
    return DIVISIONS.map(({ text: _text, ...x }) => x);
  }),

  getDivision: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(({ input }) => {
      return DIVISIONS.find((x) => x.slug === input.slug) ?? null;
    }),
});
