// ============================================
//   SUGGESTIONS D'ACCOUPLEMENT
// ============================================
// Fichier indépendant (retirable sans toucher au Cheptel ni au Calculateur).
// Parcourt toutes les paires Mâle × Femelle du Cheptel (tous statuts confondus
// — utile aussi pour planifier avec des oiseaux "En attente"/"Futur"/"Virtuel")
// et réutilise le moteur génétique existant (calculerTout) pour donner un
// résumé rapide de chaque paire, sans dupliquer sa logique.

function genererParamsGenPourCheptel(o) {
    var mutations = o.mutations || [];
    var porteurs  = o.porteurs  || [];
    var v = o.base, p = 'Rien', rl = 'Rien', rlp = 'Rien';

    if (mutations.indexOf('Jaspe') >= 0)       v = 'Jaspe';
    else if (mutations.indexOf('Cobalt') >= 0) v = 'Cobalt';

    var mutRLVisu = mutations.filter(function(m){ return MUT_RL_MELANIQUES.indexOf(m) >= 0; });
    if (mutRLVisu.length > 0) rl = mutRLVisu[0];

    if (porteurs.indexOf('Blanc Récessif') >= 0) p = 'Blanc Récessif';
    var portRLMel = porteurs.filter(function(x){ return MUT_RL_MELANIQUES.indexOf(x) >= 0; });
    if (portRLMel.length > 0) rlp = portRLMel[0];

    return {
        v: v, p: p, pl: o.plume || 'Intense', f: o.fond || 'Jaune', rl: rl, rlp: rlp,
        brun: mutations.indexOf('Brun') >= 0,     brunP: porteurs.indexOf('Brun') >= 0,
        agate: mutations.indexOf('Agate') >= 0,   agateP: porteurs.indexOf('Agate') >= 0,
        satine: mutations.indexOf('Satiné') >= 0, satineP: porteurs.indexOf('Satiné') >= 0,
        pastel: mutations.indexOf('Pastel') >= 0, pastelP: porteurs.indexOf('Pastel') >= 0,
        ivoire: mutations.indexOf('Ivoire') >= 0, ivoireP: porteurs.indexOf('Ivoire') >= 0
    };
}

function calculerPaireCheptel(pere, mere) {
    var pp = genererParamsGenPourCheptel(pere);
    var mp = genererParamsGenPourCheptel(mere);
    var loci = {
        mBrun: pp.brun, mBrunP: pp.brunP, mAgate: pp.agate, mAgateP: pp.agateP,
        mSatine: pp.satine, mSatineP: pp.satineP, mPastel: pp.pastel, mPastelP: pp.pastelP,
        mIvoire: pp.ivoire, mIvoireP: pp.ivoireP,
        fBrun: mp.brun, fAgate: mp.agate, fSatine: mp.satine, fPastel: mp.pastel, fIvoire: mp.ivoire
    };
    var calc = calculerTout(pp.v, pp.p, pp.pl, pp.f, mp.v, mp.p, mp.pl, mp.f, pp.rl, pp.rlp, mp.rl, mp.rlp, loci);
    var lethal = (pp.pl === 'Intense' && mp.pl === 'Intense') || (pp.f === 'Blanc Dominant' && mp.f === 'Blanc Dominant');
    return { calc: calc, lethal: lethal };
}

function resumerResultatsPaire(calc) {
    var tous = (calc.resM || []).concat(calc.resF || []);
    if (!tous.length) return { texte: 'Aucun résultat calculable', principal: null };
    var noms = {};
    tous.forEach(function(r) { noms[r.nom] = (noms[r.nom] || 0) + r.prob; });
    var uniques = Object.keys(noms);
    var principal = uniques.reduce(function(a, b) { return noms[a] >= noms[b] ? a : b; });
    return { texte: uniques.length + ' phénotype(s) possible(s)', principal: principal, principalPct: Math.round(noms[principal]) };
}

function toggleSuggestionsAccouplement() {
    var liste = document.getElementById('sugg-liste');
    var arrow = document.getElementById('sugg-arrow');
    if (!liste) return;
    if (liste.style.display === 'none') {
        liste.style.display = 'block';
        if (arrow) arrow.textContent = '▲';
        genererSuggestionsAccouplement();
    } else {
        liste.style.display = 'none';
        if (arrow) arrow.textContent = '▼';
    }
}

