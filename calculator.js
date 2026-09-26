// ============================================
//   CANAGEN — Calculateur génétique v2
//   Sans template literals pour compatibilité Firefox Focus
// ============================================

var MUTATIONS_VISUELLES = ["Opale","Topaze","Phaeo","Eumo","Onyx"];
var MUTATIONS_SEMI      = ["Jaspe","Cobalt"];
var MUTATIONS_LS        = ["Brun","Agate","Satiné","Pastel","Ivoire"];
var MUTATIONS_PORTEUR   = ["Opale","Topaze","Phaeo","Eumo","Onyx","Blanc Récessif"];
var MUT_RL_MELANIQUES   = ["Opale","Topaze","Phaeo","Eumo","Onyx"];

// Si l'utilisateur modifie MANUELLEMENT le formulaire après avoir chargé un
// vrai oiseau du Cheptel (Reprendre/Accoupler/Suggestions), ce n'est plus le
// même oiseau — on coupe le rattachement pour ne pas lier une sauvegarde à
// un couple réel dont les paramètres ne correspondent plus. Les changements
// FAITS PAR SCRIPT (chargement) ne déclenchent pas onchange, donc cette
// fonction n'est appelée que sur une vraie action de l'utilisateur.
function signalerModificationManuelle(prefix) {
    if (typeof definirBagueParent === 'function') definirBagueParent(prefix, null);
    var label = document.getElementById(prefix + '-selection');
    if (label && label.textContent.indexOf('✅') >= 0) {
        label.textContent = '✏️ Modifié manuellement (plus lié à un oiseau du Cheptel)';
    }
}

function toggleSelectionCategorie() {
    var panel = document.getElementById('selcat-panel');
    var arrow = document.getElementById('selcat-arrow');
    if (!panel) return;
    if (panel.style.display === 'none') {
        panel.style.display = 'block'; if (arrow) arrow.textContent = '▲';
        // Repart toujours sur un panneau vierge (aucune catégorie D00-D09
        // ouverte), plutôt que de garder l'état de la dernière fois.
        if (typeof CATEGORIES !== 'undefined') {
            CATEGORIES.forEach(function(c, n) {
                var l = document.getElementById('cat-list-' + n);
                var a = document.getElementById('arrow-' + n);
                if (l) l.style.display = 'none';
                if (a) a.textContent = '▼';
            });
        }
    }
    else { panel.style.display = 'none'; if (arrow) arrow.textContent = '▼'; }
}

// Clic n'importe où ailleurs sur la page (formulaire, autre bouton...) referme
// tout le panneau de sélection par catégorie, pas seulement son propre bouton.
document.addEventListener('click', function(e) {
    var panel = document.getElementById('selcat-panel');
    var arrow = document.getElementById('selcat-arrow');
    if (!panel || panel.style.display === 'none') return;
    var dansPanel = e.target.closest('#selcat-panel');
    var surSonBouton = e.target.closest('[onclick="toggleSelectionCategorie()"]');
    if (!dansPanel && !surSonBouton) {
        panel.style.display = 'none';
        if (arrow) arrow.textContent = '▼';
    }
});

function toggleMutationsGrid(prefix) {
    var panel = document.getElementById(prefix + '-mut-panel');
    var arrow = document.getElementById(prefix + '-mut-arrow');
    if (!panel) return;
    if (panel.style.display === 'none') { panel.style.display = 'block'; if (arrow) arrow.textContent = '▼'; }
    else { panel.style.display = 'none'; if (arrow) arrow.textContent = '▶'; }
}

function toggleInfosOiseau() {
    var panel = document.getElementById('fiche-infos-panel');
    var arrow = document.getElementById('fiche-infos-arrow');
    if (!panel) return;
    if (panel.style.display === 'none') { panel.style.display = 'block'; if (arrow) arrow.textContent = '▼'; }
    else { panel.style.display = 'none'; if (arrow) arrow.textContent = '▶'; }
}

function mettreAJourResumeMutations(prefix) {
    var n = document.querySelectorAll('input[name="' + prefix + '-mut"]:checked').length
          + document.querySelectorAll('input[name="' + prefix + '-port"]:checked').length;
    var el = document.getElementById(prefix + '-mut-resume');
    if (el) el.textContent = n > 0 ? '(' + n + ' sélectionnée' + (n > 1 ? 's' : '') + ')' : '';
}

