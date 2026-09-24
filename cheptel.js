// ============================================
//   CHEPTEL — état global
// ============================================
var baseCheptel = [];
var accouplementPere = null, accouplementMere = null;
var ficheEnCoursIdx = null;
var filtreStatutActuel = 'Tous';
var filtreSexeActuel = 'Tous';
var filtreStadeActuel = 'Tous';

function filtrerCheptelParStatut(val) {
    filtreStatutActuel = val;
    afficherCheptel();
}
function filtrerCheptelParSexe(val) {
    filtreSexeActuel = val;
    afficherCheptel();
}
function filtrerCheptelParStade(val) {
    filtreStadeActuel = val;
    afficherCheptel();
}

// ============================================
//   FORMULAIRE D'AJOUT
// ============================================
// mettreAJourMutations(prefix) est déjà générique et vit dans calculator.js
// (utilisée pour m/f) — on la réutilise telle quelle pour 'add' et 'fiche'.
function mettreAJourMutationsCheptel() { mettreAJourMutations('add'); }

// Calcule visuel / porteur / desc à partir des champs génétiques (partagé entre
// ajout et édition de fiche, pour ne jamais faire diverger la logique de nommage).
function calculerDescOiseau(base, mutations, porteurs, plume, fond) {
    var visuel = base;
    if (mutations.indexOf('Jaspe')  >= 0) visuel = 'Jaspe';
    else if (mutations.indexOf('Cobalt') >= 0) visuel = 'Kobalt';
    else if (mutations.length > 0) visuel = mutations[0];

    var porteur = porteurs.length > 0 ? porteurs[0] : 'Rien';

    var hasBrun = mutations.indexOf('Brun') >= 0, hasAgate = mutations.indexOf('Agate') >= 0;
    var hasSatine = mutations.indexOf('Satiné') >= 0 && !hasAgate;
    var autresMuts = mutations.filter(function(m){ return m !== 'Brun' && m !== 'Agate' && m !== 'Satiné'; })
                              .map(function(m){ return m === 'Cobalt' ? 'Kobalt' : m; });
    var nomBase = base === 'Lipochrome' ? 'Lipochrome' : (base === 'Sauvage' ? 'Sauvage' : 'Noir');
    if (base === 'Noir') {
        if (hasBrun && hasAgate)  nomBase = 'Isabelle';
        else if (hasBrun && hasSatine) nomBase = 'Brun Satiné';
        else if (hasBrun)         nomBase = 'Brun';
        else if (hasAgate)        nomBase = 'Agate';
        else if (hasSatine)       nomBase = 'Satiné';
    }
    var desc = nomBase;
    if (autresMuts.length > 0) desc += ' + ' + autresMuts.join(' + ');
    if (porteurs.length  > 0) desc += ' / porteur ' + porteurs.join(' & ');
    desc += ' · ' + plume + ' · ' + fond;

    return { visuel: visuel, porteur: porteur, desc: desc };
}

function ajouterOiseau() {
    var bague  = document.getElementById('bague-input').value.trim();
    var sexe   = document.getElementById('sexe-input').value;
    var base   = document.getElementById('add-base').value;
    var plume  = document.getElementById('add-plume').value;
    var fond   = document.getElementById('add-fond').value;
    var statut = document.getElementById('add-statut').value;
    var stade  = document.getElementById('add-stade').value;
    var cageId = document.getElementById('add-cage').value;
    var caseEl = document.getElementById('add-case');
    var caseIndex = caseEl ? parseInt(caseEl.value, 10) || 0 : 0;
    var notes  = document.getElementById('notes-input').value.trim();
    var fi     = document.getElementById('photo-input');

    if (!bague) { showToast('⚠️ Renseignez le numéro de bague', 'warn'); return; }

    var mutations = [], porteurs = [];
    document.querySelectorAll('input[name="add-mut"]:checked').forEach(function(cb)  { mutations.push(cb.value); });
    document.querySelectorAll('input[name="add-port"]:checked').forEach(function(cb) { porteurs.push(cb.value); });

    var calc = calculerDescOiseau(base, mutations, porteurs, plume, fond);

    var journalInitial = [];
    if (cageId && typeof baseCages !== 'undefined') {
        var cageChoisie = baseCages.find(function(c) { return c.id === cageId; });
        if (cageChoisie) {
            var tChoisie = typeCageParCode(cageChoisie.type);
            var texteInit = '📦 Placé dans "' + cageChoisie.nom + '" (' + (tChoisie ? tChoisie.nom : cageChoisie.type) + ')';
            if (cageChoisie.nombreCases > 1) texteInit += ' — case ' + (caseIndex + 1);
            journalInitial.push({ date: new Date().toLocaleDateString('fr-FR'), texte: texteInit });
        }
    }

    var o = { bague:bague, sexe:sexe, desc:calc.desc, notes:notes, statut:statut, stade:stade,
              visuel:calc.visuel, porteur:calc.porteur, base:base,
              mutations:mutations, porteurs:porteurs,
              plume:plume, fond:fond, img:'', galerie:[], cageId: cageId || null,
              caseIndex: cageId ? caseIndex : null,
              soins:{ poids:'', dernierSoin:'', alimentation:'' }, journal:journalInitial, rappels:[],
              date:new Date().toLocaleDateString('fr-FR') };

    if (fi.files && fi.files[0]) {
        var r = new FileReader();
        r.onload = function(ev) {
            o.img = ev.target.result;
            baseCheptel.push(o); sauvegarderCheptel(baseCheptel); afficherCheptel(); resetForm();
        };
        r.readAsDataURL(fi.files[0]);
    } else {
        baseCheptel.push(o); sauvegarderCheptel(baseCheptel); afficherCheptel(); resetForm();
    }
}

