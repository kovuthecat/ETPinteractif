import styles from './QRBlock.module.css';

/**
 * Bloc « Retrouvez ces conseils chez vous » : QR statique (image pré-générée,
 * hors-runtime — voir plans/aide-patient/S5.md) vers l'app patient. Réutilisé par
 * FicheOverlay (fiches individuelles) et PrintableLivret (section Contacts).
 * Aucune génération/dépendance au runtime : simple <img>.
 */
export default function QRBlock() {
  return (
    <div className={styles.block}>
      <img
        className={styles.image}
        src="/qr/patient.png"
        alt="QR code vers l'application patient — retrouvez mes substituts et mes parades"
        width={120}
        height={120}
      />
      <p className={styles.legende}>Retrouvez ces conseils chez vous — scannez ce code.</p>
    </div>
  );
}
