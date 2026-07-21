import styles from './QRBlock.module.css';

/**
 * Bloc « Retrouvez ces conseils chez vous » : QR statique (image pré-générée,
 * hors-runtime — voir plans/aide-patient/S5.md) vers l'app patient. Réutilisé par
 * FicheOverlay (fiches individuelles) et PrintableLivret (section Contacts).
 * Aucune génération/dépendance au runtime : simple <img>.
 *
 * revue-prod-2026-07/S3 (RP3a) : le QR est statique et l'app patient ne reprend aucun
 * état de la consultation (zéro persistance) — le libellé ne doit donc jamais promettre
 * une reprise personnalisée (« mes substituts », « mes parades »…), seulement l'accès à
 * l'outil générique.
 */
export default function QRBlock() {
  return (
    <div className={styles.block}>
      <img
        className={styles.image}
        src="/qr/patient.png"
        alt="QR code vers l'application patient — retrouvez l'application et ses outils chez vous"
        width={120}
        height={120}
      />
      <p className={styles.legende}>Retrouvez l'application et ses outils chez vous — scannez ce code.</p>
    </div>
  );
}