// ============================================
//   GÉNÉRATION DES FORMULAIRES
// ============================================
function genererFormulaireParent(prefix, isMale) {
    var couleur = isMale ? '#63b3ed' : '#fc8181';
    var titre   = isMale ? '🔵 Père (♂ Mâle)' : '🔴 Mère (♀ Femelle)';
    var classe  = isMale ? 'male-box' : 'femelle-box';

    var h = '';
    h += '<div class="parent-box ' + classe + '" id="' + prefix + '-box">';
    h += '<strong style="color:' + couleur + ';">' + titre + '</strong>';
    h += '<div id="' + prefix + '-selection" class="selection-label"></div>';

    // Mélanine de base
    h += '<label>Mélanine de base :</label>';
    h += '<select id="' + prefix + '-base" onchange="mettreAJourMutations(\'' + prefix + '\');signalerModificationManuelle(\'' + prefix + '\')">';
    h += '<option value="Noir">Noir (Oxydé Classique)</option>';
    h += '<option value="Lipochrome">Lipochrome Pur (Sans Mélanine)</option>';
    h += '<option value="Panaché">Panaché (Hétérozygote Lipo/Mélanique)</option>';
    h += '<option value="Sauvage">Sauvage (Non Muté)</option>';
    h += '</select>';

    // Mutations & Porteurs — repliés par défaut (allège l'affichage)
    h += '<button type="button" onclick="toggleMutationsGrid(\'' + prefix + '\')" style="width:100%;margin-top:10px;padding:8px;background:#132840;color:#f5d020;border:1px solid #2a5080;border-radius:6px;cursor:pointer;text-align:left;font-size:0.85rem;">';
    h += '<span id="' + prefix + '-mut-arrow">▶</span> 🧬 Mutations & Porteurs <span id="' + prefix + '-mut-resume" style="color:#a0aec0;font-weight:normal;"></span>';
    h += '</button>';
    h += '<div id="' + prefix + '-mut-panel" style="display:none;">';

    // Mutations visuelles
    h += '<label style="margin-top:10px;">Mutations visuelles :</label>';
    h += '<div class="checkbox-group" id="' + prefix + '-mutations" onchange="mettreAJourResumeMutations(\'' + prefix + '\');signalerModificationManuelle(\'' + prefix + '\')">';
    MUTATIONS_VISUELLES.forEach(function(m) {
        h += '<label class="checkbox-label"><input type="checkbox" name="' + prefix + '-mut" value="' + m + '"> ' + m + '</label>';
    });
    // Brun / Agate visuel LS (Isabelle = les deux cochées ensemble, calculé automatiquement)
    h += '<label class="checkbox-label"><input type="checkbox" name="' + prefix + '-mut" value="Brun"> Brun <span style="color:#63b3ed;font-size:0.7rem;">(LS)</span></label>';
    h += '<label class="checkbox-label"><input type="checkbox" name="' + prefix + '-mut" value="Agate"> Agate <span style="color:#63b3ed;font-size:0.7rem;">(LS)</span></label>';
    h += '<div style="font-size:0.7rem;color:#a0aec0;grid-column:1/-1;margin:-2px 0 4px;">💡 Isabelle = Brun + Agate cochés ensemble</div>';
    // Pastel visuel LS
    h += '<label class="checkbox-label"><input type="checkbox" name="' + prefix + '-mut" value="Pastel"> Pastel <span style="color:#63b3ed;font-size:0.7rem;">(LS)</span></label>';
    // Satiné visuel LS
    h += '<label class="checkbox-label"><input type="checkbox" name="' + prefix + '-mut" value="Satiné"> Satiné <span style="color:#63b3ed;font-size:0.7rem;">(LS)</span></label>';
    h += '<div style="font-size:0.7rem;color:#a0aec0;grid-column:1/-1;margin:-2px 0 4px;">💡 Agate et Satiné partagent le même gène (un oiseau Agate peut être porteur Satiné, mais pas visuellement les deux)</div>';
    // Ivoire visuel LS
    h += '<label class="checkbox-label"><input type="checkbox" name="' + prefix + '-mut" value="Ivoire"> Ivoire <span style="color:#63b3ed;font-size:0.7rem;">(LS)</span></label>';
    // Semi-dominants
    MUTATIONS_SEMI.forEach(function(m) {
        h += '<label class="checkbox-label"><input type="checkbox" name="' + prefix + '-mut" value="' + m + '"> ' + m + ' <span style="color:#f6ad55;font-size:0.7rem;">(SD)</span></label>';
    });
    h += '</div>';

    // Porteurs
    h += '<label style="margin-top:10px;">Gènes Porteurs :</label>';
    h += '<div class="checkbox-group" id="' + prefix + '-porteurs" onchange="mettreAJourResumeMutations(\'' + prefix + '\');signalerModificationManuelle(\'' + prefix + '\')">';
    if (isMale) {
        MUTATIONS_LS.forEach(function(m) {
            h += '<label class="checkbox-label"><input type="checkbox" name="' + prefix + '-port" value="' + m + '"> porteur ' + m + ' <span style="color:#63b3ed;font-size:0.7rem;">(LS)</span></label>';
        });
    } else {
        h += '<div style="font-size:0.72rem;color:#fc8181;margin-bottom:6px;">⚠️ Une femelle ne peut jamais être porteuse d\'une mutation liée au sexe</div>';
    }
    MUTATIONS_PORTEUR.forEach(function(m) {
        h += '<label class="checkbox-label"><input type="checkbox" name="' + prefix + '-port" value="' + m + '"> porteur ' + m + ' <span style="color:#a0aec0;font-size:0.7rem;">(RL)</span></label>';
    });
    h += '</div>';
    h += '</div>'; // fin ' + prefix + '-mut-panel

    // Structure de plume
    h += '<label>Structure de Plume :</label>';
    h += '<select id="' + prefix + '-plume" onchange="onChangePlume(\'' + prefix + '\');verifierFacteursLetaux();signalerModificationManuelle(\'' + prefix + '\')">';
    if (isMale) {
        h += '<option value="Intense">Intense</option>';
        h += '<option value="Schimmel">Non-Intense (Schimmel)</option>';
        h += '<option value="Mosaïque">Mosaïque</option>';
    } else {
        h += '<option value="Schimmel">Non-Intense (Schimmel)</option>';
        h += '<option value="Intense">Intense</option>';
        h += '<option value="Mosaïque">Mosaïque</option>';
    }
    h += '</select>';

    // Sous-choix Mosaïque
    h += '<div id="' + prefix + '-mosaic-type" style="display:none;margin-top:6px;padding:8px;background:#0a1520;border-radius:6px;border:1px solid #1e3a5f;">';
    h += '<div style="font-size:0.8rem;color:#f5d020;margin-bottom:6px;">Type Mosaïque :</div>';
    h += '<div style="display:flex;gap:8px;">';
    h += '<label class="checkbox-label" style="flex:1;justify-content:center;"><input type="radio" name="' + prefix + '-mosaic" value="T1" checked> ♂ Type 1</label>';
    h += '<label class="checkbox-label" style="flex:1;justify-content:center;"><input type="radio" name="' + prefix + '-mosaic" value="T2"> ♀ Type 2</label>';
    h += '</div></div>';

    // Fond lipochrome
    h += '<label>Fond Lipochrome :</label>';
    h += '<select id="' + prefix + '-fond" onchange="verifierFacteursLetaux();signalerModificationManuelle(\'' + prefix + '\')">';
    h += '<option value="Jaune">Jaune</option>';
    h += '<option value="Rouge">Rouge</option>';
    h += '<option value="Orangé">Orangé</option>';
    h += '<option value="Blanc Dominant">Blanc Dominant</option>';
    h += '<option value="Blanc Récessif">Blanc Récessif</option>';
    h += '<option value="Ivoire Jaune">Ivoire Jaune</option>';
    h += '</select>';

    h += '</div>';
    return h;
}

