// ============================================
//   SIMULATIONS SAUVEGARDÉES
// ============================================
// Fichier volontairement indépendant (Cheptel/Calculateur n'en dépendent pas) :
// si cette fonctionnalité s'avère inutile, il suffit de retirer ce fichier
// + son <script> + le bloc HTML "💾 Simulations sauvegardées".
//
// Une sauvegarde est une "chaîne" : {id, note, etapes:[...]}. Une chaîne
// peut contenir plusieurs étapes (Père×Mère → Jeunes, puis Jeune×Père →
// nouveaux Jeunes, etc.) — voir reprendreSimulation()/chaineEnCoursId.
//
// Les résultats sont capturés depuis window.dernierCalcul (posé par
// calculator.js juste après calculerTout, en lecture seule) — jamais depuis
// le HTML affiché. Le moteur génétique n'est ni dupliqué ni modifié ici.
var simulationsSauvegardees = [];

// Suivi du couple réel (Cheptel) actuellement chargé dans le calculateur —
// permet de rattacher une étape sauvegardée à un vrai couple pour comparer
// plus tard la prédiction (virtuel) au résultat réel.
var pereBagueActuelle = null, mereBagueActuelle = null;

function definirBagueParent(prefix, bague) {
    if (prefix === 'm') pereBagueActuelle = bague;
    else mereBagueActuelle = bague;
}
function reinitialiserBaguesParents() {
    pereBagueActuelle = null;
    mereBagueActuelle = null;
}

// Chaîne en cours : quand on fait "▶️ Reprendre" sur une sauvegarde, la
// PROCHAINE fois qu'on appuie sur "💾 Sauvegarder", le résultat s'ajoute
// comme nouvelle étape à CETTE chaîne au lieu d'en créer une nouvelle.
// Se désarme sur Réinitialiser ou sélection manuelle dans la grille.
var chaineEnCoursId = null;

function chargerSimulations() {
    try {
        var raw = localStorage.getItem('canagen_simulations');
        simulationsSauvegardees = raw ? JSON.parse(raw) : [];
    } catch (e) { simulationsSauvegardees = []; }
    migrerVersEtapes();
}

// Convertit l'ancien format plat (une sauvegarde = un seul croisement) vers
// le nouveau format {id, note, etapes:[...]} — ne perd aucune sauvegarde
// existante.
function migrerVersEtapes() {
    var migre = false;
    simulationsSauvegardees = simulationsSauvegardees.map(function(s) {
        if (s.etapes) return s;
        migre = true;
        return {
            id: s.id,
            note: s.note || '',
            etapes: [{
                date: s.date, heure: s.heure,
                pereLabel: s.pereLabel, mereLabel: s.mereLabel,
                pereBague: s.pereBague || null, mereBague: s.mereBague || null,
                pere: s.pere, mere: s.mere,
                resM: s.resM || [], resF: s.resF || []
            }]
        };
    });
    if (migre) sauvegarderSimulationsStorage();
}

function sauvegarderSimulationsStorage() {
    try { localStorage.setItem('canagen_simulations', JSON.stringify(simulationsSauvegardees)); }
    catch (e) { showToast('⚠️ Sauvegarde impossible (stockage plein ?)', 'warn'); }
}

function genererIdSimulation() {
    var d = new Date();
    var pad = function(n, len) { return String(n).padStart(len || 2, '0'); };
    var horodatage = '' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate())
        + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
    return 'SIM-' + horodatage;
}

