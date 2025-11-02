"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Star, Check, Phone, Mail, MapPin, Eye, ShoppingCart, Quote, ExternalLink
} from "lucide-react";

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay }}>
    {children}
  </motion.div>
);

const resolveCategories = [
  { name: "Resolve Unique", slug: "resolve-unique" },
  { name: "Resolve 12.0 WPC", slug: "resolve-12-0-wpc" },
  { name: "Resolve 8.0 WPC", slug: "resolve-8-0" },
  { name: "Resolve 7.0 Rigid Core", slug: "resolve-7-0-rigid-core" },
  { name: "Resolve 6.0 Rigid Core", slug: "resolve-6-0-rigid-core" },
  { name: "Resolve 5.0 Rigid Core", slug: "resolve-5-0-rigid-core" },
  { name: "R+ 4.7mm", slug: "r-4-7mm" },
];

const outletCategories = [
  { name: "Luxury Vinyl (LVP/LVT)", slug: "vinyl" },
  { name: "Laminate", slug: "laminate" },
  { name: "Hardwood", slug: "hardwood" },
  { name: "Carpet", slug: "carpet" },
  { name: "Tile & Stone", slug: "tile" },
];

const SectionTitle = ({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) => (
  <div>
    {kicker && <Badge className="rounded-full px-3 py-1 bg-blue-600 text-white">{kicker}</Badge>}
    <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{title}</h2>
    {subtitle && <p className="mt-2 text-slate-600 max-w-2xl">{subtitle}</p>}
  </div>
);

export default function Page() {
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; url?: string } | null>(null);
  const [search, setSearch] = useState("");
  // Quote form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [productField, setProductField] = useState("");
  const [details, setDetails] = useState("");

  const business = {
    phone: "517-247-7749",
    sms: "+15172477749",
    email: "totalhomeliquidation@yahoo.com",
    address: "111 W Edgewood Blvd Unit 4, Lansing, MI 48911",
    mapEmbed: "https://www.google.com/maps?q=111+W+Edgewood+Blvd+Unit+4,+Lansing,+MI+48911&output=embed",
    hours: [
      { d: "Mon–Fri", h: "9:00 AM – 6:00 PM" },
      { d: "Sat", h: "10:00 AM – 4:00 PM" },
      { d: "Sun", h: "Closed" },
    ],
  };

  // Placeholder catalog (replace by importing CSV later)
  const products = useMemo(() => [
    { id: "TC851", name: "Country Oak", brand: "Resolve", collection: "Resolve 7.0 Rigid Core", category: "LVP", wearLayerMil: 20, thicknessMm: 7.0, color: "Warm Oak", url: "https://resolvefloor.com/products/tc851-country-oak/", image: "" },
    { id: "TC290", name: "Volt", brand: "Resolve", collection: "Resolve 6.0 Rigid Core", category: "LVP", wearLayerMil: 12, thicknessMm: 6.0, color: "Gray Oak", url: "https://resolvefloor.com/products/tc290-volt/", image: "" },
    { id: "FL-20MIL", name: "Waterproof Vinyl – 20mil (Assorted Colors)", brand: "Flooring Liquidators Outlet", collection: "Outlet Vinyl", category: "LVP", wearLayerMil: 20, thicknessMm: 5.0, color: "Assorted", url: "https://flooringliquidatorsoutlet.com/", image: "" },
  ], []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p => [p.id, p.name, p.brand, p.collection, p.category, p.color].join(" ").toLowerCase().includes(q));
  }, [products, search]);

  const submitQuoteByEmail = () => {
    const subj = encodeURIComponent(`Quote request – ${firstName} ${lastName}`.trim());
    const selected = selectedProduct?.name || productField || "(no product specified)";
    const body = encodeURIComponent([
      `Name: ${firstName} ${lastName}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Product: ${selected}${selectedProduct?.url ? " (" + selectedProduct.url + ")" : ""}`,
      `Details: ${details}`,
    ].join("\n"));
    window.location.href = `mailto:${business.email}?subject=${subj}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-blue-600" />
            <span className="font-semibold tracking-tight">Flooring Floor Store</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#products" className="hover:text-blue-700">Products</a>
            <a href="#visualizer" className="hover:text-blue-700">See in My Space</a>
            <a href="#quote" className="hover:text-blue-700">Get a Quote</a>
            <a href="#contact" className="hover:text-blue-700">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button className="rounded-2xl bg-blue-600 hover:bg-blue-700">Text for Quote</Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-24 h-72 w-72 bg-blue-100 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 bg-blue-200 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <FadeIn>
            <Badge className="rounded-full px-3 py-1 bg-blue-600 text-white">Lansing • Sales & Installation</Badge>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Premium flooring at outlet pricing
              <span className="block text-slate-500 font-medium">Luxury vinyl, laminate, hardwood, carpet & tile.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg text-slate-600">
              Browse our curated lines from Resolve Flooring and Flooring Liquidators Outlet. Get free quotes, fast lead times, and see any product in your room with our visualizer.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button className="rounded-2xl px-5">Shop Products <ArrowRight className="ml-2 h-4 w-4" /></Button>
              <Button className="rounded-2xl px-5" variant="outline">See in My Space <Eye className="ml-2 h-4 w-4" /></Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="products" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionTitle kicker="Shop" title="All products from our distributors" subtitle="Everything we offer from Resolve Flooring and Flooring Liquidators Outlet. Click any item to get a fast quote or open the distributor page." />
          <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-3">
            <Input placeholder="Search by color, collection, brand, or SKU" value={search} onChange={(e)=>setSearch(e.target.value)} />
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <Card key={p.id} className="rounded-2xl group">
                <CardContent className="pt-4">
                  <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 shadow-inner flex items-center justify-center text-slate-500">
                    <span className="text-xs">Image placeholder</span>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm text-blue-700 font-medium">{p.brand}</div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.collection} • {p.wearLayerMil}mil • {p.thicknessMm}mm</div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button className="rounded-xl w-full" onClick={()=>setSelectedProduct({ name: `${p.brand} ${p.name}`, url: p.url })}>Get a Quote <Quote className="ml-2 h-4 w-4" /></Button>
                  <Button className="rounded-xl" variant="outline" onClick={()=>window.open(p.url, "_blank")}>View <ExternalLink className="ml-1 h-4 w-4" /></Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-2xl" onClick={()=>window.open("https://resolvefloor.com/products/", "_blank")}>Browse Resolve Catalog</Button>
            <Button variant="outline" className="rounded-2xl" onClick={()=>window.open("https://flooringliquidatorsoutlet.com/", "_blank")}>Browse Outlet Catalog</Button>
          </div>
        </div>
      </section>

      <section id="visualizer" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionTitle kicker="See in My Space" title="Try products in your room" subtitle="Upload a photo and preview flooring instantly. Works on mobile." />
          <div className="mt-8 grid md:grid-cols-2 gap-6 items-stretch">
            <Card className="rounded-2xl">
              <CardContent className="pt-6 space-y-4">
                <p className="text-slate-600">Use our visualizer to remove the guesswork. Snap your room, choose a product, and see it live.</p>
                <ul className="space-y-2 text-sm">
                  {["Upload your room photo", "Tap to try any color", "Save & share looks"].map(t => (
                    <li key={t} className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5 text-blue-600" /> {t}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="rounded-2xl w-full" onClick={()=>window.open("https://get.roomvo.com/", "_blank")}>Open Visualizer <Eye className="ml-2 h-4 w-4" /></Button>
              </CardFooter>
            </Card>
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 border flex items-center justify-center p-8">
              <div className="max-w-sm text-center text-slate-600">
                <div className="aspect-[4/3] rounded-xl bg-white shadow-inner mb-4" />
                <p className="text-sm">Placeholder preview. We'll plug in your live Roomvo link so customers can try any SKU.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="quote" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionTitle kicker="Free Quote" title="Tell us about your project" subtitle="Works right now via email/phone." />
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl">
              <CardContent className="pt-6 space-y-4">
                {selectedProduct && (
                  <div className="text-sm rounded-xl border bg-blue-50 p-3">
                    You’re requesting a quote for <span className="font-semibold">{selectedProduct.name}</span>
                    {selectedProduct.url && <> (<a className="underline" href={selectedProduct.url} target="_blank">view product</a>)</>}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="First name" value={firstName} onChange={e=>setFirstName(e.target.value)} />
                  <Input placeholder="Last name" value={lastName} onChange={e=>setLastName(e.target.value)} />
                </div>
                <Input type="tel" placeholder="Phone (call/text)" value={phone} onChange={e=>setPhone(e.target.value)} />
                <Input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                <Input placeholder="Product (paste URL or name)" value={productField || selectedProduct?.name || ""} onChange={e=>setProductField(e.target.value)} />
                <Textarea placeholder="Square footage, timeline, install needed?" rows={5} value={details} onChange={e=>setDetails(e.target.value)} />
                <div className="grid sm:grid-cols-3 gap-2 pt-2">
                  <Button className="rounded-2xl w-full" onClick={submitQuoteByEmail}>Email Quote</Button>
                  <Button variant="outline" className="rounded-2xl w-full" onClick={()=>window.location.href=`tel:${business.phone}`}>Call Now</Button>
                  <Button variant="outline" className="rounded-2xl w-full" onClick={()=>window.location.href=`sms:${business.sms}?&body=${encodeURIComponent('Hi! I need a flooring quote.')}`}>Text Quote</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl" id="contact">
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Open to the public • No appointments required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> {business.address}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-600" /> <a className="underline" href={`tel:${business.phone}`}>{business.phone}</a> (Call / Text)</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-600" /> <a className="underline" href={`mailto:${business.email}`}>{business.email}</a></div>
                <div className="pt-2 text-slate-700">
                  <div className="font-medium mb-1">Hours</div>
                  <ul className="grid grid-cols-2 gap-1 text-sm">
                    {business.hours.map(h => <li key={h.d} className="flex justify-between"><span>{h.d}</span><span className="text-slate-500">{h.h}</span></li>)}
                  </ul>
                </div>
                <div className="mt-3 rounded-xl overflow-hidden border">
                  <iframe title="Map" src={business.mapEmbed} className="w-full h-56" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-10 border-t bg-white/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} Flooring Floor Store. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#visualizer" className="hover:text-blue-700">Visualizer</a>
            <a href="#quote" className="hover:text-blue-700">Quotes</a>
            <a href="#contact" className="hover:text-blue-700">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
