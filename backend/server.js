const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Toutes les devises supportées (incluant TND et toutes les devises mondiales)
const CURRENCIES = {
  AED: "Dirham des Émirats Arabes Unis",
  AFN: "Afghani afghan",
  ALL: "Lek albanais",
  AMD: "Dram arménien",
  ANG: "Florin antillais néerlandais",
  AOA: "Kwanza angolais",
  ARS: "Peso argentin",
  AUD: "Dollar australien",
  AWG: "Florin arubais",
  AZN: "Manat azerbaïdjanais",
  BAM: "Mark convertible de Bosnie-Herzégovine",
  BBD: "Dollar de la Barbade",
  BDT: "Taka bangladais",
  BGN: "Lev bulgare",
  BHD: "Dinar bahreïni",
  BIF: "Franc burundais",
  BMD: "Dollar des Bermudes",
  BND: "Dollar de Brunei",
  BOB: "Boliviano bolivien",
  BRL: "Réal brésilien",
  BSD: "Dollar des Bahamas",
  BTN: "Ngultrum bhoutanais",
  BWP: "Pula botswanais",
  BYN: "Rouble biélorusse",
  BZD: "Dollar de Belize",
  CAD: "Dollar canadien",
  CDF: "Franc congolais",
  CHF: "Franc suisse",
  CLP: "Peso chilien",
  CNY: "Yuan chinois",
  COP: "Peso colombien",
  CRC: "Colón costaricain",
  CUP: "Peso cubain",
  CVE: "Escudo cap-verdien",
  CZK: "Couronne tchèque",
  DJF: "Franc djiboutien",
  DKK: "Couronne danoise",
  DOP: "Peso dominicain",
  DZD: "Dinar algérien",
  EGP: "Livre égyptienne",
  ERN: "Nakfa érythréen",
  ETB: "Birr éthiopien",
  EUR: "Euro",
  FJD: "Dollar fidjien",
  FKP: "Livre des Malouines",
  GBP: "Livre sterling",
  GEL: "Lari géorgien",
  GHS: "Cedi ghanéen",
  GIP: "Livre de Gibraltar",
  GMD: "Dalasi gambien",
  GNF: "Franc guinéen",
  GTQ: "Quetzal guatémaltèque",
  GYD: "Dollar guyanais",
  HKD: "Dollar de Hong Kong",
  HNL: "Lempira hondurien",
  HRK: "Kuna croate",
  HTG: "Gourde haïtienne",
  HUF: "Forint hongrois",
  IDR: "Roupie indonésienne",
  ILS: "Nouveau shekel israélien",
  INR: "Roupie indienne",
  IQD: "Dinar irakien",
  IRR: "Rial iranien",
  ISK: "Couronne islandaise",
  JMD: "Dollar jamaïcain",
  JOD: "Dinar jordanien",
  JPY: "Yen japonais",
  KES: "Shilling kényan",
  KGS: "Som kirghiz",
  KHR: "Riel cambodgien",
  KMF: "Franc comorien",
  KPW: "Won nord-coréen",
  KRW: "Won sud-coréen",
  KWD: "Dinar koweïtien",
  KYD: "Dollar des îles Caïmans",
  KZT: "Tenge kazakhstanais",
  LAK: "Kip laotien",
  LBP: "Livre libanaise",
  LKR: "Roupie srilankaise",
  LRD: "Dollar libérien",
  LSL: "Loti lesothan",
  LYD: "Dinar libyen",
  MAD: "Dirham marocain",
  MDL: "Leu moldave",
  MGA: "Ariary malgache",
  MKD: "Denar macédonien",
  MMK: "Kyat birman",
  MNT: "Tögrög mongol",
  MOP: "Pataca macanais",
  MRU: "Ouguiya mauritanien",
  MUR: "Roupie mauricienne",
  MVR: "Rufiyaa maldivien",
  MWK: "Kwacha malawien",
  MXN: "Peso mexicain",
  MYR: "Ringgit malaisien",
  MZN: "Metical mozambicain",
  NAD: "Dollar namibien",
  NGN: "Naira nigérian",
  NIO: "Córdoba nicaraguayen",
  NOK: "Couronne norvégienne",
  NPR: "Roupie népalaise",
  NZD: "Dollar néo-zélandais",
  OMR: "Rial omanais",
  PAB: "Balboa panaméen",
  PEN: "Sol péruvien",
  PGK: "Kina papouasien",
  PHP: "Peso philippin",
  PKR: "Roupie pakistanaise",
  PLN: "Zloty polonais",
  PYG: "Guaraní paraguayen",
  QAR: "Riyal qatari",
  RON: "Leu roumain",
  RSD: "Dinar serbe",
  RUB: "Rouble russe",
  RWF: "Franc rwandais",
  SAR: "Riyal saoudien",
  SBD: "Dollar des Salomon",
  SCR: "Roupie seychelloise",
  SDG: "Livre soudanaise",
  SEK: "Couronne suédoise",
  SGD: "Dollar de Singapour",
  SHP: "Livre de Sainte-Hélène",
  SLL: "Leone sierra-léonais",
  SOS: "Shilling somalien",
  SRD: "Dollar surinamien",
  STN: "Dobra santoméen",
  SVC: "Colón salvadorien",
  SYP: "Livre syrienne",
  SZL: "Lilangeni swazi",
  THB: "Baht thaïlandais",
  TJS: "Somoni tadjik",
  TMT: "Manat turkmène",
  TND: "Dinar tunisien",
  TOP: "Paʻanga tongien",
  TRY: "Livre turque",
  TTD: "Dollar de Trinité-et-Tobago",
  TWD: "Nouveau dollar taïwanais",
  TZS: "Shilling tanzanien",
  UAH: "Hryvnia ukrainienne",
  UGX: "Shilling ougandais",
  USD: "Dollar américain",
  UYU: "Peso uruguayen",
  UZS: "Sum ouzbek",
  VES: "Bolívar vénézuélien",
  VND: "Dong vietnamien",
  VUV: "Vatu vanuatuan",
  WST: "Tālā samoan",
  XAF: "Franc CFA d'Afrique centrale",
  XCD: "Dollar des Caraïbes orientales",
  XOF: "Franc CFA d'Afrique de l'Ouest",
  XPF: "Franc CFP",
  YER: "Rial yéménite",
  ZAR: "Rand sud-africain",
  ZMW: "Kwacha zambien",
  ZWL: "Dollar zimbabwéen"
};