function sauvegarderSimulationActuelle() {
    if (!window.dernierCalcul) { showToast('⚠️ Lancez d\'abord une simulation', 'warn'); return; }

    var pere = window.dernierCalcul.pere; // {base, plume, fond, mutations, porteurs}
    var mere = window.dernierCalcul.mere;
    var calc = window.dernierCalcul.calc; // {resM:[...], resF:[...]}

    var pereLabel = calculerDescOiseau(pere.base, pere.mutations, pere.porteurs, pere.plume, pere.fond).desc;
    var mereLabel = calculerDescOiseau(mere.base, mere.mutations, mere.porteurs, mere.plume, mere.fond).desc;
    var note = document.getElementById('sim-note-input').value.trim();
    var maintenant = new Date();

    var etape = {
        date: maintenant.toLocaleDateString('fr-FR'),
        heure: maintenant.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        timestamp: maintenant.getTime(),
        pereLabel: pereLabel, mereLabel: mereLabel,
        pereBague: pereBagueActuelle, mereBague: mereBagueActuelle,
        pere: pere, mere: mere,
        resM: calc.resM || [], resF: calc.resF || []
    };

    var chaine = chaineEnCoursId ? trouverSimulation(chaineEnCoursId) : null;
    if (chaine) {
        chaine.etapes.push(etape);
        if (note) chaine.note = note;
        showToast('✅ Étape ajoutée à la sauvegarde ' + chaine.id, 'info');
    } else {
        chaine = { id: genererIdSimulation(), note: note, etapes: [etape] };
        simulationsSauvegardees.push(chaine);
        showToast('✅ Simulation sauvegardée', 'info');
    }
    // "Sauvegarder" est à usage unique : si une chaîne était armée (via
    // Reprendre), on l'utilise puis on désarme — il faudra refaire
    // "Reprendre" pour ajouter une 3e étape. Sans ça, un simple
    // Sauvegarder ultérieur (même sans rapport) continuerait sans fin
    // la même chaîne, ce qui n'est pas ce que veut l'utilisateur.
    chaineEnCoursId = null;

    sauvegarderSimulationsStorage();
    document.getElementById('sim-note-input').value = '';
    afficherSimulationsSauvegardees();
}

// Toutes les bagues réelles touchées par une chaîne (une ou plusieurs
// étapes), dédupliquées.
function baguesDeChaine(s) {
    var bagues = [];
    s.etapes.forEach(function(e) {
        if (e.pereBague && bagues.indexOf(e.pereBague) < 0) bagues.push(e.pereBague);
        if (e.mereBague && bagues.indexOf(e.mereBague) < 0) bagues.push(e.mereBague);
    });
    return bagues;
}

// Simulations rattachées à un oiseau réel du Cheptel (via sa bague) —
// affiché depuis la fiche de l'oiseau (cheptel.js) pour comparer plus tard
// la prédiction (virtuel) au résultat réel.
function afficherSimulationsLieesFiche(bague, containerId) {
    var container = document.getElementById(containerId || 'fiche-simulations-liees');
    if (!container) return;
    var liees = simulationsSauvegardees.filter(function(s) { return baguesDeChaine(s).indexOf(bague) >= 0; });
    if (!liees.length) {
        container.innerHTML = '<div style="color:#718096;font-size:0.78rem;">Aucune simulation liée à cet oiseau pour l\'instant. Elles se rattachent automatiquement en sauvegardant une simulation lancée depuis "🧬 Accoupler" ou "Suggestions d\'accouplement".</div>';
        return;
    }
    var h = '';
    liees.slice().reverse().forEach(function(s) {
        h += '<div style="padding:8px 0;border-bottom:1px solid #1e3a5f;">';
        h += rendreEtapesChaine(s, true);
        h += '</div>';
    });
    container.innerHTML = h;
}

function toggleSimulations() {
    var liste = document.getElementById('sim-liste');
    var arrow = document.getElementById('sim-arrow');
    if (!liste) return;
    if (liste.style.display === 'none') { liste.style.display = 'block'; if (arrow) arrow.textContent = '▲'; }
    else { liste.style.display = 'none'; if (arrow) arrow.textContent = '▼'; }
}

// --- Rendu en "carte" propre, sans aucun bouton/élément d'interface ---
function rendreCarteResultat(r) {
    var sub = '';
    if (r.fond)  sub += '🎨 ' + r.fond;
    if (r.fond && r.plume) sub += ' · ';
    if (r.plume) sub += '🪶 ' + r.plume;
    var bord = r.lethal ? '#e53e3e' : '#2a5080';
    var h = '<div style="border-left:3px solid ' + bord + ';background:#0f2035;border-radius:4px;padding:6px 8px;margin-bottom:5px;">';
    h += '<strong style="color:#f5d020;">' + r.prob + '%</strong> — <span style="color:#e2e8f0;">' + r.nom + '</span>';
    if (r.lethal) h += ' <span style="color:#fc8181;">⚠️ létal</span>';
    if (sub) h += '<br><span style="color:#a0aec0;font-size:0.78rem;">' + sub + '</span>';
    h += '</div>';
    return h;
}