function genererSuggestionsAccouplement() {
    var container = document.getElementById('sugg-liste');
    if (!container) return;

    var males    = baseCheptel.filter(function(o){ return o.sexe.indexOf('Mâle') >= 0 && o.base; });
    var femelles = baseCheptel.filter(function(o){ return o.sexe.indexOf('Femelle') >= 0 && o.base; });

    if (!males.length || !femelles.length) {
        container.innerHTML = '<div style="color:#718096;font-size:0.8rem;padding:8px;">Il faut au moins un mâle et une femelle avec une génétique renseignée dans le Cheptel.</div>';
        return;
    }

    var paires = [];
    males.forEach(function(pere) {
        femelles.forEach(function(mere) {
            try {
                var r = calculerPaireCheptel(pere, mere);
                var resume = resumerResultatsPaire(r.calc);
                paires.push({ pere: pere, mere: mere, lethal: r.lethal, resume: resume });
            } catch (e) { /* paire ignorée si le calcul échoue */ }
        });
    });

    // Paires sûres d'abord, létales en dernier
    paires.sort(function(a, b) { return (a.lethal === b.lethal) ? 0 : (a.lethal ? 1 : -1); });

    var h = '';
    paires.forEach(function(pr, i) {
        var bord = pr.lethal ? '#e53e3e' : '#2a5080';
        h += '<div style="border-left:4px solid ' + bord + ';background:#0f2035;border-radius:6px;padding:8px;margin-bottom:8px;">';
        h += '<div style="font-size:0.82rem;color:#e2e8f0;">🔵 <strong>' + pr.pere.bague + '</strong> <span style="color:#718096;">(' + (pr.pere.desc||'') + ')</span></div>';
        h += '<div style="font-size:0.82rem;color:#e2e8f0;">🔴 <strong>' + pr.mere.bague + '</strong> <span style="color:#718096;">(' + (pr.mere.desc||'') + ')</span></div>';
        if (pr.lethal) {
            h += '<div style="color:#fc8181;font-size:0.78rem;margin-top:4px;">⚠️ Combinaison létale (25% de mortalité dans l\'œuf)</div>';
        } else if (pr.resume.principal) {
            h += '<div style="color:#68d391;font-size:0.78rem;margin-top:4px;">🧬 ' + pr.resume.texte + ' — principal : ' + pr.resume.principal + ' (~' + pr.resume.principalPct + '%)</div>';
        }
        h += '<button onclick="chargerSuggestionDansCalculateur(' + i + ')" style="margin-top:6px;padding:5px 10px;background:#1e3a5f;color:#f5d020;border:1px solid #2a5080;border-radius:4px;cursor:pointer;font-size:0.75rem;">▶️ Charger dans le calculateur</button>';
        h += '</div>';
    });
    container.innerHTML = h || '<div style="color:#718096;font-size:0.8rem;padding:8px;">Aucune paire calculable.</div>';

    // Mémorisé pour le bouton "Charger" (évite de recalculer/re-sérialiser les indices)
    window._suggestionsAccouplement = paires;
}

function chargerSuggestionDansCalculateur(i) {
    var paires = window._suggestionsAccouplement || [];
    var pr = paires[i];
    if (!pr) return;
    appliquerParamsCalculateur('m', pr.pere);
    appliquerParamsCalculateur('f', pr.mere);
    if (typeof definirBagueParent === 'function') { definirBagueParent('m', pr.pere.bague); definirBagueParent('f', pr.mere.bague); }
    var pL = document.getElementById('m-selection'); if (pL) pL.textContent = '✅ ' + pr.pere.bague;
    var fL = document.getElementById('f-selection'); if (fL) fL.textContent = '✅ ' + pr.mere.bague;
    naviguerVers('page-calc', document.getElementById('btn-nav-calc'));
    calculerGenetiqueExacte();
    verifierFacteursLetaux();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('▶️ Paire chargée : ' + pr.pere.bague + ' × ' + pr.mere.bague, 'info');
}
