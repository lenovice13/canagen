// ============================================
//   CAGES.JS — Gestion des Cages (V1, Couleur uniquement)
// ============================================
var baseCages = [];

// Dimensions de référence des assets visuels (px), voir images/cages/.
// Ajuste ces 3 valeurs si de nouveaux assets ont une autre taille native.
var CAGE_TILE_W = 448;
var CAGE_TILE_H = 266;
var CAGE_MONT_W = 16;

function toggleGestionCages() {
    var panel = document.getElementById('cages-panel');
    var arrow = document.getElementById('cages-arrow');
    if (!panel) return;
    if (panel.style.display === 'none') { panel.style.display = 'block'; if (arrow) arrow.textContent = '▲'; afficherCages(); }
    else { panel.style.display = 'none'; if (arrow) arrow.textContent = '▼'; }
}

function toggleAjoutCage() {
    var panel = document.getElementById('ajout-cage-panel');
    if (!panel) return;
    panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
}

// Affiche/masque le champ "nombre de cases", utile seulement pour le modèle batterie.
// Affiche/masque les champs liés au modèle choisi : disposition (double)
// ou cases-par-niveau + niveaux (batterie).
// Tableau de travail utilisé pendant la construction du formulaire de
// création (mode "batterie" libre) : un nombre par niveau, aucune limite.
var nouvelleCageNiveaux = [4, 4];

function onChangeModeleCage() {
    var modeleEl = document.getElementById('nouvelle-cage-modele');
    var champDouble = document.getElementById('champ-disposition-double');
    var champBatterie = document.getElementById('champ-batterie-niveaux');
    if (!modeleEl) return;
    if (champDouble) champDouble.style.display = (modeleEl.value === 'double') ? 'block' : 'none';
    if (champBatterie) champBatterie.style.display = (modeleEl.value === 'batterie') ? 'block' : 'none';
    if (modeleEl.value === 'batterie') afficherNiveauxForm();
}

function ajouterNiveauForm() {
    nouvelleCageNiveaux.push(nouvelleCageNiveaux.length ? nouvelleCageNiveaux[nouvelleCageNiveaux.length - 1] : 4);
    afficherNiveauxForm();
}
function supprimerNiveauForm(index) {
    if (nouvelleCageNiveaux.length <= 1) { showToast('⚠️ Il faut au moins un niveau', 'warn'); return; }
    nouvelleCageNiveaux.splice(index, 1);
    afficherNiveauxForm();
}
function modifierNiveauForm(index, valeur) {
    var n = parseInt(valeur, 10);
    nouvelleCageNiveaux[index] = (n && n > 0) ? n : 1;
}
function afficherNiveauxForm() {
    var zone = document.getElementById('nouvelle-cage-niveaux-liste');
    if (!zone) return;
    var h = '';
    nouvelleCageNiveaux.forEach(function(n, i) {
        h += '<div class="cv-niveau-form-row">'
           + '<span>Niveau ' + (i + 1) + ' :</span>'
           + '<input type="number" min="1" value="' + n + '" onchange="modifierNiveauForm(' + i + ', this.value)" style="width:64px;display:inline-block;">'
           + ' cases'
           + '<button type="button" class="cv-niveau-form-del" onclick="supprimerNiveauForm(' + i + ')" title="Retirer ce niveau">✕</button>'
           + '</div>';
    });
    zone.innerHTML = h;
}

function typeCageParCode(code) {
    return TYPES_CAGE.find(function(t) { return t.code === code; }) || null;
}

// Une cage est "hors saison" si son type a une saison idéale définie et que
// le mois actuel n'en fait pas partie. Types sans saison (Quarantaine,
// Infirmerie, Transport) ne déclenchent jamais d'alerte.
function cageHorsSaison(cage) {
    var t = typeCageParCode(cage.type);
    if (!t || !t.saisonIdeale.length) return false;
    var moisActuel = new Date().getMonth() + 1;
    return t.saisonIdeale.indexOf(moisActuel) === -1;
}

