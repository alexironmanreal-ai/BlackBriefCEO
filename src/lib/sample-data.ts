import type { Briefing, Dossier } from "./types";

export const SAMPLE_DOSSIER: Dossier = {
  companyName: "Helios Energía",
  legalName: "Helios Energía SpA",
  sector: "Generación renovable (solar, eólico) y almacenamiento BESS",
  hq: "Las Condes, Santiago, Chile",
  size: "1.200 empleados · 1,8 GW en operación · 900 MW en construcción",
  geographies: [
    "Desierto de Atacama, Chile",
    "Coquimbo, Chile",
    "Magallanes, Chile",
    "Arequipa, Perú",
    "Madrid, España (financiamiento)",
  ],
  executives: [
    { name: "Valentina Ruiz", role: "CEO" },
    { name: "Martín Orellana", role: "CFO — roadshow pre-IPO" },
    { name: "Sofía Contreras", role: "COO / operaciones OT" },
    { name: "Diego Palacios", role: "Asuntos corporativos y comunidades" },
  ],
  assets: [
    {
      name: "Planta solar Salar Alto",
      type: "Generación",
      location: "Atacama",
      note: "620 MW. Inversores Sungrow. Red OT parcialmente aislada, parches atrasados.",
    },
    {
      name: "Parque eólico Cabo Negro",
      type: "Generación",
      location: "Magallanes",
      note: "280 MW. Logística por Estrecho de Magallanes. Ventanas climáticas estrechas.",
    },
    {
      name: "BESS La Serena",
      type: "Almacenamiento",
      location: "Coquimbo",
      note: "200 MW / 800 MWh. Celdas CATL. Energización comprometida antes de diciembre.",
    },
    {
      name: "Centro de control",
      type: "OT / IT",
      location: "Las Condes, Santiago",
      note: "SCADA unificado con VPN a plantas. Único punto de visibilidad operacional.",
    },
    {
      name: "PPA Codelco",
      type: "Ingresos",
      location: "Chile",
      note: "Contrato a 15 años. ~18% del EBITDA. Renegociación abierta.",
    },
  ],
  supplyChain: [
    "Inversores Sungrow (China) — 70% del parque solar",
    "Celdas CATL (China) para BESS La Serena",
    "Turbinas y logística Vestas",
    "Financiamiento: BBVA + BID Invest",
    "EPC: Salfa (Chile) y consorcio local en Arequipa",
  ],
  competitors: ["Colbún", "Enel Chile", "AES Andes", "Atlas Renewable"],
  regulatory:
    "SEC Chile, Coordinador Eléctrico Nacional, SEA (permisos ambientales), OSINERGMIN en Perú. CNMV si avanza el listing en Madrid.",
  priorities:
    "Cerrar round pre-IPO en el trimestre, energizar BESS La Serena antes de diciembre, renegociar PPA Codelco, reducir dependencia de un solo fabricante de inversores.",
  knownExposures:
    "Parches OT atrasados en Salar Alto. Servidumbres en disputa con comunidades colla cerca de Atacama. ~40% del capex en USD con ingresos en CLP. El CFO está en roadshow público en Londres y Madrid las próximas tres semanas.",
  notes:
    "La CEO lee el briefing a las 06:30. Quiere decisiones, no recortes de prensa. Prohibido el lenguaje de consultora.",
};

