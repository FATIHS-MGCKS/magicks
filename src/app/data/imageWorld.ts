type ImageAsset = {
  src: string;
  alt: string;
};

type ServiceImageAsset = ImageAsset & {
  label: string;
};

export const HOME_SERVICE_IMAGES: Record<
  "websites" | "shops" | "software" | "automation",
  ServiceImageAsset
> = {
  websites: {
    src: "/media/stage5/home/service-websites.webp",
    label: "Websites",
    alt:
      "Helle MAGICKS-Bildwelt: ruhige Premium-Browser-Komposition mit klarer Website-Hierarchie, viel Weißraum und warmer Materialfläche.",
  },
  shops: {
    src: "/media/stage5/home/service-shops.webp",
    label: "Shops",
    alt:
      "Helle MAGICKS-Bildwelt: Produktkonfigurator für eine Pergola mit sichtbarem Produkt, reduzierter Auswahloberfläche und ruhiger Premium-Materialität.",
  },
  software: {
    src: "/media/stage5/home/service-software.webp",
    label: "Software",
    alt:
      "Helle MAGICKS-Bildwelt: strukturierte Portal- und Dashboard-Oberfläche in einer ruhigen, systemorientierten Komposition.",
  },
  automation: {
    src: "/media/stage5/home/service-automation.webp",
    label: "Automation",
    alt:
      "Helle MAGICKS-Bildwelt: verbundene Workflow-Knoten für Formular, Logik, CRM und Team als glaubwürdige Prozessvisualisierung ohne KI-Klischees.",
  },
};

export const HOME_ABOUT_IMAGE: ImageAsset = {
  src: "/media/stage5/home/about-editorial.webp",
  alt:
    "Helle MAGICKS-Studio-Komposition mit reduziertem Bildschirm, Papierfläche und Materialdetails als ruhiger editorialer Arbeitsplatz.",
};

export const SERVICE_PAGE_IMAGES = {
  websites: {
    brand: {
      src: "/media/stage5/services/websites/brand-system.webp",
      alt:
        "Helle Browser- und Gerätekomposition einer Premium-Website mit klarer Hierarchie, ruhigem Weißraum und editorialer Layoutführung.",
    },
    detail: {
      src: "/media/stage5/services/websites/interface-detail.webp",
      alt:
        "Responsive Website-Komposition mit Desktop-Browser, Kampagnenansicht und reduziertem Layoutdetail in heller MAGICKS-Bildsprache.",
    },
  },
  shops: {
    pergola: {
      src: "/media/stage5/services/shops/pergola-configurator.webp",
      alt:
        "Heller Pergola-Konfigurator mit sichtbarer Produktansicht, Material- und Größenoptionen sowie einem klaren Anfrageabschluss.",
    },
    window: {
      src: "/media/stage5/services/shops/window-configurator.webp",
      alt:
        "Heller Fenster-Konfigurator mit Produktansicht, Materialauswahl, Maßen und reduzierter Bedienoberfläche.",
    },
    mobile: {
      src: "/media/stage5/services/shops/mobile-summary.webp",
      alt:
        "Mobile Konfigurator-Zusammenfassung mit Pergola-Produkt, ausgewählten Optionen und klarem Anfrage-Button.",
    },
  },
  software: {
    portal: {
      src: "/media/stage5/services/web-software/portal-operations.webp",
      alt:
        "Helles operatives Portal mit Navigation, Tabellen, Statuschips und ruhiger Dashboard-Struktur.",
    },
    workflow: {
      src: "/media/stage5/services/web-software/workflow-detail.webp",
      alt:
        "Helle Web-Software-Ansicht mit Status-Workflow, Filterchips und strukturierter Tabelle für operative Abläufe.",
    },
  },
  automation: {
    canvas: {
      src: "/media/stage5/services/ki-automation/workflow-canvas.webp",
      alt:
        "Helle Workflow-Canvas mit Formular, Datenquelle, Logik, CRM und Team-Ausgabe als ruhige Systemvisualisierung.",
    },
    handoff: {
      src: "/media/stage5/services/ki-automation/handoff-detail.webp",
      alt:
        "Heller Automations-Handoff von Formular zu CRM mit Validierungsindikator und klar getrennten Prozesskarten.",
    },
  },
} as const;

export const PAGE_IMAGES = {
  ueberUns: {
    studio: {
      src: "/media/stage5/pages/ueber-uns/studio-anchor.webp",
      alt:
        "Ruhige helle Studio-Komposition mit Bildschirm, Papier, Materialdetails und großzügiger Fläche als editorialer MAGICKS-Arbeitsplatz.",
    },
  },
  webdesignKassel: {
    anchor: {
      src: "/media/stage5/pages/webdesign-kassel/web-presence.webp",
      alt:
        "Helle Webdesign-Komposition mit Website-Ansicht und reduzierter lokaler Kassel-Anmutung für einen hochwertigen regionalen Auftritt.",
    },
  },
  landingpagesKassel: {
    anchor: {
      src: "/media/stage5/pages/landingpages-kassel/campaign-landing.webp",
      alt:
        "Helle Landingpage- und Kampagnen-Komposition mit klarer Hierarchie, CTA-Fokus und strukturierter Conversion-Oberfläche.",
    },
  },
} as const;
