// ============================================
//   CANAGEN — Interface utilisateur (ui.js)
//   Sélection par catégories dépliables
// ============================================

var selectionState = 0;
// accouplementPere, accouplementMere et baseCheptel sont maintenant déclarées
// dans cheptel.js (chargé avant ce fichier)
var toastTimer = null;
var activeTab = 'com';

// ============================================
//   BASE DE DONNÉES COMPLÈTE DES VARIÉTÉS
// ============================================
var CATEGORIES = [
    {
        code: 'D00', nom: 'Lipochromes', couleur: '#d69e2e', emoji: '🟡',
        varietes: [
            'Jaune Intensif','Jaune Schimmel','Jaune Mosaïque M','Jaune Mosaïque F',
            'Rouge Intensif','Rouge Schimmel','Rouge Mosaïque M','Rouge Mosaïque F',
            'Blanc Dominant','Blanc Récessif',
            'Ivoire Jaune Intensif','Ivoire Jaune Schimmel',
            'Ivoire Rouge Intensif','Ivoire Rouge Schimmel'
        ]
    },
    {
        code: 'D01', nom: 'Mélaniques Classiques', couleur: '#2c5282', emoji: '⚫',
        varietes: [
            'Noir Blanc Dominant','Noir Blanc Récessif',
            'Noir Jaune Intensif','Noir Jaune Schimmel','Noir Jaune Mosaïque M','Noir Jaune Mosaïque F',
            'Noir Rouge Intensif','Noir Rouge Schimmel','Noir Rouge Mosaïque M','Noir Rouge Mosaïque F',
            'Noir Ivoire Jaune Intensif','Noir Ivoire Jaune Schimmel','Noir Ivoire Jaune Mosaïque M','Noir Ivoire Jaune Mosaïque F',
            'Noir Ivoire Rouge Intensif','Noir Ivoire Rouge Schimmel',
            'Brun Blanc Dominant','Brun Blanc Récessif',
            'Brun Jaune Intensif','Brun Jaune Schimmel','Brun Jaune Mosaïque M','Brun Jaune Mosaïque F',
            'Brun Rouge Intensif','Brun Rouge Schimmel','Brun Rouge Mosaïque M','Brun Rouge Mosaïque F',
            'Brun Ivoire Jaune Intensif','Brun Ivoire Jaune Schimmel','Brun Ivoire Jaune Mosaïque M','Brun Ivoire Jaune Mosaïque F',
            'Brun Ivoire Rouge Intensif','Brun Ivoire Rouge Schimmel',
            'Agate Blanc Dominant','Agate Blanc Récessif',
            'Agate Jaune Intensif','Agate Jaune Schimmel','Agate Jaune Mosaïque M','Agate Jaune Mosaïque F',
            'Agate Rouge Intensif','Agate Rouge Schimmel','Agate Rouge Mosaïque M','Agate Rouge Mosaïque F',
            'Agate Ivoire Jaune Intensif','Agate Ivoire Jaune Schimmel','Agate Ivoire Jaune Mosaïque M','Agate Ivoire Jaune Mosaïque F',
            'Agate Ivoire Rouge Intensif','Agate Ivoire Rouge Schimmel',
            'Isabelle Blanc Dominant','Isabelle Blanc Récessif',
            'Isabelle Jaune Intensif','Isabelle Jaune Schimmel','Isabelle Jaune Mosaïque M','Isabelle Jaune Mosaïque F',
            'Isabelle Rouge Intensif','Isabelle Rouge Schimmel','Isabelle Rouge Mosaïque M','Isabelle Rouge Mosaïque F',
            'Isabelle Ivoire Jaune Intensif','Isabelle Ivoire Jaune Schimmel','Isabelle Ivoire Jaune Mosaïque M','Isabelle Ivoire Jaune Mosaïque F',
            'Isabelle Ivoire Rouge Intensif','Isabelle Ivoire Rouge Schimmel'
        ]
    },
    {
        code: 'D02', nom: 'Pastel', couleur: '#805ad5', emoji: '💜',
        varietes: [
            'Noir Pastel Blanc Dominant','Noir Pastel Blanc Récessif',
            'Noir Pastel Jaune Intensif','Noir Pastel Jaune Schimmel',
            'Noir Pastel Jaune Mosaïque M','Noir Pastel Jaune Mosaïque F',
            'Noir Pastel Rouge Intensif','Noir Pastel Rouge Schimmel',
            'Noir Pastel Rouge Mosaïque M','Noir Pastel Rouge Mosaïque F',
            'Noir Pastel Ivoire Jaune Intensif','Noir Pastel Ivoire Jaune Schimmel',
            'Noir Pastel Ivoire Jaune Mosaïque M','Noir Pastel Ivoire Jaune Mosaïque F',
            'Noir Pastel Ivoire Rouge Intensif','Noir Pastel Ivoire Rouge Schimmel',
            'Brun Pastel Blanc Dominant','Brun Pastel Blanc Récessif',
            'Brun Pastel Jaune Intensif','Brun Pastel Jaune Schimmel',
            'Brun Pastel Jaune Mosaïque M','Brun Pastel Jaune Mosaïque F',
            'Brun Pastel Rouge Intensif','Brun Pastel Rouge Schimmel',
            'Brun Pastel Rouge Mosaïque M','Brun Pastel Rouge Mosaïque F',
            'Brun Pastel Ivoire Jaune Intensif','Brun Pastel Ivoire Jaune Schimmel',
            'Brun Pastel Ivoire Jaune Mosaïque M','Brun Pastel Ivoire Jaune Mosaïque F',
            'Brun Pastel Ivoire Rouge Intensif','Brun Pastel Ivoire Rouge Schimmel',
            'Agate Pastel Blanc Dominant','Agate Pastel Blanc Récessif',
            'Agate Pastel Jaune Intensif','Agate Pastel Jaune Schimmel',
            'Agate Pastel Jaune Mosaïque M','Agate Pastel Jaune Mosaïque F',
            'Agate Pastel Rouge Intensif','Agate Pastel Rouge Schimmel',
            'Agate Pastel Rouge Mosaïque M','Agate Pastel Rouge Mosaïque F',
            'Agate Pastel Ivoire Jaune Intensif','Agate Pastel Ivoire Jaune Schimmel',
            'Agate Pastel Ivoire Jaune Mosaïque M','Agate Pastel Ivoire Jaune Mosaïque F',
            'Agate Pastel Ivoire Rouge Intensif','Agate Pastel Ivoire Rouge Schimmel',
            'Isabelle Pastel Blanc Dominant','Isabelle Pastel Blanc Récessif',
            'Isabelle Pastel Jaune Intensif','Isabelle Pastel Jaune Schimmel',
            'Isabelle Pastel Jaune Mosaïque M','Isabelle Pastel Jaune Mosaïque F',
            'Isabelle Pastel Rouge Intensif','Isabelle Pastel Rouge Schimmel',
            'Isabelle Pastel Rouge Mosaïque M','Isabelle Pastel Rouge Mosaïque F',
            'Isabelle Pastel Ivoire Jaune Intensif','Isabelle Pastel Ivoire Jaune Schimmel',
            'Isabelle Pastel Ivoire Jaune Mosaïque M','Isabelle Pastel Ivoire Jaune Mosaïque F',
            'Isabelle Pastel Ivoire Rouge Intensif','Isabelle Pastel Ivoire Rouge Schimmel'
        ]
    },
    {
        code: 'D03', nom: 'Opale', couleur: '#2b6cb0', emoji: '🔵',
        varietes: [
            'Noir Opale Blanc Dominant','Noir Opale Blanc Récessif',
            'Noir Opale Jaune Intensif','Noir Opale Jaune Schimmel',
            'Noir Opale Jaune Mosaïque M','Noir Opale Jaune Mosaïque F',
            'Noir Opale Rouge Intensif','Noir Opale Rouge Schimmel',
            'Noir Opale Rouge Mosaïque M','Noir Opale Rouge Mosaïque F',
            'Noir Opale Ivoire Jaune Intensif','Noir Opale Ivoire Jaune Schimmel',
            'Noir Opale Ivoire Jaune Mosaïque M','Noir Opale Ivoire Jaune Mosaïque F',
            'Noir Opale Ivoire Rouge Intensif','Noir Opale Ivoire Rouge Schimmel',
            'Brun Opale Blanc Dominant','Brun Opale Blanc Récessif',
            'Brun Opale Jaune Intensif','Brun Opale Jaune Schimmel',
            'Brun Opale Jaune Mosaïque M','Brun Opale Jaune Mosaïque F',
            'Brun Opale Rouge Intensif','Brun Opale Rouge Schimmel',
            'Brun Opale Rouge Mosaïque M','Brun Opale Rouge Mosaïque F',
            'Brun Opale Ivoire Jaune Intensif','Brun Opale Ivoire Jaune Schimmel',
            'Brun Opale Ivoire Jaune Mosaïque M','Brun Opale Ivoire Jaune Mosaïque F',
            'Brun Opale Ivoire Rouge Intensif','Brun Opale Ivoire Rouge Schimmel',
            'Agate Opale Blanc Dominant','Agate Opale Blanc Récessif',
            'Agate Opale Jaune Intensif','Agate Opale Jaune Schimmel',
            'Agate Opale Jaune Mosaïque M','Agate Opale Jaune Mosaïque F',
            'Agate Opale Rouge Intensif','Agate Opale Rouge Schimmel',
            'Agate Opale Rouge Mosaïque M','Agate Opale Rouge Mosaïque F',
            'Agate Opale Ivoire Jaune Intensif','Agate Opale Ivoire Jaune Schimmel',
            'Agate Opale Ivoire Jaune Mosaïque M','Agate Opale Ivoire Jaune Mosaïque F',
            'Agate Opale Ivoire Rouge Intensif','Agate Opale Ivoire Rouge Schimmel',
            'Isabelle Opale Blanc Dominant','Isabelle Opale Blanc Récessif',
            'Isabelle Opale Jaune Intensif','Isabelle Opale Jaune Schimmel',
            'Isabelle Opale Jaune Mosaïque M','Isabelle Opale Jaune Mosaïque F',
            'Isabelle Opale Rouge Intensif','Isabelle Opale Rouge Schimmel',
            'Isabelle Opale Rouge Mosaïque M','Isabelle Opale Rouge Mosaïque F',
            'Isabelle Opale Ivoire Jaune Intensif','Isabelle Opale Ivoire Jaune Schimmel',
            'Isabelle Opale Ivoire Jaune Mosaïque M','Isabelle Opale Ivoire Jaune Mosaïque F',
            'Isabelle Opale Ivoire Rouge Intensif','Isabelle Opale Ivoire Rouge Schimmel'
        ]
    },
    {
        code: 'D04', nom: 'Phaeo', couleur: '#c05621', emoji: '🟤',
        varietes: [
            'Noir Phaeo Blanc Dominant','Noir Phaeo Blanc Récessif',
            'Noir Phaeo Jaune Intensif','Noir Phaeo Jaune Schimmel',
            'Noir Phaeo Jaune Mosaïque M','Noir Phaeo Jaune Mosaïque F',
            'Noir Phaeo Rouge Intensif','Noir Phaeo Rouge Schimmel',
            'Noir Phaeo Rouge Mosaïque M','Noir Phaeo Rouge Mosaïque F',
            'Noir Phaeo Ivoire Jaune Intensif','Noir Phaeo Ivoire Jaune Schimmel',
            'Noir Phaeo Ivoire Jaune Mosaïque M','Noir Phaeo Ivoire Jaune Mosaïque F',
            'Noir Phaeo Ivoire Rouge Intensif','Noir Phaeo Ivoire Rouge Schimmel',
            'Brun Phaeo Blanc Dominant','Brun Phaeo Blanc Récessif',
            'Brun Phaeo Jaune Intensif','Brun Phaeo Jaune Schimmel',
            'Brun Phaeo Jaune Mosaïque M','Brun Phaeo Jaune Mosaïque F',
            'Brun Phaeo Rouge Intensif','Brun Phaeo Rouge Schimmel',
            'Brun Phaeo Rouge Mosaïque M','Brun Phaeo Rouge Mosaïque F',
            'Brun Phaeo Ivoire Jaune Intensif','Brun Phaeo Ivoire Jaune Schimmel',
            'Brun Phaeo Ivoire Jaune Mosaïque M','Brun Phaeo Ivoire Jaune Mosaïque F',
            'Brun Phaeo Ivoire Rouge Intensif','Brun Phaeo Ivoire Rouge Schimmel',
            'Agate Phaeo Blanc Dominant','Agate Phaeo Blanc Récessif',
            'Agate Phaeo Jaune Intensif','Agate Phaeo Jaune Schimmel',
            'Agate Phaeo Jaune Mosaïque M','Agate Phaeo Jaune Mosaïque F',
            'Agate Phaeo Rouge Intensif','Agate Phaeo Rouge Schimmel',
            'Agate Phaeo Rouge Mosaïque M','Agate Phaeo Rouge Mosaïque F',
            'Agate Phaeo Ivoire Jaune Intensif','Agate Phaeo Ivoire Jaune Schimmel',
            'Agate Phaeo Ivoire Jaune Mosaïque M','Agate Phaeo Ivoire Jaune Mosaïque F',
            'Agate Phaeo Ivoire Rouge Intensif','Agate Phaeo Ivoire Rouge Schimmel',
            'Isabelle Phaeo Blanc Dominant','Isabelle Phaeo Blanc Récessif',
            'Isabelle Phaeo Jaune Intensif','Isabelle Phaeo Jaune Schimmel',
            'Isabelle Phaeo Jaune Mosaïque M','Isabelle Phaeo Jaune Mosaïque F',
            'Isabelle Phaeo Rouge Intensif','Isabelle Phaeo Rouge Schimmel',
            'Isabelle Phaeo Rouge Mosaïque M','Isabelle Phaeo Rouge Mosaïque F',
            'Isabelle Phaeo Ivoire Jaune Intensif','Isabelle Phaeo Ivoire Jaune Schimmel',
            'Isabelle Phaeo Ivoire Jaune Mosaïque M','Isabelle Phaeo Ivoire Jaune Mosaïque F',
            'Isabelle Phaeo Ivoire Rouge Intensif','Isabelle Phaeo Ivoire Rouge Schimmel'
        ]
    },
    {
        code: 'D05', nom: 'Satiné', couleur: '#276749', emoji: '✨',
        varietes: [
            'Noir Satiné Blanc Dominant','Noir Satiné Blanc Récessif',
            'Noir Satiné Jaune Intensif','Noir Satiné Jaune Schimmel',
            'Noir Satiné Jaune Mosaïque M','Noir Satiné Jaune Mosaïque F',
            'Noir Satiné Rouge Intensif','Noir Satiné Rouge Schimmel',
            'Noir Satiné Rouge Mosaïque M','Noir Satiné Rouge Mosaïque F',
            'Noir Satiné Ivoire Jaune Intensif','Noir Satiné Ivoire Jaune Schimmel',
            'Noir Satiné Ivoire Jaune Mosaïque M','Noir Satiné Ivoire Jaune Mosaïque F',
            'Noir Satiné Ivoire Rouge Intensif','Noir Satiné Ivoire Rouge Schimmel',
            'Brun Satiné Blanc Dominant','Brun Satiné Blanc Récessif',
            'Brun Satiné Jaune Intensif','Brun Satiné Jaune Schimmel',
            'Brun Satiné Jaune Mosaïque M','Brun Satiné Jaune Mosaïque F',
            'Brun Satiné Rouge Intensif','Brun Satiné Rouge Schimmel',
            'Brun Satiné Rouge Mosaïque M','Brun Satiné Rouge Mosaïque F',
            'Brun Satiné Ivoire Jaune Intensif','Brun Satiné Ivoire Jaune Schimmel',
            'Brun Satiné Ivoire Jaune Mosaïque M','Brun Satiné Ivoire Jaune Mosaïque F',
            'Brun Satiné Ivoire Rouge Intensif','Brun Satiné Ivoire Rouge Schimmel',
            'Agate Satiné Blanc Dominant','Agate Satiné Blanc Récessif',
            'Agate Satiné Jaune Intensif','Agate Satiné Jaune Schimmel',
            'Agate Satiné Jaune Mosaïque M','Agate Satiné Jaune Mosaïque F',
            'Agate Satiné Rouge Intensif','Agate Satiné Rouge Schimmel',
            'Agate Satiné Rouge Mosaïque M','Agate Satiné Rouge Mosaïque F',
            'Agate Satiné Ivoire Jaune Intensif','Agate Satiné Ivoire Jaune Schimmel',
            'Agate Satiné Ivoire Jaune Mosaïque M','Agate Satiné Ivoire Jaune Mosaïque F',
            'Agate Satiné Ivoire Rouge Intensif','Agate Satiné Ivoire Rouge Schimmel',
            'Isabelle Satiné Blanc Dominant','Isabelle Satiné Blanc Récessif',
            'Isabelle Satiné Jaune Intensif','Isabelle Satiné Jaune Schimmel',
            'Isabelle Satiné Jaune Mosaïque M','Isabelle Satiné Jaune Mosaïque F',
            'Isabelle Satiné Rouge Intensif','Isabelle Satiné Rouge Schimmel',
            'Isabelle Satiné Rouge Mosaïque M','Isabelle Satiné Rouge Mosaïque F',
            'Isabelle Satiné Ivoire Jaune Intensif','Isabelle Satiné Ivoire Jaune Schimmel',
            'Isabelle Satiné Ivoire Jaune Mosaïque M','Isabelle Satiné Ivoire Jaune Mosaïque F',
            'Isabelle Satiné Ivoire Rouge Intensif','Isabelle Satiné Ivoire Rouge Schimmel'
        ]
    },
    {
        code: 'D06', nom: 'Topaze', couleur: '#b7791f', emoji: '💛',
        varietes: [
            'Noir Topaze Blanc Dominant','Noir Topaze Blanc Récessif',
            'Noir Topaze Jaune Intensif','Noir Topaze Jaune Schimmel',
            'Noir Topaze Jaune Mosaïque M','Noir Topaze Jaune Mosaïque F',
            'Noir Topaze Rouge Intensif','Noir Topaze Rouge Schimmel',
            'Noir Topaze Rouge Mosaïque M','Noir Topaze Rouge Mosaïque F',
            'Noir Topaze Ivoire Jaune Intensif','Noir Topaze Ivoire Jaune Schimmel',
            'Noir Topaze Ivoire Jaune Mosaïque M','Noir Topaze Ivoire Jaune Mosaïque F',
            'Noir Topaze Ivoire Rouge Intensif','Noir Topaze Ivoire Rouge Schimmel',
            'Brun Topaze Blanc Dominant','Brun Topaze Blanc Récessif',
            'Brun Topaze Jaune Intensif','Brun Topaze Jaune Schimmel',
            'Brun Topaze Jaune Mosaïque M','Brun Topaze Jaune Mosaïque F',
            'Brun Topaze Rouge Intensif','Brun Topaze Rouge Schimmel',
            'Brun Topaze Rouge Mosaïque M','Brun Topaze Rouge Mosaïque F',
            'Brun Topaze Ivoire Jaune Intensif','Brun Topaze Ivoire Jaune Schimmel',
            'Brun Topaze Ivoire Jaune Mosaïque M','Brun Topaze Ivoire Jaune Mosaïque F',
            'Brun Topaze Ivoire Rouge Intensif','Brun Topaze Ivoire Rouge Schimmel',
            'Agate Topaze Blanc Dominant','Agate Topaze Blanc Récessif',
            'Agate Topaze Jaune Intensif','Agate Topaze Jaune Schimmel',
            'Agate Topaze Jaune Mosaïque M','Agate Topaze Jaune Mosaïque F',
            'Agate Topaze Rouge Intensif','Agate Topaze Rouge Schimmel',
            'Agate Topaze Rouge Mosaïque M','Agate Topaze Rouge Mosaïque F',
            'Agate Topaze Ivoire Jaune Intensif','Agate Topaze Ivoire Jaune Schimmel',
            'Agate Topaze Ivoire Jaune Mosaïque M','Agate Topaze Ivoire Jaune Mosaïque F',
            'Agate Topaze Ivoire Rouge Intensif','Agate Topaze Ivoire Rouge Schimmel',
            'Isabelle Topaze Blanc Dominant','Isabelle Topaze Blanc Récessif',
            'Isabelle Topaze Jaune Intensif','Isabelle Topaze Jaune Schimmel',
            'Isabelle Topaze Jaune Mosaïque M','Isabelle Topaze Jaune Mosaïque F',
            'Isabelle Topaze Rouge Intensif','Isabelle Topaze Rouge Schimmel',
            'Isabelle Topaze Rouge Mosaïque M','Isabelle Topaze Rouge Mosaïque F',
            'Isabelle Topaze Ivoire Jaune Intensif','Isabelle Topaze Ivoire Jaune Schimmel',
            'Isabelle Topaze Ivoire Jaune Mosaïque M','Isabelle Topaze Ivoire Jaune Mosaïque F',
            'Isabelle Topaze Ivoire Rouge Intensif','Isabelle Topaze Ivoire Rouge Schimmel'
        ]
    },
    {
        code: 'D07', nom: 'Onyx', couleur: '#1a202c', emoji: '🖤',
        varietes: [
            'Noir Onyx Blanc Dominant','Noir Onyx Blanc Récessif',
            'Noir Onyx Jaune Intensif','Noir Onyx Jaune Schimmel',
            'Noir Onyx Jaune Mosaïque M','Noir Onyx Jaune Mosaïque F',
            'Noir Onyx Rouge Intensif','Noir Onyx Rouge Schimmel',
            'Noir Onyx Rouge Mosaïque M','Noir Onyx Rouge Mosaïque F',
            'Noir Onyx Ivoire Jaune Intensif','Noir Onyx Ivoire Jaune Schimmel',
            'Noir Onyx Ivoire Jaune Mosaïque M','Noir Onyx Ivoire Jaune Mosaïque F',
            'Noir Onyx Ivoire Rouge Intensif','Noir Onyx Ivoire Rouge Schimmel',
            'Brun Onyx Blanc Dominant','Brun Onyx Blanc Récessif',
            'Brun Onyx Jaune Intensif','Brun Onyx Jaune Schimmel',
            'Brun Onyx Jaune Mosaïque M','Brun Onyx Jaune Mosaïque F',
            'Brun Onyx Rouge Intensif','Brun Onyx Rouge Schimmel',
            'Brun Onyx Rouge Mosaïque M','Brun Onyx Rouge Mosaïque F',
            'Brun Onyx Ivoire Jaune Intensif','Brun Onyx Ivoire Jaune Schimmel',
            'Brun Onyx Ivoire Jaune Mosaïque M','Brun Onyx Ivoire Jaune Mosaïque F',
            'Brun Onyx Ivoire Rouge Intensif','Brun Onyx Ivoire Rouge Schimmel',
            'Agate Onyx Blanc Dominant','Agate Onyx Blanc Récessif',
            'Agate Onyx Jaune Intensif','Agate Onyx Jaune Schimmel',
            'Agate Onyx Jaune Mosaïque M','Agate Onyx Jaune Mosaïque F',
            'Agate Onyx Rouge Intensif','Agate Onyx Rouge Schimmel',
            'Agate Onyx Rouge Mosaïque M','Agate Onyx Rouge Mosaïque F',
            'Agate Onyx Ivoire Jaune Intensif','Agate Onyx Ivoire Jaune Schimmel',
            'Agate Onyx Ivoire Jaune Mosaïque M','Agate Onyx Ivoire Jaune Mosaïque F',
            'Agate Onyx Ivoire Rouge Intensif','Agate Onyx Ivoire Rouge Schimmel',
            'Isabelle Onyx Blanc Dominant','Isabelle Onyx Blanc Récessif',
            'Isabelle Onyx Jaune Intensif','Isabelle Onyx Jaune Schimmel',
            'Isabelle Onyx Jaune Mosaïque M','Isabelle Onyx Jaune Mosaïque F',
            'Isabelle Onyx Rouge Intensif','Isabelle Onyx Rouge Schimmel',
            'Isabelle Onyx Rouge Mosaïque M','Isabelle Onyx Rouge Mosaïque F',
            'Isabelle Onyx Ivoire Jaune Intensif','Isabelle Onyx Ivoire Jaune Schimmel',
            'Isabelle Onyx Ivoire Jaune Mosaïque M','Isabelle Onyx Ivoire Jaune Mosaïque F',
            'Isabelle Onyx Ivoire Rouge Intensif','Isabelle Onyx Ivoire Rouge Schimmel'
        ]
    },
    {
        code: 'D08', nom: 'Kobalt', couleur: '#2c5282', emoji: '💙',
        varietes: [
            'Noir Kobalt Blanc Dominant','Noir Kobalt Blanc Récessif',
            'Noir Kobalt Jaune Intensif','Noir Kobalt Jaune Schimmel',
            'Noir Kobalt Jaune Mosaïque M','Noir Kobalt Jaune Mosaïque F',
            'Noir Kobalt Rouge Intensif','Noir Kobalt Rouge Schimmel',
            'Noir Kobalt Rouge Mosaïque M','Noir Kobalt Rouge Mosaïque F',
            'Noir Kobalt Ivoire Jaune Intensif','Noir Kobalt Ivoire Jaune Schimmel',
            'Noir Kobalt Ivoire Jaune Mosaïque M','Noir Kobalt Ivoire Jaune Mosaïque F',
            'Noir Kobalt Ivoire Rouge Intensif','Noir Kobalt Ivoire Rouge Schimmel',
            'Brun Kobalt Blanc Dominant','Brun Kobalt Blanc Récessif',
            'Brun Kobalt Jaune Intensif','Brun Kobalt Jaune Schimmel',
            'Brun Kobalt Jaune Mosaïque M','Brun Kobalt Jaune Mosaïque F',
            'Brun Kobalt Rouge Intensif','Brun Kobalt Rouge Schimmel',
            'Brun Kobalt Rouge Mosaïque M','Brun Kobalt Rouge Mosaïque F',
            'Brun Kobalt Ivoire Jaune Intensif','Brun Kobalt Ivoire Jaune Schimmel',
            'Brun Kobalt Ivoire Jaune Mosaïque M','Brun Kobalt Ivoire Jaune Mosaïque F',
            'Brun Kobalt Ivoire Rouge Intensif','Brun Kobalt Ivoire Rouge Schimmel',
            'Agate Kobalt Blanc Dominant','Agate Kobalt Blanc Récessif',
            'Agate Kobalt Jaune Intensif','Agate Kobalt Jaune Schimmel',
            'Agate Kobalt Jaune Mosaïque M','Agate Kobalt Jaune Mosaïque F',
            'Agate Kobalt Rouge Intensif','Agate Kobalt Rouge Schimmel',
            'Agate Kobalt Rouge Mosaïque M','Agate Kobalt Rouge Mosaïque F',
            'Agate Kobalt Ivoire Jaune Intensif','Agate Kobalt Ivoire Jaune Schimmel',
            'Agate Kobalt Ivoire Jaune Mosaïque M','Agate Kobalt Ivoire Jaune Mosaïque F',
            'Agate Kobalt Ivoire Rouge Intensif','Agate Kobalt Ivoire Rouge Schimmel',
            'Isabelle Kobalt Blanc Dominant','Isabelle Kobalt Blanc Récessif',
            'Isabelle Kobalt Jaune Intensif','Isabelle Kobalt Jaune Schimmel',
            'Isabelle Kobalt Jaune Mosaïque M','Isabelle Kobalt Jaune Mosaïque F',
            'Isabelle Kobalt Rouge Intensif','Isabelle Kobalt Rouge Schimmel',
            'Isabelle Kobalt Rouge Mosaïque M','Isabelle Kobalt Rouge Mosaïque F',
            'Isabelle Kobalt Ivoire Jaune Intensif','Isabelle Kobalt Ivoire Jaune Schimmel',
            'Isabelle Kobalt Ivoire Jaune Mosaïque M','Isabelle Kobalt Ivoire Jaune Mosaïque F',
            'Isabelle Kobalt Ivoire Rouge Intensif','Isabelle Kobalt Ivoire Rouge Schimmel'
        ]
    },
    {
        code: 'D09', nom: 'Jaspe', couleur: '#702459', emoji: '🔮',
        varietes: [
            'Noir Jaspe Blanc Dominant','Noir Jaspe Blanc Récessif',
            'Noir Jaspe Jaune Intensif','Noir Jaspe Jaune Schimmel',
            'Noir Jaspe Jaune Mosaïque M','Noir Jaspe Jaune Mosaïque F',
            'Noir Jaspe Rouge Intensif','Noir Jaspe Rouge Schimmel',
            'Noir Jaspe Rouge Mosaïque M','Noir Jaspe Rouge Mosaïque F',
            'Noir Jaspe Ivoire Jaune Intensif','Noir Jaspe Ivoire Jaune Schimmel',
            'Noir Jaspe Ivoire Jaune Mosaïque M','Noir Jaspe Ivoire Jaune Mosaïque F',
            'Noir Jaspe Ivoire Rouge Intensif','Noir Jaspe Ivoire Rouge Schimmel',
            'Brun Jaspe Blanc Dominant','Brun Jaspe Blanc Récessif',
            'Brun Jaspe Jaune Intensif','Brun Jaspe Jaune Schimmel',
            'Brun Jaspe Jaune Mosaïque M','Brun Jaspe Jaune Mosaïque F',
            'Brun Jaspe Rouge Intensif','Brun Jaspe Rouge Schimmel',
            'Brun Jaspe Rouge Mosaïque M','Brun Jaspe Rouge Mosaïque F',
            'Brun Jaspe Ivoire Jaune Intensif','Brun Jaspe Ivoire Jaune Schimmel',
            'Brun Jaspe Ivoire Jaune Mosaïque M','Brun Jaspe Ivoire Jaune Mosaïque F',
            'Brun Jaspe Ivoire Rouge Intensif','Brun Jaspe Ivoire Rouge Schimmel',
            'Agate Jaspe Blanc Dominant','Agate Jaspe Blanc Récessif',
            'Agate Jaspe Jaune Intensif','Agate Jaspe Jaune Schimmel',
            'Agate Jaspe Jaune Mosaïque M','Agate Jaspe Jaune Mosaïque F',
            'Agate Jaspe Rouge Intensif','Agate Jaspe Rouge Schimmel',
            'Agate Jaspe Rouge Mosaïque M','Agate Jaspe Rouge Mosaïque F',
            'Agate Jaspe Ivoire Jaune Intensif','Agate Jaspe Ivoire Jaune Schimmel',
            'Agate Jaspe Ivoire Jaune Mosaïque M','Agate Jaspe Ivoire Jaune Mosaïque F',
            'Agate Jaspe Ivoire Rouge Intensif','Agate Jaspe Ivoire Rouge Schimmel',
            'Isabelle Jaspe Blanc Dominant','Isabelle Jaspe Blanc Récessif',
            'Isabelle Jaspe Jaune Intensif','Isabelle Jaspe Jaune Schimmel',
            'Isabelle Jaspe Jaune Mosaïque M','Isabelle Jaspe Jaune Mosaïque F',
            'Isabelle Jaspe Rouge Intensif','Isabelle Jaspe Rouge Schimmel',
            'Isabelle Jaspe Rouge Mosaïque M','Isabelle Jaspe Rouge Mosaïque F',
            'Isabelle Jaspe Ivoire Jaune Intensif','Isabelle Jaspe Ivoire Jaune Schimmel',
            'Isabelle Jaspe Ivoire Jaune Mosaïque M','Isabelle Jaspe Ivoire Jaune Mosaïque F',
            'Isabelle Jaspe Ivoire Rouge Intensif','Isabelle Jaspe Ivoire Rouge Schimmel'
        ]
    }
];

