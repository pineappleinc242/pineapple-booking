import React from 'react'

type LogoProps = {
  className?: string
  title?: string
}

export function Logo({ className = '', title = 'Pineapple Inc. Studios' }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 90"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {/* Pineapple glyph (stylised) */}
      <g transform="translate(10,8)" fill="none" fillRule="evenodd">
        {/* Pineapple glyph filled with a darker charcoal so it reads on gray headers/footers */}
        <g transform="translate(0,0)" fill="#0f172a">
          {/* leaves */}
          <path d="M28 2c6 0 8 6 8 6s3-1 6 2c3 3 2 6 0 8-2 2-8 2-12 0-4-2-8-8-8-8s-1-8 6-8z" opacity="0.95" />
          {/* body */}
          <path d="M20 30c0-8 8-18 18-18s18 10 18 18c0 12-8 26-18 26S20 42 20 30z" opacity="0.95" />
          {/* decorative cuts */}
          <path d="M26 28c4 4 10 6 16 6s12-2 16-6" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
          <path d="M28 36c3 3 8 5 14 5s11-2 14-5" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
        </g>
      </g>

      {/* Wordmark */}
      <g transform="translate(80,28)">
        <text x="0" y="0" fill="currentColor" className="text-[18px] font-semibold" style={{ fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
          PINEAPPLE <tspan fill="currentColor" className="font-light">INC.</tspan>
        </text>
        <text x="0" y="26" fill="currentColor" className="text-[12px] tracking-widest" style={{ fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
          STUDIOS
        </text>
      </g>
    </svg>
  )
}

export default Logo
