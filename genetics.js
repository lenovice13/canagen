// ============================================
//   CANARIAPP — Moteur Génétique v5
//   Basé sur Mendel / Punnett
//   Mutations liées au sexe (loci Z indépendants) : Brun, Agate, Pastel, Ivoire
//   Isabelle = Brun + Agate combinés (pas un locus séparé)
//   Satiné : encore sur l'ancien modèle à locus unique, en attente de revue scientifique dédiée
//   Mutations récessives libres : Opale, Phaeo, Topaze, Eumo, Onyx
//   Blanc Récessif : géré dans le fond lipochrome
//   Locus E (panachure) : Lipochrome (E) codominant avec base mélanique (e) —
//   AJOUTÉ v5 : le Panaché est désormais un vrai génotype hétérozygote E/e,
//   réinjectable comme parent (avant : simple texte affiché une fois, perdu
//   si on le réutilisait comme parent — cf. discussion "Panaché" 26/09/2026).
// ============================================

const MUT_LIEE_SEXE      = ["Satiné"]; // Satiné laissé tel quel (NON TRANCHÉ, cf. synthèse CanariGenDB du 19/07/2026)
const MUT_Z_INDEPENDANTES = ["Brun","Agate","Pastel","Ivoire"]; // loci Z indépendants (VALIDÉ 19/07/2026)
const MUT_RECESSIF_LIBRE = ["Opale","Phaeo","Topaze","Eumo","Onyx"];

// --- Locus 1 : Liaison au sexe (ZZ mâle / ZW femelle) ---
function punnettLiaisonSexe(mv, mp, fv) {
    const estLS = m => MUT_LIEE_SEXE.includes(m);
    let Za, Zb;
    if (estLS(mv))       { Za = mv;    Zb = mv; }
    else if (estLS(mp))  { Za = "Noir"; Zb = mp; }
    else                 { Za = "Noir"; Zb = "Noir"; }
    const Zf = estLS(fv) ? fv : "Noir";
    const gametes = Za === Zb ? [[1.0, Za]] : [[0.5, Za],[0.5, Zb]];
    const resM = [], resF = [];
    gametes.forEach(([p, a]) => {
        let nomM;
        if (a === Zf)                       nomM = a === "Noir" ? "Noir" : a + " Pur";
        else if (a === "Noir" && Zf !== "Noir") nomM = "Black / porteur " + Zf;
        else if (Zf === "Noir" && a !== "Noir") nomM = "Black / porteur " + a;
        else                                nomM = "Black / porteur " + a + " & " + Zf;
        const nomF = a === "Noir" ? "Noir" : a + " Visuel";
        resM.push({ prob: p, nom: nomM });
        resF.push({ prob: p, nom: nomF });
    });
    return { resMales: resM, resFemelles: resF };
}

// --- Locus Z indépendant générique (pour Brun, Agate, Pastel, Ivoire) ---
// mVisuel/mPorteur/fVisuel : booléens — le parent possède-t-il CETTE mutation précise ?
function locusZUnique(mVisuel, mPorteur, fVisuel) {
    let Za, Zb;
    if (mVisuel)        { Za = true;  Zb = true;  }
    else if (mPorteur)  { Za = false; Zb = true;  }
    else                { Za = false; Zb = false; }
    const Zf = !!fVisuel;
    const gametes = Za === Zb ? [[1.0, Za]] : [[0.5, Za],[0.5, Zb]];
    const resM = [], resF = [];
    gametes.forEach(([p, a]) => {
        const visuelM = a && Zf;
        const porteurM = !visuelM && (a || Zf);
        resM.push({ prob: p, visuel: visuelM, porteur: porteurM });
        resF.push({ prob: p, visuel: a, porteur: false }); // la fille reçoit directement le Z du père
    });
    return { resM, resF };
}

