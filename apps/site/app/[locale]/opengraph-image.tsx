import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Omi3';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          backgroundColor: '#111903',
        }}
      >
        <svg width={280} height={80} viewBox="0 0 14 4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.375 4V3.375H0.75V1.5H1.375V0.875H2.625V1.5H3.25V3.375H2.625V4H1.375ZM1.375 3.35H2.625V1.525H1.375V3.35ZM4.5 4V0.875H5.125V1.5H5.75V2.125H6.375V2.75H5.75V2.125H5.125V4H4.5ZM7 4V2.125H6.375V1.5H7V0.875H7.625V4H7ZM8.875 4V0.875H9.5V4H8.875Z"
            fill="white"
          />
          <path
            d="M12.625 2.125V1.5H10.75V0.875H12.625V1.5H13.25V2.125H12.625ZM12.625 3.375V2.75H11.375V2.125H12.625V2.75H13.25V3.375H12.625ZM10.75 4V3.375H12.625V4H10.75Z"
            fill="#B0FC31"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  );
}
