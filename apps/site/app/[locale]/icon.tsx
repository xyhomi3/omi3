import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '5px',
        }}
      >
        <svg height={16.875} width={13.5} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 864 1080">
          <path fill="white" d="M216,1080V864H0V216H216V0H648V216H864V864H648v216Zm0-224.65H648V224.65H216Z" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
