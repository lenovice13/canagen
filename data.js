// ============================================
//   CANARIAPP — Base de données
// ============================================

const imagesCOM = [
    "images/black-yellow-intense-0.jpg",
    "images/black-yellow-non-intense-1.jpg",
    "images/black-red-intense-2.jpg",
    "images/black-red-non-intense-3.jpg",
    "images/black-white-intense-4.jpg",
    "images/black-white-intense-5.jpg",
    "images/black-white-non-intense-6.jpg",
    "images/black-red-intense-7.jpg",
    "images/brown-yellow-intense-8.jpg",
    "images/brown-red-non-intense-9.jpg",
    "images/brown-white-intense-10.jpg",
    "images/brown-white-non-intense-11.jpg",
    "images/brown-yellow-intense-12.jpg",
    "images/brown-yellow-non-intense-13.jpg",
    "images/brown-red-intense-14.jpg",
    "images/brown-red-non-intense-15.jpg",
    "images/brown-white-intense-16.jpg",
    "images/agate-yellow-intense-17.jpg",
    "images/agate-yellow-non-intense-18.jpg",
    "images/agate-red-intense-19.jpg",
    "images/agate-red-intense-20.jpg",
    "images/agate-red-non-intense-21.jpg",
    "images/agate-white-intense-22.jpg",
    "images/agate-white-non-intense-23.jpg",
    "images/isabel-yellow-intense-24.jpg",
    "images/isabel-yellow-non-intense-25.jpg",
    "images/isabel-red-intense-26.jpg",
    "images/isabel-red-non-intense-27.jpg",
    "images/agate-white-intense-28.jpg",
    "images/isabel-white-intense-29.jpg",
    "images/isabel-white-non-intense-30.jpg",
    "images/isabel-red-intense-31.jpg",
    "images/opal-agate-yellow-32.jpg",
    "images/phaeo-brown-white-33.jpg",
    "images/opal-isabel-yellow-34.jpg",
    "images/opal-isabel-white-35.jpg",
    "images/opal-agate-yellow-36.jpg",
    "images/opal-agate-white-37.jpg",
    "images/phaeo-brown-yellow-38.jpg",
    "images/phaeo-brown-white-39.jpg",
    "images/opal-isabel-yellow-40.jpg",
    "images/opal-isabel-white-41.jpg",
    "images/lipochrome-yellow-intense-42.jpg",
    "images/lipochrome-yellow-non-intense-43.jpg",
    "images/lipochrome-red-intense-44.jpg",
    "images/lipochrome-red-non-intense-45.jpg",
    "images/lipochrome-white-dominant-46.jpg",
    "images/lipochrome-white-recessive-47.jpg",
    "images/mosaic-agate-yellow-48.jpg",
    "images/mosaic-agate-red-49.jpg",
    "images/mosaic-black-yellow-50.jpg",
    "images/mosaic-black-red-51.jpg",
    "images/mosaic-lipochrome-yellow-52.jpg",
    "images/mosaic-lipochrome-red-53.jpg",
    "images/mosaic-agate-yellow-54.jpg",
    "images/mosaic-agate-red-55.jpg",
    "images/mosaic-black-yellow-56.jpg",
    "images/mosaic-black-red-57.jpg",
    "images/mosaic-lipochrome-yellow-58.jpg",
    "images/mosaic-lipochrome-red-59.jpg"
];

const databaseSauvage = {emoji:"🌿", bg:"#276749", nom:"Canari Sauvage (Phénotype Ancestral)", histoire:"Le phénotype ancestral de Serinus canaria — le père de toutes les mutations. Plumage verdâtre-jaune strié de noir et brun, camouflage idéal en Macaronésie (îles Canaries, Açores, Madère). Base génétique originelle de toutes les mutations domestiques ci-dessous."};