function initCalculateur() {
    document.getElementById('form-pere').innerHTML = genererFormulaireParent('m', true);
    document.getElementById('form-mere').innerHTML = genererFormulaireParent('f', false);
}

// ============================================
//   MOSAÏQUE — afficher/masquer sous-choix
// ============================================
function onChangePlume(prefix) {
    var val = document.getElementById(prefix + '-plume').value;
    var div = document.getElementById(prefix + '-mosaic-type');
    if (div) div.style.display = val === 'Mosaïque' ? 'block' : 'none';
}

// ============================================
//   MÉLANINE — désactiver mutations si Lipochrome
// ============================================
function mettreAJourMutations(prefix) {
    var base = document.getElementById(prefix + '-base').value;
    var disabled = (base === 'Lipochrome' || base === 'Sauvage');
    document.querySelectorAll('input[name="' + prefix + '-mut"]').forEach(function(cb) {
        cb.disabled = disabled;
        cb.closest('.checkbox-label').style.opacity = disabled ? '0.4' : '1';
        if (disabled) cb.checked = false;
    });

    // "Sauvage" = phénotype ancestral fixe : le facteur rouge, le blanc et la
    // distinction Intense/Schimmel n'existaient pas chez le canari originel.
    // Fond/Structure n'ont donc aucun effet et sont désactivés pour éviter
    // de laisser croire qu'ils comptent.
    var sauvage = (base === 'Sauvage');
    var plumeEl = document.getElementById(prefix + '-plume');
    var fondEl  = document.getElementById(prefix + '-fond');
    if (plumeEl) { plumeEl.disabled = sauvage; plumeEl.style.opacity = sauvage ? '0.4' : '1'; }
    if (fondEl)  { fondEl.disabled  = sauvage; fondEl.style.opacity  = sauvage ? '0.4' : '1'; }

    // Un oiseau vraiment sauvage ne porte aucune mutation cachée par définition
    document.querySelectorAll('input[name="' + prefix + '-port"]').forEach(function(cb) {
        cb.disabled = sauvage;
        var lbl = cb.closest('.checkbox-label') || cb.closest('label');
        if (lbl) lbl.style.opacity = sauvage ? '0.4' : '1';
        if (sauvage) cb.checked = false;
    });
}