function resetForm() {
    ['bague-input','notes-input'].forEach(function(id) { var el=document.getElementById(id); if(el) el.value=''; });
    var fi=document.getElementById('photo-input'); if(fi) fi.value='';
    var ab=document.getElementById('add-base'); if(ab) ab.value='Noir';
    var as=document.getElementById('add-statut'); if(as) as.value='Acquis';
    var ast=document.getElementById('add-stade'); if(ast) ast.value='Adulte';
    document.querySelectorAll('input[name="add-mut"]').forEach(function(cb)  { cb.checked=false; });
    document.querySelectorAll('input[name="add-port"]').forEach(function(cb) { cb.checked=false; });
    mettreAJourResumeMutations('add');
    var addPanel = document.getElementById('add-mut-panel');
    var addArrow = document.getElementById('add-mut-arrow');
    if (addPanel) addPanel.style.display = 'none';
    if (addArrow) addArrow.textContent = '▶';
    var sexeInput = document.getElementById('sexe-input'); if (sexeInput) sexeInput.value = '♂ Mâle';
    mettreAJourPorteursLS('add');
    var formPanel = document.getElementById('add-form-panel');
    var formArrow = document.getElementById('add-form-arrow');
    if (formPanel) formPanel.style.display = 'none';
    if (formArrow) formArrow.textContent = '▶';
}

function mettreAJourCodeGenetiqueFiche() {
    var el = document.getElementById('fiche-code-genetique');
    if (!el || typeof genererCodeGenetique !== 'function') return;
    var sexe = document.getElementById('fiche-sexe').value;
    var mutations = [], porteurs = [];
    document.querySelectorAll('input[name="fiche-mut"]:checked').forEach(function(cb)  { mutations.push(cb.value); });
    document.querySelectorAll('input[name="fiche-port"]:checked').forEach(function(cb) { porteurs.push(cb.value); });
    el.textContent = '🔬 ' + genererCodeGenetique(sexe, mutations, porteurs);
}

function mettreAJourPorteursLS(prefix) {
    var sexeEl = document.getElementById(prefix === 'add' ? 'sexe-input' : 'fiche-sexe');
    var lsDiv = document.getElementById(prefix + '-porteurs-ls');
    var avertDiv = document.getElementById(prefix + '-porteurs-avertissement');
    if (!sexeEl || !lsDiv) return;
    var estFemelle = sexeEl.value.indexOf('Femelle') >= 0;
    lsDiv.style.display = estFemelle ? 'none' : 'contents';
    if (avertDiv) avertDiv.style.display = estFemelle ? 'block' : 'none';
    if (estFemelle) lsDiv.querySelectorAll('input').forEach(function(cb){ cb.checked = false; });
    mettreAJourResumeMutations(prefix);
}

function toggleFormulaireAjout() {
    var panel = document.getElementById('add-form-panel');
    var arrow = document.getElementById('add-form-arrow');
    if (!panel) return;
    if (panel.style.display === 'none') { panel.style.display = 'block'; if (arrow) arrow.textContent = '▼'; }
    else { panel.style.display = 'none'; if (arrow) arrow.textContent = '▶'; }
}

function todayISO() { return new Date().toISOString().slice(0, 10); }

function afficherRappelsGlobal() {
    var box = document.getElementById('rappels-global');
    if (!box) return;
    var today = todayISO();
    var items = [];
    baseCheptel.forEach(function(o, idx) {
        (o.rappels || []).forEach(function(r) {
            items.push({ idx: idx, bague: o.bague, type: r.type, titre: r.titre, date: r.date });
        });
    });
    items.sort(function(a, b) { return a.date < b.date ? -1 : 1; });

    if (!items.length) { box.style.display = 'none'; box.innerHTML = ''; return; }

    var h = '<strong style="color:#f5d020;font-size:0.9rem;">🔔 Rappels</strong>';
    items.forEach(function(it) {
        var enRetard = it.date < today;
        var couleur = enRetard ? '#fc8181' : '#a0aec0';
        h += '<div onclick="ouvrirFiche(' + it.idx + ')" style="cursor:pointer;padding:5px 0;border-bottom:1px solid #1e3a5f;font-size:0.8rem;color:' + couleur + ';">';
        h += (enRetard ? '⚠️ ' : '📅 ') + '<strong>' + it.bague + '</strong> — ' + it.type + ' : ' + it.titre + ' (' + it.date.split('-').reverse().join('/') + ')';
        h += '</div>';
    });
    box.innerHTML = h;
    box.style.display = 'block';
}

// ============================================
//   AFFICHAGE DE LA VOLIÈRE
// ============================================
function oiseauCorrespondFiltres(o) {
    if (filtreStatutActuel !== 'Tous' && (o.statut || 'Acquis') !== filtreStatutActuel) return false;
    if (filtreSexeActuel === 'Mâle' && o.sexe.indexOf('Mâle') < 0) return false;
    if (filtreSexeActuel === 'Femelle' && o.sexe.indexOf('Femelle') < 0) return false;
    if (filtreStadeActuel !== 'Tous' && (o.stade || 'Adulte') !== filtreStadeActuel) return false;
    return true;
}