function ajouterCage() {
    var nomEl = document.getElementById('nouvelle-cage-nom');
    var typeEl = document.getElementById('nouvelle-cage-type');
    var modeleEl = document.getElementById('nouvelle-cage-modele');
    var dispoDoubleEl = document.getElementById('nouvelle-cage-disposition-double');
    var nom = nomEl.value.trim();
    if (!nom) { showToast('⚠️ Donnez un nom à la cage', 'warn'); return; }
    if (baseCages.some(function(c) { return c.nom.toLowerCase() === nom.toLowerCase(); })) {
        showToast('⚠️ Une cage porte déjà ce nom', 'warn'); return;
    }

    var modele = modeleEl ? modeleEl.value : 'simple';
    var niveaux;

    if (modele === 'simple') {
        niveaux = [1];
    } else if (modele === 'double') {
        // en enfilade = 2 cases côte à côte sur 1 niveau ; superposé = 1 case sur 2 niveaux empilés
        var dispo = dispoDoubleEl ? dispoDoubleEl.value : 'enfilade';
        niveaux = (dispo === 'superpose') ? [1, 1] : [2];
    } else if (modele === 'batterie') {
        // niveaux libres, sans limite (voir 06_Cages.md §24-25)
        niveaux = nouvelleCageNiveaux.slice().filter(function(n) { return n > 0; });
        if (!niveaux.length) niveaux = [4];
    } else {
        niveaux = [1];
    }

    var separateursActifs = niveaux.map(function(n) {
        return new Array(Math.max(0, n - 1)).fill(true);
    });

    baseCages.push({
        id: 'cage-' + Date.now(),
        nom: nom,
        type: typeEl.value,
        modele: modele,
        niveaux: niveaux,
        nombreCases: niveaux.reduce(function(a, b) { return a + b; }, 0),
        separateursActifs: separateursActifs
    });
    sauvegarderCages(baseCages);
    nomEl.value = '';
    nouvelleCageNiveaux = [4, 4];
    toggleAjoutCage();
    afficherCages();
    mettreAJourListesCagesFormulaires();
    showToast('✅ Cage "' + nom + '" créée', 'info');
}

function supprimerCage(id) {
    var cage = baseCages.find(function(c) { return c.id === id; });
    if (!cage) return;
    var occupants = baseCheptel.filter(function(o) { return o.cageId === id; });
    if (occupants.length && !confirm('Cette cage contient ' + occupants.length + ' oiseau(x). Les retirer et supprimer la cage "' + cage.nom + '" ?')) return;
    else if (!occupants.length && !confirm('Supprimer la cage "' + cage.nom + '" ?')) return;
    occupants.forEach(function(o) { o.cageId = null; o.caseIndex = null; });
    if (occupants.length) sauvegarderCheptel(baseCheptel);
    baseCages = baseCages.filter(function(c) { return c.id !== id; });
    sauvegarderCages(baseCages);
    afficherCages();
    mettreAJourListesCagesFormulaires();
}

// Active/désactive le séparateur entre deux cases adjacentes d'un même
// niveau (jonctionIndex1Based = 1 -> séparateur entre case 1 et case 2 DU
// NIVEAU). Chaque niveau a ses propres séparateurs, indépendants des autres.
function toggleSeparateurCage(cageId, niveauIndex, jonctionIndex1Based) {
    var cage = baseCages.find(function(c) { return c.id === cageId; });
    if (!cage || !cage.separateursActifs || !cage.separateursActifs[niveauIndex]) return;
    var i = jonctionIndex1Based - 1;
    var sepNiveau = cage.separateursActifs[niveauIndex];
    if (i < 0 || i >= sepNiveau.length) return;

    var offsetNiv = (cage.niveaux || []).slice(0, niveauIndex).reduce(function(a, b) { return a + b; }, 0);
    var idxGlobalGauche = offsetNiv + (jonctionIndex1Based - 1);
    var idxGlobalDroite = offsetNiv + jonctionIndex1Based;

    var activeActuellement = sepNiveau[i] !== false;
    if (activeActuellement) {
        var occLeft = baseCheptel.some(function(o) { return o.cageId === cageId && o.caseIndex === idxGlobalGauche; });
        var occRight = baseCheptel.some(function(o) { return o.cageId === cageId && o.caseIndex === idxGlobalDroite; });
        if (occLeft && occRight) {
            if (!confirm('Les deux cases contiennent chacune un oiseau. Fusionner quand même cet espace ?')) return;
        }
    }
    sepNiveau[i] = !activeActuellement;
    sauvegarderCages(baseCages);
    afficherCages();
}