const databaseHorsCOM = [
    {id:"hc1", emoji:"🔵", bg:"#2c5282", nom:"Noir Kobalt (Intense)",          visuel:"Cobalt",   plume:"Intense",  fond:"Jaune",          histoire:"Mutation semi-dominante récente. Simple Facteur : intensification des mélanines noires, aspect ardoise-bleuté. Double Facteur encore à l'étude. Homologuée COM récemment."},
    {id:"hc2", emoji:"💎", bg:"#553c9a", nom:"Noir Jaspe SF",                  visuel:"Jaspe",    plume:"Intense",  fond:"Jaune",          histoire:"Mutation à hérédité libre et dominante créée et fixée par <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;jose-antonio-abellan-banos&#39;);return false;&quot;>José Antonio Abellán Baños</a>, sans facteur létal. Simple Facteur : reflets argentés sur le dos. Double Facteur : dilution plus poussée, parfaitement viable (aspect proche d'un <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;opale&#39;);return false;&quot;>Opale</a> peu marqué)."},
    {id:"hc3", emoji:"🟤", bg:"#6b2d0a", nom:"Isabelle Satiné (Intense)",        visuel:"Satiné",   plume:"Intense",  fond:"Jaune",          histoire:"Mutation liée au sexe effaçant totalement les stries brunes. Stries beige très clair quasi invisibles. Yeux souvent rouges (ruby eyes). Statut COM à vérifier : certaines sources ne reconnaissent officiellement chez le canari que la forme ancestrale <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;agate&#39;);return false;&quot;>Agate</a> Satiné (dite \"Lutino\")."},
    {id:"hc4", emoji:"🟠", bg:"#9c4221", nom:"Agate Topaze (Intense)",           visuel:"Topaze",   plume:"Intense",  fond:"Jaune",          histoire:"Récessif libre concentrant les mélanines en un liseré central. Aspect 'peau de requin'. Les deux parents doivent être porteurs. Homologuée COM."},
    {id:"hc5", emoji:"🟢", bg:"#276749", nom:"Agate Eumo (Intense)",            visuel:"Eumo",     plume:"Intense",  fond:"Jaune",          histoire:"Mutation récessif libre très récente supprimant la phaeomélanine. Stries très nettes. En cours de standardisation COM."},
    {id:"hc6", emoji:"⚫", bg:"#1a202c", nom:"Noir Onyx (Intense)",            visuel:"Onyx",     plume:"Intense",  fond:"Jaune",          histoire:"Mutation récessif libre récente intensifiant les mélanines noires. Encore en cours d'étude et d'homologation COM."},
    {id:"hc7", emoji:"🍑", bg:"#b7791f", nom:"Agate Pastel (Intense)",          visuel:"Pastel",   plume:"Intense",  fond:"Jaune",          histoire:"Ancienne mutation récessif libre qui dilue et adoucit toutes les mélanines. Stries présentes mais atténuées."},
    {id:"hc8", emoji:"🌫️", bg:"#4a5568", nom:"Noir Ailes Grises (Intense)", visuel:"Ailes Grises", plume:"Intense", fond:"Jaune", histoire:"Mutation d'une vingtaine d'années, apparue à partir de souches Noir <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;pastel&#39;);return false;&quot;>Pastel</a>, officiellement reconnue seulement dans la série Noir. <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;dict-dilution&#39;);return false;&quot;>Dilution</a> de l'eumélanine avec un dessin particulier : lunules gris perle sur le corps, refoulements gris foncé concentrés en bout et pourtour des plumes (ailes/queue). Génétique encore mal maîtrisée : plusieurs théories concurrentes (allèle du pastel vs gène modificateur indépendant), aucun consensus définitif à ce jour — non intégrée au moteur de calcul pour cette raison."},
    {id:"hc9", emoji:"🟫", bg:"#742a2a", nom:"Noir Mogno (Intense)", visuel:"Mogno", plume:"Intense", fond:"Jaune", histoire:"Mutation récente, reconnaissance officielle autour de 2015. Très proche visuellement de l'<a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;opale&#39;);return false;&quot;>Opale</a> — la principale difficulté d'homologation reste justement de déterminer précisément où s'arrête l'expression de l'Opale et où commence celle du Mogno. Se distingue par une tonalité de strie gris-noir plus soutenue. Non encore intégrée au moteur, la frontière avec Opale n'étant pas encore stabilisée par la communauté."},
    {id:"hc10", emoji:"❓", bg:"#2d3748", nom:"Le Perle (en cours d'étude)", visuel:"Le Perle", plume:"Intense", fond:"Jaune", histoire:"ℹ️ Infos à compléter — mutation encore à l'étude, présentée par l'éleveur italien Carlo Maria Nobili. Décrite par des pointes noires sur les ailes et la queue chez certains sujets (issus de croisements <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;opale&#39;);return false;&quot;>Opale</a> <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;mosaique&#39;);return false;&quot;>Mosaïque</a>), mais la stabilité et la transmission du caractère restent incertaines (des cas rapportés le voient disparaître après la mue). Pas encore de génétique établie — à suivre."}
];

