import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Wrench,
  Search,
  Plus,
  Bell,
  Settings,
  Users,
  Package2,
  Loader2,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Barcode,
  Download,
  Upload,
  Filter,
  MoreHorizontal,
  Eye,
  Send,
} from "lucide-react";

// --- Dummy Data ---
const STATUS = [
  { key: "geldi", label: "Geldi", color: "bg-slate-200 text-slate-800" },
  { key: "parca", label: "Parça Bekleniyor", color: "bg-amber-200 text-amber-900" },
  { key: "tamir", label: "Tamir Ediliyor", color: "bg-blue-200 text-blue-900" },
  { key: "test", label: "Test", color: "bg-purple-200 text-purple-900" },
  { key: "hazir", label: "Teslime Hazır", color: "bg-emerald-200 text-emerald-900" },
  { key: "teslim", label: "Teslim Edildi", color: "bg-zinc-200 text-zinc-900" },
] as const;

const DUMMY_DEVICES = [
  {
    id: "TRK-240813-001",
    customer: "Ahmet Yılmaz",
    phone: "+90 532 123 45 67",
    brand: "Apple",
    model: "iPhone 13",
    serial: "SNX13-9931A",
    issue: "Ekran kırık, batarya çabuk bitiyor",
    status: "tamir",
    assigned: "Ece",
    eta: "2025-08-15",
    createdAt: "2025-08-12 10:24",
    cost: 6200,
  },
  {
    id: "TRK-240813-002",
    customer: "Mehmet Demir",
    phone: "+90 534 987 65 43",
    brand: "Samsung",
    model: "S22",
    serial: "SMS22-77XY",
    issue: "Şarj soketi arızalı",
    status: "parca",
    assigned: "Mert",
    eta: "2025-08-16",
    createdAt: "2025-08-13 09:11",
    cost: 1800,
  },
  {
    id: "TRK-240812-008",
    customer: "Elif Kaya",
    phone: "+90 555 111 22 33",
    brand: "Xiaomi",
    model: "Redmi Note 10",
    serial: "XM-101010",
    issue: "Su teması sonrası açılmıyor",
    status: "test",
    assigned: "Burak",
    eta: "2025-08-14",
    createdAt: "2025-08-12 13:42",
    cost: 3500,
  },
] as const;

const TECHS = ["Ece", "Mert", "Burak", "Zeynep", "Umut"];

function StatusBadge({ value }: { value: string }) {
  const s = STATUS.find((x) => x.key === value);
  if (!s) return null;
  return <Badge className={`${s.color} rounded-full px-3 py-1`}>{s.label}</Badge>;
}

function TopBar({ onOpenIntake }: { onOpenIntake: () => void }) {
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-white/60 p-3 sm:p-4 border-b flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Package2 className="w-6 h-6" />
        <span className="font-semibold tracking-tight">Tamir Merkezi</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2" />
            <Input className="pl-8" placeholder="Hızlı ara: müşteri, cihaz, seri no" />
          </div>
          <Button variant="outline" className="gap-2"><Filter className="w-4 h-4"/>Filtreler</Button>
        </div>
        <Button onClick={onOpenIntake} className="gap-2"><Plus className="w-4 h-4"/>Yeni Kayıt</Button>
        <Button variant="ghost" size="icon"><Bell className="w-5 h-5"/></Button>
        <Button variant="ghost" size="icon"><Settings className="w-5 h-5"/></Button>
      </div>
    </div>
  );
}