// Une seule étape, résultats dans une grille repliable (fermée par défaut)
function rendreEtape(e, idxUnique) {
    var h = '<div style="margin-bottom:6px;">';
    h += '<div style="font-size:0.78rem;color:#718096;">' + e.date + ' à ' + (e.heure || '') + '</div>';
    h += '<div style="font-size:0.82rem;color:#e2e8f0;margin-bottom:4px;">🧬 ♂ ' + e.pereLabel + ' × ♀ ' + e.mereLabel + '</div>';
    h += '<button type="button" onclick="toggleEtapeResultats(\'' + idxUnique + '\')" style="width:100%;padding:6px;background:#132840;color:#f5d020;border:1px solid #2a5080;border-radius:4px;cursor:pointer;text-align:left;font-size:0.75rem;">';
    h += '<span id="etape-arrow-' + idxUnique + '">▶</span> Voir les résultats';
    h += '</button>';
    h += '<div id="etape-panel-' + idxUnique + '" style="display:none;padding-top:6px;">';
    h += '<div style="font-weight:bold;color:#3182ce;margin-bottom:4px;font-size:0.8rem;">Jeunes Mâles (♂)</div>';
    (e.resM || []).forEach(function(r) { h += rendreCarteResultat(r); });
    h += '<div style="font-weight:bold;color:#e53e3e;margin:8px 0 4px;font-size:0.8rem;">Jeunes Femelles (♀)</div>';
    (e.resF || []).forEach(function(r) { h += rendreCarteResultat(r); });
    h += '</div></div>';
    return h;
}

function toggleEtapeResultats(idxUnique) {
    var panel = document.getElementById('etape-panel-' + idxUnique);
    var arrow = document.getElementById('etape-arrow-' + idxUnique);
    if (!panel) return;
    if (panel.style.display === 'none') { panel.style.display = 'block'; if (arrow) arrow.textContent = '▼'; }
    else { panel.style.display = 'none'; if (arrow) arrow.textContent = '▶'; }
}

// Toutes les étapes d'une chaîne, à la suite, chacune avec ses résultats
// dans une grille repliable. compact=true pour un contexte plus resserré
// (ex: encart "Simulations liées" dans une fiche oiseau).
function rendreEtapesChaine(s, compact) {
    var h = '<div style="font-size:0.7rem;color:#4a5568;margin-bottom:4px;">' + s.id + (s.etapes.length > 1 ? ' — ' + s.etapes.length + ' étapes' : '') + '</div>';
    s.etapes.forEach(function(e, i) {
        h += rendreEtape(e, s.id + '-' + i);
        if (i < s.etapes.length - 1) h += '<div style="text-align:center;color:#f5d020;margin:4px 0;">⬇️</div>';
    });
    return h;
}

function trierSimulations(mode) {
    afficherSimulationsSauvegardees(mode);
}

function timestampDeEtape(e) {
    if (e.timestamp) return e.timestamp;
    // Anciennes étapes sauvegardées avant l'ajout du timestamp — on
    // reconstruit du mieux possible à partir de date+heure affichées.
    try {
        var parts = e.date.split('/'); // DD/MM/YYYY
        var hm = (e.heure || '00:00').split(':');
        return new Date(parts[2], parts[1] - 1, parts[0], hm[0], hm[1]).getTime();
    } catch (err) { return 0; }
}