// Convertir un nom de variété en paramètres moteur
function nomVersParams(nomOriginal, sexeConnu) {
    var p = {
        base: 'Noir', mutations: [], porteurs: [],
        plume: 'Intensif', fond: 'Jaune'
    };

    var carrierMap = { 'Recessive White': 'Blanc Récessif', 'Dominant White': 'Blanc Dominant' };

    // Extraire d'abord tous les "porteur X" (et "porteur X & Y") pour ne pas les
    // confondre avec une mutation visuelle ou un fond visuel lors du reste de l'analyse.
    var porteurRegex = /porteur ([^·)]+)/g;
    var mPort;
    while ((mPort = porteurRegex.exec(nomOriginal)) !== null) {
        mPort[1].split('&').forEach(function(part) {
            part = part.trim();
            if (!part) return;
            p.porteurs.push(carrierMap[part] || part);
        });
    }
    var nom = nomOriginal.replace(/porteur [^·)]+/g, '');

    // Fond (le moteur genetics.js renvoie parfois les mots en anglais)
    if (nom.indexOf('Blanc Dominant') >= 0 || nom.indexOf('Dominant White') >= 0)  { p.fond = 'Blanc Dominant'; }
    else if (nom.indexOf('Blanc Récessif') >= 0 || nom.indexOf('Recessive White') >= 0) { p.fond = 'Blanc Récessif'; }
    else if (nom.indexOf('Ivoire Rouge') >= 0 || nom.indexOf('Ivory Red') >= 0)   { p.fond = 'Rouge'; p.mutations.push('Ivoire'); }
    else if (nom.indexOf('Ivoire Jaune') >= 0 || nom.indexOf('Ivory Yellow') >= 0)   { p.fond = 'Jaune'; p.mutations.push('Ivoire'); }
    else if (nom.indexOf('Orangé') >= 0)                     { p.fond = 'Orangé'; }
    else if (nom.indexOf('Rouge') >= 0 || nom.indexOf('Red') >= 0)          { p.fond = 'Rouge'; }
    else                                         { p.fond = 'Jaune'; }

    // Structure
    if (nom.indexOf('Mosaïque M') >= 0 || nom.indexOf('Mosaïque T1') >= 0)      p.plume = 'Mosaïque T1';
    else if (nom.indexOf('Mosaïque F') >= 0 || nom.indexOf('Mosaïque T2') >= 0) p.plume = 'Mosaïque T2';
    else if (nom.indexOf('Mosaïque') >= 0) {
        // Type non précisé dans le nom -- déduit du sexe réel si on le connaît
        // (une femelle Mosaïque sans autre précision est forcément T2, pas T1).
        p.plume = (sexeConnu && sexeConnu.indexOf('Femelle') >= 0) ? 'Mosaïque T2' : 'Mosaïque T1';
    }
    else if (nom.indexOf('Schimmel') >= 0 || nom.indexOf('Non-Intense') >= 0)   p.plume = 'Schimmel';
    else                                     p.plume = 'Intense';

    // Mélanine de base — restreinte à Noir/Lipochrome/Panaché/Sauvage désormais
    // (Brun/Agate/Isabelle/Pastel/Ivoire ne sont plus des valeurs de base, voir plus bas)
    // AJOUTÉ v5 : reconnaissance de "Panaché (base X)" — sans ce test, un
    // jeune Panaché réinjecté comme parent tombait silencieusement dans le
    // else et redevenait un Noir pur classique (perte du génotype E/e caché).
    if (/^Panaché/.test(nomOriginal)) p.base = 'Panaché';
    else if (nom.indexOf('Lipochrome') >= 0 || nom.match(/^(Jaune|Rouge|Orangé|Blanc)/) || nom.match(/^Ivoire (Jaune|Rouge)/)) p.base = 'Lipochrome';
    else if (nom.indexOf('Wild Type') >= 0 || nom.match(/^Sauvage\b/)) p.base = 'Sauvage';
    else                                   p.base = 'Noir';

    // Mutations visuelles
    // Isabelle = Brun + Agate combinés (VALIDÉ 19/07/2026) — on coche les deux cases.
    if (nom.indexOf('Isabelle') >= 0) {
        p.mutations.push('Brun');
        p.mutations.push('Agate');
    } else {
        if (nom.match(/Brun (Pur|Visuel)/) || nom.indexOf('Brun Satiné') >= 0)  p.mutations.push('Brun');
        if (nom.match(/Agate (Pur|Visuel)/)) p.mutations.push('Agate');
    }
    if (nom.match(/Pastel (Pur|Visuel)/) || nom.indexOf('+ Pastel') >= 0) p.mutations.push('Pastel');
    if (nom.match(/Ivoire (Pur|Visuel)/) || nom.indexOf('+ Ivoire') >= 0) p.mutations.push('Ivoire');
    if (nom.match(/Satiné (Pur|Visuel)/)) p.mutations.push('Satiné');
    if (nom.indexOf('Opale') >= 0)   p.mutations.push('Opale');
    if (nom.indexOf('Phaeo') >= 0)   p.mutations.push('Phaeo');
    if (nom.indexOf('Topaze') >= 0)  p.mutations.push('Topaze');
    if (nom.indexOf('Onyx') >= 0)    p.mutations.push('Onyx');
    if (nom.indexOf('Kobalt') >= 0)  p.mutations.push('Cobalt');
    if (nom.indexOf('Jaspe') >= 0)   p.mutations.push('Jaspe');

    return p;
}