// --- Locus Agate/Satiné (3 allèles du même locus : Rien / Agate / Satiné) ---
// Confirmé par le livre CNJF/UOF-COM France 2022 : "la mutation Satiné est
// allèle avec le premier facteur de réduction (Agate)". Un oiseau visuellement
// Agate peut donc être porteur caché de Satiné (et inversement), mais ne peut
// jamais être visuellement les deux à la fois.
// mV/mP/fV ∈ "Rien" | "Agate" | "Satiné"
function locusAgateSatine(mV, mP, fV) {
    let Za, Zb;
    if (mV !== "Rien" && mP !== "Rien" && mV !== mP) {
        // Père hétérozygote entre 2 allèles mutants différents du même locus
        // (ex : visuellement Agate, porteur caché de Satiné)
        Za = mV; Zb = mP;
    } else if (mV !== "Rien")     { Za = mV; Zb = mV; }
    else if (mP !== "Rien")       { Za = "Rien"; Zb = mP; }
    else                            { Za = "Rien"; Zb = "Rien"; }
    const Zf = fV || "Rien";
    const gametes = Za === Zb ? [[1.0, Za]] : [[0.5, Za],[0.5, Zb]];
    const resM = [], resF = [];
    gametes.forEach(([p, a]) => {
        let visuel = null, porteur = null, composite = false;
        if (a === Zf)             { if (a !== "Rien") visuel = a; }
        else if (a === "Rien")    { porteur = Zf; }
        else if (Zf === "Rien")   { porteur = a; }
        else                       { visuel = "Agate"; porteur = "Satiné"; composite = true; } // hétérozygote Agate/Satiné : ASSOMPTION (non documentée), à confirmer
        resM.push({ prob: p, visuel: visuel, porteur: porteur, composite: composite });
        resF.push({ prob: p, visuel: a !== "Rien" ? a : null, porteur: null }); // la fille reçoit directement l'allèle du père
    });
    return { resM, resF };
}

// --- Fusionne Brun-locus + Agate-locus en un nom de base mélanique ---
// Isabelle = Brun ET Agate présents simultanément (VALIDÉ 19/07/2026)
function fusionnerBaseMelanique(brunDist, agateSatineDist, suffixeVisuel) {
    const res = [];
    brunDist.forEach(b => agateSatineDist.forEach(as => {
        const prob = b.prob * as.prob;
        if (prob < 0.0001) return;
        let nom;
        const porteurs = [];
        if (b.visuel && as.visuel === "Agate")       nom = "Isabelle" + suffixeVisuel;
        else if (b.visuel && as.visuel === "Satiné") nom = "Brun Satiné" + suffixeVisuel; // combinaison non nommée officiellement, description composée
        else if (b.visuel)                            { nom = "Brun" + suffixeVisuel; if (as.porteur) porteurs.push(as.porteur); }
        else if (as.visuel)                            { nom = as.visuel + (as.composite ? "" : suffixeVisuel); if (b.porteur) porteurs.push("Brun"); if (as.porteur) porteurs.push(as.porteur); }
        else {
            nom = "Noir";
            if (b.porteur) porteurs.push("Brun");
            if (as.porteur) porteurs.push(as.porteur);
        }
        if (porteurs.length) nom += " / porteur " + porteurs.join(" & ");
        res.push({ prob, nom });
    }));
    return res;
}

// --- Fusionne les loci Pastel + Ivoire en suffixes (comme les récessifs libres) ---
function fusionnerSuffixesZ(dist, mutName) {
    return dist.map(d => ({
        prob: d.prob,
        suffixe: d.visuel ? " + " + mutName + " Visuel" : (d.porteur ? " + porteur " + mutName : "")
    }));
}
function combinerSuffixes(distA, distB) {
    const res = [];
    distA.forEach(a => distB.forEach(b => {
        const prob = a.prob * b.prob;
        if (prob < 0.0001) return;
        res.push({ prob, suffixe: a.suffixe + b.suffixe });
    }));
    return res;
}