// Change la cage (et la case précise) d'un oiseau, et journalise automatiquement
// le déplacement dans son journal individuel.
function assignerCageOiseau(idxOiseau, nouvelleCageId, nouvelleCaseIndex) {
    var o = baseCheptel[idxOiseau];
    if (!o) return;
    if (typeof nouvelleCaseIndex === 'undefined') nouvelleCaseIndex = 0;

    var ancienneCage = o.cageId ? baseCages.find(function(c) { return c.id === o.cageId; }) : null;
    var nouvelleCage = nouvelleCageId ? baseCages.find(function(c) { return c.id === nouvelleCageId; }) : null;
    var memeCage = (ancienneCage ? ancienneCage.id : null) === (nouvelleCage ? nouvelleCage.id : null);
    var memeCase = memeCage && (o.caseIndex || 0) === nouvelleCaseIndex;
    if (memeCage && memeCase) return;

    var texte;
    if (nouvelleCage && ancienneCage) {
        var tOld = typeCageParCode(ancienneCage.type), tNew = typeCageParCode(nouvelleCage.type);
        texte = '📦 Déplacé de "' + ancienneCage.nom + '" (' + (tOld ? tOld.nom : ancienneCage.type) + ') vers "' + nouvelleCage.nom + '" (' + (tNew ? tNew.nom : nouvelleCage.type) + ')';
    } else if (nouvelleCage) {
        var tNew2 = typeCageParCode(nouvelleCage.type);
        texte = '📦 Placé dans "' + nouvelleCage.nom + '" (' + (tNew2 ? tNew2.nom : nouvelleCage.type) + ')';
        if (nouvelleCage.nombreCases > 1) texte += ' — case ' + (nouvelleCaseIndex + 1);
    } else {
        texte = '📦 Retiré de "' + ancienneCage.nom + '"';
    }

    o.cageId = nouvelleCage ? nouvelleCage.id : null;
    o.caseIndex = nouvelleCage ? nouvelleCaseIndex : null;
    if (!o.journal) o.journal = [];
    o.journal.push({ date: new Date().toLocaleDateString('fr-FR'), texte: texte });
    sauvegarderCheptel(baseCheptel);
    afficherCages();
    if (typeof afficherJournalFiche === 'function') afficherJournalFiche();
}

// ============================================
//   RENDU VISUEL D'UNE CAGE / BATTERIE (multi-niveaux, échelle libre)
// ============================================
var CAGE_GAP_NIVEAU = 0; // niveaux empilés directement, comme un vrai meuble

var ACCESSOIRES_DISPO = [
    { code: 'perchoir',  emoji: '🪶', nom: 'Perchoir' },
    { code: 'mangeoir',  emoji: '🌾', nom: 'Mangeoire' },
    { code: 'abreuvoir', emoji: '💧', nom: 'Abreuvoir' },
    { code: 'nid',       emoji: '🪺', nom: 'Nid' }
];

// Accessoires actifs pour une case donnée (clé = index global de la case
// représentative du groupe). Par défaut : perchoir + mangeoire + abreuvoir
// (le nid est optionnel, à ajouter manuellement).
function accessoiresCase(cage, idxGlobal) {
    var stock = (cage.accessoiresParCase && cage.accessoiresParCase[idxGlobal]);
    if (stock) return stock;
    return { perchoir: true, mangeoir: true, abreuvoir: true, nid: false };
}

function toggleAccessoireCase(cageId, idxGlobal, code) {
    var cage = baseCages.find(function(c) { return c.id === cageId; });
    if (!cage) return;
    if (!cage.accessoiresParCase) cage.accessoiresParCase = {};
    var actuel = accessoiresCase(cage, idxGlobal);
    var copie = { perchoir: actuel.perchoir, mangeoir: actuel.mangeoir, abreuvoir: actuel.abreuvoir, nid: actuel.nid };
    copie[code] = !copie[code];
    cage.accessoiresParCase[idxGlobal] = copie;
    sauvegarderCages(baseCages);
    afficherCages();
}

// Inverse le côté (gauche/droite) de la mangeoire et de l'abreuvoir pour une
// case — interprétation pratique de "pouvoir déplacer les accessoires" sans
// glisser-déposer (non disponible en JS vanilla sans librairie).
function inverserCotesCase(cageId, idxGlobal) {
    var cage = baseCages.find(function(c) { return c.id === cageId; });
    if (!cage) return;
    if (!cage.cotesInverses) cage.cotesInverses = {};
    cage.cotesInverses[idxGlobal] = !cage.cotesInverses[idxGlobal];
    sauvegarderCages(baseCages);
    afficherCages();
}