function afficherSimulationsSauvegardees(modeTri) {
    var count = document.getElementById('sim-count');
    if (count) count.textContent = simulationsSauvegardees.length;

    var container = document.getElementById('sim-liste-contenu');
    if (!container) return;
    if (!simulationsSauvegardees.length) {
        container.innerHTML = '<div style="color:#718096;font-size:0.8rem;padding:8px;">Aucune simulation sauvegardée.</div>';
        return;
    }

    var selectTri = document.getElementById('sim-tri');
    modeTri = modeTri || (selectTri ? selectTri.value : 'recent');

    function carteSimulation(s) {
        var derniere = s.etapes[s.etapes.length - 1];
        var h = '<div style="padding:8px;border-top:1px solid #1e3a5f;' + (chaineEnCoursId === s.id ? 'background:#132840;' : '') + '">';
        h += '<div style="font-size:0.7rem;color:#4a5568;">' + s.id + (s.etapes.length > 1 ? ' · ' + s.etapes.length + ' étapes' : '') + (chaineEnCoursId === s.id ? ' · <span style=\"color:#68d391;\">chaîne active</span>' : '') + '</div>';
        h += '<div style="font-size:0.82rem;color:#e2e8f0;"><strong style="color:#f5d020;">' + derniere.date + ' ' + (derniere.heure || '') + '</strong>' + (s.note ? ' — ' + s.note : '') + '</div>';
        h += '<div style="font-size:0.78rem;color:#a0aec0;margin:2px 0 6px;">🔵 ' + derniere.pereLabel + '<br>🔴 ' + derniere.mereLabel + '</div>';
        var bagues = baguesDeChaine(s);
        if (bagues.length) {
            h += '<div style="font-size:0.72rem;color:#68d391;margin-bottom:6px;">🔗 Couple réel : ' + bagues.join(' / ') + '</div>';
        }
        h += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
        h += '<button onclick="reprendreSimulation(\'' + s.id + '\')" style="padding:5px 10px;background:#1e3a5f;color:#f5d020;border:1px solid #2a5080;border-radius:4px;cursor:pointer;font-size:0.75rem;">▶️ Reprendre</button>';
        h += '<button onclick="voirResumeSimulation(\'' + s.id + '\')" style="padding:5px 10px;background:#1e3a5f;color:#a0aec0;border:1px solid #2a5080;border-radius:4px;cursor:pointer;font-size:0.75rem;">👁️ Résumé</button>';
        h += '<button onclick="copierSimulation(\'' + s.id + '\')" style="padding:5px 10px;background:#1e3a5f;color:#a0aec0;border:1px solid #2a5080;border-radius:4px;cursor:pointer;font-size:0.75rem;">📋 Copier</button>';
        h += '<button onclick="supprimerSimulation(\'' + s.id + '\')" style="padding:5px 10px;background:none;color:#fc8181;border:1px solid #742a2a;border-radius:4px;cursor:pointer;font-size:0.75rem;">✕</button>';
        h += '</div></div>';
        return h;
    }

    var h = '';
    if (modeTri === 'cheptel') {
        var parGroupe = {};
        var sansBague = [];
        simulationsSauvegardees.forEach(function(s) {
            var bagues = baguesDeChaine(s);
            if (!bagues.length) { sansBague.push(s); return; }
            // Groupe par la combinaison EXACTE de bagues liées à cette
            // chaîne (triée pour un ordre stable), pas par bague individuelle
            // — sinon une simulation liée à 2 parents (couple réel) apparaissait
            // deux fois de suite dans la liste, une fois sous chaque bague.
            var cle = bagues.slice().sort().join(' · ');
            if (!parGroupe[cle]) parGroupe[cle] = [];
            parGroupe[cle].push(s);
        });
        Object.keys(parGroupe).sort().forEach(function(cle) {
            h += '<div style="padding:6px 8px;background:#0f2035;color:#f5d020;font-weight:bold;font-size:0.8rem;">🐦 ' + cle + '</div>';
            parGroupe[cle].slice().reverse().forEach(function(s) { h += carteSimulation(s); });
        });
        if (sansBague.length) {
            h += '<div style="padding:6px 8px;background:#0f2035;color:#a0aec0;font-weight:bold;font-size:0.8rem;">Sans oiseau lié</div>';
            sansBague.slice().reverse().forEach(function(s) { h += carteSimulation(s); });
        }
    } else {
        var triees = simulationsSauvegardees.slice().sort(function(a, b) {
            var ta = timestampDeEtape(a.etapes[a.etapes.length - 1]);
            var tb = timestampDeEtape(b.etapes[b.etapes.length - 1]);
            return modeTri === 'ancien' ? ta - tb : tb - ta;
        });
        triees.forEach(function(s) { h += carteSimulation(s); });
    }
    container.innerHTML = h;
}

function trouverSimulation(id) {
    for (var i = 0; i < simulationsSauvegardees.length; i++) if (simulationsSauvegardees[i].id === id) return simulationsSauvegardees[i];
    return null;
}