const databaseHybrides = [
    {id:"hy3", emoji:"🌟", bg:"#b7791f", nom:"Chardonneret × Canari",    histoire:"Hybride 'Mulet', le plus répandu. Chardonneret Élégant (mâle) × femelle canari. Mulets mâles stériles très recherchés pour le chant (héritent du répertoire du chardonneret). Nécessite un certificat de capacité en France."},
    {id:"hy4", emoji:"🌿", bg:"#276749", nom:"Verdier × Canari",         histoire:"Hybride entre le Verdier d'Europe et le canari. Mulets robustes, dominante vert olive et jaune intense. Les mulets sont stériles."},
    {id:"hy5", emoji:"🍋", bg:"#6b2d0a", nom:"Tarin du Venezuela × Canari", histoire:"LE croisement fondateur ! C'est cet hybride qui a introduit le FACTEUR ROUGE dans la génétique du canari en 1921 (<a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;dr-hans-duncker&#39;);return false;&quot;>Dr Hans Duncker</a> & <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;karl-reich&#39;);return false;&quot;>Karl Reich</a>). Tous les canaris rouges descendent de ce croisement."},
    {id:"hy6", emoji:"🎵", bg:"#2c5282", nom:"Tarin des Aulnes × Canari",    histoire:"Hybride entre le Tarin des Aulnes et le canari. Mulets petits, vifs, fortement striés. Chant très mélodieux."},
    {id:"hy7", emoji:"💎", bg:"#553c9a", nom:"Tarin de Magellan × Canari", histoire:"Croisement à l'origine de la mutation <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;jaspe&#39;);return false;&quot;>Jaspe</a>, fixée chez le canari par <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;jose-antonio-abellan-banos&#39;);return false;&quot;>José Antonio Abellán Baños</a>. Contrairement aux autres tarins, les hybrides Tarin de Magellan × Tarin à poitrine noire sont fertiles à 100% — mais avec le canari, la fertilité reste limitée comme pour les autres tarins."},
    {id:"hy8", emoji:"🎶", bg:"#744210", nom:"Serin Cini × Canari",       histoire:"Le cousin le plus proche du canari (même genre <i>Serinus</i>) — hybridation très courante et particulière : les mâles hybrides sont fertiles à 100% et les femelles fertiles dans environ 10% des cas (rarissime chez les hybrides). C'est par ce canal que certaines mutations de couleur du canari se sont parfois retrouvées chez le cini."},
    {id:"hy9", emoji:"🪶", bg:"#9c4221", nom:"Linotte Mélodieuse × Canari", histoire:"Hybride 'Mulet' classique, notamment recherché en canari de chant pour le mélange des répertoires. Mulets mâles et femelles stériles."},
    {id:"hy10", emoji:"🩸", bg:"#742a2a", nom:"Bouvreuil × Canari",       histoire:"Croisement entre genres plus éloignés (Bouvreuil pivoine × canari) — hybrides toujours stériles dans les deux sexes, plus délicat à obtenir que les mulets classiques."},
    {id:"hy11", emoji:"🌰", bg:"#975a16", nom:"Pinson des Arbres × Canari", histoire:"Croisement documenté chez les éleveurs mais plus délicat que les mulets classiques (Chardonneret, Tarins) — le pinson appartient à un genre plus éloigné du canari."},
    {id:"hy12", emoji:"❄️", bg:"#2c5282", nom:"Sizerin Flammé × Canari",  histoire:"Petit fringillidé nordique, hybridation documentée chez les éleveurs, résultats de petite taille et fortement striés comme le Sizerin lui-même."},
    {id:"hy13", emoji:"🌰", bg:"#4a5568", nom:"Gros-bec Casse-Noyaux × Canari (infos à compléter)", histoire:"ℹ️ Infos à compléter — croisement mentionné par des éleveurs comme tenté mais plus délicat que les mulets classiques (Chardonneret, Tarins) ; genre plus éloigné du canari. Détails à confirmer par une source plus solide."},
    {id:"hy14", emoji:"🐦", bg:"#742a2a", nom:"Bruant × Canari (infos à compléter)", histoire:"ℹ️ Infos à compléter — croisement mentionné comme tenté (espèce exacte de bruant à préciser) mais plus difficile que les mulets classiques. Détails à confirmer."},
    {id:"hy15", emoji:"🏔️", bg:"#2f855a", nom:"Venturon Montagnard × Canari (infos à compléter)", histoire:"ℹ️ Infos à compléter — proche cousin du Serin Cini (même famille), croisement plausible mais pas encore confirmé par une source solide et directe."}
];

