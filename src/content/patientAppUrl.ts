/**
 * URL racine de l'app patient (S2-S4), encodée dans le QR statique posé sur les
 * fiches et le livret (S5). L'hébergement définitif est différable (cf.
 * plans/aide-patient/index.md §À trancher) : cette constante est un
 * placeholder documenté, à fixer par Thibault au déploiement.
 *
 * // à revalider (Thibault) : remplacer par l'URL définitive une fois l'hébergement
 * choisi, puis régénérer public/qr/patient.png (script hors-runtime, cf.
 * plans/aide-patient/S5.md).
 */
export const PATIENT_APP_URL = 'https://<A-DEFINIR>.example/patient';