function punnettRecessifLibre(mv, mp, fv, fp) {
    const muts = {};
    [mv, mp, fv, fp].forEach(m => { if (MUT_RECESSIF_LIBRE.includes(m)) muts[m] = true; });
    if (!Object.keys(muts).length) return [{ prob: 1.0, suffixe: "" }];
    let res = [{ prob: 1.0, suffixe: "" }];
    Object.keys(muts).forEach(mut => {
        const pM = mv === mut ? 1.0 : (mp === mut ? 0.5 : 0.0);
        const pF = fv === mut ? 1.0 : (fp === mut ? 0.5 : 0.0);
        const qM = 1 - pM, qF = 1 - pF;
        const combis = [];
        if (pM*pF > 0.001)       combis.push({ prob: pM*pF,           suffixe: " + " + mut + " Visuel" });
        if (pM*qF+qM*pF > 0.001) combis.push({ prob: pM*qF + qM*pF,  suffixe: " + porteur " + mut });
        if (qM*qF > 0.001)       combis.push({ prob: qM*qF,           suffixe: "" });
        if (!combis.length || (combis.length === 1 && combis[0].suffixe === "")) return;
        const next = [];
        res.forEach(r => combis.forEach(c => next.push({ prob: r.prob * c.prob, suffixe: r.suffixe + c.suffixe })));
        res = next;
    });
    return res;
}

// --- Locus 3 : Structure de plume ---
// Ne fige JAMAIS un type Mosaïque T1/T2 spécifique ici : le sexe réel du
// jeune (mâle ou femelle) n'est pas encore connu à ce stade du calcul (cette
// fonction est appelée une seule fois puis réutilisée pour bâtir les 2 listes
// mâles ET femelles). On renvoie donc "Mosaïque" générique, et c'est
// resolvePlumeSexe() qui tranche T1/T2 au moment de bâtir chaque liste —
// sinon les femelles héritaient à tort du texte "T1 (♂ masque facial)".
function resolvePlumeSexe(plume, estMale) {
    if (plume === "Mosaïque") return estMale ? "Mosaïque T1 (♂ masque facial)" : "Mosaïque T2 (♀ ligne)";
    return plume;
}
function punnettPlume(mpl, fpl) {
    // Normaliser Mosaïque T1/T2 → Mosaïque pour le calcul
    const isMosaicM = mpl.startsWith("Mosaïque");
    const isMosaicF = fpl.startsWith("Mosaïque");
    const mplN = isMosaicM ? "Mosaïque" : mpl;
    const fplN = isMosaicF ? "Mosaïque" : fpl;

    if (mplN === fplN) {
        if (mplN === "Mosaïque")
            return [{ prob:1.0, plume:"Mosaïque", lethal:false }];
        if (mplN === "Intense")
            return [
                { prob:0.25, plume:"Intense", lethal:true  },
                { prob:0.50, plume:"Intense", lethal:false },
                { prob:0.25, plume:"Non-Intense", lethal:false }
            ];
        return [{ prob:1.0, plume:mplN, lethal:false }];
    }
    if ((mplN==="Intense"&&fplN==="Schimmel") || (mplN==="Schimmel"&&fplN==="Intense"))
        return [{ prob:0.5, plume:"Intense", lethal:false }, { prob:0.5, plume:"Non-Intense", lethal:false }];
    if (mplN==="Mosaïque" || fplN==="Mosaïque") {
        const autre = mplN==="Mosaïque" ? fplN : mplN;
        return [
            { prob:0.5, plume:"Mosaïque", lethal:false },
            { prob:0.5, plume:autre, lethal:false }
        ];
    }
    return [{ prob:1.0, plume:mplN, lethal:false }];
}


// --- Locus 4 : Fond lipochrome ---
// Le facteur rouge (introduit historiquement chez le canari via le Tarin du
// Venezuela) est CODOMINANT avec le jaune — pas dominant/récessif. Jaune pur x
// Rouge pur donne donc 100% d'Orangé (hétérozygotes), et Orangé x Orangé
// redonne la ségrégation classique 25% Rouge pur / 50% Orangé / 25% Jaune pur.
// Cf. "Approche de la génétique chez les oiseaux", chapitre "Le facteur
// codominant" (RESOLU 29/07, remplace l'ancien calcul 50/50 erroné).
function allelesRougeJaune(fond) {
    if (fond === "Jaune")  return ["J", "J"];
    if (fond === "Rouge")  return ["R", "R"];
    if (fond === "Orangé") return ["J", "R"];
    return null;
}
function punnettRougeJaune(mf, ff) {
    var ma = allelesRougeJaune(mf), fa = allelesRougeJaune(ff);
    var compte = {};
    ma.forEach(function(a) {
        fa.forEach(function(b) {
            var nom = (a === b) ? (a === "J" ? "Jaune" : "Rouge") : "Orangé";
            compte[nom] = (compte[nom] || 0) + 0.25;
        });
    });
    return Object.keys(compte).map(function(nom) { return { prob: compte[nom], fond: nom, lethal: false }; });
}

