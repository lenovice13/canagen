// ============================================
//   REPRODUCTION — Module indépendant (04_Reproduction.md)
// ============================================
// Fichier autonome : ne modifie aucun autre fichier existant.
// Réutilise (sans les dupliquer) : baseCheptel/sauvegarderCheptel (cheptel.js),
// baseCages/typeCageParCode (cages.js), simulationsSauvegardees/baguesDeChaine/
// rendreEtapesChaine/definirBagueParent (simulations.js), remplirCalculateurDepuisOiseau
// (cheptel.js), nomVersParams/appliquerParamsCalculateur/showToast/naviguerVers (ui.js),
// todayISO (cheptel.js).
//
// Le lien Calculatrice ne stocke AUCUN identifiant de simulation sur la reproduction :
// on retrouve les simulations liées à la volée via les bagues des parents (même
// mécanisme que "Simulations liées" du Cheptel) — pas de 2e système de liaison à
// maintenir.

var baseReproductions = [];
var reproductionEnCoursId = null; // reproduction actuellement ouverte dans le modal détail
var filtreSaisonRepro = 'Tous';
var filtreEtatRepro = 'Tous';

var ETATS_REPRODUCTION = ['Prévue', 'En cours', 'Terminée', 'Annulée'];
var SELECTIONS_JEUNE = [
    { code: 'non',        emoji: '⚪', nom: 'Non sélectionné' },
    { code: 'garder',     emoji: '⭐', nom: 'À garder' },
    { code: 'surveiller', emoji: '🟡', nom: 'À surveiller' },
    { code: 'ceder',      emoji: '🔴', nom: 'À céder / vendre' },
    { code: 'cede',       emoji: '✅', nom: 'Cédé / vendu' }
];

// ============================================
//   STOCKAGE
// ============================================
function chargerReproductions() {
    try {
        var d = localStorage.getItem('canagen_reproductions');
        return d ? JSON.parse(d) : [];
    } catch (e) { return []; }
}
function sauvegarderReproductions(repros) {
    try {
        localStorage.setItem('canagen_reproductions', JSON.stringify(repros));
        return true;
    } catch (e) {
        if (typeof showToast === 'function') showToast('⚠️ Sauvegarde des reproductions impossible (stockage plein ?)', 'warn');
        return false;
    }
}

function genererIdReproduction() {
    var d = new Date();
    function pad(n) { return String(n).padStart(2, '0'); }
    return 'REPRO-' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
}
function genererIdPonte()  { return 'PONTE-'  + Date.now() + '-' + Math.floor(Math.random() * 1000); }
function genererIdJeune()  { return 'JEUNE-'  + Date.now() + '-' + Math.floor(Math.random() * 1000); }

function trouverReproduction(id) {
    for (var i = 0; i < baseReproductions.length; i++) if (baseReproductions[i].id === id) return baseReproductions[i];
    return null;
}
function trouverPonte(r, ponteId) {
    for (var i = 0; i < r.pontes.length; i++) if (r.pontes[i].id === ponteId) return r.pontes[i];
    return null;
}
function trouverJeune(p, jeuneId) {
    for (var i = 0; i < p.jeunes.length; i++) if (p.jeunes[i].id === jeuneId) return p.jeunes[i];
    return null;
}

// ============================================
//   FORMULAIRES — LISTES OISEAUX / CAGES
// ============================================
function mettreAJourListesReproductionFormulaires() {
    var selPere = document.getElementById('repro-pere');
    var selMere = document.getElementById('repro-mere');
    var selCage = document.getElementById('repro-cage');
    if (selPere) {
        var h = '<option value="">— Choisir —</option>';
        (typeof baseCheptel !== 'undefined' ? baseCheptel : []).forEach(function (o) {
            if (o.sexe.indexOf('Mâle') >= 0) h += '<option value="' + o.bague + '">' + o.bague + ' — ' + (o.desc || '') + '</option>';
        });
        selPere.innerHTML = h;
    }
    if (selMere) {
        var h2 = '<option value="">— Choisir —</option>';
        (typeof baseCheptel !== 'undefined' ? baseCheptel : []).forEach(function (o) {
            if (o.sexe.indexOf('Femelle') >= 0) h2 += '<option value="' + o.bague + '">' + o.bague + ' — ' + (o.desc || '') + '</option>';
        });
        selMere.innerHTML = h2;
    }
    if (selCage) {
        var valeurActuelle = selCage.value;
        var h3 = '<option value="">— Aucune —</option>';
        (typeof baseCages !== 'undefined' ? baseCages : []).forEach(function (c) {
            var t = typeof typeCageParCode === 'function' ? typeCageParCode(c.type) : null;
            h3 += '<option value="' + c.id + '">' + (t ? t.emoji : '📦') + ' ' + c.nom + '</option>';
        });
        selCage.innerHTML = h3;
        if ((typeof baseCages !== 'undefined' ? baseCages : []).some(function (c) { return c.id === valeurActuelle; })) selCage.value = valeurActuelle;
    }
}