// Recharge les paramètres de la DERNIÈRE étape dans le calculateur et
// relance un calcul frais (plutôt que de réafficher les données figées) —
// et arme cette chaîne comme "en cours" : le prochain "Sauvegarder" s'y
// ajoutera comme nouvelle étape au lieu de créer une nouvelle sauvegarde.
function reprendreSimulation(id) {
    var s = trouverSimulation(id);
    if (!s) return;
    var derniere = s.etapes[s.etapes.length - 1];
    appliquerParamsCalculateur('m', derniere.pere);
    appliquerParamsCalculateur('f', derniere.mere);
    definirBagueParent('m', derniere.pereBague);
    definirBagueParent('f', derniere.mereBague);
    chaineEnCoursId = s.id;
    var pL = document.getElementById('m-selection'); if (pL) pL.textContent = '✅ ' + derniere.pereLabel;
    var fL = document.getElementById('f-selection'); if (fL) fL.textContent = '✅ ' + derniere.mereLabel;
    calculerGenetiqueExacte();
    verifierFacteursLetaux();
    var zoneRes = document.getElementById('results-area');
    if (zoneRes) zoneRes.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('▶️ Reprise — "Sauvegarder" ajoutera une étape à ' + s.id, 'info');
}

function voirResumeSimulation(id) {
    var s = trouverSimulation(id);
    if (!s) return;
    document.getElementById('result-males').innerHTML    = rendreEtapesChaine(s, false);
    document.getElementById('result-femelles').innerHTML = '';
    document.getElementById('results-area').style.display = 'block';
    var derniere = s.etapes[s.etapes.length - 1];
    var pL = document.getElementById('m-selection'); if (pL) pL.textContent = '✅ ' + derniere.pereLabel;
    var fL = document.getElementById('f-selection'); if (fL) fL.textContent = '✅ ' + derniere.mereLabel;
    var zoneRes2 = document.getElementById('results-area');
    if (zoneRes2) zoneRes2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('👁️ ' + s.etapes.length + ' étape(s) telles que sauvegardées', 'info');
}

// Texte propre, prêt à coller (forum, WhatsApp...) — uniquement les données,
// aucun élément d'interface, toutes les étapes de la chaîne.
function texteSimulation(s) {
    var texte = 'CanaGen — ' + s.id + (s.note ? ' — ' + s.note : '') + '\n';
    texte += (s.etapes.length > 1 ? s.etapes.length + ' étapes\n' : '') + '\n';
    s.etapes.forEach(function(e, i) {
        if (s.etapes.length > 1) texte += '--- Étape ' + (i + 1) + ' — ' + e.date + ' à ' + (e.heure || '') + ' ---\n';
        else texte += e.date + ' à ' + (e.heure || '') + '\n';
        texte += '🧬 Accouplement : ♂ ' + e.pereLabel + ' × ♀ ' + e.mereLabel + '\n\n';
        texte += 'Jeunes Mâles :\n';
        (e.resM || []).forEach(function(r) {
            texte += '- ' + r.prob + '% ' + r.nom + (r.fond ? ' · ' + r.fond : '') + (r.plume ? ' · ' + r.plume : '') + (r.lethal ? ' (⚠️ létal)' : '') + '\n';
        });
        texte += '\nJeunes Femelles :\n';
        (e.resF || []).forEach(function(r) {
            texte += '- ' + r.prob + '% ' + r.nom + (r.fond ? ' · ' + r.fond : '') + (r.plume ? ' · ' + r.plume : '') + (r.lethal ? ' (⚠️ létal)' : '') + '\n';
        });
        texte += '\n';
    });
    return texte;
}

function copierSimulation(id) {
    var s = trouverSimulation(id);
    if (!s) return;
    var texte = texteSimulation(s);
    var ta = document.createElement('textarea');
    ta.value = texte; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try {
        var ok = document.execCommand('copy');
        showToast(ok ? '✅ Copié — collez-le sur le forum !' : '⚠️ Copie manuelle nécessaire', ok ? 'info' : 'warn');
    } catch (e) { showToast('⚠️ Copie manuelle nécessaire', 'warn'); }
    document.body.removeChild(ta);
}

function supprimerSimulation(id) {
    if (!confirm('Supprimer cette simulation sauvegardée (toutes ses étapes) ?')) return;
    simulationsSauvegardees = simulationsSauvegardees.filter(function(s) { return s.id !== id; });
    if (chaineEnCoursId === id) chaineEnCoursId = null;
    sauvegarderSimulationsStorage();
    afficherSimulationsSauvegardees();
}