function afficherCheptel() {
    var visibles = baseCheptel.filter(oiseauCorrespondFiltres);

    var males    = visibles.filter(function(o){ return o.sexe.indexOf('Mâle') >= 0; });
    var femelles = visibles.filter(function(o){ return o.sexe.indexOf('Femelle') >= 0; });
    document.getElementById('compteur-males').textContent    = males.length;
    document.getElementById('compteur-femelles').textContent = femelles.length;
    document.getElementById('compteur-total').textContent    = visibles.length;
    afficherRappelsGlobal();

    var today = todayISO();
    var h = '';
    if (!baseCheptel.length) {
        h = '<div style="text-align:center;color:#718096;padding:20px;border:2px dashed #1e3a5f;border-radius:8px;">🐦 Votre volière est vide.</div>';
    } else if (!visibles.length) {
        h = '<div style="text-align:center;color:#718096;padding:20px;border:2px dashed #1e3a5f;border-radius:8px;">🐦 Aucun oiseau ne correspond à ce filtre.</div>';
    } else {
        baseCheptel.forEach(function(o, idx) {
            if (!oiseauCorrespondFiltres(o)) return;
            var isMale  = o.sexe.indexOf('Mâle') >= 0;
            var couleur = isMale ? '#3182ce' : '#e53e3e';
            var emoji   = isMale ? '♂' : '♀';
            var imgHTML = o.img
                ? '<img src="' + o.img + '" class="bird-img-preview">'
                : '<div class="bird-img-preview" style="background:' + couleur + '20;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">' + emoji + '</div>';
            h += '<div class="bird-card" id="bird-card-' + idx + '" style="border-left:5px solid ' + couleur + '">';
            h += imgHTML;
            h += '<div style="flex:1;min-width:0;">';
            h += '<strong style="color:' + couleur + '">Bague : ' + o.bague + '</strong> (' + o.sexe + ')<br>';
            h += '<small style="color:#a0aec0;">' + (o.desc||'') + '</small>';
            if (typeof genererCodeGenetique === 'function') {
                h += '<br><small style="color:#4a5568;font-family:monospace;">🔬 ' + genererCodeGenetique(o.sexe, o.mutations, o.porteurs) + '</small>';
            }
            if (o.notes) h += '<br><small style="color:#718096;font-style:italic;">📝 ' + o.notes + '</small>';
            if (o.statut && o.statut !== 'Acquis') {
                var statutEmoji = o.statut === 'En attente' ? '🕓' : '🛒';
                h += '<br><small style="color:#63b3ed;">' + statutEmoji + ' ' + o.statut + '</small>';
            }
            if (o.stade === 'Jeune') {
                h += '<br><small style="color:#f6ad55;">🐣 Jeune</small>';
            }
            if (typeof simulationsSauvegardees !== 'undefined') {
                var partenaires = [];
                simulationsSauvegardees.forEach(function(s) {
                    (s.etapes || []).forEach(function(e) {
                        var autre = null;
                        if (e.pereBague === o.bague) autre = e.mereBague;
                        else if (e.mereBague === o.bague) autre = e.pereBague;
                        if (autre && partenaires.indexOf(autre) < 0) partenaires.push(autre);
                    });
                });
                if (partenaires.length) {
                    h += '<br><small style="color:#b794f4;">💞 En couple avec ' + partenaires.join(', ') + '</small>';
                }
            }
            if (o.soins && (o.soins.poids || o.soins.dernierSoin)) {
                h += '<br><small style="color:#68d391;">🩺 ' + [o.soins.poids, o.soins.dernierSoin].filter(Boolean).join(' · ') + '</small>';
            }
            var enRetard = (o.rappels || []).filter(function(r){ return r.date < today; }).length;
            if (enRetard > 0) h += '<br><small style="color:#fc8181;">⚠️ ' + enRetard + ' rappel(s) en retard</small>';
            if (o.date)  h += '<br><small style="color:#4a5568;">' + o.date + '</small>';
            h += '<div style="margin-top:4px;display:flex;gap:6px;flex-wrap:wrap;">';
            if (o.visuel || o.desc) h += '<button class="btn-accoupler" onclick="utiliserPourAccouplement(' + idx + ')">🧬 Accoupler</button>';
            h += '<button class="btn-accoupler" style="background:#2a5080;" onclick="ouvrirVue(' + idx + ')">👁️ Voir</button>';
            h += '<button class="btn-accoupler" style="background:#2a5080;" onclick="ouvrirFiche(' + idx + ')">✏️ Fiche</button>';
            h += '</div>';
            h += '</div>';
            h += '<button class="btn-delete" onclick="supprimerOiseau(' + idx + ')">✕</button>';
            h += '</div>';
        });
    }
    document.getElementById('liste-cheptel').innerHTML = h;

    // Si le panneau Suggestions est déjà ouvert, le rafraîchir automatiquement
    // (sinon il reste figé sur l'ancien état après un ajout/suppression/édition).
    var suggListe = document.getElementById('sugg-liste');
    if (suggListe && suggListe.style.display !== 'none' && typeof genererSuggestionsAccouplement === 'function') {
        genererSuggestionsAccouplement();
    }
}

function supprimerOiseau(idx) {
    if (confirm('Supprimer ' + baseCheptel[idx].bague + ' ?')) {
        baseCheptel.splice(idx, 1); sauvegarderCheptel(baseCheptel); afficherCheptel();
    }
}