// ============================================
//   CRÉATION / LISTE / FILTRES
// ============================================
function toggleNouvelleReproduction() {
    var panel = document.getElementById('nouvelle-repro-panel');
    if (!panel) return;
    var ouverture = panel.style.display === 'none';
    if (ouverture) mettreAJourListesReproductionFormulaires();
    panel.style.display = ouverture ? 'block' : 'none';
    if (ouverture) {
        var saisonEl = document.getElementById('repro-saison');
        if (saisonEl && !saisonEl.value) saisonEl.value = String(new Date().getFullYear());
    }
}

function creerReproduction() {
    var pereBague = document.getElementById('repro-pere').value;
    var mereBague = document.getElementById('repro-mere').value;
    var saison = document.getElementById('repro-saison').value.trim() || String(new Date().getFullYear());
    var cageId = document.getElementById('repro-cage').value || null;
    var note = document.getElementById('repro-note').value.trim();
    if (!pereBague || !mereBague) { showToast('⚠️ Choisissez un père et une mère', 'warn'); return; }

    var r = {
        id: genererIdReproduction(),
        pereBague: pereBague, mereBague: mereBague,
        saison: saison, etat: 'Prévue',
        cageId: cageId, note: note,
        cageHistorique: [],
        pontes: [],
        dateCreation: new Date().toLocaleDateString('fr-FR'),
        supprime: false
    };
    if (cageId) {
        var cage = (typeof baseCages !== 'undefined' ? baseCages : []).find(function (c) { return c.id === cageId; });
        if (cage) r.cageHistorique.push({ date: new Date().toLocaleDateString('fr-FR'), texte: '📦 Reproduction créée dans "' + cage.nom + '"' });
    }
    baseReproductions.push(r);
    sauvegarderReproductions(baseReproductions);
    document.getElementById('repro-note').value = '';
    toggleNouvelleReproduction();
    afficherReproductions();
    showToast('✅ Reproduction créée', 'info');
}

function reproductionCorrespondFiltres(r) {
    if (r.supprime) return false;
    if (filtreSaisonRepro !== 'Tous' && r.saison !== filtreSaisonRepro) return false;
    if (filtreEtatRepro !== 'Tous' && r.etat !== filtreEtatRepro) return false;
    return true;
}
function filtrerReproParSaison(val) { filtreSaisonRepro = val; afficherReproductions(); }
function filtrerReproParEtat(val)   { filtreEtatRepro = val;   afficherReproductions(); }

function mettreAJourFiltreSaisons() {
    var sel = document.getElementById('filtre-repro-saison');
    if (!sel) return;
    var valeurActuelle = sel.value;
    var saisons = [];
    baseReproductions.forEach(function (r) { if (!r.supprime && saisons.indexOf(r.saison) < 0) saisons.push(r.saison); });
    saisons.sort().reverse();
    var h = '<option value="Tous">Toutes saisons</option>';
    saisons.forEach(function (s) { h += '<option value="' + s + '">' + s + '</option>'; });
    sel.innerHTML = h;
    if (saisons.indexOf(valeurActuelle) >= 0 || valeurActuelle === 'Tous') sel.value = valeurActuelle;
}

function resumePonteReproduction(r) {
    var totalOeufs = 0, totalEclos = 0, totalJeunes = 0;
    r.pontes.forEach(function (p) {
        totalOeufs += p.nombreOeufs || 0;
        totalEclos += p.nombreEclos || 0;
        totalJeunes += p.jeunes.length;
    });
    return { totalOeufs: totalOeufs, totalEclos: totalEclos, totalJeunes: totalJeunes };
}