function punnettFond(mf, ff, mpPorteurBlanc) {
    if (mpPorteurBlanc) {
        return ff === "Blanc Récessif"
            ? [{ prob:0.5, fond:mf+" / porteur Blanc Récessif", lethal:false }, { prob:0.5, fond:"Blanc Récessif", lethal:false }]
            : [{ prob:0.5, fond:mf, lethal:false }, { prob:0.5, fond:mf+" / porteur Blanc Récessif", lethal:false }];
    }
    if (mf === ff && mf !== "Blanc Dominant" && mf !== "Orangé") return [{ prob:1.0, fond:mf, lethal:false }];
    if (mf==="Blanc Dominant" && ff==="Blanc Dominant")
        return [{ prob:0.25, fond:"Blanc Dominant", lethal:true }, { prob:0.50, fond:"Blanc Dominant", lethal:false }, { prob:0.25, fond:"Jaune", lethal:false }];
    if (mf==="Blanc Dominant" || ff==="Blanc Dominant") {
        const a = mf==="Blanc Dominant" ? ff : mf;
        return [{ prob:0.5, fond:"Blanc Dominant", lethal:false }, { prob:0.5, fond:a, lethal:false }];
    }
    if (mf==="Blanc Récessif" && ff==="Blanc Récessif") return [{ prob:1.0, fond:"Blanc Récessif", lethal:false }];
    if (mf==="Blanc Récessif" || ff==="Blanc Récessif") {
        const c = mf==="Blanc Récessif" ? ff : mf;
        return [{ prob:0.5, fond:c, lethal:false }, { prob:0.5, fond:c+" / porteur Blanc Récessif", lethal:false }];
    }
    if (mf==="Ivoire Jaune" || ff==="Ivoire Jaune") {
        const a = mf==="Ivoire Jaune" ? ff : mf;
        return [{ prob:0.5, fond:"Ivoire "+a, lethal:false }, { prob:0.5, fond:a, lethal:false }];
    }
    if (allelesRougeJaune(mf) && allelesRougeJaune(ff)) return punnettRougeJaune(mf, ff);
    return [{ prob:1.0, fond:mf+" x "+ff, lethal:false }];
}

// --- Locus E (panachure) : Lipochrome (E) codominant avec base mélanique (e) ---
// AJOUTÉ v5. Avant, "Lipochrome" et "Noir/Sauvage" étaient traités comme deux
// bases mélaniques totalement séparées (cf. buildLipoMel, supprimé) : le
// résultat "Panaché" n'était qu'un texte affiché une fois, jamais un
// génotype réinjectable comme parent. Ici, Lipochrome = homozygote EE,
// Panaché = hétérozygote Ee (transporte la base mélanique ET le potentiel
// lipochrome pur), base mélanique normale (Noir/Sauvage) = homozygote ee.
// Codominant : un Panaché montre sa base mélanique (comme un mélanique pur)
// mais transmet le lipochrome pur à 50% de ses gamètes.
function alleleE(v) {
    if (v === "Lipochrome") return ["E","E"];
    if (v === "Panaché")    return ["E","e"];
    return ["e","e"]; // Noir, Sauvage, ou toute base mélanique classique
}
function punnettLocusE(mv, fv) {
    var ma = alleleE(mv), fa = alleleE(fv), compte = {};
    ma.forEach(function(a) { fa.forEach(function(b) {
        var key = (a === "E" && b === "E") ? "EE" : (a === "e" && b === "e") ? "ee" : "Ee";
        compte[key] = (compte[key] || 0) + 0.25;
    }); });
    return Object.keys(compte).filter(function(k) { return compte[k] > 0.0001; })
        .map(function(k) { return { prob: compte[k], geno: k }; });
}
// Applique le locus E à une liste déjà construite (résultats mélanine/mutations)
// et renomme chaque entrée selon le génotype E obtenu : EE → Lipochrome Pur,
// Ee → Panaché (base X), ee → X inchangé (la base mélanique déjà calculée).
function appliquerLocusE(mv, fv, lsList) {
    var eDist = punnettLocusE(mv, fv), out = [];
    lsList.forEach(function(item) {
        eDist.forEach(function(e) {
            var prob = item.prob * e.prob;
            if (prob < 0.0001) return;
            var nom;
            if (e.geno === "EE")      nom = "Lipochrome Pur";
            else if (e.geno === "Ee") nom = "Panaché (base " + item.nom + ")";
            else                       nom = item.nom;
            out.push({ prob: prob, nom: nom });
        });
    });
    return out;
}