// ============================================
//   LIRE LES VALEURS DU FORMULAIRE
// ============================================
function lireParent(prefix) {
    var base  = document.getElementById(prefix + '-base').value;
    var fond  = document.getElementById(prefix + '-fond').value;
    var mutations = [];
    var porteurs  = [];
    document.querySelectorAll('input[name="' + prefix + '-mut"]:checked').forEach(function(cb){ mutations.push(cb.value); });
    document.querySelectorAll('input[name="' + prefix + '-port"]:checked').forEach(function(cb){ porteurs.push(cb.value); });

    var plume = document.getElementById(prefix + '-plume').value;
    if (plume === 'Mosaïque') {
        var radio = document.querySelector('input[name="' + prefix + '-mosaic"]:checked');
        plume = 'Mosaïque ' + (radio ? radio.value : 'T1');
    }
    return { base: base, plume: plume, fond: fond, mutations: mutations, porteurs: porteurs };
}

// ============================================
//   PRÉ-REMPLIR DEPUIS UNE CARTE
// ============================================
function preRemplirParent(prefix, o) {
    try {
        var baseMap = {
            'Noir':'Noir','Brun':'Brun','Agate':'Agate','Isabel':'Isabel',
            'Lipochrome':'Lipochrome','Sauvage':'Sauvage',
            'Opale':'Noir','Agate Opale':'Agate','Phaeo':'Brun',
            'Topaze':'Agate','Satiné':'Isabel','Eumo':'Agate',
            'Cobalt':'Noir','Jaspe':'Noir','Onyx':'Noir','Pastel':'Noir'
        };
        var mutMap = {
            'Opale':'Opale','Agate Opale':'Opale','Phaeo':'Phaeo',
            'Topaze':'Topaze','Satiné':'Satiné','Eumo':'Eumo',
            'Onyx':'Onyx','Jaspe':'Jaspe','Cobalt':'Cobalt','Pastel':'Pastel'
        };

        var baseSelect = document.getElementById(prefix + '-base');
        if (baseSelect) { baseSelect.value = baseMap[o.visuel] || 'Noir'; mettreAJourMutations(prefix); }

        document.querySelectorAll('input[name="' + prefix + '-mut"]').forEach(function(cb){ cb.checked = false; });
        document.querySelectorAll('input[name="' + prefix + '-port"]').forEach(function(cb){ cb.checked = false; });

        if (mutMap[o.visuel]) {
            var cb = document.querySelector('input[name="' + prefix + '-mut"][value="' + mutMap[o.visuel] + '"]');
            if (cb) cb.checked = true;
        }

        var plumeSelect = document.getElementById(prefix + '-plume');
        var fondSelect  = document.getElementById(prefix + '-fond');
        if (plumeSelect) { plumeSelect.value = o.plume || (prefix === 'f' ? 'Schimmel' : 'Intense'); onChangePlume(prefix); }
        if (fondSelect)  fondSelect.value = o.fond || 'Jaune';

    } catch(e) {}
}