function afficherReproductions() {
    mettreAJourFiltreSaisons();
    var container = document.getElementById('liste-reproductions');
    if (!container) return;
    var visibles = baseReproductions.filter(reproductionCorrespondFiltres);
    if (!baseReproductions.filter(function (r) { return !r.supprime; }).length) {
        container.innerHTML = '<div style="text-align:center;color:#718096;padding:20px;border:2px dashed #1e3a5f;border-radius:8px;">🥚 Aucune reproduction pour l\'instant.</div>';
    } else if (!visibles.length) {
        container.innerHTML = '<div style="text-align:center;color:#718096;padding:20px;border:2px dashed #1e3a5f;border-radius:8px;">🥚 Aucune reproduction ne correspond à ce filtre.</div>';
    } else {
        var h = '';
        visibles.slice().reverse().forEach(function (r) {
            var res = resumePonteReproduction(r);
            var cage = r.cageId ? (typeof baseCages !== 'undefined' ? baseCages : []).find(function (c) { return c.id === r.cageId; }) : null;
            var couleurEtat = { 'Prévue': '#63b3ed', 'En cours': '#f6ad55', 'Terminée': '#68d391', 'Annulée': '#fc8181' }[r.etat] || '#a0aec0';
            h += '<div class="variety-sheet" style="border-left-color:' + couleurEtat + ';cursor:pointer;" onclick="ouvrirDetailReproduction(\'' + r.id + '\')">';
            h += '<div class="variety-sheet-name">🔵 ' + r.pereBague + ' × 🔴 ' + r.mereBague + '</div>';
            h += '<div class="variety-sheet-info">';
            h += 'Saison ' + r.saison + ' · <span style="color:' + couleurEtat + ';font-weight:bold;">' + r.etat + '</span>';
            if (cage) h += ' · 📦 ' + cage.nom;
            h += '<br>🥚 ' + r.pontes.length + ' ponte(s) · ' + res.totalOeufs + ' œuf(s) · ' + res.totalEclos + ' éclos · ' + res.totalJeunes + ' jeune(s)';
            if (r.note) h += '<br><span style="opacity:0.75;font-style:italic;">📝 ' + r.note + '</span>';
            h += '</div></div>';
        });
        container.innerHTML = h;
    }
}