function Kanban() {
  const [devices, setDevices] = useState(DUMMY_DEVICES.map(d=>({...d})));

  const columns = useMemo(() => STATUS.map((s) => ({
    ...s,
    items: devices.filter((d) => d.status === s.key),
  })), [devices]);

  function move(id: string, to: string) {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, status: to } : d)));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {columns.map((col) => (
        <Card key={col.key} className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> {col.label}
              </CardTitle>
              <Badge variant="secondary">{col.items.length}</Badge>
            </div>
            <CardDescription>Durum sütunu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <AnimatePresence>
              {col.items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                >
                  <div className="p-3 rounded-xl border hover:shadow-sm transition bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm line-clamp-1">{item.brand} {item.model}</div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost"><MoreHorizontal className="w-4 h-4"/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {STATUS.map(s=> (
                            <DropdownMenuItem key={s.key} onClick={()=>move(item.id, s.key)}>{s.label}</DropdownMenuItem>
                          ))}
                          <DropdownMenuItem className="gap-2"><Eye className="w-4 h-4"/>Detay</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="text-xs text-zinc-600 flex items-center gap-2">
                      <Barcode className="w-3 h-3"/> {item.id}
                    </div>
                    <div className="mt-2 text-xs text-zinc-700 line-clamp-2">{item.issue}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="w-3 h-3"/> {item.assigned}
                      </div>
                      <div className="text-xs">ETA: {item.eta}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DevicesTable() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [tech, setTech] = useState<string | undefined>(undefined);

  const rows = useMemo(() => {
    return DUMMY_DEVICES.filter((d) =>
      (status ? d.status === status : true) &&
      (tech ? d.assigned === tech : true) &&
      (q ? [d.id, d.customer, d.brand, d.model, d.serial].join(" ").toLowerCase().includes(q.toLowerCase()) : true)
    );
  }, [q, status, tech]);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Cihaz Listesi</CardTitle>
        <CardDescription>Filtrele, sırala ve dışa aktar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative grow">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2" />
            <Input value={q} onChange={(e)=>setQ(e.target.value)} className="pl-8" placeholder="Ara (Takip no, müşteri, cihaz)"/>
          </div>
          <Select onValueChange={setStatus}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Durum"/></SelectTrigger>
            <SelectContent>
              {STATUS.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={setTech}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Teknisyen"/></SelectTrigger>
            <SelectContent>
              {TECHS.map(t=> <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4"/>CSV</Button>
        </div>

        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Takip No</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>Cihaz</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Teknisyen</TableHead>
                <TableHead>Oluşturma</TableHead>
                <TableHead className="text-right">Tahmini Tutar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.id} className="hover:bg-zinc-50">
                  <TableCell className="font-medium">{r.id}</TableCell>
                  <TableCell>{r.customer}</TableCell>
                  <TableCell>{r.brand} {r.model}</TableCell>
                  <TableCell><StatusBadge value={r.status}/></TableCell>
                  <TableCell>{r.assigned}</TableCell>
                  <TableCell>{r.createdAt}</TableCell>
                  <TableCell className="text-right">₺{r.cost.toLocaleString("tr-TR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="text-sm text-zinc-600">Açık İş Emri</div>
          <div className="text-2xl font-semibold mt-1">23</div>
          <Progress value={64} className="mt-3"/>
        </CardContent>
      </Card>
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="text-sm text-zinc-600">Ortalama Tamir Süresi</div>
          <div className="text-2xl font-semibold mt-1">2.6 gün</div>
          <div className="text-xs text-zinc-500 mt-1">Son 30 gün</div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="text-sm text-zinc-600">Bugün Teslim</div>
          <div className="text-2xl font-semibold mt-1">5</div>
          <div className="text-xs text-zinc-500 mt-1">Planlanan</div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="text-sm text-zinc-600">Parça Bekleyen</div>
          <div className="text-2xl font-semibold mt-1">7</div>
          <div className="text-xs text-zinc-500 mt-1">Ortalama 1.2 gün</div>
        </CardContent>
      </Card>
    </div>
  );
}

function CustomerLookup() {
  const [code, setCode] = useState("");
  const [found, setFound] = useState<typeof DUMMY_DEVICES[number] | null>(null);
  const onLookup = () => {
    const f = DUMMY_DEVICES.find((d) => d.id.toLowerCase() === code.trim().toLowerCase());
    setFound(f ?? null);
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Müşteri Takip</CardTitle>
        <CardDescription>Takip numarasıyla durum sorgulayın</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input placeholder="Takip No örn. TRK-240813-001" value={code} onChange={(e)=>setCode(e.target.value)} />
          <Button onClick={onLookup} className="gap-2"><Search className="w-4 h-4"/>Sorgula</Button>
        </div>
        <AnimatePresence>
          {found && (
            <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="mt-4 p-4 border rounded-xl">
              <div className="flex items-center justify-between">
                <div className="font-medium">{found.brand} {found.model}</div>
                <StatusBadge value={found.status}/>
              </div>
              <div className="text-sm text-zinc-600 mt-1">Müşteri: {found.customer}</div>
              <div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm">
                <div className="p-2 rounded-lg bg-zinc-50">Arıza: {found.issue}</div>
                <div className="p-2 rounded-lg bg-zinc-50">ETA: {found.eta}</div>
              </div>
              <div className="mt-3 text-xs text-zinc-500">Not: Bu prototip verileri örnektir. Gerçekte kimlik doğrulama olmadan yalnızca durum ve temel bilgiler gösterilir.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function IntakeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v:boolean)=>void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Plus className="w-4 h-4"/>Yeni Ürün Kaydı</DialogTitle>
          <DialogDescription>Müşteri ve cihaz bilgilerini girin</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label>Müşteri Adı</Label>
            <Input placeholder="Ad Soyad" />
          </div>
          <div>
            <Label>Telefon</Label>
            <Input placeholder="05xx xxx xx xx" />
          </div>
          <div>
            <Label>Marka</Label>
            <Input placeholder="Örn. Apple" />
          </div>
          <div>
            <Label>Model</Label>
            <Input placeholder="Örn. iPhone 13" />
          </div>
          <div className="sm:col-span-2">
            <Label>Seri No</Label>
            <Input placeholder="Seri numarası" />
          </div>
          <div className="sm:col-span-2">
            <Label>Arıza Açıklaması</Label>
            <Textarea placeholder="Cihaz problemi..." />
          </div>
          <div>
            <Label>Teknisyen</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Seçin"/></SelectTrigger>
              <SelectContent>
                {TECHS.map(t=> <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Durum</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Geldi"/></SelectTrigger>
              <SelectContent>
                {STATUS.map(s=> <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">İptal</Button>
          <Button className="gap-2"><Upload className="w-4 h-4"/>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [openIntake, setOpenIntake] = useState(false);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
        <TopBar onOpenIntake={()=>setOpenIntake(true)} />
        <main className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-zinc-100"><Wrench className="w-5 h-5"/></div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Servis Yönetim Paneli</h1>
              <p className="text-sm text-zinc-600">Ürün takibi, müşteri bilgilendirme ve ekip yönetimi bir arada</p>
            </div>
          </div>

          <MetricsBar />

          <Tabs defaultValue="kanban" className="mt-2">
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="kanban" className="gap-2"><ClipboardList className="w-4 h-4"/>Süreç</TabsTrigger>
              <TabsTrigger value="table" className="gap-2"><Package2 className="w-4 h-4"/>Cihazlar</TabsTrigger>
              <TabsTrigger value="customer" className="gap-2"><Eye className="w-4 h-4"/>Müşteri</TabsTrigger>
            </TabsList>
            <TabsContent value="kanban" className="mt-4">
              <Kanban />
            </TabsContent>
            <TabsContent value="table" className="mt-4">
              <DevicesTable />
            </TabsContent>
            <TabsContent value="customer" className="mt-4">
              <CustomerLookup />
            </TabsContent>
          </Tabs>
        </main>
        <IntakeDialog open={openIntake} onOpenChange={setOpenIntake} />
      </div>
    </TooltipProvider>
  );
}
