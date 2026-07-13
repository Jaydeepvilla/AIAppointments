import { db } from "../../src/server/db";
import { serviceCategories, services } from "../../src/server/db/schema";
import { ORG_ID } from "./business";

export interface SeededService {
  id: string;
  name: string;
  price: string;
  duration: number;
}

export async function seedServices(): Promise<SeededService[]> {
  console.log("💇 Seeding service categories and 20+ services...");

  // Static category IDs
  const catFacials = "44444444-1111-1111-1111-111111111111";
  const catMassages = "44444444-2222-2222-2222-222222222222";
  const catBrowsLashes = "44444444-3333-3333-3333-333333333333";
  const catBodyNails = "44444444-4444-4444-4444-444444444444";

  await db.insert(serviceCategories).values([
    { id: catFacials, organizationId: ORG_ID, name: "Facials & Skin Therapies", description: "Advanced clinical facials, hydrafacials, and peels for glowing skin." },
    { id: catMassages, organizationId: ORG_ID, name: "Massage & Body Healing", description: "Deep tissue, hot stone, and restorative massage wellness treatments." },
    { id: catBrowsLashes, organizationId: ORG_ID, name: "Brows, Lashes & Waxing", description: "Expert brow shaping, lash lifts, tints, and full body waxing services." },
    { id: catBodyNails, organizationId: ORG_ID, name: "Manicures, Pedicures & Body Wraps", description: "Premium nail treatments, wraps, and exfoliating scrub therapies." }
  ]).onConflictDoNothing();

  const servicesData = [
    // Facials & Skin Therapies (8 services)
    {
      id: "55555555-1001-1111-1111-111111111111",
      categoryId: catFacials,
      name: "Signature Glow Facial",
      description: "Our classic custom facial featuring a double cleanse, gentle exfoliation, pore extractions, a personalized mask, and a face massage.",
      duration: 60,
      price: "115.00"
    },
    {
      id: "55555555-1002-1111-1111-111111111111",
      categoryId: catFacials,
      name: "Ultimate Hydrafacial MD",
      description: "An advanced 3-step medical grade facial that deeply cleanses, extracts impurities, and hydrates the skin using patented vortex fusion serums.",
      duration: 45,
      price: "199.00"
    },
    {
      id: "55555555-1003-1111-1111-111111111111",
      categoryId: catFacials,
      name: "Dermaplaning & Brightening",
      description: "Manual exfoliation service that removes dead skin cells and peach fuzz, combined with a botanical vitamin C brightening serum.",
      duration: 45,
      price: "95.00"
    },
    {
      id: "55555555-1004-1111-1111-111111111111",
      categoryId: catFacials,
      name: "Collagen Induction Microneedling",
      description: "Clinically proven micro-needling treatment that stimulates collagen production, reducing fine lines, acne scarring, and hyperpigmentation.",
      duration: 75,
      price: "249.00"
    },
    {
      id: "55555555-1005-1111-1111-111111111111",
      categoryId: catFacials,
      name: "Glycolic Resurfacing Peel",
      description: "A fast-acting chemical peel that melts away dull top layers to reveal fresh, even, and smooth skin. Minimal downtime.",
      duration: 30,
      price: "85.00"
    },
    {
      id: "55555555-1006-1111-1111-111111111111",
      categoryId: catFacials,
      name: "LED Light Therapy Treatment",
      description: "Non-invasive cell renewal treatment utilizing medical-grade red and blue light to treat breakouts, fine lines, and inflammation.",
      duration: 30,
      price: "60.00"
    },
    {
      id: "55555555-1007-1111-1111-111111111111",
      categoryId: catFacials,
      name: "Anti-Aging Peptide Infusion",
      description: "Rich peptide serum lock-in combined with mild microcurrent muscle toning to firm sagging skin and boost elastic properties.",
      duration: 75,
      price: "165.00"
    },
    {
      id: "55555555-1008-1111-1111-111111111111",
      categoryId: catFacials,
      name: "Teen Balance Clarifying Facial",
      description: "Deep clearing facial for younger clients focused on extracting blackheads, balancing sebum levels, and education on skincare habits.",
      duration: 45,
      price: "85.00"
    },

    // Massage & Body Healing (6 services)
    {
      id: "55555555-2001-1111-1111-111111111111",
      categoryId: catMassages,
      name: "Swedish Massage Restorative",
      description: "Classic light-to-medium pressure massage designed to melt stress, increase blood flow, and prompt full body physical relaxation.",
      duration: 60,
      price: "110.00"
    },
    {
      id: "55555555-2002-1111-1111-111111111111",
      categoryId: catMassages,
      name: "Deep Tissue Muscle Recovery",
      description: "Focused massage targeting deep muscle layers, fascia, and chronic tension nodes. Recommended for athletes or severe soreness.",
      duration: 75,
      price: "135.00"
    },
    {
      id: "55555555-2003-1111-1111-111111111111",
      categoryId: catMassages,
      name: "Himalayan Warm Salt Stone Massage",
      description: "Relaxing massage incorporating heated organic salt stones to infuse trace minerals into the skin and relieve stiff lower back tension.",
      duration: 90,
      price: "170.00"
    },
    {
      id: "55555555-2004-1111-1111-111111111111",
      categoryId: catMassages,
      name: "Maternity Harmony Massage",
      description: "Nurturing massage using specialized cushions to support expecting mothers. Safely reduces pregnancy hip ache and fluid swelling.",
      duration: 60,
      price: "125.00"
    },
    {
      id: "55555555-2005-1111-1111-111111111111",
      categoryId: catMassages,
      name: "Reflexology Tension Relief",
      description: "Ancient therapeutic pressure point massage focused entirely on feet, hands, and head meridian channels to trigger system wellness.",
      duration: 45,
      price: "80.00"
    },
    {
      id: "55555555-2006-1111-1111-111111111111",
      categoryId: catMassages,
      name: "Aromatherapy Escape Massage",
      description: "Swedish massage technique combined with medical-grade organic lavender, eucalyptus, and frankincense essential oils.",
      duration: 60,
      price: "120.00"
    },

    // Brows, Lashes & Waxing (5 services)
    {
      id: "55555555-3001-1111-1111-111111111111",
      categoryId: catBrowsLashes,
      name: "Precision Brow Wax & Shaping",
      description: "Brow consultation, wax design mapping, clean trimming, and soothing tea tree after-wax cream application.",
      duration: 30,
      price: "35.00"
    },
    {
      id: "55555555-3002-1111-1111-111111111111",
      categoryId: catBrowsLashes,
      name: "Keratin Lash Lift & Tint",
      description: "Organic keratin treatment that naturally lifts, curls, and darkens your natural lashes. Lasts up to 6–8 weeks.",
      duration: 60,
      price: "110.00"
    },
    {
      id: "55555555-3003-1111-1111-111111111111",
      categoryId: catBrowsLashes,
      name: "Henna Brow Tinting & Design",
      description: "Semi-permanent tinting using natural plant extract dyes to fill in sparse brow structures and design shape.",
      duration: 45,
      price: "65.00"
    },
    {
      id: "55555555-3004-1111-1111-111111111111",
      categoryId: catBrowsLashes,
      name: "Brazilian Honey Waxing",
      description: "Premium smooth hard wax service for delicate bikini areas. Quick, hygienic, and includes soothing rosewater wipe down.",
      duration: 40,
      price: "70.00"
    },
    {
      id: "55555555-3005-1111-1111-111111111111",
      categoryId: catBrowsLashes,
      name: "Lash Extensions Full Set Classic",
      description: "Meticulous single-strand synthetic silk lashes applied to each natural lash. Enhances eye definition and volume.",
      duration: 120,
      price: "150.00"
    },

    // Manicures, Pedicures & Body Wraps (4 services)
    {
      id: "55555555-4001-1111-1111-111111111111",
      categoryId: catBodyNails,
      name: "Organic Honey Spa Manicure",
      description: "Nail shaping, warm lavender oil soak, cuticle care, honey honey scrub scrub, hand massage, and professional organic polish.",
      duration: 45,
      price: "45.00"
    },
    {
      id: "55555555-4002-1111-1111-111111111111",
      categoryId: catBodyNails,
      name: "Detox Seaweed Body Wrap",
      description: "Warm seaweed paste wrap combined with a thermal blanket wrap to sweat out deep toxins and re-mineralize the skin matrix.",
      duration: 75,
      price: "140.00"
    },
    {
      id: "55555555-4003-1111-1111-111111111111",
      categoryId: catBodyNails,
      name: "Volcano Hot Stone Spa Pedicure",
      description: "Ultimate foot relaxation: bubbling volcano crystals, exfoliating foot scrub, warm clay boot mask, hot stone massage, and polish.",
      duration: 60,
      price: "75.00"
    },
    {
      id: "55555555-4004-1111-1111-111111111111",
      categoryId: catBodyNails,
      name: "Crushed Cabernet Skin Exfoliant",
      description: "Full body smoothing polish featuring real grape seeds, honey, brown sugar, and organic grape oils. Leaves skin satin smooth.",
      duration: 60,
      price: "115.00"
    }
  ];

  for (const svc of servicesData) {
    await db.insert(services).values({
      id: svc.id,
      organizationId: ORG_ID,
      categoryId: svc.categoryId,
      name: svc.name,
      description: svc.description,
      duration: svc.duration,
      price: svc.price,
      isActive: true,
      isArchived: false,
    }).onConflictDoNothing();
  }

  console.log(`✅ Seeded ${servicesData.length} active spa services!`);
  return servicesData.map(s => ({ id: s.id, name: s.name, price: s.price, duration: s.duration }));
}