// ============================================
//   FICHE OISEAU (édition, photos, soins, journal)
// ============================================
function ouvrirFiche(idx) {
    var o = baseCheptel[idx];
    if (!o) return;
    ficheEnCoursIdx = idx;

    // Photo principale
    var imgEl = document.getElementById('fiche-photo-principale');
    var placeholderEl = document.getElementById('fiche-photo-placeholder');
    if (o.img) { imgEl.src = o.img; imgEl.style.display='block'; placeholderEl.style.display='none'; }
    else { imgEl.style.display='none'; placeholderEl.style.display='flex'; }
    document.getElementById('fiche-photo-input').value = '';

    // Infos générales
    document.getElementById('fiche-bague').value = o.bague || '';
    document.getElementById('fiche-sexe').value  = o.sexe || '♂ Mâle';
    document.getElementById('fiche-base').value  = o.base || 'Noir';
    document.getElementById('fiche-plume').value = o.plume || 'Intense';
    document.getElementById('fiche-fond').value  = o.fond || 'Jaune';
    document.getElementById('fiche-notes').value = o.notes || '';
    document.getElementById('fiche-statut').value = o.statut || 'Acquis';
    document.getElementById('fiche-stade').value = o.stade || 'Adulte';
    var ficheCaseEl = document.getElementById('fiche-case');
    if (ficheCaseEl) ficheCaseEl.value = String(o.caseIndex || 0);
    if (typeof mettreAJourListesCagesFormulaires === 'function') mettreAJourListesCagesFormulaires();
    var ficheCageEl = document.getElementById('fiche-cage');
    if (ficheCageEl) ficheCageEl.value = o.cageId || '';
    if (typeof afficherSelecteurCase === 'function') afficherSelecteurCase('fiche');
    document.querySelectorAll('input[name="fiche-mut"]').forEach(function(cb)  { cb.checked = (o.mutations||[]).indexOf(cb.value) >= 0; });
    document.querySelectorAll('input[name="fiche-port"]').forEach(function(cb) { cb.checked = (o.porteurs||[]).indexOf(cb.value)  >= 0; });
    mettreAJourPorteursLS('fiche');
    mettreAJourCodeGenetiqueFiche();
    mettreAJourMutations('fiche');
    mettreAJourResumeMutations('fiche');
    var fichePanel = document.getElementById('fiche-mut-panel');
    var ficheArrow = document.getElementById('fiche-mut-arrow');
    var aDesMutations = (o.mutations && o.mutations.length > 0) || (o.porteurs && o.porteurs.length > 0);
    if (fichePanel) fichePanel.style.display = aDesMutations ? 'block' : 'none';
    if (ficheArrow) ficheArrow.textContent = aDesMutations ? '▼' : '▶';
    var infosPanel = document.getElementById('fiche-infos-panel');
    var infosArrow = document.getElementById('fiche-infos-arrow');
    if (infosPanel) infosPanel.style.display = 'none';
    if (infosArrow) infosArrow.textContent = '▶';

    // Soins / alimentation
    var soins = o.soins || {};
    document.getElementById('fiche-poids').value = soins.poids || '';
    document.getElementById('fiche-dernier-soin').value = soins.dernierSoin || '';
    document.getElementById('fiche-alimentation').value = soins.alimentation || '';

    // Galerie, rappels et journal
    afficherGalerieFiche();
    afficherRappelsFiche();
    afficherJournalFiche();
    if (typeof afficherSimulationsLieesFiche === 'function') afficherSimulationsLieesFiche(o.bague);

    document.getElementById('fiche-overlay').style.display = 'block';
    document.getElementById('fiche-modal').scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fermerFiche() {
    document.getElementById('fiche-overlay').style.display = 'none';
    ficheEnCoursIdx = null;
}

function sauvegarderFiche() {
    if (ficheEnCoursIdx === null) return;
    var o = baseCheptel[ficheEnCoursIdx];

    var bague = document.getElementById('fiche-bague').value.trim();
    if (!bague) { showToast('⚠️ Renseignez le numéro de bague', 'warn'); return; }

    var base  = document.getElementById('fiche-base').value;
    var plume = document.getElementById('fiche-plume').value;
    var fond  = document.getElementById('fiche-fond').value;
    var mutations = [], porteurs = [];
    document.querySelectorAll('input[name="fiche-mut"]:checked').forEach(function(cb)  { mutations.push(cb.value); });
    document.querySelectorAll('input[name="fiche-port"]:checked').forEach(function(cb) { porteurs.push(cb.value); });
    var calc = calculerDescOiseau(base, mutations, porteurs, plume, fond);

    o.bague = bague;
    o.sexe  = document.getElementById('fiche-sexe').value;
    o.notes = document.getElementById('fiche-notes').value.trim();
    o.statut = document.getElementById('fiche-statut').value;
    o.stade = document.getElementById('fiche-stade').value;
    o.base = base; o.plume = plume; o.fond = fond;
    o.mutations = mutations; o.porteurs = porteurs;
    o.visuel = calc.visuel; o.porteur = calc.porteur; o.desc = calc.desc;

    sauvegarderCheptel(baseCheptel);
    afficherCheptel();
    showToast('✅ Fiche mise à jour', 'info');
    fermerFiche();
}

function sauvegarderSoins() {
    if (ficheEnCoursIdx === null) return;
    var o = baseCheptel[ficheEnCoursIdx];
    if (!o.soins) o.soins = { poids:'', dernierSoin:'', alimentation:'' };
    if (!o.journal) o.journal = [];

    var nvPoids = document.getElementById('fiche-poids').value.trim();
    var nvSoin  = document.getElementById('fiche-dernier-soin').value.trim();
    var nvAlim  = document.getElementById('fiche-alimentation').value.trim();

    // Avant d'écraser les champs, on historise ce qui change dans le journal —
    // comme ça l'ancienne date de vermifuge (par ex.) reste consultable au lieu
    // d'être perdue quand on rentre la nouvelle.
    var changements = [];
    if (nvPoids && nvPoids !== o.soins.poids)             changements.push('Poids : ' + nvPoids);
    if (nvSoin  && nvSoin  !== o.soins.dernierSoin)        changements.push('Soin : ' + nvSoin);
    if (nvAlim  && nvAlim  !== o.soins.alimentation)       changements.push('Alimentation : ' + nvAlim);
    if (changements.length) {
        o.journal.push({ date: new Date().toLocaleDateString('fr-FR'), texte: changements.join(' · ') });
    }

    o.soins = { poids: nvPoids, dernierSoin: nvSoin, alimentation: nvAlim };
    sauvegarderCheptel(baseCheptel);
    afficherCheptel();
    afficherJournalFiche();
    showToast('✅ Soins enregistrés (historisés dans le journal)', 'info');
}

// --- Photo principale ---
function changerPhotoPrincipale() {
    if (ficheEnCoursIdx === null) return;
    var fi = document.getElementById('fiche-photo-input');
    if (!fi.files || !fi.files[0]) return;
    var r = new FileReader();
    r.onload = function(ev) {
        baseCheptel[ficheEnCoursIdx].img = ev.target.result;
        sauvegarderCheptel(baseCheptel);
        afficherCheptel();
        var imgEl = document.getElementById('fiche-photo-principale');
        var placeholderEl = document.getElementById('fiche-photo-placeholder');
        imgEl.src = ev.target.result; imgEl.style.display='block'; placeholderEl.style.display='none';
        showToast('✅ Photo principale mise à jour', 'info');
    };
    r.readAsDataURL(fi.files[0]);
}

// --- Galerie secondaire ---
function afficherGalerieFiche() {
    var o = baseCheptel[ficheEnCoursIdx];
    var galerie = (o && o.galerie) || [];
    var h = '';
    galerie.forEach(function(src, pIdx) {
        h += '<div style="position:relative;">';
        h += '<img src="' + src + '" style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:1px solid #2a5080;">';
        h += '<button onclick="supprimerPhotoGalerie(' + pIdx + ')" style="position:absolute;top:-6px;right:-6px;width:18px;height:18px;line-height:16px;padding:0;background:#e53e3e;color:#fff;border:none;border-radius:50%;cursor:pointer;font-size:0.7rem;">✕</button>';
        h += '</div>';
    });
    if (!galerie.length) h = '<div style="color:#718096;font-size:0.78rem;">Aucune photo dans la galerie.</div>';
    document.getElementById('fiche-galerie').innerHTML = h;
}

function ajouterPhotoGalerie() {
    if (ficheEnCoursIdx === null) return;
    var fi = document.getElementById('fiche-galerie-input');
    if (!fi.files || !fi.files[0]) { showToast('⚠️ Choisissez une photo', 'warn'); return; }
    var o = baseCheptel[ficheEnCoursIdx];
    if (!o.galerie) o.galerie = [];
    var r = new FileReader();
    r.onload = function(ev) {
        o.galerie.push(ev.target.result);
        sauvegarderCheptel(baseCheptel);
        afficherGalerieFiche();
        fi.value = '';
        showToast('✅ Photo ajoutée à la galerie', 'info');
    };
    r.readAsDataURL(fi.files[0]);
}

function supprimerPhotoGalerie(pIdx) {
    if (ficheEnCoursIdx === null) return;
    var o = baseCheptel[ficheEnCoursIdx];
    if (!confirm('Supprimer cette photo de la galerie ?')) return;
    o.galerie.splice(pIdx, 1);
    sauvegarderCheptel(baseCheptel);
    afficherGalerieFiche();
}

// --- Rappels & échéances ---
function afficherRappelsFiche() {
    var o = baseCheptel[ficheEnCoursIdx];
    var rappels = (o && o.rappels) || [];
    var today = todayISO();
    var tri = rappels.map(function(r, i){ return {r:r, i:i}; }).sort(function(a,b){ return a.r.date < b.r.date ? -1 : 1; });
    var h = '';
    tri.forEach(function(entry) {
        var r = entry.r;
        var enRetard = r.date < today;
        h += '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #1e3a5f;font-size:0.8rem;color:' + (enRetard?'#fc8181':'#e2e8f0') + ';">';
        h += '<span>' + (enRetard ? '⚠️ ' : '📅 ') + r.type + ' — ' + r.titre + ' <em style="opacity:0.7;">(' + r.date.split('-').reverse().join('/') + ')</em></span>';
        h += '<span style="white-space:nowrap;"><button onclick="marquerRappelFait(' + entry.i + ')" style="background:none;border:none;color:#68d391;cursor:pointer;">✅</button>';
        h += '<button onclick="supprimerRappel(' + entry.i + ')" style="background:none;border:none;color:#718096;cursor:pointer;">✕</button></span>';
        h += '</div>';
    });
    if (!rappels.length) h = '<div style="color:#718096;font-size:0.78rem;">Aucun rappel programmé.</div>';
    document.getElementById('fiche-rappels-liste').innerHTML = h;
}

function ajouterRappel() {
    if (ficheEnCoursIdx === null) return;
    var type  = document.getElementById('fiche-rappel-type').value;
    var titre = document.getElementById('fiche-rappel-titre').value.trim();
    var date  = document.getElementById('fiche-rappel-date').value;
    if (!titre || !date) { showToast('⚠️ Renseignez un titre et une date', 'warn'); return; }
    var o = baseCheptel[ficheEnCoursIdx];
    if (!o.rappels) o.rappels = [];
    o.rappels.push({ type: type, titre: titre, date: date });
    sauvegarderCheptel(baseCheptel);
    document.getElementById('fiche-rappel-titre').value = '';
    document.getElementById('fiche-rappel-date').value  = '';
    afficherRappelsFiche();
    afficherCheptel();
}

function marquerRappelFait(rIdx) {
    if (ficheEnCoursIdx === null) return;
    var o = baseCheptel[ficheEnCoursIdx];
    var r = o.rappels[rIdx];
    if (!o.journal) o.journal = [];
    o.journal.push({ date: new Date().toLocaleDateString('fr-FR'), texte: '✅ ' + r.type + ' effectué : ' + r.titre + ' (prévu le ' + r.date.split('-').reverse().join('/') + ')' });
    o.rappels.splice(rIdx, 1);
    sauvegarderCheptel(baseCheptel);
    afficherRappelsFiche();
    afficherJournalFiche();
    afficherCheptel();
    showToast('✅ Rappel marqué comme fait', 'info');
}

function supprimerRappel(rIdx) {
    if (ficheEnCoursIdx === null) return;
    if (!confirm('Supprimer ce rappel ?')) return;
    var o = baseCheptel[ficheEnCoursIdx];
    o.rappels.splice(rIdx, 1);
    sauvegarderCheptel(baseCheptel);
    afficherRappelsFiche();
    afficherCheptel();
}

// --- Journal libre ---
function afficherJournalFiche() {
    var o = baseCheptel[ficheEnCoursIdx];
    var journal = (o && o.journal) || [];
    var h = '';
    for (var i = journal.length - 1; i >= 0; i--) {
        var entree = journal[i];
        h += '<div style="display:flex;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid #1e3a5f;">';
        h += '<span><strong style="color:#f5d020;">' + entree.date + '</strong> — ' + entree.texte + '</span>';
        h += '<button onclick="supprimerEntreeJournal(' + i + ')" style="background:none;border:none;color:#718096;cursor:pointer;">✕</button>';
        h += '</div>';
    }
    if (!journal.length) h = '<div style="color:#718096;font-size:0.78rem;">Aucune entrée pour l\'instant.</div>';
    document.getElementById('fiche-journal-liste').innerHTML = h;
}

function ajouterEntreeJournal() {
    if (ficheEnCoursIdx === null) return;
    var input = document.getElementById('fiche-journal-input');
    var texte = input.value.trim();
    if (!texte) { showToast('⚠️ Écrivez une note avant d\'ajouter', 'warn'); return; }
    var o = baseCheptel[ficheEnCoursIdx];
    if (!o.journal) o.journal = [];
    o.journal.push({ date: new Date().toLocaleDateString('fr-FR'), texte: texte });
    sauvegarderCheptel(baseCheptel);
    input.value = '';
    afficherJournalFiche();
}

function supprimerEntreeJournal(jIdx) {
    if (ficheEnCoursIdx === null) return;
    if (!confirm('Supprimer cette entrée du journal ?')) return;
    var o = baseCheptel[ficheEnCoursIdx];
    o.journal.splice(jIdx, 1);
    sauvegarderCheptel(baseCheptel);
    afficherJournalFiche();
}

// ============================================
//   FICHE OISEAU — VUE LECTURE SEULE
// ============================================
function ouvrirVue(idx) {
    var o = baseCheptel[idx];
    if (!o) return;
    ficheEnCoursIdx = idx;

    var imgHTML = o.img
        ? '<img src="' + o.img + '" style="width:110px;height:110px;object-fit:cover;border-radius:8px;border:2px solid #2a5080;">'
        : '<div style="width:110px;height:110px;border-radius:8px;background:#1e3a5f;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto;">🐦</div>';

    var galerieHTML = '';
    (o.galerie || []).forEach(function(src) {
        galerieHTML += '<img src="' + src + '" style="width:56px;height:56px;object-fit:cover;border-radius:6px;border:1px solid #2a5080;">';
    });
    if (!galerieHTML) galerieHTML = '<div style="color:#718096;font-size:0.78rem;">Aucune photo dans la galerie.</div>';

    var isMale = o.sexe.indexOf('Mâle') >= 0;
    var couleur = isMale ? '#3182ce' : '#e53e3e';

    var soins = o.soins || {};
    var soinsHTML = (soins.poids || soins.dernierSoin || soins.alimentation)
        ? [
            soins.poids ? '<div>⚖️ Poids : ' + soins.poids + '</div>' : '',
            soins.dernierSoin ? '<div>🩺 Dernier soin : ' + soins.dernierSoin + '</div>' : '',
            soins.alimentation ? '<div>🌾 Alimentation : ' + soins.alimentation + '</div>' : ''
          ].join('')
        : '<div style="color:#718096;font-size:0.78rem;">Aucune info de soins renseignée.</div>';

    var today = todayISO();
    var rappelsHTML = '';
    var rappelsTri = (o.rappels || []).slice().sort(function(a,b){ return a.date < b.date ? -1 : 1; });
    rappelsTri.forEach(function(r) {
        var enRetard = r.date < today;
        rappelsHTML += '<div style="padding:4px 0;border-bottom:1px solid #1e3a5f;color:' + (enRetard?'#fc8181':'#e2e8f0') + ';">' + (enRetard?'⚠️ ':'📅 ') + r.type + ' — ' + r.titre + ' <em style="opacity:0.7;">(' + r.date.split('-').reverse().join('/') + ')</em></div>';
    });
    if (!rappelsHTML) rappelsHTML = '<div style="color:#718096;font-size:0.78rem;">Aucun rappel programmé.</div>';

    var journalHTML = '';
    var journal = o.journal || [];
    for (var i = journal.length - 1; i >= 0; i--) {
        journalHTML += '<div style="padding:4px 0;border-bottom:1px solid #1e3a5f;"><strong style="color:#f5d020;">' + journal[i].date + '</strong> — ' + journal[i].texte + '</div>';
    }
    if (!journalHTML) journalHTML = '<div style="color:#718096;font-size:0.78rem;">Aucune entrée pour l\'instant.</div>';

    var h = '';
    h += '<div style="text-align:center;margin-bottom:12px;">' + imgHTML + '</div>';
    h += '<div style="text-align:center;"><strong style="color:' + couleur + ';font-size:1.05rem;">Bague : ' + o.bague + '</strong> (' + o.sexe + ')</div>';
    h += '<div style="text-align:center;color:#a0aec0;margin:4px 0 10px;">' + (o.desc || '') + '</div>';
    if (typeof genererCodeGenetique === 'function') {
        h += '<div style="text-align:center;color:#4a5568;font-family:monospace;font-size:0.78rem;margin:-6px 0 10px;">🔬 ' + genererCodeGenetique(o.sexe, o.mutations, o.porteurs) + '</div>';
    }
    if (o.notes) h += '<div style="font-style:italic;color:#718096;margin-bottom:10px;">📝 ' + o.notes + '</div>';
    if (o.statut && o.statut !== 'Acquis') {
        var statutEmoji = o.statut === 'En attente' ? '🕓' : '🛒';
        h += '<div style="color:#63b3ed;margin-bottom:10px;">' + statutEmoji + ' ' + o.statut + '</div>';
    }
    if (o.stade === 'Jeune') {
        h += '<div style="color:#f6ad55;margin-bottom:10px;">🐣 Jeune</div>';
    }
    var partenairesVue = [];
    simulationsSauvegardees.forEach(function(s) {
        (s.etapes || []).forEach(function(e) {
            var autre = null;
            if (e.pereBague === o.bague) autre = e.mereBague;
            else if (e.mereBague === o.bague) autre = e.pereBague;
            if (autre && partenairesVue.indexOf(autre) < 0) partenairesVue.push(autre);
        });
    });
    if (partenairesVue.length) {
        h += '<div style="color:#b794f4;margin-bottom:10px;">💞 En couple avec ' + partenairesVue.join(', ') + '</div>';
    }
    h += '<label style="color:#f5d020;">📷 Galerie photos :</label>';
    h += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 14px;">' + galerieHTML + '</div>';
    h += '<hr style="border-color:#2a5080;margin:14px 0;">';
    h += '<strong style="color:#f5d020;font-size:0.9rem;">🩺 Soins & alimentation</strong>';
    h += '<div style="margin-top:6px;">' + soinsHTML + '</div>';
    h += '<hr style="border-color:#2a5080;margin:14px 0;">';
    h += '<strong style="color:#f5d020;font-size:0.9rem;">🔔 Rappels & échéances</strong>';
    h += '<div style="margin-top:8px;font-size:0.8rem;">' + rappelsHTML + '</div>';
    h += '<hr style="border-color:#2a5080;margin:14px 0;">';
    h += '<strong style="color:#f5d020;font-size:0.9rem;">🧬 Simulations liées</strong>';
    h += '<div id="vue-simulations-liees" style="margin-top:8px;font-size:0.78rem;"></div>';
    h += '<hr style="border-color:#2a5080;margin:14px 0;">';
    h += '<strong style="color:#f5d020;font-size:0.9rem;">📝 Journal de suivi</strong>';
    h += '<div style="max-height:180px;overflow-y:auto;margin-top:8px;font-size:0.8rem;">' + journalHTML + '</div>';

    document.getElementById('vue-contenu').innerHTML = h;
    if (typeof afficherSimulationsLieesFiche === 'function') afficherSimulationsLieesFiche(o.bague, 'vue-simulations-liees');
    document.getElementById('vue-overlay').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fermerVue() {
    document.getElementById('vue-overlay').style.display = 'none';
    ficheEnCoursIdx = null;
}

function passerEnModification() {
    var idx = ficheEnCoursIdx;
    fermerVue();
    ouvrirFiche(idx);
}

// ============================================
//   ACCOUPLER DEPUIS LA VOLIÈRE
// ============================================
function remplirCalculateurDepuisOiseau(prefix, o) {
    try {
        // Filet de sécurité pour les oiseaux sauvegardés avant ce correctif
        // (qui n'ont que .desc, sans base/mutations/porteurs/plume/fond structurés).
        var params = (o.base && o.mutations) ? o : nomVersParams(o.desc || '', o.sexe);
        // appliquerParamsCalculateur (ui.js) gère correctement le cas Mosaïque T1/T2
        // (select "Mosaïque" + radio séparé) — les oiseaux "Gardés" depuis la
        // calculette passent par nomVersParams() qui renvoie "Mosaïque T1"/"T2",
        // ce que l'ancienne version de cette fonction ne savait pas traduire.
        if (typeof appliquerParamsCalculateur === 'function') {
            appliquerParamsCalculateur(prefix, params);
        }
    } catch(e) {}
}

function utiliserPourAccouplement(idx) {
    var o = baseCheptel[idx];
    if (!o.visuel) { showToast('⚠️ Cet oiseau n\'a pas de génétique enregistrée', 'warn'); return; }
    var isMale = o.sexe.indexOf('Mâle') >= 0;
    if (isMale) {
        accouplementPere = idx;
        document.querySelectorAll('.bird-card').forEach(function(c){ c.classList.remove('acc-pere'); });
        var el=document.getElementById('bird-card-'+idx); if(el) el.classList.add('acc-pere');
        var ba=document.getElementById('btn-annuler-acc'); if(ba) ba.style.display='block';
        showToast('🔵 Père : ' + o.bague, 'pere');
    } else {
        accouplementMere = idx;
        document.querySelectorAll('.bird-card').forEach(function(c){ c.classList.remove('acc-mere'); });
        var el2=document.getElementById('bird-card-'+idx); if(el2) el2.classList.add('acc-mere');
        showToast('🔴 Mère : ' + o.bague, 'mere');
    }
    if (accouplementPere !== null && accouplementMere !== null) {
        setTimeout(function(){ simulerDepuisVoliere(); }, 600);
    }
}

function simulerDepuisVoliere() {
    var pere=baseCheptel[accouplementPere], mere=baseCheptel[accouplementMere];
    remplirCalculateurDepuisOiseau('m', pere);
    remplirCalculateurDepuisOiseau('f', mere);
    if (typeof definirBagueParent === 'function') { definirBagueParent('m', pere.bague); definirBagueParent('f', mere.bague); }
    var pL=document.getElementById('m-selection'); if(pL) pL.textContent='✅ '+pere.bague+' — '+(pere.desc||'');
    var mL=document.getElementById('f-selection'); if(mL) mL.textContent='✅ '+mere.bague+' — '+(mere.desc||'');
    accouplementPere=null; accouplementMere=null;
    document.getElementById('btn-simuler-voliere').style.display='none';
    document.getElementById('btn-annuler-acc').style.display='none';
    document.querySelectorAll('.bird-card').forEach(function(c){ c.classList.remove('acc-pere','acc-mere'); });
    naviguerVers('page-calc', document.getElementById('btn-nav-calc'));
    verifierFacteursLetaux();
    showToast('🧬 Parents chargés — appuyez sur Simuler !', 'info');
}

function annulerAccouplement() {
    accouplementPere=null; accouplementMere=null;
    document.getElementById('btn-simuler-voliere').style.display='none';
    document.getElementById('btn-annuler-acc').style.display='none';
    document.querySelectorAll('.bird-card').forEach(function(c){ c.classList.remove('acc-pere','acc-mere'); });
    showToast('Sélection annulée', 'warn');
}

// ============================================
//   EXPORT / IMPORT
// ============================================
function exporterCheptel() {
    if (!baseCheptel.length && !(typeof simulationsSauvegardees !== 'undefined' && simulationsSauvegardees.length)) {
        showToast('Votre volière et vos sauvegardes sont vides !', 'warn'); return;
    }
    // Format combiné : cheptel + sauvegardes du Calculateur, pour tout
    // récupérer en un seul export/import (en attendant une sauvegarde
    // automatique native). L'import reste compatible avec les anciens
    // exports (un simple tableau d'oiseaux, sans simulations).
    var payload = {
        canagenExport: true,
        cheptel: baseCheptel,
        simulations: (typeof simulationsSauvegardees !== 'undefined') ? simulationsSauvegardees : [],
        cages: (typeof baseCages !== 'undefined') ? baseCages : []
    };
    var json=JSON.stringify(payload, null, 2);
    if (navigator.share) {
        navigator.share({title:'CanaGen — Sauvegarde', text:json})
            .then(function(){ showToast('✅ Partagé !', 'info'); })
            .catch(function(){ afficherZoneExport(json); });
    } else { afficherZoneExport(json); }
}
function afficherZoneExport(json) {
    document.getElementById('export-content').value=json;
    document.getElementById('export-zone').style.display='block';
    document.getElementById('import-zone').style.display='none';
    document.getElementById('export-zone').scrollIntoView({behavior:'smooth',block:'start'});
}
function copierExport() {
    var ta = document.getElementById('export-content');
    ta.focus(); ta.select();
    // navigator.clipboard demande souvent un contexte sécurisé (https) ; comme
    // l'app tourne en http:// local, on part directement sur execCommand qui
    // marche partout, y compris en http.
    try {
        var ok = document.execCommand('copy');
        showToast(ok ? '✅ Copié dans le presse-papiers !' : '⚠️ Sélectionnez et copiez manuellement', ok ? 'info' : 'warn');
    } catch(e) {
        showToast('⚠️ Sélectionnez et copiez manuellement', 'warn');
    }
}
function afficherImport() {
    document.getElementById('import-zone').style.display='block';
    document.getElementById('export-zone').style.display='none';
    document.getElementById('import-zone').scrollIntoView({behavior:'smooth',block:'start'});
}
function importerCheptel() {
    var txt=document.getElementById('import-content').value.trim();
    if (!txt) { showToast("Collez votre JSON d'abord", 'warn'); return; }
    try {
        var data=JSON.parse(txt);
        var oiseaux, sims = [], cages = [];
        if (Array.isArray(data)) {
            // Ancien format : juste un tableau d'oiseaux (compatibilité ascendante)
            oiseaux = data;
        } else if (data && data.canagenExport && Array.isArray(data.cheptel)) {
            oiseaux = data.cheptel;
            sims = Array.isArray(data.simulations) ? data.simulations : [];
            cages = Array.isArray(data.cages) ? data.cages : [];
        } else {
            throw new Error();
        }
        var msg = 'Importer ' + oiseaux.length + ' oiseau(x)' + (sims.length ? ' et ' + sims.length + ' sauvegarde(s) de calculateur' : '') + (cages.length ? ' et ' + cages.length + ' cage(s)' : '') + ' ?';
        if (confirm(msg)) {
            baseCheptel=baseCheptel.concat(oiseaux);
            sauvegarderCheptel(baseCheptel); afficherCheptel();
            if (sims.length && typeof simulationsSauvegardees !== 'undefined') {
                simulationsSauvegardees = simulationsSauvegardees.concat(sims);
                if (typeof sauvegarderSimulationsStorage === 'function') sauvegarderSimulationsStorage();
                if (typeof afficherSimulationsSauvegardees === 'function') afficherSimulationsSauvegardees();
            }
            if (cages.length && typeof baseCages !== 'undefined') {
                cages.forEach(function(c) { if (!baseCages.some(function(bc) { return bc.id === c.id; })) baseCages.push(c); });
                sauvegarderCages(baseCages);
                if (typeof mettreAJourListesCagesFormulaires === 'function') mettreAJourListesCagesFormulaires();
                if (typeof afficherCages === 'function') afficherCages();
            }
            document.getElementById('import-zone').style.display='none';
            document.getElementById('import-content').value='';
            fermerRappel();
            showToast('✅ ' + oiseaux.length + ' oiseau(x)' + (sims.length ? ' + ' + sims.length + ' sauvegarde(s)' : '') + (cages.length ? ' + ' + cages.length + ' cage(s)' : '') + ' importé(s) !', 'info');
        }
    } catch(e) { showToast('Erreur : JSON invalide', 'warn'); }
}
