import React, { useEffect, useRef } from 'react';
import { ADS_CONFIG } from '../config';

interface Props {
  slotId?: string;
  format?: 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

const AdSlot: React.FC<Props> = ({ slotId, format = 'rectangle', className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ADS_CONFIG.clientId || typeof window === 'undefined') return;
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.clientId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    if (!document.querySelector(`script[src*="${ADS_CONFIG.clientId}"]`)) {
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!ADS_CONFIG.clientId) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.warn('Ad push failed', e);
    }
  }, [ADS_CONFIG.clientId]);

  const sizeMap = {
    rectangle: 'auto',
    horizontal: 'horizontal',
    vertical: 'vertical'
  };

  if (!ADS_CONFIG.clientId) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 border border-slate-200 rounded-xl text-slate-400 text-xs font-bold uppercase tracking-widest ${className}`}
        style={{ minHeight: format === 'vertical' ? 250 : 90 }}
      >
        Ad slot
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADS_CONFIG.clientId}
        data-ad-slot={slotId || ADS_CONFIG.slotReport}
        data-ad-format={sizeMap[format]}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSlot;
