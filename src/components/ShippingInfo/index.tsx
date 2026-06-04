import React from 'react'

export function ShippingInfo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
      <div style={{ flex: '1 1 280px', textAlign: 'center' }}>
        <hr style={{ borderWidth: '2px', marginBottom: '1.5rem', borderColor: '#FFCED1' }} />
        <h3 style={{ fontWeight: 500, paddingBottom: '0.75rem', textAlign: 'center' }}>
          <i className="fa-solid fa-route fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
          Local Pick Up Available
        </h3>
        <p style={{ textAlign: 'center' }}>
          Receive 15% off your total when you opt for local pick-up.
        </p>
        <p style={{ textAlign: 'center' }}>
          Illinois residents can schedule a time to pick up in person in the Pilsen neighborhood of Chicago.
        </p>
      </div>
      <div style={{ flex: '1 1 280px' }}>
        <hr style={{ borderWidth: '2px', marginBottom: '1.5rem', borderColor: '#FFCED1' }} />
        <h3 style={{ fontWeight: 500, paddingBottom: '0.75rem', textAlign: 'center' }}>
          <i className="fa-solid fa-truck-fast fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
          FREE Shipping to United States
        </h3>
        <p style={{ textAlign: 'center' }}>
          Orders ship USPS Ground Advantage.
          <br />
          Insurance is added to orders over $100.
        </p>
      </div>
      <div style={{ flex: '1 1 280px', textAlign: 'center' }}>
        <hr style={{ borderWidth: '2px', marginBottom: '1.5rem', borderColor: '#FFCED1' }} />
        <h3 style={{ fontWeight: 500, paddingBottom: '0.75rem', textAlign: 'center' }}>
          <i className="fa-solid fa-circle-check fc-7" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
          Plan for Success
        </h3>
        <p style={{ textAlign: 'center', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
          If possible, consider shipping to a business address where packages are often received
          and brought inside quickly. Postal workers often throw boxes over gates onto hard
          surfaces and while each order is packaged carefully, this extra step helps.
        </p>
      </div>
    </div>
  )
}