function construireVisuelCage(cage) {
    var niveaux = cage.niveaux || [cage.casesParNiveau || cage.nombreCases || 1];
    var largeurMaxCases = Math.max.apply(null, niveaux);
    var groupes = casesEffectivesCage(cage);
    var totalW = CAGE_MONT_W * 2 + largeurMaxCases * CAGE_TILE_W;
    var totalH = niveaux.length * CAGE_TILE_H + (niveaux.length - 1) * CAGE_GAP_NIVEAU;
    var html = '<div class="cage-visuelle" style="width:' + totalW + 'px;height:' + totalH + 'px;">';

    var offsetGlobal = 0;
    for (var niv = 0; niv < niveaux.length; niv++) {
        var casesCeNiveau = niveaux[niv];
        var yNiv = niv * (CAGE_TILE_H + CAGE_GAP_NIVEAU);
        var sepNiveau = (cage.separateursActifs && cage.separateursActifs[niv]) || [];

        html += '<img class="cv-struct" src="images/cages/montant_G.png" style="left:0;top:' + yNiv + 'px;width:' + CAGE_MONT_W + 'px;height:' + CAGE_TILE_H + 'px;">';
        for (var i = 0; i < casesCeNiveau; i++) {
            var x = CAGE_MONT_W + i * CAGE_TILE_W;
            html += '<img class="cv-struct" src="images/cages/grille.png" style="left:' + x + 'px;top:' + yNiv + 'px;width:' + CAGE_TILE_W + 'px;height:' + CAGE_TILE_H + 'px;">';
            html += '<img class="cv-struct" src="images/cages/traverse.png" style="left:' + x + 'px;top:' + yNiv + 'px;width:' + CAGE_TILE_W + 'px;height:' + CAGE_TILE_H + 'px;">';
            html += '<img class="cv-struct" src="images/cages/tiroir.png" style="left:' + x + 'px;top:' + yNiv + 'px;width:' + CAGE_TILE_W + 'px;height:' + CAGE_TILE_H + 'px;">';
            if (i > 0) {
                var actif = (sepNiveau[i - 1] !== false);
                if (actif) {
                    html += '<img class="cv-struct cv-separateur" src="images/cages/separateur.png"'
                          + ' style="left:' + (x - 10) + 'px;top:' + yNiv + 'px;width:20px;height:' + CAGE_TILE_H + 'px;cursor:pointer;" title="Cliquer pour fusionner avec la case precedente"'
                          + ' onclick="toggleSeparateurCage(\'' + cage.id + '\', ' + niv + ', ' + i + ')">';
                } else {
                    html += '<div class="cv-rejoindre" style="left:' + (x - 10) + 'px;top:' + yNiv + 'px;width:20px;height:' + CAGE_TILE_H + 'px;"'
                          + ' title="Cliquer pour re-separer" onclick="toggleSeparateurCage(\'' + cage.id + '\', ' + niv + ', ' + i + ')"></div>';
                }
            }
        }
        html += '<img class="cv-struct" src="images/cages/montant_D.png" style="left:' + (CAGE_MONT_W + casesCeNiveau * CAGE_TILE_W) + 'px;top:' + yNiv + 'px;width:' + CAGE_MONT_W + 'px;height:' + CAGE_TILE_H + 'px;">';
        offsetGlobal += casesCeNiveau;
    }

    groupes.forEach(function(groupe) {
        var yGroupe = groupe.niveau * (CAGE_TILE_H + CAGE_GAP_NIVEAU);
        var offsetNiv = niveaux.slice(0, groupe.niveau).reduce(function(a, b) { return a + b; }, 0);
        var localStart = groupe.indices[0] - offsetNiv;
        var xGroupe = CAGE_MONT_W + localStart * CAGE_TILE_W;
        var wGroupe = groupe.indices.length * CAGE_TILE_W;
        var idxRepresentant = groupe.indices[0];
        var acc = accessoiresCase(cage, idxRepresentant);
        var cotesInv = cage.cotesInverses && cage.cotesInverses[idxRepresentant];
        var xMangeoir = cotesInv ? (xGroupe + wGroupe - 84) : (xGroupe + 20);
        var xAbreuvoir = cotesInv ? (xGroupe + 20) : (xGroupe + wGroupe - 60);

        var occupants = baseCheptel
            .map(function(o, idx) { return { o: o, idx: idx }; })
            .filter(function(x) { return x.o.cageId === cage.id && groupe.indices.indexOf(x.o.caseIndex || 0) !== -1; });

        if (acc.perchoir) {
            html += '<img class="cv-acc" src="images/cages/perchoir.png" style="left:' + (xGroupe + 36) + 'px;top:' + (yGroupe + 119) + 'px;width:17px;height:17px;">';
            html += '<img class="cv-acc" src="images/cages/perchoir.png" style="left:' + (xGroupe + wGroupe - 53) + 'px;top:' + (yGroupe + 119) + 'px;width:17px;height:17px;">';
        }
        if (acc.mangeoir) html += '<img class="cv-acc" src="images/cages/mangeoir.png" style="left:' + xMangeoir + 'px;top:' + (yGroupe + 182) + 'px;width:64px;height:47px;">';
        if (acc.abreuvoir) html += '<img class="cv-acc" src="images/cages/abreuvoir.png" style="left:' + xAbreuvoir + 'px;top:' + (yGroupe + 153) + 'px;width:32px;height:60px;">';
        if (acc.nid) html += '<img class="cv-acc" src="images/cages/nid.png" style="left:' + (xGroupe + wGroupe / 2 - 31) + 'px;top:' + (yGroupe + 90) + 'px;width:62px;height:46px;">';

        html += '<div class="cv-etiquette" style="left:' + (xGroupe + 6) + 'px;top:' + (yGroupe + 6) + 'px;width:' + (wGroupe - 12) + 'px;">';
        html += '<div onclick="ouvrirSelecteurCaseDepuisVisuel(\'' + cage.id + '\', ' + groupe.indices[0] + ')">';
        if (occupants.length) {
            occupants.forEach(function(x) {
                html += '<div class="cv-oiseau">🐦 ' + (x.o.bague || 'Sans bague') + ' ' + (x.o.sexe ? x.o.sexe.charAt(0) : '?') + '</div>';
            });
        } else {
            html += '<div class="cv-oiseau cv-vide">Vide</div>';
        }
        html += '</div>';
        html += '<div class="cv-toolbar">';
        ACCESSOIRES_DISPO.forEach(function(a) {
            html += '<span class="cv-acc-toggle' + (acc[a.code] ? ' actif' : '') + '" title="' + a.nom + '"'
                  + ' onclick="event.stopPropagation();toggleAccessoireCase(\'' + cage.id + '\', ' + idxRepresentant + ', \'' + a.code + '\')">' + a.emoji + '</span>';
        });
        html += '<span class="cv-acc-toggle" title="Inverser mangeoire/abreuvoir"'
              + ' onclick="event.stopPropagation();inverserCotesCase(\'' + cage.id + '\', ' + idxRepresentant + ')">🔄</span>';
        html += '</div>';
        html += '</div>';
    });

    html += '</div>';
    return html;
}

