import { useState } from 'react';
import { Brain, Check, Cloud, Dna, HeartPulse, ShieldAlert, Wind, X, type LucideIcon } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleFooterNav from '../../../components/ModuleFooterNav';
import styles from './NicotineToxiqueModule.module.css';

// Repère viewBox unique (1000x620) : le point sert à la fois à tracer le trait
// pointillé, à placer l'étiquette et à ancrer le pop-up — plus de désynchronisation.
type Category = 'toxiques' | 'dependance';
interface Point { x: number; y: number; }
interface Hotspot { id: string; category: Category; label: string; eyebrow: string; detail: string; Icon: LucideIcon; point: Point; connectorFrom?: Point; }

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 620;

const HOTSPOTS: Hotspot[] = [
  { id: 'respiratoire', category: 'toxiques', label: 'Goudrons et particules', eyebrow: 'Voies respiratoires', detail: 'Les goudrons adhèrent aux poumons. Les particules fines pénètrent dans les voies respiratoires et entretiennent leur inflammation.', Icon: Wind, point: { x: 150, y: 105 }, connectorFrom: { x: 394, y: 273 } },
  { id: 'co', category: 'toxiques', label: 'Monoxyde de carbone', eyebrow: 'Gaz de combustion', detail: "Le monoxyde de carbone (CO) est un gaz asphyxiant qui endommage le coeur et les artères.", Icon: HeartPulse, point: { x: 140, y: 471 }, connectorFrom: { x: 397, y: 326 } },
  { id: 'cancerogenes', category: 'toxiques', label: 'Cancérogènes', eyebrow: 'Risque de cancers', detail: 'La fumée contient environ 70 substances cancérogènes connues, associées à de multiples cancers.', Icon: Dna, point: { x: 580, y: 81 }, connectorFrom: { x: 463, y: 264 } },
  { id: 'melange', category: 'toxiques', label: 'Mélange chimique', eyebrow: 'Fumée de combustion', detail: "En brûlant, le tabac libère un cocktail d'environ 7 000 substances chimiques. C'est ce mélange issu de la combustion — et non la nicotine — qui rend malade.", Icon: Cloud, point: { x: 600, y: 496 }, connectorFrom: { x: 471, y: 337 } },
  { id: 'nicotine', category: 'dependance', label: 'Nicotine', eyebrow: 'Dépendance', detail: "La nicotine crée la dépendance. Elle n'est pas anodine, mais ce n'est pas elle qui provoque les cancers et les maladies liés à la fumée.", Icon: Brain, point: { x: 824, y: 310 } },
];

const toPercent = (point: Point) => ({ left: `${(point.x / VIEWBOX_WIDTH) * 100}%`, top: `${(point.y / VIEWBOX_HEIGHT) * 100}%` });

