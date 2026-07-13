import { useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ModuleProps } from '../../types';
import SilhouetteCorps, { type SilhouetteZone } from '../../../components/SilhouetteCorps';
import IllustrationSlot from '../components/IllustrationSlot';
import { ZONES, ZONES_BY_ID, JALONS, DERNIER_JALON_INDEX, beneficesDeZone, type ZoneId } from './data';
import styles from './BeneficesArretModule.module.css';

/**
 * Module « Ce que l'arrêt répare » (plan approfondissement-tabac/S5.md). Une frise de 10
 * jalons (20 minutes → 10-15 ans) rallume la silhouette zone par zone. Registre positif et
 * factuel : jamais l'organe malade, jamais « si vous continuez de fumer », jamais de compte
 * à rebours anxiogène — uniquement ce que l'arrêt apporte, à tout âge et à tout moment.
 */

const MESSAGE_TRANSVERSE =
  "Ces étapes se déclenchent quel que soit l'âge, le nombre d'années de tabac ou de tentatives précédentes. Il n'est jamais trop tard — ni trop tôt.";

export default function BeneficesArretModule(_props: ModuleProps) {
  const [jalonIndex, setJalonIndex] = useState(0);
  const [selectedZone, setSelectedZone] = useState<ZoneId | null>(null);

  const jalonCourant = JALONS[jalonIndex];

  const zonesPassees = new Set<ZoneId>();
  for (let i = 0; i < jalonIndex; i++) {
    for (const z of JALONS[i].zones) zonesPassees.add(z);
  }
  const zonesCourantes = new Set(jalonCourant.zones);

  const silhouetteZones: SilhouetteZone[] = ZONES.map((z) => ({
    id: z.id,
    label: z.label,
    x: z.x,
    y: z.y,
    r: z.r,
    etat: zonesCourantes.has(z.id) ? 'allume' : zonesPassees.has(z.id) ? 'ouvert' : 'actif',
  }));

  function selectionnerJalon(index: number) {
    setJalonIndex(index);
    setSelectedZone(null);
  }

  function reculer() {
    if (jalonIndex > 0) selectionnerJalon(jalonIndex - 1);
  }

  function avancer() {
    if (jalonIndex < DERNIER_JALON_INDEX) selectionnerJalon(jalonIndex + 1);
  }

  function recommencer() {
    selectionnerJalon(0);
  }

  function basculerZone(id: string) {
    setSelectedZone((current) => (current === id ? null : (id as ZoneId)));
  }

  const zoneDetail = selectedZone ? ZONES_BY_ID[selectedZone] : null;
  const beneficesZone = selectedZone ? beneficesDeZone(selectedZone) : [];

  return (
    <div className={styles.module}>
      <p className={styles.intro}>
        Choisissez un moment après la dernière cigarette et regardez ce qui se répare, organe
        par organe.
      </p>

      <div className={styles.layout}>
        <div className={styles.silhouetteCol}>
          <SilhouetteCorps zones={silhouetteZones} onZoneClick={basculerZone} />
        </div>

        <div className={styles.panneau}>
          <div className={styles.frise}>
            <div className={styles.friseControls}>
              <button
                type="button"
                className={styles.friseNavBtn}
                onClick={reculer}
                disabled={jalonIndex === 0}
                aria-label="Étape précédente"
              >
                <ChevronLeft aria-hidden="true" />
              </button>

              <div className={styles.friseTrack} role="group" aria-label="Étapes de l'arrêt">
                {JALONS.map((jalon, index) => {
                  const passe = index < jalonIndex;
                  const actuel = index === jalonIndex;
                  return (
                    <button
                      key={jalon.echeance + index}
                      type="button"
                      className={`${styles.friseChip}${actuel ? ` ${styles.friseChipActuel}` : ''}${passe ? ` ${styles.friseChipAcquis}` : ''}`}
                      aria-current={actuel ? 'step' : undefined}
                      onClick={() => selectionnerJalon(index)}
                    >
                      {passe && <CheckCircle2 size={14} aria-hidden="true" />}
                      {jalon.echeance}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className={styles.friseNavBtn}
                onClick={avancer}
                disabled={jalonIndex === DERNIER_JALON_INDEX}
                aria-label="Étape suivante"
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </div>

            <div className={styles.friseFooter}>
              <p className={styles.friseNote}>Échelle non linéaire — repères chronologiques.</p>
              <button type="button" className="btn btn--tertiary" onClick={recommencer}>
                Recommencer
              </button>
            </div>
          </div>

          <div className={`${styles.panel} panel`}>
            {zoneDetail ? (
              <div className={styles.detailZone}>
                <button type="button" className={styles.retour} onClick={() => setSelectedZone(null)}>
                  <ArrowLeft aria-hidden="true" /> Retour à l'étape
                </button>

                <div className={styles.detailHeader}>
                  <IllustrationSlot
                    id={`benef-${zoneDetail.id}`}
                    label={zoneDetail.illustrationLabel}
                    shape="rounded"
                    size={96}
                  />
                  <span className="eyebrow">{zoneDetail.label}</span>
                </div>

                <ul className={styles.beneficesListe}>
                  {beneficesZone.map((b) => {
                    const acquis = b.jalonIndex <= jalonIndex;
                    return (
                      <li
                        key={b.jalonIndex}
                        className={`${styles.beneficeItem}${acquis ? ` ${styles.beneficeAcquis}` : ''}`}
                      >
                        <span className={styles.beneficeMarque} aria-hidden="true">
                          {acquis && <CheckCircle2 size={16} />}
                        </span>
                        <div>
                          <span className={styles.beneficeEcheance}>
                            {b.echeance}
                            {acquis && <span className={styles.beneficeAcquisLabel}> — acquis</span>}
                          </span>
                          <p>{b.texte}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className={styles.detailJalon}>
                <span className="eyebrow">
                  Étape {jalonIndex + 1} / {JALONS.length}
                </span>
                <p className={styles.echeance}>{jalonCourant.echeance}</p>
                <p className={styles.texteBenefice}>{jalonCourant.texte}</p>

                <div className={styles.zonesConcernees} aria-label="Zones concernées par cette étape">
                  {jalonCourant.zones.map((zid) => {
                    const zone = ZONES_BY_ID[zid];
                    return (
                      <div key={zid} className={styles.zoneCard}>
                        <IllustrationSlot id={`benef-${zid}`} label={zone.illustrationLabel} shape="rounded" size={80} />
                        <span className={styles.zoneChip}>
                          <CheckCircle2 size={14} aria-hidden="true" /> {zone.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {jalonIndex === DERNIER_JALON_INDEX && (
                  <div className={styles.horizon}>
                    <IllustrationSlot id="benef-horizon" label="L'horizon retrouvé" shape="rounded" size={110} />
                  </div>
                )}
              </div>
            )}
          </div>

          <p className={styles.messageTransverse}>{MESSAGE_TRANSVERSE}</p>
        </div>
      </div>
    </div>
  );
}