// Ajuste l'échelle d'affichage de chaque cage pour qu'elle tienne dans la
// largeur de son conteneur (utile sur mobile où 448px/case est trop large).
// Ne grossit jamais au-delà de la taille native (scale max = 1).
function ajusterEchelleCages() {
    document.querySelectorAll('.cv-scale-wrap').forEach(function(wrap) {
        var inner = wrap.querySelector('.cage-visuelle');
        if (!inner) return;
        var natW = parseFloat(inner.style.width);
        var natH = parseFloat(inner.style.height);
        if (!natW || !natH) return;
        var dispoW = wrap.clientWidth || natW;
        var echelle = Math.min(1, dispoW / natW) * 0.99; // marge de securite anti-arrondi
        inner.style.transform = 'scale(' + echelle + ')';
        inner.style.transformOrigin = 'top left';
        wrap.style.height = (natH * echelle) + 'px';
    });
}
window.addEventListener('resize', ajusterEchelleCages);


function afficherCages() {
    var container = document.getElementById('cages-liste');
    var alertes = document.getElementById('cages-alertes');
    if (!container) return;

    if (!baseCages.length) {
        container.innerHTML = '<p style="font-size:0.8rem;color:#718096;padding:6px;">Aucune cage créée pour l\'instant.</p>';
        if (alertes) alertes.innerHTML = '';
        return;
    }

    var horsSaison = [];
    var h = '';
    baseCages.forEach(function(cage) {
        var t = typeCageParCode(cage.type);
        var occupantsTotal = baseCheptel.filter(function(o) { return o.cageId === cage.id; });
        var enAlerte = cageHorsSaison(cage) && occupantsTotal.length > 0;
        if (enAlerte) horsSaison.push({ cage: cage, t: t });

        h += '<div class="variety-sheet" style="border-left-color:' + (enAlerte ? '#f6ad55' : '#2a5080') + ';">';
        h += '<div class="variety-sheet-name">' + (t ? t.emoji : '📦') + ' ' + cage.nom + ' <span style="color:#718096;font-weight:normal;font-size:0.75rem;">(' + (t ? t.nom : cage.type) + ')</span></div>';

        h += '<div class="cv-scroll"><div class="cv-scale-wrap">' + construireVisuelCage(cage) + '</div></div>';

        if (enAlerte) h += '<div class="fiche-note">⚠️ Hors saison habituelle pour ce type de cage (' + (t ? t.nom : '') + ')</div>';
        h += '<button class="btn-voir" style="margin-top:4px;background:#742a2a;" onclick="supprimerCage(\'' + cage.id + '\')">🗑️ Supprimer la cage</button>';
        h += '</div>';
    });
    container.innerHTML = h;
    ajusterEchelleCages();

    if (alertes) {
        if (horsSaison.length) {
            var texteAlerte = '⚠️ ' + horsSaison.length + ' cage(s) semble(nt) hors saison : ' + horsSaison.map(function(x) { return x.cage.nom; }).join(', ') + '. Vérifie si un déplacement est nécessaire.';
            alertes.innerHTML = '<div class="fiche-note" style="margin-bottom:8px;">' + texteAlerte + '</div>';
        } else {
            alertes.innerHTML = '';
        }
    }
}