// ============================================
//   TOAST
// ============================================
function showToast(msg, type) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast ' + type + ' show';
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { t.className = 'toast ' + type; }, 3000);
}

// ============================================
//   NAVIGATION
// ============================================
function naviguerVers(pId, btn) {
    document.querySelectorAll('.app-page').forEach(function(p) { p.classList.remove('active'); });
    document.getElementById(pId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    if (btn) btn.classList.add('active');
}

function afficherRappelImport() {
    var r = document.getElementById('rappel-import');
    if (r) r.style.display = 'block';
}
function fermerRappel() {
    var r = document.getElementById('rappel-import');
    if (r) r.style.display = 'none';
}

// ============================================
//   GÉNÉRATION DES CATÉGORIES DÉPLIABLES
// ============================================
function générerCategories() {
    var container = document.getElementById('categories-container');
    if (!container) return;
    var h = '';
    CATEGORIES.forEach(function(cat, ci) {
        h += '<div class="cat-bloc">';
        h += '<button class="cat-header" onclick="toggleCategorie(' + ci + ')" style="border-left:4px solid ' + cat.couleur + ';">';
        h += '<span>' + cat.emoji + ' ' + cat.code + ' — ' + cat.nom + '</span>';
        h += '<span class="cat-count">' + cat.varietes.length + ' variétés</span>';
        h += '<span class="cat-arrow" id="arrow-' + ci + '">▼</span>';
        h += '</button>';
        h += '<div class="cat-list" id="cat-list-' + ci + '" style="display:none;">';
        cat.varietes.forEach(function(v, vi) {
            var id = 'var-' + ci + '-' + vi;
            h += '<button class="var-item" id="' + id + '" onclick="clicVariete(\'' + v + '\',\'' + id + '\')">';
            h += v;
            h += '</button>';
        });
        h += '</div>';
        h += '</div>';
    });
    container.innerHTML = h;
}

// Pliage/dépliage des sections du Glossaire — vrai accordéon : n'en ouvre
// jamais deux à la fois, ouvrir une section referme automatiquement celle
// qui était ouverte.
function toggleGlossaire(i) {
    var list  = document.getElementById('glo-list-' + i);
    var arrow = document.getElementById('glo-arrow-' + i);
    if (!list) return;
    var etaitOuverte = list.style.display !== 'none';
    for (var n = 0; n <= 14; n++) {
        var l = document.getElementById('glo-list-' + n);
        var a = document.getElementById('glo-arrow-' + n);
        if (l) l.style.display = 'none';
        if (a) a.textContent = '▼';
    }
    if (!etaitOuverte) {
        list.style.display = 'flex';
        if (arrow) arrow.textContent = '▲';
        // Repart toujours du début de la section qu'on vient d'ouvrir (son
        // en-tête), plutôt que de laisser la page où elle était scrollée.
        setTimeout(function() {
            var header = arrow ? arrow.closest('.cat-header') : null;
            if (header) header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

function toggleCategorie(ci) {
    var list  = document.getElementById('cat-list-' + ci);
    var arrow = document.getElementById('arrow-' + ci);
    if (!list) return;
    var etaitOuverte = list.style.display !== 'none';
    CATEGORIES.forEach(function(c, n) {
        var l = document.getElementById('cat-list-' + n);
        var a = document.getElementById('arrow-' + n);
        if (l) l.style.display = 'none';
        if (a) a.textContent = '▼';
    });
    if (!etaitOuverte) {
        list.style.display = 'flex';
        if (arrow) arrow.textContent = '▲';
        setTimeout(function() {
            var header = arrow ? arrow.closest('.cat-header') : null;
            if (header) header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

// ============================================
//   CLIC SUR UNE VARIÉTÉ
// ============================================
var lastPereId  = null;
var lastMereId  = null;

function clicVariete(nom, btnId) {
    var params = nomVersParams(nom);
    if (typeof reinitialiserBaguesParents === 'function') reinitialiserBaguesParents();
    if (typeof chaineEnCoursId !== 'undefined') chaineEnCoursId = null;

    if (selectionState === 0) {
        // Enlever surbrillance père précédent
        if (lastPereId) {
            var old = document.getElementById(lastPereId);
            if (old) old.classList.remove('var-selected-pere');
        }
        // Appliquer surbrillance père
        var btn = document.getElementById(btnId);
        if (btn) btn.classList.add('var-selected-pere');
        lastPereId = btnId;

        // Remplir le formulaire père
        appliquerParamsCalculateur('m', params);
        document.getElementById('m-selection').textContent = '✅ Père : ' + nom;
        selectionState = 1;
        showToast('🔵 Père sélectionné : ' + nom, 'pere');
    } else {
        // Enlever surbrillance mère précédent
        if (lastMereId) {
            var oldM = document.getElementById(lastMereId);
            if (oldM) oldM.classList.remove('var-selected-mere');
        }
        // Appliquer surbrillance mère
        var btnM = document.getElementById(btnId);
        if (btnM) btnM.classList.add('var-selected-mere');
        lastMereId = btnId;

        // Remplir le formulaire mère
        appliquerParamsCalculateur('f', params);
        document.getElementById('f-selection').textContent = '✅ Mère : ' + nom;
        selectionState = 0;
        showToast('🔴 Mère sélectionnée : ' + nom, 'mere');
    }
    verifierFacteursLetaux();
}

function appliquerParamsCalculateur(prefix, params) {
    // Mélanine de base — restreinte à Noir/Lipochrome/Sauvage ; Brun/Agate/Pastel/
    // Satiné/Ivoire sont déjà placés dans params.mutations par nomVersParams().
    var baseEl = document.getElementById(prefix + '-base');
    if (baseEl) { baseEl.value = params.base; mettreAJourMutations(prefix); }

    // Décocher tout
    document.querySelectorAll('input[name="' + prefix + '-mut"]').forEach(function(cb) { cb.checked = false; });
    document.querySelectorAll('input[name="' + prefix + '-port"]').forEach(function(cb) { cb.checked = false; });

    // Cocher mutations
    params.mutations.forEach(function(m) {
        var cb = document.querySelector('input[name="' + prefix + '-mut"][value="' + m + '"]');
        if (cb) cb.checked = true;
    });
    params.porteurs.forEach(function(p) {
        var cb = document.querySelector('input[name="' + prefix + '-port"][value="' + p + '"]');
        if (cb) cb.checked = true;
    });

    // Structure
    var plumeEl = document.getElementById(prefix + '-plume');
    if (plumeEl) {
        if (params.plume === 'Mosaïque T1' || params.plume === 'Mosaïque T2') {
            plumeEl.value = 'Mosaïque';
            onChangePlume(prefix);
            var radio = document.querySelector('input[name="' + prefix + '-mosaic"][value="' + (params.plume === 'Mosaïque T1' ? 'T1' : 'T2') + '"]');
            if (radio) radio.checked = true;
        } else if (params.plume === 'Mosaïque') {
            // Type non précisé (ex: oiseau du Cheptel saisi via le formulaire, qui
            // n'offre qu'un choix "Mosaïque" générique sans T1/T2) — on déduit le
            // type du sexe réel de l'oiseau plutôt que de laisser le radio HTML sur
            // son T1 par défaut, qui ignorait le cas d'une femelle Mosaïque.
            plumeEl.value = 'Mosaïque';
            onChangePlume(prefix);
            var sexeConnu = params.sexe || '';
            var typeParDefaut = sexeConnu.indexOf('Femelle') >= 0 ? 'T2' : (sexeConnu.indexOf('Mâle') >= 0 ? 'T1' : (prefix === 'f' ? 'T2' : 'T1'));
            var radioDefaut = document.querySelector('input[name="' + prefix + '-mosaic"][value="' + typeParDefaut + '"]');
            if (radioDefaut) radioDefaut.checked = true;
        } else {
            plumeEl.value = params.plume;
            onChangePlume(prefix);
        }
    }

    // Fond
    var fondEl = document.getElementById(prefix + '-fond');
    if (fondEl) fondEl.value = params.fond;

    // Les cases cochées par script ne déclenchent pas onchange — on met à jour
    // le résumé à la main, et on déplie le panneau s'il y a quelque chose à voir.
    mettreAJourResumeMutations(prefix);
    if (params.mutations.length > 0 || params.porteurs.length > 0) {
        var panel = document.getElementById(prefix + '-mut-panel');
        var arrow = document.getElementById(prefix + '-mut-arrow');
        if (panel) panel.style.display = 'block';
        if (arrow) arrow.textContent = '▼';
    }
}

// ============================================
//   LEXIQUE
// ============================================
function switchTab(tab) {
    activeTab = tab;
    ['sommaire','cours','com','fiches','glossaire','tuto','faq'].forEach(function(t) {
        var s = document.getElementById('lex-section-' + t);
        var b = document.getElementById('tab-' + t);
        if (s) s.style.display = t === tab ? 'block' : 'none';
        if (b) b.classList.toggle('active-tab', t === tab);
    });
    var search = document.getElementById('lexique-search');
    if (search) search.value = '';
    var fsearch = document.getElementById('fiches-search');
    if (fsearch) fsearch.value = '';
    // Réinitialise un éventuel filtre laissé par filtrerLexique()/voirDansGrille() —
    // sans ça, les fiches masquées par une recherche précédente (ex: bouton "Voir"
    // du calculateur) restaient cachées à vie. .variety-sheet est partagé par
    // COM/Mutations/Hybrides, et .lexique-box par le Glossaire ET la FAQ — il faut
    // réinitialiser les deux, sinon Glossaire/FAQ restent vides après un "Voir".
    document.querySelectorAll('.variety-sheet').forEach(function(el) { el.style.display = ''; });
    document.querySelectorAll('.lex-cat-block').forEach(function(block) { block.style.display = ''; });
    document.querySelectorAll('.lexique-box').forEach(function(el) { el.style.display = ''; });
    document.querySelectorAll('.fiche-detaillee').forEach(function(el) { el.style.display = ''; });
    // Les sous-catégories D00-D09 (COM et Fiches) restent repliées par défaut —
    // contrairement aux autres resets ci-dessus, on force 'none' (pas '') sinon
    // elles s'afficheraient toutes grandes ouvertes faute de règle CSS par défaut.
    document.querySelectorAll('[id^="com-cat-list-"], [id^="fiches-cat-list-"], [id^="cours-cat-list-"]').forEach(function(l) { l.style.display = 'none'; });
    document.querySelectorAll('[id^="com-cat-arrow-"], [id^="fiches-cat-arrow-"], [id^="cours-cat-arrow-"]').forEach(function(a) { a.textContent = '▼'; });
}

// Navigue vers un onglet du Lexique, et optionnellement une ancre précise à l'intérieur
var ANCRE_VERS_SECTION_GLOSSAIRE = {
    'anc-alertes': 0, 'anc-melanines': 1, 'anc-lipochromes': 1, 'anc-mutations': 2, 'anc-histoire': 3, 'anc-grandsnoms': 9, 
    'anc-dictionnaire': 10, 'anc-materiel': 11, 'anc-alimentation': 12, 'anc-concours': 13, 'anc-cycle': 14, 
    'melanine-de-base': 1, 'noir': 1, 'brun': 1, 'agate': 1, 'isabelle': 1, 'pheomelanine': 1, 'anc-lipochromes': 1, 
    'jaune': 1, 'rouge': 1, 'blanc-dominant': 1, 'blanc-recessif': 1, 'ivoire': 1, 'mosaique': 1, 'intensif': 1, 
    'schimmel': 1, 'lie-au-sexe': 2, 'pastel': 2, 'recessif-libre': 2, 'opale': 2, 'topaze': 2, 'eumo': 2, 'onyx': 2, 
    'phaeo': 2, 'jaspe': 2, 'kobalt': 2, 'satine': 2, 'crossing-over': 2, 'pur-et-visuel-dans-les-resultats': 2, 
    'des-iles-canaries-a-la-domestication-mondiale': 3, '1402-1496-decouverte-et-conquete': 3, 'xvie-siecle-le-monopole-espagnol-et-le-secret-des-moines': 3, 
    '1622-le-naufrage-de-l-ile-d-elbe': 3, 'xviiie-xixe-siecle-l-age-d-or-et-la-specialisation-regionale': 3, 
    '1921-la-revolution-genetique-et-le-canari-rouge': 3, '1950-2000-l-explosion-des-mutations-de-couleur': 3, 
    'xxie-siecle-l-elevage-genetique-de-precision': 3, 'harzer-roller': 4, 'timbrado-espanol': 4, 'malinois': 4, 
    'canaris-de-posture': 4, '1-famille-des-frises': 4, '2-famille-des-lisses-de-forme': 4, '3-famille-des-huppes': 4, 
    '4-famille-posture-redressee': 4, '5-famille-de-dessin-le-lizard': 4, 'la-mue': 5, 'besoins-pendant-la-mue': 5, 
    'acarien-rouge': 5, 'coccidiose': 5, 'acarien-des-sacs-aeriens': 5, 'longevite-prevention': 5, 'bague-fermee': 6, 
    'elevage-au-nid': 6, 'patee-d-elevage': 6, 'juge-ornithologue': 6, 'canari-de-posture': 6, 'titi': 7, 
    'symbole-domestique': 7, 'porte-bonheur-des-marins': 7, 'l-etymologie-des-iles-canaries': 7, 'structure-du-plumage': 8, 
    'intensif-vs-schimmel': 8, 'systeme-respiratoire-sacs-aeriens': 8, 'la-syrinx': 8, 'systeme-digestif': 8, 
    'metabolisme-des-pigments': 8, 'declenchement-de-la-reproduction': 8, 'plaque-incubatrice': 8, 'formation-de-l-uf': 8, 
    'mirage-developpement-embryonnaire': 8, 'dr-hans-duncker': 9, 'karl-reich': 9, 'dr-maurice-pomarede': 9, 
    'jose-antonio-abellan-banos': 9, 'guillermo-cabrera-amat': 9, 'pietro-lucca': 9, 'c-o-m-confederation-ornithologique-mondiale': 9, 
    'o-m-j-ordre-mondial-des-juges': 9, 'u-o-f': 9, 'dict-acromelanique': 10, 'dict-allele': 10, 'dict-atoxoplasmose': 10, 
    'dict-autosome': 10, 'dict-carophylle-rouge': 10, 'dict-carotenoide': 10, 'dict-cloaque': 10, 'dict-co-dominance': 10, 
    'dict-colibacillose': 10, 'dict-dilution': 10, 'dict-enrofloxacine': 10, 'dict-grit': 10, 'dict-heterogametique': 10, 
    'dict-homozygote': 10, 'dict-incrustation': 10, 'dict-ivermectine': 10, 'dict-letal': 10, 'dict-megabacteriose': 10, 
    'dict-meiose': 10, 'dict-oviducte': 10, 'dict-passerine': 10, 'dict-phenotype': 10, 'dict-pica': 10, 'dict-pododermatite': 10, 
    'dict-rectrices': 10, 'dict-tarse': 10, 'dict-tison': 10, 'dict-toltrazuril': 10, 'dict-variole-du-canari': 10, 
    'cages-d-elevage': 11, 'volieres-d-assouplissement': 11, 'cages-de-concours': 11, 'perchoirs': 11, 'mangeoires-buvettes': 11, 
    'nids': 11, 'eclairage-programme': 11, 'regulation-du-climat': 11, 'outils-de-precision': 11, 'base-du-melange-de-graines': 12, 
    'regime-en-periode-de-repos': 12, 'regime-en-preparation-reproduction': 12, 'regime-en-periode-de-mue': 12, 
    'mineraux-assainisseurs': 12, 'les-3-pigments-colorants-du-rouge': 12, 'calendrier-de-coloration': 12, 
    'protection-hepatique-pendant-la-coloration': 12, 'selection-des-sujets': 13, 'ecolage-des-canaris-de-chant': 13, 
    'entrainement-couleur-posture': 13, 'grille-de-notation-c-o-m': 13, 'diametres-reglementaires-des-bagues-c-o-m': 13, 
    'le-jour-j-enlogement': 13, 'bague-fermee-officielle': 13, 'attestation-de-cession': 13, 'les-4-phases-de-l-annee': 14, 
    'photoperiode-le-declencheur-hormonal': 14, 'temperature-hygrometrie-ideales': 14, 'preparation-nutritionnelle-des-reproducteurs': 14, 
    'signes-de-bonne-condition-avant-accouplement': 14, 'mise-en-menage-ponte': 14, 'incubation-mirage': 14, 
    'eclosion-premiers-jours': 14, 'baguage': 14, 'chronologie-du-sevrage': 14, 'ethique-de-selection': 14, 
    'modele-fiche-de-suivi-de-cage': 14, 'modele-registre-matricule-du-cheptel': 14
};
function allerA(tab, ancre) {
    switchTab(tab);
    if (ancre) {
        var sectionIdx = ANCRE_VERS_SECTION_GLOSSAIRE[ancre];
        if (sectionIdx !== undefined) {
            // Vrai accordéon : referme toutes les autres sections avant d'ouvrir
            // celle qui contient le terme ciblé.
            for (var n = 0; n <= 14; n++) {
                var l = document.getElementById('glo-list-' + n);
                var a = document.getElementById('glo-arrow-' + n);
                if (l) l.style.display = 'none';
                if (a) a.textContent = '▼';
            }
            var list = document.getElementById('glo-list-' + sectionIdx);
            var arrow = document.getElementById('glo-arrow-' + sectionIdx);
            if (list) list.style.display = 'flex';
            if (arrow) arrow.textContent = '▲';
        }
        setTimeout(function() {
            var el = document.getElementById(ancre);
            // Centre le terme visé au milieu de l'écran plutôt qu'en haut —
            // plus lisible et sans risque d'être masqué par la barre du haut.
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function filtrerLexique(query) {
    var q = query.toLowerCase().trim();
    if (!q) { switchTab(activeTab); return; }
    ['cours','com','glossaire'].forEach(function(t) {
        var s = document.getElementById('lex-section-' + t);
        var b = document.getElementById('tab-' + t);
        if (s) s.style.display = 'block';
        if (b) b.classList.remove('active-tab');
    });
    var tuto = document.getElementById('lex-section-tuto');
    if (tuto) tuto.style.display = 'none';
    document.querySelectorAll('.variety-sheet').forEach(function(el) {
        el.style.display = el.textContent.toLowerCase().indexOf(q) >= 0 ? 'block' : 'none';
    });
    document.querySelectorAll('.lex-cat-block').forEach(function(block) {
        var hasVisible = block.querySelector('.variety-sheet[style*="display: block"]');
        block.style.display = hasVisible ? 'block' : 'none';
        var innerList = block.querySelector('[id^="com-cat-list-"]');
        var innerArrow = block.querySelector('[id^="com-cat-arrow-"]');
        if (innerList) innerList.style.display = hasVisible ? 'block' : 'none';
        if (innerArrow) innerArrow.textContent = hasVisible ? '▲' : '▼';
    });
    document.querySelectorAll('.lexique-box').forEach(function(el) {
        el.style.display = el.textContent.toLowerCase().indexOf(q) >= 0 ? 'block' : 'none';
    });
    for (var i = 0; i <= 14; i++) {
        var list = document.getElementById('glo-list-' + i);
        var arrow = document.getElementById('glo-arrow-' + i);
        if (list) list.style.display = 'flex';
        if (arrow) arrow.textContent = '▲';
    }
}

// ============================================
//   DESCRIPTION AUTOMATIQUE D'UNE VARIÉTÉ COM
// ============================================
// Les 590 variétés COM sont des combinaisons systématiques de 4 briques
// (base mélanique, mutation de catégorie, fond, structure). Plutôt que
// d'écrire 590 fiches à la main (intenable à maintenir), on compose une
// description courte à partir de ces briques, en réutilisant les mêmes
// définitions déjà validées que le Glossaire.
var VARIETE_BASE_DEFS = {
    'Isabelle': 'Cumul des mutations Brun et Agate — teinte brun-gris clair et chaud.',
    'Brun':     'Mutation liée au sexe qui dilue et réchauffe la mélanine noire en brun chocolat.',
    'Agate':    'Mutation liée au sexe qui éclaircit et refroidit la mélanine noire en gris-bleuté.',
    'Noir':     'Mélanine de base non mutée (oxydée classique).'
};
var VARIETE_CAT_DEFS = {
    'Pastel':  'Pastel : éclaircit et estompe la mélanine, aspect plus doux et diffus.',
    'Opale':   'Opale : refroidit et éclaircit la mélanine, aspect bleuté-gris.',
    'Phaeo':   'Phaeo : remplace l\'eumélanine noire/brune par de la phéomélanine brun-roux.',
    'Satiné':  'Satiné : allèle d\'Agate (même locus), éclaircit fortement la mélanine.',
    'Topaze':  'Topaze : réchauffe la mélanine vers des tons dorés.',
    'Onyx':    'Onyx : assombrit et densifie la mélanine.',
    'Kobalt':  'Cobalt : bleuit intensément la mélanine (double facteur létal).',
    'Jaspe':   'Jaspe : mutation dominante à hérédité libre, sans facteur létal — aspect marbré/tacheté, Double Facteur juste plus dilué.'
};
var VARIETE_FOND_DEFS = {
    'Ivoire Jaune':   'Fond : Ivoire sur Jaune — adoucit et éclaircit le lipochrome.',
    'Ivoire Rouge':   'Fond : Ivoire sur Rouge — adoucit et éclaircit le lipochrome.',
    'Blanc Dominant': 'Fond : Blanc Dominant — absence de lipochrome, mutation dominante (double facteur létal).',
    'Blanc Récessif': 'Fond : Blanc Récessif — absence de lipochrome, mutation récessive (sans risque létal).',
    'Jaune': 'Fond : Jaune — lipochrome naturel du canari domestique.',
    'Rouge': 'Fond : Rouge — introduit historiquement par croisement avec le Tarin du Venezuela.'
};
var VARIETE_STRUCT_DEFS = {
    'Mosaïque M': 'Structure : Mosaïque (♂) — lipochrome limité au masque facial.',
    'Mosaïque F': 'Structure : Mosaïque (♀) — lipochrome limité à la ligne oculaire.',
    'Schimmel':   'Structure : Schimmel — lipochrome incomplet, aspect plus clair et givré.',
    'Intensif':   'Structure : Intensif — lipochrome uniforme sur toute la plume.'
};
function genererDescriptionVariete(nom) {
    var parts = [];
    if (nom.indexOf('Isabelle') >= 0)      parts.push(VARIETE_BASE_DEFS['Isabelle']);
    else if (nom.indexOf('Brun') >= 0)     parts.push(VARIETE_BASE_DEFS['Brun']);
    else if (nom.indexOf('Agate') >= 0)    parts.push(VARIETE_BASE_DEFS['Agate']);
    else if (nom.match(/^Noir\b/))         parts.push(VARIETE_BASE_DEFS['Noir']);

    Object.keys(VARIETE_CAT_DEFS).forEach(function(m) {
        if (nom.indexOf(m) >= 0) parts.push(VARIETE_CAT_DEFS[m]);
    });

    if (nom.indexOf('Ivoire Jaune') >= 0)        parts.push(VARIETE_FOND_DEFS['Ivoire Jaune']);
    else if (nom.indexOf('Ivoire Rouge') >= 0)   parts.push(VARIETE_FOND_DEFS['Ivoire Rouge']);
    else if (nom.indexOf('Blanc Dominant') >= 0) parts.push(VARIETE_FOND_DEFS['Blanc Dominant']);
    else if (nom.indexOf('Blanc Récessif') >= 0) parts.push(VARIETE_FOND_DEFS['Blanc Récessif']);
    else if (nom.indexOf('Jaune') >= 0)          parts.push(VARIETE_FOND_DEFS['Jaune']);
    else if (nom.indexOf('Rouge') >= 0)          parts.push(VARIETE_FOND_DEFS['Rouge']);

    if (nom.indexOf('Mosaïque M') >= 0)     parts.push(VARIETE_STRUCT_DEFS['Mosaïque M']);
    else if (nom.indexOf('Mosaïque F') >= 0) parts.push(VARIETE_STRUCT_DEFS['Mosaïque F']);
    else if (nom.indexOf('Schimmel') >= 0)   parts.push(VARIETE_STRUCT_DEFS['Schimmel']);
    else if (nom.indexOf('Intensif') >= 0)   parts.push(VARIETE_STRUCT_DEFS['Intensif']);

    // Couleur des yeux et du bec/pattes selon la série de base, avec
    // dérogation pour les mutations qui changent la couleur des yeux
    // (Satiné, Topaze, Eumo, Phaeo — toutes yeux rouges/rubis à des degrés
    // divers ; les autres gardent la couleur de leur série).
    var becPattes = 'Oxydés (Noirs)';
    if (nom.indexOf('Isabelle') >= 0 || nom.indexOf('Agate') >= 0) becPattes = 'Dépigmentés (Chair)';
    else if (nom.indexOf('Brun') >= 0) becPattes = 'Dilués (Brun)';
    else if (nom.match(/^(Jaune|Rouge|Orangé|Blanc|Ivoire)/)) becPattes = 'Dépigmentés (Chair)';

    var yeux = 'Noirs';
    if (nom.indexOf('Satiné') >= 0)      yeux = 'Rouges/Rubis dès la naissance';
    else if (nom.indexOf('Topaze') >= 0) yeux = 'Rouges à la naissance, foncent à l\'âge adulte';
    else if (nom.indexOf('Eumo') >= 0)   yeux = 'Rouge Rubis à l\'âge adulte';
    else if (nom.indexOf('Phaeo') >= 0)  yeux = 'Rouge vif';

    parts.push('👁️ Yeux : ' + yeux + ' · 🦶 Bec/pattes : ' + becPattes + '.');

    return parts.join(' ');
}

// Extrait les mutations d'un nom de variété COM brut (format Lexique, sans
// suffixe Pur/Visuel — différent des résultats du calculateur que parse
// nomVersParams). Utilisé uniquement pour afficher le code génétique bonus.
function extraireMutationsDuNom(nom) {
    var mutations = [];
    if (nom.indexOf('Isabelle') >= 0) { mutations.push('Brun'); mutations.push('Agate'); }
    else if (nom.indexOf('Brun') >= 0) mutations.push('Brun');
    else if (nom.indexOf('Agate') >= 0) mutations.push('Agate');
    ['Pastel', 'Satiné', 'Ivoire', 'Opale', 'Topaze', 'Phaeo', 'Eumo', 'Onyx'].forEach(function(m) {
        if (nom.indexOf(m) >= 0 && mutations.indexOf(m) < 0) mutations.push(m);
    });
    if (nom.indexOf('Kobalt') >= 0) mutations.push('Cobalt');
    if (nom.indexOf('Jaspe') >= 0) mutations.push('Jaspe');
    return mutations;
}

// Accordéon générique pour les catégories D00-D09 du Lexique (COM et
// Fiches ont chacun leur propre groupe d'accordéon, distingués par prefix).
function toggleCatLexique(prefix, code) {
    var list  = document.getElementById(prefix + '-cat-list-' + code);
    var arrow = document.getElementById(prefix + '-cat-arrow-' + code);
    if (!list) return;
    var etaitOuverte = list.style.display !== 'none';
    document.querySelectorAll('[id^="' + prefix + '-cat-list-"]').forEach(function(l) { l.style.display = 'none'; });
    document.querySelectorAll('[id^="' + prefix + '-cat-arrow-"]').forEach(function(a) { a.textContent = '▼'; });
    if (!etaitOuverte) {
        list.style.display = 'block';
        if (arrow) arrow.textContent = '▲';
        setTimeout(function() {
            var header = arrow ? arrow.closest('.cat-header') : null;
            if (header) header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

// Devine la catégorie D00-D09 d'une fiche détaillée à partir de son titre
// (les fiches n'ont pas de code de catégorie stocké — dérivé ici pour
// pouvoir les regrouper comme les variétés COM).
function categorieDeFiche(titre) {
    if (titre.indexOf('Lipochrome') === 0) return 'D00';
    if (titre.indexOf('Jaspe') >= 0)   return 'D09';
    if (titre.indexOf('Kobalt') >= 0)  return 'D08';
    if (titre.indexOf('Onyx') >= 0)    return 'D07';
    if (titre.indexOf('Topaze') >= 0)  return 'D06';
    if (titre.indexOf('Satiné') >= 0)  return 'D05';
    if (titre.indexOf('Phaeo') >= 0)   return 'D04';
    if (titre.indexOf('Opale') >= 0)   return 'D03';
    if (titre.indexOf('Pastel') >= 0)  return 'D02';
    return 'D01';
}

function générerFichesLexique() {
    // Section COM — maintenant basée sur CATEGORIES, chaque catégorie rabattable
    var h = '';
    CATEGORIES.forEach(function(cat) {
        h += '<div class="cat-bloc lex-cat-block" id="lex-cat-' + cat.code + '" style="margin-bottom:12px;">';
        h += '<button class="cat-header" onclick="toggleCatLexique(\'com\',\'' + cat.code + '\')" style="border-left:4px solid ' + cat.couleur + ';">';
        h += '<span>' + cat.emoji + ' ' + cat.code + ' — ' + cat.nom + ' (' + cat.varietes.length + ')</span>';
        h += '<span class="cat-arrow" id="com-cat-arrow-' + cat.code + '">▼</span></button>';
        h += '<div id="com-cat-list-' + cat.code + '" style="display:none;">';
        cat.varietes.forEach(function(v, vi) {
            h += '<div class="variety-sheet" id="lex-var-' + cat.code + '-' + vi + '" style="border-left-color:' + cat.couleur + ';">';
            h += '<div class="variety-sheet-name">' + v + '</div>';
            h += '<div class="variety-sheet-info">' + genererDescriptionVariete(v) + '</div>';
            if (typeof genererCodeGenetique === 'function') {
                var muts = extraireMutationsDuNom(v);
                h += '<div style="font-family:monospace;font-size:0.72rem;color:#4a5568;margin-top:2px;">🔬 ♂ ' + genererCodeGenetique('♂ Mâle', muts, []) + ' · ♀ ' + genererCodeGenetique('♀ Femelle', muts, []) + '</div>';
            }
            var safe = v.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
            h += '<button class="btn-voir" style="margin-top:4px;" onclick="voirFicheDetaillee(\'' + safe + '\')">📖 Fiche complète</button>';
            h += '</div>';
        });
        h += '</div></div>';
    });
    var comContainer = document.getElementById('lex-com-container');
    if (comContainer) comContainer.innerHTML = h;

    // Fiches détaillées (222) — regroupées par les mêmes catégories D00-D09, rabattables
    if (typeof databaseFichesDetaillees !== 'undefined') {
        var groupes = {};
        databaseFichesDetaillees.forEach(function(f, fi) {
            var code = categorieDeFiche(f.titre);
            if (!groupes[code]) groupes[code] = [];
            groupes[code].push({ f: f, fi: fi });
        });
        var hf = '';
        CATEGORIES.forEach(function(cat) {
            var items = groupes[cat.code] || [];
            if (!items.length) return;
            hf += '<div class="cat-bloc" style="margin-bottom:12px;">';
            hf += '<button class="cat-header" onclick="toggleCatLexique(\'fiches\',\'' + cat.code + '\')" style="border-left:4px solid ' + cat.couleur + ';">';
            hf += '<span>' + cat.emoji + ' ' + cat.code + ' — ' + cat.nom + ' (' + items.length + ')</span>';
            hf += '<span class="cat-arrow" id="fiches-cat-arrow-' + cat.code + '">▼</span></button>';
            hf += '<div id="fiches-cat-list-' + cat.code + '" style="display:none;">';
            items.forEach(function(it) {
                hf += '<div class="fiche-detaillee" id="fiche-det-' + it.fi + '">';
                hf += '<div class="fiche-detaillee-titre">' + it.f.titre + '</div>';
                hf += '<div class="fiche-detaillee-corps">' + it.f.html + '</div>';
                hf += '</div>';
            });
            hf += '</div></div>';
        });
        var fichesContainer = document.getElementById('lex-fiches-container');
        if (fichesContainer) fichesContainer.innerHTML = hf;
    }

    // Sauvage — seul en haut, le "père" de toutes les variétés
    if (typeof databaseSauvage !== 'undefined') {
        var hs = '<div class="variety-sheet" style="border-left-color:#276749;">';
        hs += '<div class="variety-sheet-name">' + databaseSauvage.emoji + ' ' + databaseSauvage.nom + '</div>';
        hs += '<div class="variety-sheet-info">' + databaseSauvage.histoire + '</div></div>';
        var sauvageContainer = document.getElementById('lex-sauvage-container');
        if (sauvageContainer) sauvageContainer.innerHTML = hs;
    }

    // Bloc générique repliable pour Hors-COM / Postures / Chants / Hybrides,
    // tous dans le même groupe accordéon 'com' que les catégories D00-D09.
    function rendreBlocRepliable(containerId, code, emoji, titre, couleur, items) {
        var container = document.getElementById(containerId);
        if (!container || !items) return;
        var hb = '<div class="cat-bloc lex-cat-block" id="lex-cat-' + code + '" style="margin-bottom:12px;">';
        hb += '<button class="cat-header" onclick="toggleCatLexique(\'com\',\'' + code + '\')" style="border-left:4px solid ' + couleur + ';">';
        hb += '<span>' + emoji + ' ' + titre + ' (' + items.length + ')</span>';
        hb += '<span class="cat-arrow" id="com-cat-arrow-' + code + '">▼</span></button>';
        hb += '<div id="com-cat-list-' + code + '" style="display:none;">';
        items.forEach(function(o, idx) {
            hb += '<div class="variety-sheet" id="fiche-' + code + '-' + idx + '" style="border-left-color:' + couleur + ';">';
            hb += '<div class="variety-sheet-name">' + o.emoji + ' ' + o.nom + '</div>';
            hb += '<div class="variety-sheet-info">' + o.histoire + '</div>';
            hb += '</div>';
        });
        hb += '</div></div>';
        container.innerHTML = hb;
    }
    rendreBlocRepliable('lex-hc-container', 'HORSCOM', '🔬', 'Mutations Hors-COM (exemples)', '#6b46c1', typeof databaseHorsCOM !== 'undefined' ? databaseHorsCOM : null);
    rendreBlocRepliable('lex-posture-container', 'POSTURE', '📐', 'Races de Posture', '#805ad5', typeof databasePostures !== 'undefined' ? databasePostures : null);
    rendreBlocRepliable('lex-chant-container', 'CHANT', '🎵', 'Races de Chant', '#2b6cb0', typeof databaseChants !== 'undefined' ? databaseChants : null);
    rendreBlocRepliable('lex-hy-container', 'HYBRIDE', '🌍', 'Espèces croisées avec le Canari', '#276749', typeof databaseHybrides !== 'undefined' ? databaseHybrides : null);
}

// Reconstruit un nom au format CATEGORIES/Lexique (ex: "Noir Opale Jaune Intensif")
// à partir des paramètres extraits d'un résultat de simulation.
function construireNomCanonique(params) {
    var mutCatMap  = { 'Opale':'Opale','Phaeo':'Phaeo','Satiné':'Satiné','Topaze':'Topaze',
                        'Onyx':'Onyx','Cobalt':'Kobalt','Jaspe':'Jaspe','Pastel':'Pastel' };
    var plumeMap   = { 'Intense':'Intensif','Schimmel':'Schimmel',
                        'Mosaïque T1':'Mosaïque M','Mosaïque T2':'Mosaïque F' };

    // Brun/Agate déterminent le mot de base (Isabelle = les deux ensemble)
    var hasBrun  = params.mutations.indexOf('Brun') >= 0;
    var hasAgate = params.mutations.indexOf('Agate') >= 0;
    var baseWord = 'Noir';
    if (hasBrun && hasAgate) baseWord = 'Isabelle';
    else if (hasBrun)        baseWord = 'Brun';
    else if (hasAgate)       baseWord = 'Agate';

    var mutCat = null;
    params.mutations.forEach(function(m) { if (!mutCat && mutCatMap[m]) mutCat = mutCatMap[m]; });

    var isIvoire = params.mutations.indexOf('Ivoire') >= 0;
    var fondWord = params.fond;
    if (isIvoire && params.fond === 'Jaune') fondWord = 'Ivoire Jaune';
    if (isIvoire && params.fond === 'Rouge') fondWord = 'Ivoire Rouge';

    var plumeWord = plumeMap[params.plume] || 'Intensif';
    var estBlanc  = (params.fond === 'Blanc Dominant' || params.fond === 'Blanc Récessif');

    if (params.base === 'Lipochrome') {
        return estBlanc ? fondWord : (fondWord + ' ' + plumeWord);
    }

    var parts = [baseWord];
    if (mutCat) parts.push(mutCat);
    parts.push(fondWord);
    if (!estBlanc) parts.push(plumeWord);
    return parts.join(' ');
}

// Calcule le titre du groupe-fiche (série+mutation+fond, sans le patron)
// correspondant à un nom de variété COM complet. Doit rester en phase avec
// la convention de titrage des 222 fiches détaillées (fiches.js).
function groupeFromVariete(nom) {
    var base = nom.replace(/ (Intensif|Schimmel|Mosaïque M|Mosaïque F)$/, '');
    var estMelanique = /^(Noir|Brun|Agate|Isabelle)\b/.test(base);
    return estMelanique ? base : ('Lipochrome ' + base);
}

function copierTexte(elementId) {
    var el = document.getElementById(elementId);
    if (!el) return;
    var ta = document.createElement('textarea');
    ta.value = el.textContent; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try {
        var ok = document.execCommand('copy');
        showToast(ok ? '✅ Modèle copié !' : '⚠️ Copie manuelle nécessaire', ok ? 'info' : 'warn');
    } catch (e) { showToast('⚠️ Copie manuelle nécessaire', 'warn'); }
    document.body.removeChild(ta);
}

function voirFicheDetaillee(nomVariete) {
    naviguerVers('page-lexique', document.getElementById('btn-nav-lexique'));
    switchTab('fiches');
    var cible = groupeFromVariete(nomVariete);
    var trouve = null;
    document.querySelectorAll('.fiche-detaillee').forEach(function(el) {
        var titreEl = el.querySelector('.fiche-detaillee-titre');
        var estMatch = !!(titreEl && titreEl.textContent.trim() === cible);
        el.style.display = estMatch ? 'block' : 'none';
        if (estMatch) trouve = el;
    });
    // Accordéon : referme toutes les catégories, n'ouvre que celle qui
    // contient la fiche ciblée (sinon elle reste invisible, repliée).
    document.querySelectorAll('[id^="fiches-cat-list-"]').forEach(function(l) { l.style.display = 'none'; });
    document.querySelectorAll('[id^="fiches-cat-arrow-"]').forEach(function(a) { a.textContent = '▼'; });
    if (trouve) {
        var catList = trouve.closest('[id^="fiches-cat-list-"]');
        if (catList) {
            catList.style.display = 'block';
            var code = catList.id.replace('fiches-cat-list-', '');
            var arrow = document.getElementById('fiches-cat-arrow-' + code);
            if (arrow) arrow.textContent = '▲';
        }
    }
    setTimeout(function() {
        if (trouve) {
            trouve.scrollIntoView({ behavior:'smooth', block:'start' });
            showToast('📖 ' + cible, 'info');
        } else {
            showToast('⚠️ Fiche "' + cible + '" introuvable', 'warn');
        }
    }, 50);
}

function filtrerFichesDetaillees(query) {
    var q = query.toLowerCase().trim();
    document.querySelectorAll('.fiche-detaillee').forEach(function(el) {
        el.style.display = !q || el.textContent.toLowerCase().indexOf(q) >= 0 ? 'block' : 'none';
    });
}

function voirDansGrille(desc) {
    naviguerVers('page-lexique', document.getElementById('btn-nav-lexique'));
    switchTab('com');
    var params = nomVersParams(desc);
    var nomCanonique = construireNomCanonique(params);
    var cible = nomCanonique.toLowerCase().trim();
    // Match EXACT sur le nom de la fiche (.variety-sheet-name), pas une
    // recherche libre par sous-chaîne dans tout le texte : "Rouge Intensif"
    // en sous-chaîne matchait aussi "Noir Rouge Intensif", "Ivoire Rouge
    // Intensif", et toute autre fiche mélanique se terminant pareil.
    var trouve = null;
    document.querySelectorAll('.variety-sheet').forEach(function(el) {
        var nomEl = el.querySelector('.variety-sheet-name');
        var estMatch = !!(nomEl && nomEl.textContent.toLowerCase().trim() === cible);
        el.style.display = estMatch ? 'block' : 'none';
        if (estMatch) trouve = el;
    });
    document.querySelectorAll('.lex-cat-block').forEach(function(block) {
        var hasVisible = block.querySelector('.variety-sheet[style*="display: block"]');
        block.style.display = hasVisible ? 'block' : 'none';
        var innerList = block.querySelector('[id^="com-cat-list-"]');
        var innerArrow = block.querySelector('[id^="com-cat-arrow-"]');
        if (innerList) innerList.style.display = hasVisible ? 'block' : 'none';
        if (innerArrow) innerArrow.textContent = hasVisible ? '▲' : '▼';
    });
    var search = document.getElementById('lexique-search');
    if (search) search.value = nomCanonique;
    setTimeout(function() {
        if (trouve) {
            trouve.scrollIntoView({ behavior:'smooth', block:'center' });
            showToast('📖 ' + nomCanonique, 'info');
        } else {
            window.scrollTo({ top:0, behavior:'smooth' });
            showToast('⚠️ "' + nomCanonique + '" introuvable dans le Lexique', 'warn');
        }
    }, 50);
}


// ============================================
//   GARDER UN JEUNE
// ============================================
function garderJeuneExec(desc, sexe) {
    var prefix = (sexe.indexOf('♂') >= 0 || sexe.indexOf('Mâle') >= 0) ? 'm' : 'f';

    // Le moteur génétique renvoie parfois un phénotype Mosaïque ambigu
    // ("Mosaïque T1 (♂ masque) / T2 (♀ ligne)") quand les 2 parents sont Mosaïque.
    // Le sexe réel de l'oisillon lève l'ambiguïté — on tranche AVANT tout (Garder et Annuler).
    var descFinal = desc;
    var parts = desc.split(' · ');
    if (parts.length === 3 && parts[1].indexOf('Mosaïque T1') >= 0 && parts[1].indexOf('T2') >= 0) {
        parts[1] = (prefix === 'm') ? 'Mosaïque T1 (♂ masque facial)' : 'Mosaïque T2 (♀ ligne)';
        descFinal = parts.join(' · ');
    }

    var ok = confirm('Enregistrer ce jeune ?\n\n[OK] → Cheptel\n[Annuler] → Réinjecter comme parent');
    if (ok) {
        var annee = new Date().getFullYear();
        var paramsCheptel = nomVersParams(descFinal);
        baseCheptel.push({
            bague:'FR-'+annee+'-JEUNE', sexe:sexe, desc:descFinal, img:'', galerie:[], date:new Date().toLocaleDateString('fr-FR'),
            base: paramsCheptel.base, visuel: paramsCheptel.base || 'Noir', mutations: paramsCheptel.mutations, porteurs: paramsCheptel.porteurs,
            plume: paramsCheptel.plume, fond: paramsCheptel.fond, statut:'Acquis', stade:'Jeune',
            notes:'', soins:{ poids:'', dernierSoin:'', alimentation:'' }, journal:[], rappels:[]
        });
        sauvegarderCheptel(baseCheptel);
        afficherCheptel();
        showToast('✅ Oiseau sauvegardé !', 'info');
    } else {
        var params = nomVersParams(descFinal);
        appliquerParamsCalculateur(prefix, params);
        var selEl = document.getElementById(prefix + '-selection');
        if (selEl) selEl.textContent = '✅ ' + (prefix === 'm' ? 'Père' : 'Mère') + ' : ' + descFinal;
        verifierFacteursLetaux();
        naviguerVers('page-calc', document.getElementById('btn-nav-calc'));
        var box = document.getElementById(prefix + '-box');
        if (box) box.scrollIntoView({ behavior:'smooth', block:'start' });
        showToast('♻️ Réinjecté comme ' + (prefix === 'm' ? 'père' : 'mère'), prefix === 'm' ? 'pere' : 'mere');
    }
}

// ============================================
//   RÉINITIALISER LE CALCULATEUR
// ============================================
function reinitialiserCalculateur() {
    if (!confirm('Réinitialiser le calculateur ?\n\nPère, Mère et résultats seront effacés.')) return;

    // Formulaires Père/Mère remis à zéro (base Noir, aucune mutation/porteur, Intense, Jaune)
    initCalculateur();
    if (typeof reinitialiserBaguesParents === 'function') reinitialiserBaguesParents();
    if (typeof chaineEnCoursId !== 'undefined') chaineEnCoursId = null;

    // Sélection par catégorie
    selectionState = 0;
    document.querySelectorAll('.var-selected-pere').forEach(function(el) { el.classList.remove('var-selected-pere'); });
    document.querySelectorAll('.var-selected-mere').forEach(function(el) { el.classList.remove('var-selected-mere'); });
    lastPereId = null;
    lastMereId = null;

    // Sélection depuis la volière (le cas échéant)
    accouplementPere = null; accouplementMere = null;
    var bsv = document.getElementById('btn-simuler-voliere'); if (bsv) bsv.style.display = 'none';
    var bac = document.getElementById('btn-annuler-acc');    if (bac) bac.style.display = 'none';
    document.querySelectorAll('.bird-card').forEach(function(c) { c.classList.remove('acc-pere', 'acc-mere'); });

    // Résultats et alerte létale
    document.getElementById('result-males').innerHTML = '';
    document.getElementById('result-femelles').innerHTML = '';
    var alerte = document.getElementById('lethal-alert'); if (alerte) alerte.style.display = 'none';

    naviguerVers('page-calc', document.getElementById('btn-nav-calc'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('🔄 Calculateur réinitialisé', 'info');
}

// ============================================
//   SERVICE WORKER
// ============================================
function enregistrerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(function(){});
    }
}

// ============================================
//   PROTECTION BOUTON RETOUR (Android/navigateur)
// ============================================
// Astuce standard PWA : on ajoute une entrée d'historique factice au
// chargement. Le bouton retour déclenche alors popstate au lieu de fermer
// direct l'app — on demande confirmation, et si annulé on re-piège
// l'historique pour le prochain appui.
function protegerBoutonRetour() {
    history.pushState({ canagen: true }, '', location.href);
    window.addEventListener('popstate', function() {
        if (confirm('Voulez-vous vraiment quitter CanaGen ?')) {
            history.back();
        } else {
            history.pushState({ canagen: true }, '', location.href);
        }
    });
}

// ============================================
//   INIT
// ============================================
window.onload = function() {
    protegerBoutonRetour();
    initCalculateur();
    baseCheptel = chargerCheptel();
    baseCages = chargerCages();
    chargerSimulations();
    afficherSimulationsSauvegardees();
    générerCategories();
    générerFichesLexique();
    afficherCheptel();
    mettreAJourListesCagesFormulaires();
    afficherCages();
    switchTab('sommaire');
    enregistrerServiceWorker();
    if (baseCheptel.length === 0) afficherRappelImport();
};