// --- Assemblage final ---
function assembler(lsItems, rl, plumes, fonds, estMale) {
    const map = {};
    lsItems.forEach(li => rl.forEach(ri => plumes.forEach(pi => fonds.forEach(fi => {
        const prob = Math.round(li.prob * ri.prob * pi.prob * fi.prob * 100);
        if (!prob) return;
        let nom = li.nom + ri.suffixe;
        // "Noir + X Visuel" → "X Visuel" (le RL visuel remplace la mélanine de base Noir)
        nom = nom.replace(/^Noir [+] (.+ Visuel)$/, '$1');
        // NE PAS transformer "Noir + porteur X" → format différent mâle/femelle géré plus bas
        const lethal = pi.lethal || fi.lethal;
        const nouveau = nom.includes("porteur") || fi.fond.includes("porteur") || nom.includes("Panaché");
        const plume = resolvePlumeSexe(pi.plume, estMale);
        const key = nom + "|" + plume + "|" + fi.fond + "|" + lethal;
        if (map[key]) map[key].prob += prob;
        else map[key] = { prob, nom, plume, fond: fi.fond, lethal, nouveau };
    }))));
    return Object.values(map).sort((a,b) => b.prob - a.prob);
}

// --- Fonction principale ---
function calculerTout(mv, mp, mpl, mf, fv, fp, fpl, ff, mrl, mrlp, frl, frlp, loci) {
    mrl  = mrl  || "Rien";
    mrlp = mrlp || "Rien";
    frl  = frl  || "Rien";
    frlp = frlp || "Rien";
    loci = loci || {};
    const mBrun = !!loci.mBrun, mBrunP = !!loci.mBrunP;
    const mPastel = !!loci.mPastel, mPastelP = !!loci.mPastelP;
    const mIvoire = !!loci.mIvoire, mIvoireP = !!loci.mIvoireP;
    const fBrun = !!loci.fBrun;
    const fPastel = !!loci.fPastel, fIvoire = !!loci.fIvoire;
    // Locus partagé Agate/Satiné (3 allèles, cf. CNJF/UOF-COM France 2022)
    const mAS  = loci.mAgate ? "Agate" : (loci.mSatine  ? "Satiné" : "Rien");
    const mASP = loci.mAgateP ? "Agate" : (loci.mSatineP ? "Satiné" : "Rien");
    const fAS  = loci.fAgate ? "Agate" : (loci.fSatine  ? "Satiné" : "Rien");
    const mpPorteurBlanc = mp === "Blanc Récessif";
    const mpReal = mpPorteurBlanc ? "Rien" : mp;

    // Sauvage × Sauvage : lignée 100% ancestrale, phénotype fixe
    if (mv==="Sauvage" && fv==="Sauvage")
        return { resM:[{prob:100,nom:"Sauvage",plume:"",fond:"",lethal:false,nouveau:false}],
                 resF:[{prob:100,nom:"Sauvage",plume:"",fond:"",lethal:false,nouveau:false}] };

    // Un seul parent Sauvage : génétiquement équivalent à Noir (référence non
    // mutée) pour le calcul — le résultat dépend alors normalement de l'autre
    // parent, ce n'est plus un résultat fixe.
    if (mv==="Sauvage") mv = "Noir";
    if (fv==="Sauvage") fv = "Noir";

    // Semi-dominants
    // Jaspe : mutation semi-dominante/dominante à hérédité libre, PAS de facteur
    // létal (confirmé par plusieurs sources francophones et anglophones
    // indépendantes — le Double Facteur est juste une dilution plus poussée,
    // parfaitement viable). À ne pas confondre avec Intense×Intense ou
    // Blanc Dominant×Blanc Dominant, qui eux sont réellement létaux.
    if (mv==="Jaspe" || fv==="Jaspe") {
        const b = mv==="Jaspe" && fv==="Jaspe";
        const genos = b
            ? [{prob:25,nom:"Jaspe Double Facteur",lethalGeno:false, nouveau:false},
               {prob:50,nom:"Jaspe Simple Facteur",       lethalGeno:false,nouveau:false},
               {prob:25,nom:"Noir Classique",              lethalGeno:false,nouveau:false}]
            : [{prob:50,nom:"Jaspe Simple Facteur",       lethalGeno:false,nouveau:false},
               {prob:50,nom:"Noir Classique",              lethalGeno:false,nouveau:false}];
        const pl = punnettPlume(mpl,fpl), fo = punnettFond(mf,ff,mpPorteurBlanc), rM = [], rF = [];
        genos.forEach(g => pl.forEach(p => fo.forEach(f => {
            const prob = Math.round(g.prob/100 * p.prob * f.prob * 100);
            if (!prob) return;
            const lethal = g.lethalGeno||p.lethal||f.lethal;
            rM.push({ prob, nom:g.nom, plume:resolvePlumeSexe(p.plume, true),  fond:f.fond, lethal, nouveau:g.nouveau });
            rF.push({ prob, nom:g.nom, plume:resolvePlumeSexe(p.plume, false), fond:f.fond, lethal, nouveau:g.nouveau });
        })));
        return {resM:rM, resF:rF};
    }
    if (mv==="Cobalt" || fv==="Cobalt") {
        const b = mv==="Cobalt" && fv==="Cobalt";
        const genos = b
            ? [{prob:25,nom:"Kobalt Double Facteur (à l'étude)",lethalGeno:false,nouveau:true},
               {prob:50,nom:"Kobalt Simple Facteur",             lethalGeno:false,nouveau:false},
               {prob:25,nom:"Noir Classique",                    lethalGeno:false,nouveau:false}]
            : [{prob:50,nom:"Kobalt Simple Facteur",             lethalGeno:false,nouveau:false},
               {prob:50,nom:"Noir Classique",                    lethalGeno:false,nouveau:false}];
        const pl = punnettPlume(mpl,fpl), fo = punnettFond(mf,ff,mpPorteurBlanc), rM2 = [], rF2 = [];
        genos.forEach(g => pl.forEach(p => fo.forEach(f => {
            const prob = Math.round(g.prob/100 * p.prob * f.prob * 100);
            if (!prob) return;
            const lethal = g.lethalGeno||p.lethal||f.lethal;
            rM2.push({ prob, nom:g.nom, plume:resolvePlumeSexe(p.plume, true),  fond:f.fond, lethal, nouveau:g.nouveau });
            rF2.push({ prob, nom:g.nom, plume:resolvePlumeSexe(p.plume, false), fond:f.fond, lethal, nouveau:g.nouveau });
        })));
        return {resM:rM2, resF:rF2};
    }

    const brunLocus   = locusZUnique(mBrun,   mBrunP,   fBrun);
    const agateSatineLocus = locusAgateSatine(mAS, mASP, fAS);
    const pastelLocus = locusZUnique(mPastel, mPastelP, fPastel);
    const ivoireLocus = locusZUnique(mIvoire, mIvoireP, fIvoire);

    const baseM = fusionnerBaseMelanique(brunLocus.resM, agateSatineLocus.resM, " Pur");
    const baseF = fusionnerBaseMelanique(brunLocus.resF, agateSatineLocus.resF, " Visuel");

    const sufM = combinerSuffixes(fusionnerSuffixesZ(pastelLocus.resM, "Pastel"), fusionnerSuffixesZ(ivoireLocus.resM, "Ivoire"));
    const sufF = combinerSuffixes(fusionnerSuffixesZ(pastelLocus.resF, "Pastel"), fusionnerSuffixesZ(ivoireLocus.resF, "Ivoire"));

    const combiner = (baseDist, sufDist) => {
        const out = [];
        baseDist.forEach(b => sufDist.forEach(s => {
            const prob = b.prob * s.prob;
            if (prob < 0.0001) return;
            let nom = b.nom + s.suffixe;
            nom = nom.replace(/^Noir [+] (.+ (Visuel|Pur))$/, '$1'); // base non mutée + 1 seule mutation visuelle
            out.push({ prob, nom });
        }));
        return out;
    };

    // Locus E (panachure) appliqué APRÈS la construction de la base mélanique
    // complète (mélanine + Pastel/Ivoire), pour que "Panaché (base X)" porte
    // le nom complet de X, mutations comprises — ex: "Panaché (base Isabelle
    // Pur + Pastel Visuel)".
    const ls = {
        resMales:    appliquerLocusE(mv, fv, combiner(baseM, sufM)),
        resFemelles: appliquerLocusE(mv, fv, combiner(baseF, sufF))
    };
    const rl     = punnettRecessifLibre(mrl, mrlp, frl, frlp);
    const plumes = punnettPlume(mpl, fpl);
    const fonds  = punnettFond(mf, ff, mpPorteurBlanc);

    return {
        resM: assembler(ls.resMales,    rl, plumes, fonds, true),
        resF: assembler(ls.resFemelles, rl, plumes, fonds, false)
    };
}

