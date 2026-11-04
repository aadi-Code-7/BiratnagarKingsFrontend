import { asset } from '../config.js';

/** Player photo, or a crest-coloured initials tile when no photo is available. */
export default function PlayerImg({ p, className = '', ...rest }) {
  if (p.image) return <img className={className} src={asset(p.image)} alt={p.fullName || `${p.firstName} ${p.lastName}`} loading="lazy" decoding="async" {...rest} />;
  const initials = (p.firstName[0] + (p.lastName[0] || '')).toUpperCase();
  return <div className={'avatar ' + className} role="img" aria-label={p.fullName}><span>{initials}</span></div>;
}
