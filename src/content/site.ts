/**
 * All editable site content lives here.
 * Update text, links, stats and fees in this single file.
 */

export const links = {
  startTransaction: "/request",
  discord: "https://discord.com/invite/roescrow",
  fees: "/fees",
  terms: "/terms",
  privacy: "/privacy",
  rules: "/rules",
  contact: "/request",
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Services", href: "/services" },
  { label: "Verify", href: "/verify" },
  { label: "Fees", href: "/fees" },
  { label: "Safety", href: "/safety" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/request" },
];

/** Set `value` to a real figure when you have one (e.g. "12,480"). */
export const stats = [
  { value: "1", label: "Secure Transactions", note: "Handled end to end" },
  { value: "2", label: "Fast Response Times", note: "Average reply window" },
  { value: "3", label: "Trusted Middlemen", note: "Verified team members" },
  { value: "4", label: "Transparent Process", note: "Documented every step" },
];

export const steps = [
  {
    title: "Open a Deal",
    body: "Buyer and seller submit the transaction details.",
  },
  {
    title: "Middleman Assigned",
    body: "A verified RoEscrow middleman reviews and accepts the transaction.",
  },
  {
    title: "Assets Secured",
    body: "The middleman securely holds the agreed assets while both sides complete their part.",
  },
  {
    title: "Transaction Completed",
    body: "Once everything is verified, the assets are released to the correct parties.",
  },
];

export const services = [
  {
    title: "Robux Transactions",
    body: "Middleman coverage for Robux-based deals between two parties.",
  },
  {
    title: "Limited Item Trades",
    body: "Held and verified item trades with both sides confirmed before release.",
  },
  {
    title: "Account Transactions",
    body: "Structured handover process with verification at each stage.",
  },
  {
    title: "Game Asset Transactions",
    body: "Coverage for in-game assets, builds, models and commissioned work.",
  },
  {
    title: "Custom Deals",
    body: "Non-standard arrangements reviewed case by case before acceptance.",
  },
];

export const reasons = [
  {
    title: "Security First",
    body: "Every deal follows a fixed, reviewable handling procedure.",
  },
  {
    title: "Verified Middlemen",
    body: "Only approved team members are ever assigned to a transaction.",
  },
  {
    title: "Clear Communication",
    body: "Both parties stay informed at every stage of the process.",
  },
  {
    title: "Fast Processing",
    body: "Requests are picked up and moved forward without delay.",
  },
  {
    title: "Transparent Fees",
    body: "Fees are confirmed with both parties before anything begins.",
  },
  {
    title: "Transaction Records",
    body: "Each deal is logged so it can be referenced afterwards.",
  },
];

/** Fee tiers shown on the homepage and matched by the bot transaction logic. */
export const feeTiers = [
  {
    name: "Under $25",
    amount: "5%",
    unit: "transaction fee",
    points: [
      "Small transaction coverage",
      "Verified middleman assigned",
      "Full transaction record",
    ],
  },
  {
    name: "$25 - $100",
    amount: "4%",
    unit: "transaction fee",
    points: [
      "Standard transaction coverage",
      "Verified middleman assigned",
      "Full transaction record",
    ],
  },
  {
    name: "$100 - $500",
    amount: "3%",
    unit: "transaction fee",
    points: ["High value transaction coverage", "Extended verification", "Full transaction record"],
  },
  {
    name: "Over $500",
    amount: "2%",
    unit: "transaction fee",
    points: ["Premium transaction coverage", "Priority handling", "Dedicated deal support"],
  },
];
export const safetyPoints = [
  "Only communicate through official RoEscrow channels.",
  "Never send assets before a middleman is officially assigned.",
  "Always verify the middleman handling your transaction.",
  "RoEscrow will never ask for your password.",
  "Report impersonators immediately.",
];

export const faqs = [
  {
    q: "What is a middleman?",
    a: "A middleman is a neutral third party who holds the agreed assets during a trade so neither side has to send first and trust the other to follow through.",
  },
  {
    q: "How does RoEscrow protect transactions?",
    a: "A verified middleman holds the agreed assets while both parties complete their side of the deal. Nothing is released until each step has been checked.",
  },
  {
    q: "What transactions are supported?",
    a: "Robux transactions, limited item trades, account transactions, game asset transactions and custom deals. Supported types and rules may vary.",
  },
  {
    q: "How long does a transaction take?",
    a: "Timing depends on the deal type, its value and how quickly both parties respond. An estimate is given once a middleman is assigned.",
  },
  {
    q: "What happens if a deal is canceled?",
    a: "If a deal is canceled before completion, held assets are returned to the party they came from, following the transaction rules.",
  },
  {
    q: "How are middlemen verified?",
    a: "Middlemen are approved internally before being allowed to take deals, and every assignment is recorded against the transaction.",
  },
  {
    q: "What fees does RoEscrow charge?",
    a: "Fees depend on the transaction type and value, and are always confirmed with both parties before the deal begins.",
  },
  {
    q: "How do I know I'm speaking with the real RoEscrow?",
    a: "Only trust the official channels linked on this site. Anyone contacting you elsewhere claiming to represent RoEscrow should be reported.",
  },
];

export const transactionTypes = [
  "Robux Transaction",
  "Limited Item Trade",
  "Account Transaction",
  "Game Asset Transaction",
  "In-Game Item Transaction",
  "Custom Deal",
];

export const paymentMethods = [
  "Robux",
  "Limited Items",
  "Game Assets",
  "PayPal",
  "Apple Pay",
  "Cash App",
  "Cryptocurrency",
  "Other / Discuss with middleman",
];

export const disclaimer =
  "RoEscrow is an independent service and is not affiliated with, endorsed by, or sponsored by Roblox Corporation.";