// ============================================
//   ALERTE LÉTALE
// ============================================
function verifierFacteursLetaux() {
    var mp = document.getElementById('m-plume') ? document.getElementById('m-plume').value : '';
    var fp = document.getElementById('f-plume') ? document.getElementById('f-plume').value : '';
    var mf = document.getElementById('m-fond')  ? document.getElementById('m-fond').value  : '';
    var ff = document.getElementById('f-fond')  ? document.getElementById('f-fond').value  : '';
    var lethal = (mp === "Intense" && fp === "Intense") || (mf === "Blanc Dominant" && ff === "Blanc Dominant");
    var el = document.getElementById('lethal-alert');
    if (el) el.style.display = lethal ? 'block' : 'none';
}

// ============================================
//   CALCUL GÉNÉTIQUE
// ============================================
function calculerGenetiqueExacte() {
    var pereData = lireParent('m');
    var mereData = lireParent('f');

    var mv  = pereData.base; // restreint à Noir/Lipochrome/Sauvage désormais
    var mp  = 'Rien';
    var mrl = 'Rien';
    var mrlp = 'Rien';
    var mpl = pereData.plume;
    var mf  = pereData.fond;

    if (pereData.mutations.indexOf('Jaspe') >= 0)       mv = 'Jaspe';
    else if (pereData.mutations.indexOf('Cobalt') >= 0) mv = 'Cobalt';

    var mutRLVisu = pereData.mutations.filter(function(m){ return MUT_RL_MELANIQUES.indexOf(m) >= 0; });
    if (mutRLVisu.length > 0) mrl = mutRLVisu[0];

    if (mp === 'Rien' && pereData.porteurs.indexOf('Blanc Récessif') >= 0) mp = 'Blanc Récessif';

    var portRLMel = pereData.porteurs.filter(function(p){ return MUT_RL_MELANIQUES.indexOf(p) >= 0; });
    if (portRLMel.length > 0) mrlp = portRLMel[0];

    var fv  = mereData.base;
    var fp  = 'Rien';
    var frl = 'Rien';
    var frlp = 'Rien';
    var fpl = mereData.plume;
    var ff  = mereData.fond;

    if (mereData.mutations.indexOf('Jaspe') >= 0)       fv = 'Jaspe';
    else if (mereData.mutations.indexOf('Cobalt') >= 0) fv = 'Cobalt';

    var mutRLVisuF = mereData.mutations.filter(function(m){ return MUT_RL_MELANIQUES.indexOf(m) >= 0; });
    if (mutRLVisuF.length > 0) frl = mutRLVisuF[0];

    var portRLMelF = mereData.porteurs.filter(function(p){ return MUT_RL_MELANIQUES.indexOf(p) >= 0; });
    if (portRLMelF.length > 0) frlp = portRLMelF[0];
    if (mereData.porteurs.indexOf('Blanc Récessif') >= 0) fp = 'Blanc Récessif';

    // Brun / Agate-Satiné (locus partagé) / Pastel / Ivoire : loci Z indépendants
    // Isabelle = Brun + Agate combinés ; Satiné = allèle alternatif d'Agate sur le même locus
    // (VALIDÉ — livre CNJF/UOF-COM France 2022 + CanariGenDB REG-016)
    var loci = {
        mBrun:    pereData.mutations.indexOf('Brun') >= 0,
        mBrunP:   pereData.porteurs.indexOf('Brun') >= 0,
        mAgate:   pereData.mutations.indexOf('Agate') >= 0,
        mAgateP:  pereData.porteurs.indexOf('Agate') >= 0,
        mSatine:  pereData.mutations.indexOf('Satiné') >= 0,
        mSatineP: pereData.porteurs.indexOf('Satiné') >= 0,
        mPastel:  pereData.mutations.indexOf('Pastel') >= 0,
        mPastelP: pereData.porteurs.indexOf('Pastel') >= 0,
        mIvoire:  pereData.mutations.indexOf('Ivoire') >= 0,
        mIvoireP: pereData.porteurs.indexOf('Ivoire') >= 0,
        fBrun:    mereData.mutations.indexOf('Brun') >= 0,
        fAgate:   mereData.mutations.indexOf('Agate') >= 0,
        fSatine:  mereData.mutations.indexOf('Satiné') >= 0,
        fPastel:  mereData.mutations.indexOf('Pastel') >= 0,
        fIvoire:  mereData.mutations.indexOf('Ivoire') >= 0
    };

    var calc = calculerTout(mv, mp, mpl, mf, fv, fp, fpl, ff, mrl, mrlp, frl, frlp, loci);
    // Capture en lecture seule du dernier calcul, pour que d'autres fonctionnalités
    // (ex: sauvegarde de simulation) puissent réutiliser des données propres et
    // structurées sans jamais toucher au moteur ni au calcul lui-même.
    window.dernierCalcul = { calc: calc, pere: pereData, mere: mereData };
    afficherResultats(calc, mv, mpl, mf);
}