// Races de posture (physique/morphologie) — issu du Glossaire Chant&Posture,
// reproduit ici en fiches individuelles pour un futur outil dédié.
const databasePostures = [
    {id:"po0", emoji:"🌀", bg:"#6b46c1", nom:"Frisé Parisien", histoire:"Le géant des Frisés — 19 cm minimum. Frisures très développées sur manteau, jabot et nageoires, plumes de coq sur le croupion, ongles en tire-bouchon."},
    {id:"po1", emoji:"🌀", bg:"#6b46c1", nom:"Frisé du Nord", histoire:"17-18 cm. Posture droite, frisures bien dessinées mais plumage plus court que le Parisien. Pas d'ongles en tire-bouchon."},
    {id:"po2", emoji:"🌀", bg:"#6b46c1", nom:"Frisé du Sud", histoire:"15 cm. Posture en forme de « 7 » (cou et tête projetés vers l'avant et le bas). Frisures concentrées sur le jabot et les flancs, dos lisse."},
    {id:"po3", emoji:"🌀", bg:"#6b46c1", nom:"Fiorino", histoire:"11 cm maximum (miniature). Existe en variété Huppée ou Tête Lisse. Frisures légères et symétriques."},
    {id:"po4", emoji:"⚪", bg:"#553c9a", nom:"Gloster (Corona / Consort)", histoire:"11 cm max, rond comme une pomme. Corona : huppe ronde centrée sur la tête. Consort : tête lisse, sourcils marqués. Accouplement Corona × Consort obligatoire (2 Corona = létal pour la huppe)."},
    {id:"po5", emoji:"🖊️", bg:"#2c5282", nom:"Raza Española", histoire:"11,5 cm max. Corps extrêmement fin, étroit et cylindrique (forme « stylo »), tête de noisette."},
    {id:"po6", emoji:"⚪", bg:"#553c9a", nom:"Fife Fancy", histoire:"11 cm max. Miniature du Border — corps sphérique, plumage très lisse et plaqué."},
    {id:"po7", emoji:"⚪", bg:"#b7791f", nom:"Border Fancy", histoire:"14,5 cm. Sphère parfaite au niveau de la poitrine et du manteau, posture fière à 60°."},
    {id:"po8", emoji:"🦁", bg:"#9c4221", nom:"Norwich", histoire:"16 cm. Oiseau massif, lourd, très emplumé, sourcils épais."},
    {id:"po9", emoji:"🥕", bg:"#c05621", nom:"Yorkshire", histoire:"19 cm — « le gentilhomme de l'aviculture ». Silhouette en carotte inversée (épaules larges, corps s'affinant vers la queue), posture très redressée."},
    {id:"po10", emoji:"👑", bg:"#805ad5", nom:"Crested / Crestbred", histoire:"17 cm. Huppe gigantesque retombant largement sur le bec et la nuque (Crested) ou tête lisse (Crestbred, le compagnon obligatoire pour l'accouplement — 2 huppés = létal)."},
    {id:"po11", emoji:"👑", bg:"#805ad5", nom:"German Crest (Huppé Allemand)", histoire:"Canari de couleur portant une huppe ovale — seule race de posture où la couleur du lipochrome/mélanine est aussi jugée."},
    {id:"po12", emoji:"🪝", bg:"#2f855a", nom:"Bossu Belge", histoire:"17-18 cm. Posture en forme de crochet/« 7 » : épaules hautes, cou tendu vers le bas, queue rentrée sous le perchoir."},
    {id:"po13", emoji:"🌙", bg:"#2f855a", nom:"Scotch Fancy", histoire:"17 cm. Forme de demi-lune/croissant, corps arqué du bec à la pointe de la queue."},
    {id:"po14", emoji:"🌙", bg:"#2f855a", nom:"Hoso Japonais", histoire:"11 cm (miniature). Version miniature et élégante du Scotch Fancy (même forme de croissant)."},
    {id:"po15", emoji:"🦎", bg:"#2d3748", nom:"Lizard Canary", histoire:"13,5-14 cm. Race de dessin unique : spangles (écailles noires alignées sur le dos), paillettes (dessin de poitrine), casquette (zone lipochrome nette sur la tête)."},
    {id:"po16", emoji:"🌀", bg:"#6b46c1", nom:"A.G.I. (Arlequin Géant Italien)", histoire:"Race de frisé italienne géante — 19-20 cm, l'un des plus grands canaris frisés, aux frisures amples et harmonieuses sur tout le corps. Sélection notamment associée à <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;pietro-lucca&#39;);return false;&quot;>Pietro Lucca</a>."},
    {id:"po17", emoji:"🌀", bg:"#6b46c1", nom:"Padovan", histoire:"Race de frisé italienne (région de Padoue) — frisures denses et symétriques, silhouette élancée. Race de posture frisée travaillée par des maîtres sélectionneurs italiens comme <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;pietro-lucca&#39;);return false;&quot;>Pietro Lucca</a>."},
    {id:"po18", emoji:"🌀", bg:"#6b46c1", nom:"Frisé Suisse", histoire:"Race de frisé suisse (helvétique) — silhouette et frisures propres à cette souche régionale, moins répandue hors de Suisse."},
    {id:"po19", emoji:"🪝", bg:"#2f855a", nom:"Gibber Italicus", histoire:"14-15 cm, Italie. Silhouette très frêle et « décharnée » caractéristique, tête en forme de noisette portée en avant, posture en chiffre 7 (angle minimum 80°), jambes longues et raides aux cuisses dénudées. Plumage rare (peu fourni), zones frisées et lisses bien distinctes."},
    {id:"po20", emoji:"🪝", bg:"#2f855a", nom:"Giboso Español", histoire:"Race de posture espagnole — silhouette bossue caractéristique, posture en chiffre 1 (contrairement au Gibber Italicus et au Bossu Belge qui adoptent le chiffre 7)."},
    {id:"po21", emoji:"⚪", bg:"#b7791f", nom:"Münchener (Munichois)", histoire:"Race de posture allemande (Munich) — silhouette élancée à plumage lisse, moins répandue hors d'Allemagne."},
    {id:"po22", emoji:"⚪", bg:"#553c9a", nom:"Bernois", histoire:"Race de forme suisse (Berne), plumage lisse — silhouette élégante et allongée."},
    {id:"po23", emoji:"🖊️", bg:"#2c5282", nom:"Llarguet Español", histoire:"Race de forme espagnole (Catalogne) — silhouette longue et fine, plumage lisse, proche dans l'esprit du Raza Española."},
    {id:"po24", emoji:"🍯", bg:"#c05621", nom:"Melado Tinerfeño", histoire:"Race de posture espagnole originaire de Tenerife (Îles Canaries) — silhouette et posture propres à cette souche insulaire."},
    {id:"po25", emoji:"🍀", bg:"#2f855a", nom:"Irish Fancy", histoire:"Race de forme irlandaise à plumage lisse, moins répandue mais toujours élevée par des passionnés — silhouette élancée proche de la famille Border/Fife."},
    {id:"po26", emoji:"🎭", bg:"#9c4221", nom:"Arlequin Portugais", histoire:"Race de posture portugaise récemment homologuée par la C.O.M. — silhouette et maintien propres, distincte du London Fancy malgré un nom qui prête parfois à confusion."},
    {id:"po27", emoji:"🎨", bg:"#744210", nom:"London Fancy", histoire:"Race anglaise à dessin unique décrite dès 1824 (Joseph Nash) : corps jaune d'or intense contrastant avec des ailes et une queue entièrement noires. Déclin puis disparition présumée entre les deux guerres mondiales — en cours de reconstruction active par des éleveurs depuis les années 2000, avec un standard C.O.M. de nouveau reconnu."},
    {id:"po28", emoji:"🎗️", bg:"#975a16", nom:"Jubilee (infos à compléter)", histoire:"ℹ️ Infos à compléter — canari de couleur historique mentionné par les éleveurs, détails précis (origine, standard) non encore confirmés par une source solide."},
    {id:"po29", emoji:"☀️", bg:"#c05621", nom:"California (infos à compléter)", histoire:"ℹ️ Infos à compléter — variété de couleur historique mentionnée par les éleveurs, détails précis non encore confirmés."},
    {id:"po30", emoji:"🇩🇪", bg:"#2c5282", nom:"Thallwitzer (infos à compléter)", histoire:"ℹ️ Infos à compléter — variété allemande historique mentionnée par les éleveurs, détails précis non encore confirmés."},
    {id:"po31", emoji:"🇳🇱", bg:"#2b6cb0", nom:"Dutchback (infos à compléter)", histoire:"ℹ️ Infos à compléter — variété historique d'origine néerlandaise mentionnée par les éleveurs, détails précis non encore confirmés."},
    {id:"po32", emoji:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", bg:"#2f855a", nom:"Canari de Glasgow (infos à compléter)", histoire:"ℹ️ Infos à compléter — souche écossaise historique mentionnée par les éleveurs, détails précis non encore confirmés."},
    {id:"po33", emoji:"🇳🇱", bg:"#2b6cb0", nom:"Canari de Hollande, ancienne souche (infos à compléter)", histoire:"ℹ️ Infos à compléter — souche historique néerlandaise antérieure aux races frisées modernes, détails précis non encore confirmés."},
    {id:"po34", emoji:"🍋", bg:"#b7791f", nom:"Jonque / Jonquet", histoire:"Ancien terme historique (confirmé par une gravure de 1880 tirée de l'ouvrage anglais de référence « Illustrated Book of Canaries and Cage-Birds ») désignant ce qu'on appelle aujourd'hui « Intensif » — par opposition au terme « Mealy »/« Farineux » de l'époque, devenu « Schimmel ». N'est plus utilisé dans la nomenclature C.O.M. actuelle, remplacé par Intensif/Schimmel."},
    {id:"po35", emoji:"🧄", bg:"#742a2a", nom:"Ajosado (infos à compléter)", histoire:"ℹ️ Infos à compléter — terme rencontré dans la littérature hispanophone du canari, pourrait désigner une variété ou une teinte particulière (à distinguer et confirmer)."},
    {id:"po36", emoji:"🏴", bg:"#4a5568", nom:"Stafford Canary", histoire:"Race de posture anglaise moderne, développée dans les années 1980 (comté du Staffordshire) — l'une des races les plus récentes reconnues, illustrant que la sélection de nouvelles races de posture continue encore aujourd'hui."},
    {id:"po37", emoji:"🇦🇺", bg:"#c05621", nom:"Australian Plainhead", histoire:"Seule race de canari entièrement développée en Australie, issue de vieilles souches de Norwich et adaptée aux standards australiens dans les années 1930 — distincte du standard Norwich britannique moderne suite à une divergence historique entre éleveurs des deux pays."}
];

// Races de chant — issu du Glossaire Chant&Posture, reproduit ici en
// fiches individuelles pour un futur outil dédié au chant.
const databaseChants = [
    {id:"ch0", emoji:"🎼", bg:"#2c5282", nom:"Harzer Roller (Harz)", histoire:"Canari de chant allemand, chant grave/doux/roulé émis bec fermé. 6 tours jugés en concours COM : Hohlrollen (roulades creuses), Knorren (timbres sourds), Wasserrollen (roulades d'eau), Hohlklingeln (timbres creux), Pfeifen (flûtes), Glucken (gloucoups)."},
    {id:"ch1", emoji:"🎺", bg:"#c05621", nom:"Timbrado Español", histoire:"Canari de chant espagnol, chant joyeux/puissant/métallique émis bec ouvert. Styles Clásico et Discontinuo. Tours : Timbres, Cascabeles (grelots), Floreos, Campana (cloche)."},
    {id:"ch2", emoji:"💧", bg:"#2b6cb0", nom:"Malinois (Waterslager)", histoire:"Canari de chant belge, répertoire dominé par des sons d'eau. Tours : Klokkende (eau frappée), Bollende (eau bouillonnante), Waterrol (roulade d'eau)."},
    {id:"ch3", emoji:"🇺🇸", bg:"#742a2a", nom:"American Singer", histoire:"Canari de chant américain, créé par croisement (env. 70% Roller Allemand / 30% Border Anglais) sur 4-5 ans de sélection systématique — combine le chant du Roller à la vigueur et la variété de tours du Border."},
    {id:"ch4", emoji:"🇷🇺", bg:"#822727", nom:"Chanteur Russe", histoire:"Canari de chant issu de la même souche allemande que le Harz, développé en Russie sur près de 300 ans. Chant aigu et imitatif, historiquement affiné à l'oreille sur des flûtes et le chant d'oiseaux indigènes locaux."},
    {id:"ch5", emoji:"🇮🇷", bg:"#975a16", nom:"Chanteur Persan (infos à compléter)", histoire:"ℹ️ Infos à compléter — canari de chant populaire en Iran et au Moyen-Orient, moins documenté en Europe/Amérique du Nord que les 5 grandes races de concours. Détails de standard et de tours à préciser."},
    {id:"ch6", emoji:"🇩🇪", bg:"#2c5282", nom:"Chanteur de Saxe (infos à compléter)", histoire:"ℹ️ Infos à compléter — race de chant allemande régionale (Saxe), moins internationalement répandue que le <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;harzer-roller&#39;);return false;&quot;>Harzer Roller</a>. À documenter plus précisément."},
    {id:"ch7", emoji:"💧", bg:"#2b6cb0", nom:"Wateren (infos à compléter)", histoire:"ℹ️ Infos à compléter — variante/dénomination proche du <a href=&quot;#&quot; class=&quot;terme-lien&quot; onclick=&quot;allerA(&#39;glossaire&#39;,&#39;malinois&#39;);return false;&quot;>Malinois</a> (Waterslager), à clarifier et distinguer précisément."}
];

// ============================================
//   LOCALSTORAGE
// ============================================
function sauvegarderCheptel(base) {
    try {
        localStorage.setItem('canariapp_cheptel', JSON.stringify(base));
        return true;
    } catch(e) {
        if (typeof showToast === 'function') {
            showToast('⚠️ Sauvegarde impossible (stockage plein ?) — essayez une photo plus légère ou supprimez un ancien oiseau', 'warn');
        }
        return false;
    }
}
function chargerCheptel() {
    try {
        const d = localStorage.getItem('canariapp_cheptel');
        return d ? JSON.parse(d) : [];
    } catch(e) { return []; }
}

// ============================================
//   GESTION DES CAGES (V1 — Couleur uniquement)
// ============================================
// Types de cage, avec les mois idéaux d'usage (1=janvier...12=décembre) pour
// les suggestions saisonnières. Tableau vide = pas de saison type (usage
// ponctuel, pas de suggestion à faire). Repris des fiches "Cages Canaris
// Couleur" fournies par l'utilisateur.
const TYPES_CAGE = [
    {code:"elevage",     emoji:"🐣", nom:"Élevage",              saisonIdeale:[2,3,4,5],      description:"Cage de reproduction — couple isolé pour la ponte et l'élevage des jeunes au nid."},
    {code:"voliere",     emoji:"🕊️", nom:"Volière / Vol",        saisonIdeale:[5,6,7,8,9],    description:"Grand espace pour l'exercice, la mue et le développement musculaire des jeunes."},
    {code:"repos",       emoji:"😴", nom:"Repos / Hivernage",    saisonIdeale:[10,11,12,1],   description:"Photopériode courte, alimentation restreinte — repos avant la reprise de la reproduction."},
    {code:"quarantaine", emoji:"🚧", nom:"Quarantaine",          saisonIdeale:[],             description:"Isolement de tout nouvel oiseau (ou suspect) à l'écart du reste du cheptel, plusieurs semaines."},
    {code:"infirmerie",  emoji:"🏥", nom:"Infirmerie",           saisonIdeale:[],             description:"Cage de soins pour un oiseau malade ou blessé, souvent chauffée."},
    {code:"exposition",  emoji:"🏆", nom:"Exposition / Concours",saisonIdeale:[8,9,10],       description:"Cage officielle normalisée C.O.M., pour l'entraînement et le concours."},
    {code:"transport",   emoji:"🚗", nom:"Transport",            saisonIdeale:[],             description:"Cage ou caisse de déplacement, obscure et ventilée."}
];

// Modèles de structure physique (indépendants du type d'usage ci-dessus).
// "cases" = nombre de compartiments physiques de la structure. Pour "batterie",
// le nombre exact est demandé séparément à la création (4/6/8/12...).
const MODELES_CAGE = [
    {code:"simple",   nom:"Simple — 60cm",             cases:1},
    {code:"double",   nom:"Double — 120cm (séparable)", cases:2},
    {code:"batterie", nom:"Batterie",                   cases:null}
];

function modeleCageParCode(code) {
    return MODELES_CAGE.find(function(m) { return m.code === code; }) || null;
}

// Calcule les cases "effectives" d'une cage en tenant compte des niveaux ET
// des séparateurs retirés. cage.niveaux est un tableau libre : un élément par
// niveau (rangée), sa valeur = nombre de cases physiques sur ce niveau. Les
// niveaux peuvent avoir des tailles différentes (ex: [4,4] = 2 niveaux
// identiques de 4 ; [3,1] = un niveau de 3 cases et un niveau d'1 seule case
// en dessous). Aucune limite n'est imposée sur le nombre de niveaux ni sur le
// nombre de cases par niveau (voir 06_Cages.md §24-25 : "4, 6, 8, 12
// compartiments ou davantage", "ne pas figer un nombre maximal").
//
// Chaque niveau a ses propres séparateurs internes (cage.separateursActifs[niveau]),
// indépendants des autres niveaux.
//
// Chaque case a un index GLOBAL 0-based continu (niveau0: 0..N0-1, niveau1:
// N0..N0+N1-1, etc.) — c'est cet index global qui est stocké sur l'oiseau
// (o.caseIndex), pour rester simple à manipuler partout ailleurs.
//
// Retourne un tableau de groupes {niveau, indices}, où indices est la liste
// des index globaux fusionnés ensemble (cases dont le séparateur est retiré).
function casesEffectivesCage(cage) {
    var niveaux = cage.niveaux || [cage.casesParNiveau || cage.nombreCases || 1]; // compat anciennes cages
    var groupesTous = [];
    var offsetGlobal = 0;
    for (var niv = 0; niv < niveaux.length; niv++) {
        var casesCeNiveau = niveaux[niv];
        var sep = (cage.separateursActifs && cage.separateursActifs[niv]) || [];
        var courant = [offsetGlobal];
        for (var i = 1; i < casesCeNiveau; i++) {
            var actif = sep[i - 1] !== false; // par défaut: séparateur actif (cases distinctes)
            var idxGlobal = offsetGlobal + i;
            if (actif) {
                groupesTous.push({ niveau: niv, indices: courant });
                courant = [idxGlobal];
            } else {
                courant.push(idxGlobal);
            }
        }
        groupesTous.push({ niveau: niv, indices: courant });
        offsetGlobal += casesCeNiveau;
    }
    return groupesTous;
}

// Libellé d'un groupe pour affichage, ex: indices [0] -> "1", [1,2] -> "2-3",
// indices [4,5] (niveau 2 d'une batterie 4/niveau) -> "5-6". Utilise .indices.
function libelleGroupeCases(groupe) {
    var indices = groupe.indices || groupe; // tolère l'ancien format (tableau brut)
    if (indices.length === 1) return String(indices[0] + 1);
    return (indices[0] + 1) + '-' + (indices[indices.length - 1] + 1);
}

function chargerCages() {
    try {
        const d = localStorage.getItem('canagen_cages');
        return d ? JSON.parse(d) : [];
    } catch(e) { return []; }
}
function sauvegarderCages(cages) {
    try {
        localStorage.setItem('canagen_cages', JSON.stringify(cages));
        return true;
    } catch(e) {
        if (typeof showToast === 'function') showToast('⚠️ Sauvegarde des cages impossible (stockage plein ?)', 'warn');
        return false;
    }
}