// ============================================
//   CODE GÉNÉTIQUE (notation Z/W scientifique)
// ============================================
// Notation "bonus" affichée en plus du texte habituel (jamais à sa place) :
// mâle ZZ (2 chromosomes, peut être homozygote ou porteur caché), femelle
// ZW (1 seul chromosome, jamais porteuse cachée). Récessifs libres en +/x.
// Se concentre sur le volet mélanine — le fond (Jaune/Rouge/Blanc...) reste
// donné par le texte habituel, pas dupliqué ici.
function genererCodeGenetique(sexe, mutations, porteurs) {
    mutations = mutations || []; porteurs = porteurs || [];
    var estMale = sexe.indexOf("Mâle") >= 0;
    var symbolesLS = { "Brun":"br", "Pastel":"p", "Ivoire":"iv" };
    var symbolesRL = { "Opale":"op", "Topaze":"top", "Phaeo":"ph", "Eumo":"eu", "Onyx":"on" };
    var symbolesSD = { "Jaspe":"ja", "Cobalt":"ko" };
    var parties = [];

    // Locus partagé Agate/Satiné (3 allèles : +, ag, sat)
    var visuelAgate = mutations.indexOf("Agate") >= 0, visuelSatine = mutations.indexOf("Satiné") >= 0;
    var porteurAgate = porteurs.indexOf("Agate") >= 0, porteurSatine = porteurs.indexOf("Satiné") >= 0;
    if (visuelAgate || visuelSatine) {
        var alleleVisuel = visuelAgate ? "ag" : "sat";
        if (estMale) {
            var alleleCache = porteurSatine ? "sat" : (porteurAgate ? "ag" : alleleVisuel);
            parties.push("Z(" + alleleVisuel + ")Z(" + alleleCache + ")");
        } else {
            parties.push("Z(" + alleleVisuel + ")W");
        }
    } else if (estMale && (porteurAgate || porteurSatine)) {
        parties.push("Z(+)Z(" + (porteurSatine ? "sat" : "ag") + ")");
    }

    // Autres loci liés au sexe (Brun, Pastel, Ivoire)
    Object.keys(symbolesLS).forEach(function(m) {
        var s = symbolesLS[m];
        if (mutations.indexOf(m) >= 0) parties.push(estMale ? "Z(" + s + ")Z(" + s + ")" : "Z(" + s + ")W");
        else if (estMale && porteurs.indexOf(m) >= 0) parties.push("Z(+)Z(" + s + ")");
    });

    // Récessifs libres autosomaux (même règle pour les 2 sexes)
    Object.keys(symbolesRL).forEach(function(m) {
        var s = symbolesRL[m];
        if (mutations.indexOf(m) >= 0) parties.push(s + "/" + s);
        else if (porteurs.indexOf(m) >= 0) parties.push("+/" + s);
    });

    // Semi-dominants (simple facteur par défaut — pas de distinction
    // SF/DF stockée pour un oiseau statique du Cheptel)
    Object.keys(symbolesSD).forEach(function(m) {
        if (mutations.indexOf(m) >= 0) parties.push("+/" + symbolesSD[m] + " (SF)");
    });

    if (!parties.length) return estMale ? "Z(+)Z(+)" : "Z(+)W";
    return parties.join(" · ");
}