// ============================================
//   DÉTAIL D'UNE REPRODUCTION
// ============================================
function ouvrirDetailReproduction(id) {
    reproductionEnCoursId = id;
    afficherDetailReproduction();
    document.getElementById('repro-detail-overlay').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function fermerDetailReproduction() {
    document.getElementById('repro-detail-overlay').style.display = 'none';
    reproductionEnCoursId = null;
    afficherReproductions();
}

function changerEtatReproduction(id, etat) {
    var r = trouverReproduction(id);
    if (!r) return;
    r.etat = etat;
    sauvegarderReproductions(baseReproductions);
}
function changerSaisonReproduction(id, saison) {
    var r = trouverReproduction(id);
    if (!r) return;
    r.saison = saison.trim() || r.saison;
    sauvegarderReproductions(baseReproductions);
}
function changerNoteReproduction(id, note) {
    var r = trouverReproduction(id);
    if (!r) return;
    r.note = note;
    sauvegarderReproductions(baseReproductions);
}
function changerCageReproduction(id, nouvelleCageId) {
    var r = trouverReproduction(id);
    if (!r) return;
    var ancienneCage = r.cageId ? (typeof baseCages !== 'undefined' ? baseCages : []).find(function (c) { return c.id === r.cageId; }) : null;
    var nouvelleCage = nouvelleCageId ? (typeof baseCages !== 'undefined' ? baseCages : []).find(function (c) { return c.id === nouvelleCageId; }) : null;
    if ((ancienneCage ? ancienneCage.id : null) === (nouvelleCage ? nouvelleCage.id : null)) return;
    var texte;
    if (nouvelleCage && ancienneCage) texte = '📦 Déplacée de "' + ancienneCage.nom + '" vers "' + nouvelleCage.nom + '"';
    else if (nouvelleCage) texte = '📦 Placée dans "' + nouvelleCage.nom + '"';
    else texte = '📦 Retirée de "' + ancienneCage.nom + '"';
    r.cageId = nouvelleCage ? nouvelleCage.id : null;
    if (!r.cageHistorique) r.cageHistorique = [];
    r.cageHistorique.push({ date: new Date().toLocaleDateString('fr-FR'), texte: texte });
    sauvegarderReproductions(baseReproductions);
    afficherDetailReproduction();
}

function simulerReproduction(id) {
    var r = trouverReproduction(id);
    if (!r) return;
    var pere = (typeof baseCheptel !== 'undefined' ? baseCheptel : []).find(function (o) { return o.bague === r.pereBague; });
    var mere = (typeof baseCheptel !== 'undefined' ? baseCheptel : []).find(function (o) { return o.bague === r.mereBague; });
    if (!pere || !mere) { showToast('⚠️ Parent(s) introuvable(s) dans le Cheptel', 'warn'); return; }
    if (typeof remplirCalculateurDepuisOiseau === 'function') {
        remplirCalculateurDepuisOiseau('m', pere);
        remplirCalculateurDepuisOiseau('f', mere);
    }
    if (typeof definirBagueParent === 'function') { definirBagueParent('m', pere.bague); definirBagueParent('f', mere.bague); }
    var pL = document.getElementById('m-selection'); if (pL) pL.textContent = '✅ ' + pere.bague;
    var fL = document.getElementById('f-selection'); if (fL) fL.textContent = '✅ ' + mere.bague;
    fermerDetailReproduction();
    naviguerVers('page-calc', document.getElementById('btn-nav-calc'));
    if (typeof verifierFacteursLetaux === 'function') verifierFacteursLetaux();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('🧬 Parents chargés — Simulez puis "💾 Sauvegarder" pour lier la prévision à cette reproduction', 'info');
}

function simulationsLieesReproduction(r) {
    if (typeof simulationsSauvegardees === 'undefined' || typeof baguesDeChaine !== 'function') return [];
    return simulationsSauvegardees.filter(function (s) {
        var bagues = baguesDeChaine(s);
        return bagues.indexOf(r.pereBague) >= 0 && bagues.indexOf(r.mereBague) >= 0;
    });
}

// ============================================
//   PONTES
// ============================================
function ajouterPonte(reproId) {
    var r = trouverReproduction(reproId);
    if (!r) return;
    r.pontes.push({
        id: genererIdPonte(), datePonte: todayISO(), nombreOeufs: 0, note: '',
        dateEclosion: '', nombreEclos: 0, jeunes: []
    });
    sauvegarderReproductions(baseReproductions);
    afficherDetailReproduction();
}
function supprimerPonte(reproId, ponteId) {
    var r = trouverReproduction(reproId);
    if (!r) return;
    if (!confirm('Supprimer cette ponte et tous ses jeunes enregistrés ?')) return;
    r.pontes = r.pontes.filter(function (p) { return p.id !== ponteId; });
    sauvegarderReproductions(baseReproductions);
    afficherDetailReproduction();
}
function sauvegarderChampPonte(reproId, ponteId, champ, valeur) {
    var r = trouverReproduction(reproId);
    if (!r) return;
    var p = trouverPonte(r, ponteId);
    if (!p) return;
    if (champ === 'nombreOeufs') p[champ] = parseInt(valeur, 10) || 0;
    else p[champ] = valeur;
    sauvegarderReproductions(baseReproductions);
}
function enregistrerEclosion(reproId, ponteId) {
    var r = trouverReproduction(reproId);
    if (!r) return;
    var p = trouverPonte(r, ponteId);
    if (!p) return;
    var dateInput = document.getElementById('eclosion-date-' + ponteId);
    var nbInput = document.getElementById('eclosion-nb-' + ponteId);
    var date = dateInput ? dateInput.value : '';
    var nb = nbInput ? (parseInt(nbInput.value, 10) || 0) : 0;
    if (!date) { showToast('⚠️ Renseignez la date d\'éclosion', 'warn'); return; }
    p.dateEclosion = date;
    p.nombreEclos = nb;
    for (var i = p.jeunes.length; i < nb; i++) {
        p.jeunes.push({
            id: genererIdJeune(), bague: '', sexe: '', selection: 'Non sélectionné',
            poids: '', notes: '', journal: [], dateSevrage: '', destination: '', cheptelBague: null
        });
    }
    sauvegarderReproductions(baseReproductions);
    afficherDetailReproduction();
    showToast('🐣 Éclosion enregistrée', 'info');
}
function ajouterJeuneManuel(reproId, ponteId) {
    var r = trouverReproduction(reproId);
    if (!r) return;
    var p = trouverPonte(r, ponteId);
    if (!p) return;
    p.jeunes.push({
        id: genererIdJeune(), bague: '', sexe: '', selection: 'Non sélectionné',
        poids: '', notes: '', journal: [], dateSevrage: '', destination: '', cheptelBague: null
    });
    sauvegarderReproductions(baseReproductions);
    afficherDetailReproduction();
}
function supprimerJeune(reproId, ponteId, jeuneId) {
    var r = trouverReproduction(reproId);
    if (!r) return;
    var p = trouverPonte(r, ponteId);
    if (!p) return;
    if (!confirm('Supprimer ce jeune de la reproduction ?')) return;
    p.jeunes = p.jeunes.filter(function (j) { return j.id !== jeuneId; });
    sauvegarderReproductions(baseReproductions);
    afficherDetailReproduction();
}

// ============================================
//   JEUNES — infos, sélection, journal
// ============================================
function sauvegarderChampJeune(reproId, ponteId, jeuneId, champ, valeur) {
    var r = trouverReproduction(reproId);
    if (!r) return;
    var p = trouverPonte(r, ponteId);
    if (!p) return;
    var j = trouverJeune(p, jeuneId);
    if (!j) return;
    j[champ] = valeur;
    sauvegarderReproductions(baseReproductions);
}
function changerSelectionJeune(reproId, ponteId, jeuneId, selection) {
    sauvegarderChampJeune(reproId, ponteId, jeuneId, 'selection', selection);
    afficherDetailReproduction();
}
function ajouterEntreeJournalJeune(reproId, ponteId, jeuneId) {
    var r = trouverReproduction(reproId);
    if (!r) return;
    var p = trouverPonte(r, ponteId);
    if (!p) return;
    var j = trouverJeune(p, jeuneId);
    if (!j) return;
    var input = document.getElementById('journal-jeune-' + jeuneId);
    var texte = input ? input.value.trim() : '';
    if (!texte) { showToast('⚠️ Écrivez une note avant d\'ajouter', 'warn'); return; }
    if (!j.journal) j.journal = [];
    j.journal.push({ date: new Date().toLocaleDateString('fr-FR'), texte: texte });
    sauvegarderReproductions(baseReproductions);
    afficherDetailReproduction();
}
function supprimerEntreeJournalJeune(reproId, ponteId, jeuneId, idx) {
    var r = trouverReproduction(reproId);
    if (!r) return;
    var p = trouverPonte(r, ponteId);
    if (!p) return;
    var j = trouverJeune(p, jeuneId);
    if (!j) return;
    j.journal.splice(idx, 1);
    sauvegarderReproductions(baseReproductions);
    afficherDetailReproduction();
}

// Ajoute le jeune au Cheptel : reprend parents/génétique(si dispo)/date/origine.
// descGenetique (optionnel) : un libellé de résultat pris dans une simulation liée,
// passé à nomVersParams() — même mécanisme que garderJeuneExec() du Calculateur.
function ajouterJeuneAuCheptel(reproId, ponteId, jeuneId) {
    var r = trouverReproduction(reproId);
    if (!r) return;
    var p = trouverPonte(r, ponteId);
    if (!p) return;
    var j = trouverJeune(p, jeuneId);
    if (!j) return;
    if (j.cheptelBague) { showToast('ℹ️ Déjà ajouté au Cheptel (' + j.cheptelBague + ')', 'warn'); return; }

    var bague = j.bague.trim();
    if (!bague) bague = 'FR-' + new Date().getFullYear() + '-JEUNE-' + Math.floor(Math.random() * 10000);
    if ((typeof baseCheptel !== 'undefined' ? baseCheptel : []).some(function (o) { return o.bague.toLowerCase() === bague.toLowerCase(); })) {
        showToast('⚠️ Ce numéro de bague existe déjà dans le Cheptel — modifiez-le puis réessayez', 'warn'); return;
    }
    var sexe = j.sexe || '♂ Mâle';

    var descSelect = document.getElementById('genetique-jeune-' + jeuneId);
    var descChoisie = descSelect ? descSelect.value : '';
    var params = descChoisie ? nomVersParams(descChoisie, sexe) : { base: 'Noir', mutations: [], porteurs: [], plume: 'Intense', fond: 'Jaune' };
    var calc = (typeof calculerDescOiseau === 'function')
        ? calculerDescOiseau(params.base, params.mutations, params.porteurs, params.plume, params.fond)
        : { visuel: params.base, porteur: 'Rien', desc: params.base };

    var oiseau = {
        bague: bague, sexe: sexe, desc: calc.desc, notes: 'Issu de la reproduction ' + r.id + ' (♂ ' + r.pereBague + ' × ♀ ' + r.mereBague + ')',
        statut: 'Acquis', stade: 'Jeune',
        visuel: calc.visuel, porteur: calc.porteur, base: params.base,
        mutations: params.mutations, porteurs: params.porteurs, plume: params.plume, fond: params.fond,
        img: '', galerie: [], cageId: null,
        soins: { poids: j.poids || '', dernierSoin: '', alimentation: '' },
        journal: [{ date: new Date().toLocaleDateString('fr-FR'), texte: '🥚 Ajouté depuis la reproduction ' + r.id }],
        rappels: [], date: new Date().toLocaleDateString('fr-FR')
    };
    baseCheptel.push(oiseau);
    sauvegarderCheptel(baseCheptel);
    if (typeof afficherCheptel === 'function') afficherCheptel();

    j.cheptelBague = bague;
    if (!j.bague) j.bague = bague;
    sauvegarderReproductions(baseReproductions);
    afficherDetailReproduction();
    showToast('✅ ' + bague + ' ajouté au Cheptel', 'info');
}

// ============================================
//   SUPPRESSION / CORBEILLE
// ============================================
function supprimerReproduction(id) {
    if (!confirm('Supprimer cette reproduction ? Elle sera placée dans la corbeille.')) return;
    var r = trouverReproduction(id);
    if (!r) return;
    r.supprime = true;
    sauvegarderReproductions(baseReproductions);
    fermerDetailReproduction();
    afficherReproductions();
    afficherCorbeilleRepro();
    showToast('🗑️ Reproduction déplacée dans la corbeille', 'warn');
}
function restaurerReproduction(id) {
    var r = trouverReproduction(id);
    if (!r) return;
    r.supprime = false;
    sauvegarderReproductions(baseReproductions);
    afficherReproductions();
    afficherCorbeilleRepro();
    showToast('✅ Reproduction restaurée', 'info');
}
function supprimerDefinitivementReproduction(id) {
    if (!confirm('Supprimer définitivement cette reproduction ?\n\nCette action est irréversible.')) return;
    if (!confirm('Confirmez-vous une seconde fois la suppression définitive ?')) return;
    baseReproductions = baseReproductions.filter(function (r) { return r.id !== id; });
    sauvegarderReproductions(baseReproductions);
    afficherCorbeilleRepro();
    showToast('🗑️ Reproduction supprimée définitivement', 'warn');
}
function toggleCorbeilleRepro() {
    var liste = document.getElementById('repro-corbeille-liste');
    var arrow = document.getElementById('repro-corbeille-arrow');
    if (!liste) return;
    if (liste.style.display === 'none') { liste.style.display = 'block'; if (arrow) arrow.textContent = '▲'; afficherCorbeilleRepro(); }
    else { liste.style.display = 'none'; if (arrow) arrow.textContent = '▼'; }
}
function afficherCorbeilleRepro() {
    var container = document.getElementById('repro-corbeille-liste');
    if (!container) return;
    var supprimees = baseReproductions.filter(function (r) { return r.supprime; });
    if (!supprimees.length) { container.innerHTML = '<div style="color:#718096;font-size:0.8rem;">Corbeille vide.</div>'; return; }
    var h = '';
    supprimees.forEach(function (r) {
        h += '<div class="variety-sheet" style="border-left-color:#742a2a;">';
        h += '<div class="variety-sheet-name">🔵 ' + r.pereBague + ' × 🔴 ' + r.mereBague + ' <span style="color:#718096;font-weight:normal;font-size:0.75rem;">(' + r.saison + ')</span></div>';
        h += '<button class="btn-voir" onclick="restaurerReproduction(\'' + r.id + '\')">♻️ Restaurer</button> ';
        h += '<button class="btn-voir" style="background:#742a2a;" onclick="supprimerDefinitivementReproduction(\'' + r.id + '\')">🗑️ Supprimer définitivement</button>';
        h += '</div>';
    });
    container.innerHTML = h;
}

// ============================================
//   RENDU — MODAL DÉTAIL
// ============================================
function afficherDetailReproduction() {
    var r = trouverReproduction(reproductionEnCoursId);
    var container = document.getElementById('repro-detail-contenu');
    if (!r || !container) return;

    var h = '';
    h += '<div style="font-size:1rem;color:#e2e8f0;margin-bottom:8px;"><strong style="color:#63b3ed;">🔵 ' + r.pereBague + '</strong> × <strong style="color:#fc8181;">🔴 ' + r.mereBague + '</strong></div>';

    // Infos éditables
    h += '<label>Saison :</label><input type="text" value="' + r.saison + '" onchange="changerSaisonReproduction(\'' + r.id + '\', this.value)">';
    h += '<label>État :</label><select onchange="changerEtatReproduction(\'' + r.id + '\', this.value)">';
    ETATS_REPRODUCTION.forEach(function (e) { h += '<option value="' + e + '"' + (r.etat === e ? ' selected' : '') + '>' + e + '</option>'; });
    h += '</select>';
    h += '<label>Cage :</label><select id="repro-detail-cage" onchange="changerCageReproduction(\'' + r.id + '\', this.value)"><option value="">— Aucune —</option></select>';
    h += '<label>Note :</label><input type="text" value="' + (r.note || '').replace(/"/g, '&quot;') + '" onchange="changerNoteReproduction(\'' + r.id + '\', this.value)">';

    h += '<button class="btn-add" onclick="simulerReproduction(\'' + r.id + '\')" style="margin-top:10px;">🧬 Ouvrir la Calculatrice avec ces parents</button>';

    // Simulations liées
    var simsLiees = simulationsLieesReproduction(r);
    h += '<div class="cat-bloc" style="margin-top:12px;"><button class="cat-header" onclick="var l=document.getElementById(\'repro-sims-liste\');var a=document.getElementById(\'repro-sims-arrow\');var o=l.style.display===\'none\';l.style.display=o?\'block\':\'none\';a.textContent=o?\'▲\':\'▼\';" style="border-left-color:#805ad5;">';
    h += '<span>🧬 Prévisions génétiques liées</span><span class="cat-count">' + simsLiees.length + '</span><span class="cat-arrow" id="repro-sims-arrow">▼</span></button>';
    h += '<div id="repro-sims-liste" style="display:none;padding:8px;">';
    if (!simsLiees.length) h += '<div style="color:#718096;font-size:0.78rem;">Aucune simulation sauvegardée pour ce couple pour l\'instant.</div>';
    else simsLiees.forEach(function (s) { h += '<div style="padding:6px 0;border-bottom:1px solid #1e3a5f;">' + rendreEtapesChaine(s, true) + '</div>'; });
    h += '</div></div>';

    // Pontes
    h += '<hr style="border-color:#2a5080;margin:14px 0;">';
    h += '<strong style="color:#f5d020;font-size:0.9rem;">🥚 Pontes (' + r.pontes.length + ')</strong>';
    r.pontes.forEach(function (p) { h += rendrePonte(r, p); });
    h += '<button class="btn-add" onclick="ajouterPonte(\'' + r.id + '\')" style="margin-top:8px;">➕ Nouvelle ponte</button>';

    h += '<hr style="border-color:#2a5080;margin:14px 0;">';
    h += '<button class="btn-voir" style="background:#742a2a;width:100%;text-align:center;" onclick="supprimerReproduction(\'' + r.id + '\')">🗑️ Supprimer cette reproduction</button>';

    container.innerHTML = h;

    // Repeuple le select cage après innerHTML (évite de casser la sélection courante)
    var selCage = document.getElementById('repro-detail-cage');
    if (selCage) {
        var hc = '<option value="">— Aucune —</option>';
        (typeof baseCages !== 'undefined' ? baseCages : []).forEach(function (c) {
            var t = typeof typeCageParCode === 'function' ? typeCageParCode(c.type) : null;
            hc += '<option value="' + c.id + '"' + (r.cageId === c.id ? ' selected' : '') + '>' + (t ? t.emoji : '📦') + ' ' + c.nom + '</option>';
        });
        selCage.innerHTML = hc;
    }
}

function rendrePonte(r, p) {
    var h = '<div style="background:#0f2035;border:1px solid #1e3a5f;border-radius:6px;padding:10px;margin:8px 0;">';
    h += '<label style="margin-top:0;">📅 Date de ponte :</label><input type="date" value="' + p.datePonte + '" onchange="sauvegarderChampPonte(\'' + r.id + '\',\'' + p.id + '\',\'datePonte\',this.value)">';
    h += '<label>🥚 Nombre d\'œufs :</label><input type="number" min="0" value="' + p.nombreOeufs + '" onchange="sauvegarderChampPonte(\'' + r.id + '\',\'' + p.id + '\',\'nombreOeufs\',this.value)">';
    h += '<label>Note :</label><input type="text" value="' + (p.note || '').replace(/"/g, '&quot;') + '" onchange="sauvegarderChampPonte(\'' + r.id + '\',\'' + p.id + '\',\'note\',this.value)">';

    if (!p.dateEclosion) {
        h += '<div style="margin-top:8px;padding:8px;background:#0a1520;border-radius:6px;">';
        h += '<label style="margin-top:0;">🐣 Date d\'éclosion :</label><input type="date" id="eclosion-date-' + p.id + '">';
        h += '<label>Nombre d\'œufs éclos :</label><input type="number" min="0" id="eclosion-nb-' + p.id + '">';
        h += '<button class="btn-add" style="margin-top:6px;" onclick="enregistrerEclosion(\'' + r.id + '\',\'' + p.id + '\')">✅ Enregistrer l\'éclosion</button>';
        h += '</div>';
    } else {
        h += '<div style="font-size:0.82rem;color:#68d391;margin-top:6px;">🐣 Éclos le ' + p.dateEclosion.split('-').reverse().join('/') + ' — ' + p.nombreEclos + ' jeune(s)</div>';
    }

    if (p.jeunes.length) {
        h += '<div style="margin-top:8px;"><strong style="color:#f5d020;font-size:0.85rem;">👶 Jeunes (' + p.jeunes.length + ')</strong></div>';
        p.jeunes.forEach(function (j) { h += rendreJeune(r, p, j); });
    }
    if (p.dateEclosion) h += '<button class="btn-voir" onclick="ajouterJeuneManuel(\'' + r.id + '\',\'' + p.id + '\')" style="margin-top:6px;">➕ Ajouter un jeune manuellement</button> ';
    h += '<button class="btn-voir" style="background:#742a2a;" onclick="supprimerPonte(\'' + r.id + '\',\'' + p.id + '\')">🗑️ Supprimer la ponte</button>';
    h += '</div>';
    return h;
}

function rendreJeune(r, p, j) {
    var selectionInfo = SELECTIONS_JEUNE.find(function (s) { return s.nom === j.selection; }) || SELECTIONS_JEUNE[0];
    var h = '<div style="background:#0a1520;border-left:3px solid #2a5080;border-radius:0 6px 6px 0;padding:8px;margin:6px 0;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;">';
    h += '<strong style="color:#f5d020;">' + selectionInfo.emoji + ' ' + (j.bague || 'Sans bague') + '</strong>';
    h += '<button onclick="supprimerJeune(\'' + r.id + '\',\'' + p.id + '\',\'' + j.id + '\')" style="background:none;border:none;color:#718096;cursor:pointer;">✕</button>';
    h += '</div>';

    h += '<label style="margin-top:6px;">Sélection :</label><select onchange="changerSelectionJeune(\'' + r.id + '\',\'' + p.id + '\',\'' + j.id + '\',this.value)">';
    SELECTIONS_JEUNE.forEach(function (s) { h += '<option value="' + s.nom + '"' + (j.selection === s.nom ? ' selected' : '') + '>' + s.emoji + ' ' + s.nom + '</option>'; });
    h += '</select>';

    h += '<label>Numéro de bague :</label><input type="text" value="' + (j.bague || '').replace(/"/g, '&quot;') + '" onchange="sauvegarderChampJeune(\'' + r.id + '\',\'' + p.id + '\',\'' + j.id + '\',\'bague\',this.value)">';
    h += '<label>Sexe :</label><select onchange="sauvegarderChampJeune(\'' + r.id + '\',\'' + p.id + '\',\'' + j.id + '\',\'sexe\',this.value)">';
    h += '<option value=""' + (!j.sexe ? ' selected' : '') + '>— Inconnu —</option>';
    h += '<option value="♂ Mâle"' + (j.sexe === '♂ Mâle' ? ' selected' : '') + '>♂ Mâle</option>';
    h += '<option value="♀ Femelle"' + (j.sexe === '♀ Femelle' ? ' selected' : '') + '>♀ Femelle</option>';
    h += '</select>';
    h += '<label>Poids :</label><input type="text" value="' + (j.poids || '').replace(/"/g, '&quot;') + '" placeholder="Ex : 16g" onchange="sauvegarderChampJeune(\'' + r.id + '\',\'' + p.id + '\',\'' + j.id + '\',\'poids\',this.value)">';
    h += '<label>Date de sevrage :</label><input type="date" value="' + (j.dateSevrage || '') + '" onchange="sauvegarderChampJeune(\'' + r.id + '\',\'' + p.id + '\',\'' + j.id + '\',\'dateSevrage\',this.value)">';
    h += '<label>Destination :</label><input type="text" value="' + (j.destination || '').replace(/"/g, '&quot;') + '" placeholder="Ex : gardé / vendu à..." onchange="sauvegarderChampJeune(\'' + r.id + '\',\'' + p.id + '\',\'' + j.id + '\',\'destination\',this.value)">';

    // Journal
    h += '<div style="margin-top:6px;font-size:0.78rem;">';
    (j.journal || []).slice().reverse().forEach(function (entree, i) {
        var idxReel = j.journal.length - 1 - i;
        h += '<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #1e3a5f;">';
        h += '<span><strong style="color:#f5d020;">' + entree.date + '</strong> — ' + entree.texte + '</span>';
        h += '<button onclick="supprimerEntreeJournalJeune(\'' + r.id + '\',\'' + p.id + '\',\'' + j.id + '\',' + idxReel + ')" style="background:none;border:none;color:#718096;cursor:pointer;">✕</button></div>';
    });
    h += '</div>';
    h += '<div style="display:flex;gap:6px;margin-top:4px;">';
    h += '<input type="text" id="journal-jeune-' + j.id + '" placeholder="Observation..." style="flex:1;">';
    h += '<button onclick="ajouterEntreeJournalJeune(\'' + r.id + '\',\'' + p.id + '\',\'' + j.id + '\')" style="padding:6px 10px;background:#f5d020;color:#0d1b2a;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">➕</button>';
    h += '</div>';

    // Ajout au Cheptel
    if (j.cheptelBague) {
        h += '<div style="margin-top:6px;color:#68d391;font-size:0.78rem;">✅ Dans le Cheptel : ' + j.cheptelBague + '</div>';
    } else {
        var simsLiees = simulationsLieesReproduction(r);
        var labels = [];
        simsLiees.forEach(function (s) {
            var derniere = s.etapes[s.etapes.length - 1];
            (j.sexe === '♀ Femelle' ? derniere.resF : (j.sexe === '♂ Mâle' ? derniere.resM : derniere.resM.concat(derniere.resF))).forEach(function (res) {
                var label = res.nom + (res.plume ? ' · ' + res.plume : '') + (res.fond ? ' · ' + res.fond : '');
                if (labels.indexOf(label) < 0) labels.push(label);
            });
        });
        if (labels.length) {
            h += '<label style="margin-top:6px;">🧬 Génétique (depuis une simulation liée) :</label>';
            h += '<select id="genetique-jeune-' + j.id + '"><option value="">— Non renseignée —</option>';
            labels.forEach(function (l) { h += '<option value="' + l.replace(/"/g, '&quot;') + '">' + l + '</option>'; });
            h += '</select>';
        }
        h += '<button class="btn-add" style="margin-top:6px;" onclick="ajouterJeuneAuCheptel(\'' + r.id + '\',\'' + p.id + '\',\'' + j.id + '\')">📥 Ajouter au Cheptel</button>';
    }

    h += '</div>';
    return h;
}

// ============================================
//   INIT
// ============================================
window.addEventListener('load', function () {
    baseReproductions = chargerReproductions();
    afficherReproductions();
    mettreAJourListesReproductionFormulaires();
});
