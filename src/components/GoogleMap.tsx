import { useMemo } from 'react';

interface GoogleMapProps {
  address: string;
  city?: string;
  state?: string;
  cep?: string;
  className?: string;
}

export function GoogleMap({ address, city, state, cep, className = '' }: GoogleMapProps) {
  const fullAddress = useMemo(() => {
    const parts = [address, city, state, cep].filter(Boolean);
    return parts.join(', ');
  }, [address, city, state, cep]);

  const encodedAddress = encodeURIComponent(fullAddress);

  if (!address && !city) {
    return null;
  }

  return (
    <div className={`rounded-2xl overflow-hidden shadow-elevated ${className}`}>
      <iframe
        title="Localização da empresa"
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${encodedAddress}&output=embed`}
      />
    </div>
  );
}