// Remplit les listes déroulantes "Cage actuelle" du formulaire d'ajout et de
// la fiche d'édition. Une deuxième zone ("case") se met à jour dynamiquement
// selon la cage choisie.
function mettreAJourListesCagesFormulaires() {
    ['add-cage', 'fiche-cage'].forEach(function(selectId) {
        var sel = document.getElementById(selectId);
        if (!sel) return;
        var valeurActuelle = sel.value;
        var h = '<option value="">— Aucune —</option>';
        baseCages.forEach(function(cage) {
            var t = typeCageParCode(cage.type);
            h += '<option value="' + cage.id + '">' + (t ? t.emoji : '📦') + ' ' + cage.nom + '</option>';
        });
        sel.innerHTML = h;
        if (baseCages.some(function(c) { return c.id === valeurActuelle; })) sel.value = valeurActuelle;
        var prefix = selectId === 'add-cage' ? 'add' : 'fiche';
        afficherSelecteurCase(prefix);
    });
}

// Construit la liste des cases disponibles (groupes effectifs) pour la cage
// actuellement choisie dans le select #<prefix>-cage, sous forme de boutons.
function afficherSelecteurCase(prefix) {
    var selCage = document.getElementById(prefix + '-cage');
    var zone = document.getElementById(prefix + '-case-selector');
    var inputCase = document.getElementById(prefix + '-case');
    if (!selCage || !zone || !inputCase) return;

    var cage = baseCages.find(function(c) { return c.id === selCage.value; });
    if (!cage || cage.nombreCases <= 1) {
        zone.innerHTML = '';
        zone.style.display = 'none';
        inputCase.value = '0';
        return;
    }

    var groupes = casesEffectivesCage(cage);
    var groupeSelectionne = groupes.find(function(g) { return String(g.indices[0]) === inputCase.value; }) || groupes[0];
    var h = '<div class="cv-emplacement-actuel">📍 Emplacement actuel : <b>Case ' + libelleGroupeCases(groupeSelectionne) + '</b></div>';
    h += '<label>Choisir un emplacement :</label><div class="cv-case-boutons">';
    var dernierNiveau = -1;
    groupes.forEach(function(groupe) {
        if (cage.niveaux && cage.niveaux.length > 1 && groupe.niveau !== dernierNiveau) {
            h += '<span class="cv-niveau-sep">niv. ' + (groupe.niveau + 1) + '</span>';
            dernierNiveau = groupe.niveau;
        }
        var occupe = baseCheptel.some(function(o) { return o.cageId === cage.id && groupe.indices.indexOf(o.caseIndex || 0) !== -1; });
        var selected = String(groupe.indices[0]) === inputCase.value;
        h += '<button type="button" class="cv-case-btn' + (selected ? ' selected' : '') + (occupe ? ' occupee' : '') + '"'
           + ' onclick="choisirCase(\'' + prefix + '\', ' + groupe.indices[0] + ')">' + libelleGroupeCases(groupe) + '</button>';
    });
    h += '</div>';
    zone.innerHTML = h;
    zone.style.display = 'block';
    if (!groupes.some(function(g) { return String(g.indices[0]) === inputCase.value; })) {
        inputCase.value = String(groupes[0].indices[0]);
    }
}