export const SAMPLE_BRIEFING: Briefing = {
  id: "brief-helios-ref",
  date: "",
  generatedAt: "",
  source: "referencia",
  companyName: "Helios Energía",
  headline:
    "Tres frentes convergen esta semana: la planta que no puede parchearse en caliente, el CFO que está en cartelera pública, y un PPA que alguien más quiere reabrir.",
  situation:
    "Helios no tiene un problema de ‘noticias del sector energético’. Tiene un cuello de botella físico en Salar Alto, un ejecutivo expuesto en Europa, y un contrato que representa casi un quinto del EBITDA. El resto del ruido —precios spot, comunicados de competidores, foros de ciberseguridad— solo importa si toca uno de esos tres. Este briefing descarta lo demás.",
  items: [
    {
      id: "t1",
      severity: "critico",
      vector: "cibernetico",
      horizon: "hoy",
      title: "Salar Alto sigue siendo el único activo que no se puede aislar sin apagar megawatts",
      dossierAnchor: "Planta solar Salar Alto · red OT",
      whyItMatters:
        "El SCADA unificado del centro de Las Condes llega a Atacama por VPN. Los parches OT están atrasados. Un incidente de ransomware en generación chilena no necesita ser ‘sobre Helios’ para volverse tu problema: con 620 MW y un PPA Codelco detrás, una detención de 12 horas no es un ticket de TI, es una cláusula de suministro.",
      action:
        "Hoy: Sofía Contreras confirma que Salar Alto puede operar en isla (sin VPN a Santiago) y que el runbook de 4 horas existe en papel, no solo en Confluence. Si no existe, no hay briefing que lo invente — hay que escribirlo antes del lunes.",
      owner: "Sofía Contreras, COO",
    },
    {
      id: "t2",
      severity: "alto",
      vector: "personal",
      horizon: "7d",
      title: "El roadshow de Martín Orellana convierte al CFO en superficie de ataque, no en agenda de marketing",
      dossierAnchor: "Martín Orellana · Londres / Madrid",
      whyItMatters:
        "Tres semanas de hoteles, decks de valuación y reuniones con banks en dos capitales. El pre-IPO es prioridad del trimestre. Eso significa: itinerario reconstruible, materiales con cifras de EBITDA y PPA, y un ejecutivo que la prensa ya puede nombrar. El riesgo no es ‘un extraño en el lobby’. Es que el contenido del round circule antes que el round.",
      action:
        "Asuntos corporativos fija una regla de 48 h: ningún deck completo en correo personal, ningún itinerario en calendarios públicos, un solo canal de documentos. Seguridad física del hotel la cubre el banco anfitrión; la fuga de cifras no.",
      owner: "Diego Palacios + CFO",
    },
    {
      id: "t3",
      severity: "alto",
      vector: "financiero",
      horizon: "30d",
      title: "El PPA Codelco no es un contrato: es el 18% del EBITDA en una mesa que se puede reabrir",
      dossierAnchor: "PPA Codelco · renegociación abierta",
      whyItMatters:
        "Cualquier rumor de energía más barata —de Colbún, Enel o un BESS ajeno que se adelante al tuyo— le da a Codelco una palanca que el roadshow no puede permitirse. Helios necesita el contrato firme para el round. El competidor no tiene que ganarte el cliente; le basta con que el precio se vuelva ‘discutible’ durante la due diligence.",
      action:
        "Valentina Ruiz habla con el sponsor en Codelco esta semana, no con ‘el área de abastecimiento’. Objetivo: congelar términos hasta cierre del round o, si no, documentar por escrito el rango. El banco de la IPO no acepta un ‘estamos conversando’.",
      owner: "Valentina Ruiz, CEO",
    },
    {
      id: "t4",
      severity: "alto",
      vector: "suministro",
      horizon: "30d",
      title: "Sungrow y CATL no son proveedores. Son un solo país sentado en el 70% del solar y en todo el BESS",
      dossierAnchor: "Sungrow · CATL · BESS La Serena",
      whyItMatters:
        "La prioridad de energizar La Serena antes de diciembre asume que las celdas llegan. Un control de exportación, una cola portuaria o un recambio de firmware impuesto por el fabricante no es un escenario extremo: es el único modo de fallo que tumba a la vez el parque solar y el almacenamiento. El round pre-IPO premiará diversificación; hoy no la hay.",
      action:
        "Compras abre un segundo fabricante de inversores con lead time real (no brochure) y un plan B de celdas para el 30% de La Serena. Si el plan B no cabe en el calendario de diciembre, el board debe oírlo ahora, no en noviembre.",
      owner: "COO + Abastecimiento",
    },
    {
      id: "t5",
      severity: "vigilancia",
      vector: "regulatorio",
      horizon: "30d",
      title: "La servidumbre colla en Atacama puede no detener Salar Alto. Puede detener la historia que le estás vendiendo a Madrid",
      dossierAnchor: "Comunidades colla · SEA · listing Madrid",
      whyItMatters:
        "Los inversionistas europeos del roadshow preguntan ESG en la primera hora. Un conflicto de servidumbre no necesita sentencia para convertirse en footnote de risk factors. Diego Palacios ya tiene el mapa; el banco de la IPO todavía no.",
      action:
        "Una página, no un informe: estado del diálogo, qué se pidió, qué se ofreció, fecha del próximo hito SEA. Va al data room esta semana.",
      owner: "Diego Palacios",
    },
  ],
  watchlist: [
    "Tipo de cambio CLP/USD — 40% del capex está nominado en dólares.",
    "Ventana climática en Magallanes para Cabo Negro: un mes perdido no se recupera en el Estrecho.",
    "Movimientos de Colbún o AES Andes cerca de clientes industriales de cobre.",
    "Firmware y boletines de Sungrow — no esperar al parche ‘cuando haya ventana’.",
  ],
  close:
    "Si solo hay capacidad para una conversación hoy, que sea esta: ¿puede Salar Alto operar desconectado de Santiago? La segunda, esta tarde: ¿el PPA con Codelco está congelado o está a merced del próximo correo de un competidor? El roadshow espera. La planta, no.",
  signalNote: "5 amenazas ancladas al dossier · 0 recortes de prensa",
};

export function stampSampleBriefing(date: string): Briefing {
  return {
    ...SAMPLE_BRIEFING,
    id: `brief-helios-${date}`,
    date,
    generatedAt: new Date().toISOString(),
  };
}
