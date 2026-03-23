// Global HRIS button and animation styles — inject once at the top level layout.

export const GLOBAL_STYLES = `
  /* ── Button gradient hover ── */
  .hris-btn {
    position: relative;
    overflow: hidden;
    z-index: 0;
    transition: color 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease !important;
  }
  .hris-btn::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #1CA7EC 0%, #1F2F98 100%);
    opacity: 0;
    transition: opacity 0.28s ease;
    z-index: -1;
    border-radius: inherit;
  }
  .hris-btn:hover::before { opacity: 1; }
  .hris-btn:hover {
    color: #ffffff !important;
    border-color: transparent !important;
    box-shadow: 0 6px 22px rgba(28,167,236,0.40) !important;
  }

  /* ── Soft text link hover ── */
  .hris-btn-soft {
    position: relative;
    overflow: hidden;
    z-index: 0;
    transition: color 0.28s ease, box-shadow 0.28s ease !important;
  }
  .hris-btn-soft::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #1CA7EC 0%, #1F2F98 100%);
    opacity: 0;
    transition: opacity 0.28s ease;
    z-index: -1;
    border-radius: inherit;
  }
  .hris-btn-soft:hover::before { opacity: 1; }
  .hris-btn-soft:hover {
    color: #ffffff !important;
    box-shadow: 0 3px 14px rgba(28,167,236,0.30) !important;
  }

  /* ── Icon-only button ── */
  .hris-btn-icon {
    transition: opacity 0.2s ease !important;
  }
  .hris-btn-icon:hover { opacity: 0.75; }
`;