function choisirCase(prefix, caseIndex) {
    var inputCase = document.getElementById(prefix + '-case');
    if (inputCase) inputCase.value = String(caseIndex);
    afficherSelecteurCase(prefix);
    // Dans la fiche d'un oiseau existant, l'affectation est immédiate (comme
    // le select cage l'était déjà) ; dans le formulaire d'ajout, la valeur
    // est simplement mémorisée jusqu'à la validation du formulaire.
    if (prefix === 'fiche' && typeof ficheEnCoursIdx !== 'undefined' && ficheEnCoursIdx !== null) {
        var selCage = document.getElementById('fiche-cage');
        if (selCage && selCage.value) assignerCageOiseau(ficheEnCoursIdx, selCage.value, caseIndex);
    }
}

// Appelé au changement du select de cage dans la fiche d'un oiseau. Reconstruit
// la liste des cases disponibles ; si la cage choisie n'a qu'une seule case (ou
// aucune cage), l'affectation est immédiate comme avant.
function onChangeFicheCage() {
    var selCage = document.getElementById('fiche-cage');
    if (!selCage || typeof ficheEnCoursIdx === 'undefined' || ficheEnCoursIdx === null) return;
    afficherSelecteurCase('fiche');
    var cage = baseCages.find(function(c) { return c.id === selCage.value; });
    if (!cage || cage.nombreCases <= 1) {
        assignerCageOiseau(ficheEnCoursIdx, selCage.value || null, 0);
    }
    // si nombreCases > 1, on attend que l'éleveur clique sur une case précise
    // (afficherSelecteurCase a déjà affiché les boutons correspondants)
}

// Ouvre le formulaire d'édition depuis un clic sur une case du visuel cage,
// pré-sélectionne la cage et la case correspondantes.
function ouvrirSelecteurCaseDepuisVisuel(cageId, caseIndex) {
    var selCage = document.getElementById('fiche-cage');
    if (!selCage) return;
    selCage.value = cageId;
    var inputCase = document.getElementById('fiche-case');
    if (inputCase) inputCase.value = String(caseIndex);
    afficherSelecteurCase('fiche');
    showToast('📍 Emplacement sélectionné — choisissez un oiseau puis validez', 'info');
}

// ============================================
//   CASES EFFECTIVES (fusion via séparateurs désactivés)
// ============================================
// Regroupe les cases adjacentes d'un même niveau dont le séparateur commun
// est désactivé (false) en un seul "groupe" affiché/traité comme une case
// unique. Retourne la liste des groupes, niveau par niveau, de gauche à
// droite : [{ niveau, indices:[indexGlobal, ...] }, ...].
function casesEffectivesCage(cage) {
    var niveaux = cage.niveaux || [cage.nombreCases || 1];
    var groupes = [];
    var offsetGlobal = 0;
    for (var niv = 0; niv < niveaux.length; niv++) {
        var n = niveaux[niv];
        var sep = (cage.separateursActifs && cage.separateursActifs[niv]) || [];
        var groupeCourant = [offsetGlobal];
        for (var i = 1; i < n; i++) {
            var actif = sep[i - 1] !== false;
            if (actif) {
                groupes.push({ niveau: niv, indices: groupeCourant });
                groupeCourant = [offsetGlobal + i];
            } else {
                groupeCourant.push(offsetGlobal + i);
            }
        }
        groupes.push({ niveau: niv, indices: groupeCourant });
        offsetGlobal += n;
    }
    return groupes;
}

// Libellé humain (1-based) d'un groupe de cases : "3" seule, ou "3-4" si fusionnée.
function libelleGroupeCases(groupe) {
    if (!groupe || !groupe.indices || !groupe.indices.length) return '';
    var debut = groupe.indices[0] + 1;
    var fin = groupe.indices[groupe.indices.length - 1] + 1;
    return debut === fin ? String(debut) : (debut + '-' + fin);
}