// GET /currencies - Retourne toutes les devises
app.get('/currencies', (req, res) => {
  const list = Object.entries(CURRENCIES).map(([code, name]) => ({ code, name }));
  res.json(list);
});

// GET /convert - Convertit un montant
app.get('/convert', async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Paramètres manquants: from, to, amount requis' });
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount < 0) {
    return res.status(400).json({ error: 'Montant invalide' });
  }

  try {
    // Utilisation de l'API ouverte exchangerate-api
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${from.toUpperCase()}`
    );

    const rates = response.data.rates;
    const toUpper = to.toUpperCase();

    if (!rates[toUpper]) {
      return res.status(400).json({ error: `Devise "${to}" non trouvée` });
    }

    const rate = rates[toUpper];
    const converted = numAmount * rate;

    res.json({
      from: from.toUpperCase(),
      to: toUpper,
      amount: numAmount,
      converted: parseFloat(converted.toFixed(6)),
      rate: parseFloat(rate.toFixed(6)),
      timestamp: response.data.time_last_updated
    });

  } catch (error) {
    console.error('Erreur de conversion:', error.message);
    res.status(500).json({ error: 'Erreur lors de la conversion. Vérifiez votre connexion.' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Currency Converter API is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend démarré sur http://0.0.0.0:${PORT}`);
});