export default function NicotineToxiqueModule({ onNavigate }: ModuleProps) {
  const [filter, setFilter] = useState<Category | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = HOTSPOTS.find((hotspot) => hotspot.id === selectedId) ?? null;
  const toggleFilter = (next: Category) => {
    setFilter((current) => current === next ? null : next);
    setSelectedId(null);
  };

  return (
    <div className={styles.module}>
      <p className={styles.intro}>La combustion produit la fumée qui rend malade. La nicotine joue un autre rôle : elle crée la dépendance.</p>
      <div className={styles.filters} aria-label="Filtrer la scène">
        <span className={styles.filtersLabel}>Mettre en évidence</span>
        <button type="button" className={`${styles.filterButton} ${styles.filterToxiques}`} aria-pressed={filter === 'toxiques'} onClick={() => toggleFilter('toxiques')}>
          {filter === 'toxiques' ? <Check aria-hidden="true" /> : <ShieldAlert aria-hidden="true" />} Toxiques de la combustion
        </button>
        <button type="button" className={`${styles.filterButton} ${styles.filterDependance}`} aria-pressed={filter === 'dependance'} onClick={() => toggleFilter('dependance')}>
          {filter === 'dependance' ? <Check aria-hidden="true" /> : <Brain aria-hidden="true" />} Dépendance
        </button>
      </div>

      <div className={styles.sceneShell}>
        <div className={styles.legend} aria-label="Légende de la scène">
          <span className={styles.legendToxiques}><ShieldAlert aria-hidden="true" /><span className={styles.legendRole}>Ce qui rend malade</span> fumée / combustion</span>
          <span className={styles.legendDependance}><Brain aria-hidden="true" /><span className={styles.legendRole}>Ce qui crée la dépendance</span> nicotine</span>
        </div>
        <div className={styles.scene}>
          <svg className={styles.illustration} viewBox="0 0 1000 620" role="img" aria-label="Une cigarette en combustion produit une fumée reliée à quatre familles toxiques rouges. La nicotine est isolée dans une zone verte.">
            <defs>
              <filter id="smokeBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
              <pattern id="toxicHatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="12" className={styles.hatchLine} /></pattern>
            </defs>
            <path className={styles.toxicArea} d="M82 102C196 18 426 34 570 142c121 91 137 282 17 374C458 615 190 582 91 456-1 338-16 174 82 102Z" />
            <path className={styles.hatchedArea} d="M82 102C196 18 426 34 570 142c121 91 137 282 17 374C458 615 190 582 91 456-1 338-16 174 82 102Z" />
            <circle className={styles.nicotineArea} cx="824" cy="310" r="146" />
            <g className={filter === 'dependance' ? styles.dimmed : undefined}>
              {HOTSPOTS.filter((hotspot) => hotspot.connectorFrom).map((hotspot) => (
                <path key={hotspot.id} className={styles.connectorToxic} d={`M${hotspot.connectorFrom!.x} ${hotspot.connectorFrom!.y}L${hotspot.point.x} ${hotspot.point.y}`} />
              ))}
              <g className={styles.smoke} filter="url(#smokeBlur)"><path d="M464 293c-67-42-17-81-73-117-44-28-12-67 4-91M495 290c-37-49 25-81-11-127-29-37 9-73 31-91M526 298c17-49 70-61 49-116-12-31 19-61 43-74" /></g>
              <g className={styles.cigarette}><rect x="284" y="288" width="173" height="42" rx="11" /><rect className={styles.filterTip} x="284" y="288" width="65" height="42" rx="11" /><rect className={styles.burningTip} x="445" y="288" width="18" height="42" rx="8" /><path className={styles.ember} d="M463 289c19 8 19 31 0 40" /></g>
            </g>
            <g className={filter === 'toxiques' ? styles.dimmed : undefined}>
              <path className={styles.connectorNicotine} d="M689 310h-90" /><circle className={styles.nicotineMark} cx="824" cy="310" r="46" /><path className={styles.nicotineMolecule} d="M801 299l18-11 21 11v23l-21 11-18-11Zm39 0 18-10 19 11v22l-19 11-18-11" />
            </g>
          </svg>

          {HOTSPOTS.map((hotspot) => {
            const Icon = hotspot.Icon;
            const isDimmed = filter !== null && filter !== hotspot.category;
            const isSelected = selectedId === hotspot.id;
            return (
              <button key={hotspot.id} type="button" style={toPercent(hotspot.point)} className={`${styles.hotspot} ${styles[hotspot.category]} ${isDimmed ? styles.hotspotDimmed : ''} ${isSelected ? styles.hotspotSelected : ''}`} aria-expanded={isSelected} aria-controls="hotspot-detail" onClick={() => setSelectedId((current) => current === hotspot.id ? null : hotspot.id)}>
                <Icon aria-hidden="true" /><span>{hotspot.label}</span>
              </button>
            );
          })}
          <div className={`${styles.sceneLabel} ${styles.combustionLabel} ${filter === 'dependance' ? styles.dimmedLabel : ''}`}><ShieldAlert aria-hidden="true" /> Ce qui rend malade</div>
          <div className={`${styles.sceneLabel} ${styles.nicotineLabel} ${filter === 'toxiques' ? styles.dimmedLabel : ''}`}><Brain aria-hidden="true" /> Dépendance</div>

          {selected ? (() => {
            const pct = toPercent(selected.point);
            const openLeft = selected.point.x > VIEWBOX_WIDTH / 2;
            const openUp = selected.point.y > VIEWBOX_HEIGHT / 2;
            const anchorStyle = {
              ...(openLeft ? { right: `calc(100% - ${pct.left})`, marginRight: '1.25rem' } : { left: pct.left, marginLeft: '1.25rem' }),
              ...(openUp ? { bottom: `calc(100% - ${pct.top})`, marginBottom: '1.25rem' } : { top: pct.top, marginTop: '1.25rem' }),
            };
            return (
              <aside id="hotspot-detail" style={anchorStyle} className={`${styles.detailBubble} ${styles[selected.category]}`} aria-live="polite">
                <selected.Icon aria-hidden="true" />
                <div className={styles.detailContent}><span className={styles.detailEyebrow}>{selected.eyebrow}</span><strong>{selected.label}</strong><p>{selected.detail}</p></div>
                <button type="button" className={styles.closeButton} onClick={() => setSelectedId(null)} aria-label={`Fermer le détail « ${selected.label} »`}><X aria-hidden="true" /></button>
              </aside>
            );
          })() : null}
        </div>
      </div>

      <p className="filrouge">
        C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se traite.
      </p>
      <ModuleFooterNav
        items={[
          { id: 'substituts', label: 'Substituts et vapoteuse' },
          { id: 'nicotine', label: 'Comprendre la nicotine' },
        ]}
        onNavigate={onNavigate}
      />
    </div>
  );
}