// ============================================
//   AFFICHAGE DES RÉSULTATS
// ============================================
function afficherResultats(calc, mv, mpl, mf) {
    function buildItems(items, sexe) {
        if (!items || !items.length) return '<div style="color:#718096;padding:8px;">Aucun résultat</div>';
        return items.map(function(r) {
            var cls  = r.lethal ? 'lethal-result' : '';
            var warn = '';
            if (r.lethal) warn = "⚠️ Ces jeunes (Double Facteur) mourront dans l'œuf.";

            var nomAff = r.nom;
            var sub = '';
            if (r.fond)  sub += '🎨 ' + r.fond;
            if (r.fond && r.plume) sub += ' · ';
            if (r.plume) sub += '🪶 ' + r.plume;

            var labelComplet = r.nom + (r.plume ? ' · ' + r.plume : '') + (r.fond ? ' · ' + r.fond : '');
            var safe     = labelComplet.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
            var nomSafe  = r.nom.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
            var sexeSafe = sexe.replace(/'/g,'&#39;');

            var html = '<div class="result-item ' + cls + '">';
            html += '<div class="result-item-top">';
            html += '<span class="result-pct">' + r.prob + '%</span>';
            html += '<span class="result-nom">' + nomAff + '</span>';
            html += '<span class="result-item-btns">';
            html += '<button class="btn-keep" data-label="' + safe + '" data-sexe="' + sexeSafe + '" onclick="garderJeuneBtn(this)">Garder</button>';
            if (r.lethal || r.nouveau) {
                html += '<span class="badge-new">🆕</span>';
            } else {
                html += '<button class="btn-voir" data-desc="' + safe + '" onclick="voirBtn(this)">Voir</button>';
            }
            if (r.lethal) html += '<span class="badge-lethal">🔴 LÉTAL</span>';
            html += '</span></div>';
            if (sub)  html += '<div class="result-item-sub">'  + sub  + '</div>';
            if (warn) html += '<div class="result-item-warn">' + warn + '</div>';
            html += '</div>';
            return html;
        }).join('');
    }

    document.getElementById('result-males').innerHTML    = buildItems(calc.resM, '♂ Mâle');
    document.getElementById('result-femelles').innerHTML = buildItems(calc.resF, '♀ Femelle');
    document.getElementById('results-area').style.display = 'block';
    document.getElementById('results-area').scrollIntoView({behavior:'smooth', block:'start'});
}

function garderJeuneBtn(btn) { garderJeuneExec(btn.dataset.label, btn.dataset.sexe); }
function voirBtn(btn)        { voirDansGrille(btn.dataset.desc); }

// remplirCalculateurDepuisOiseau vit maintenant uniquement dans cheptel.js
// (logique Cheptel séparée du calculateur — évite d'avoir deux copies
// divergentes de la même fonction dans deux fichiers différents).
