import { useState, useEffect, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── CONFIG ───────────────────────────────────────────────────
const SUPABASE_URL  = "https://fhyhdwuugyrrdzdknuri.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoeWhkd3V1Z3lycmR6ZGtudXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMzg4ODgsImV4cCI6MjA5OTcxNDg4OH0.6oFMHl8CZJwWU5xnRx1sRHa_Tb7E7w1k63w4HirF3Gc";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// ─── Données statiques ────────────────────────────────────────
const TOWERS = [
  { key:"tower_rayne", label:"Tour Rayne Syndicate",   zone:"Windswept Hills",  boss:"Zoe & Grizzbolt",      lv:10 },
  { key:"tower_fpa",   label:"Tour Free Pal Alliance", zone:"Astral Mountains", boss:"Lily & Lyleen",        lv:20 },
  { key:"tower_pyre",  label:"Tour Eternal Pyre",      zone:"Bamboo Grove",     boss:"Axel & Orserk",        lv:30 },
  { key:"tower_pidf",  label:"Tour PIDF",              zone:"Twilight Dunes",   boss:"Marcus & Faleris",     lv:40 },
  { key:"tower_pgru",  label:"Tour PAL Research Unit", zone:"Mt. Obsidian",     boss:"Victor & Shadowbeak",  lv:50 },
  { key:"tower_moon",  label:"Tour Moonflower",        zone:"Sakurajima",       boss:"Saya & Selyne",        lv:55 },
  { key:"tower_fey",   label:"Tour Feybreak",          zone:"Feybreak",         boss:"Bjorn & Bastigor",     lv:60 },
  { key:"tower_azure", label:"Tour Azure Covenant",    zone:"Sunreach",         boss:"Auri & Shaolong",      lv:68 },
  { key:"tower_world", label:"Finale — Arbre-Monde",   zone:"Arbre-Monde",      boss:"Zenara & Astralym",    lv:80 },
];

const ALPHAS = [
  // Palpagos (48)
  { key:"alpha_chillet",         pal:"Chillet",          title:"Dancer of the Plains",            lv:11, type:"Ice/Dragon",     location:"Bamboo Grove" },
  { key:"alpha_gumoss",          pal:"Gumoss",           title:"Suddenly Transformed",            lv:11, type:"Grass/Ground",   location:"Verdant Brook" },
  { key:"alpha_sweepa",          pal:"Sweepa",           title:"Majesty of Fuzz",                 lv:11, type:"Ice",            location:"Marsh Island" },
  { key:"alpha_dumud",           pal:"Dumud",            title:"Perpetual Procrastinator",        lv:14, type:"Ground",         location:"Twilight Dunes" },
  { key:"alpha_penking",         pal:"Penking",          title:"Pioneer of the Frozen Sea",       lv:15, type:"Water/Ice",      location:"Sealed Realm of the Frozen Wings" },
  { key:"alpha_azurobe",         pal:"Azurobe",          title:"Lady of the Lake",                lv:17, type:"Water/Dragon",   location:"Open World" },
  { key:"alpha_grintale",        pal:"Grintale",         title:"Marshmallow Body",                lv:17, type:"Neutral",        location:"Open World" },
  { key:"alpha_nitewing",        pal:"Nitewing",         title:"Wings of the Firmament",          lv:18, type:"Neutral",        location:"Open World" },
  { key:"alpha_foxparks_cryst_palpagos", pal:"Foxparks Cryst", title:"—",                          lv:23, type:"Ice",            location:"Open World" },
  { key:"alpha_broncherry",      pal:"Broncherry",       title:"Winds of Spring",                 lv:23, type:"Grass",          location:"Open World" },
  { key:"alpha_bushi",           pal:"Bushi",            title:"Vagrant Warrior",                 lv:23, type:"Fire",           location:"Sealed Realm of the Swordmaster" },
  { key:"alpha_arsox",           pal:"Arsox",            title:"—",                               lv:15, type:"Fire",           location:"Sealed Realm of the Swordmaster" },
  { key:"alpha_felbat",          pal:"Felbat",           title:"Gloom-shrouded Bloodsucker",      lv:23, type:"Dark",           location:"Sealed Realm of the Abyssal Nights" },
  { key:"alpha_katress",         pal:"Katress",          title:"Phantasmal Feline",               lv:23, type:"Dark",           location:"Sealed Realm of the Invincible" },
  { key:"alpha_foxcicle",        pal:"Foxcicle",         title:"—",                               lv:15, type:"Ice",            location:"Sealed Realm of the Invincible" },
  { key:"alpha_kingpaca",        pal:"Kingpaca",         title:"Supreme Fluff Commander",         lv:23, type:"Neutral",        location:"Open World" },
  { key:"alpha_quivern",         pal:"Quivern",          title:"Wings of White",                  lv:23, type:"Dragon",         location:"Sealed Realm of the Winged Tyrant" },
  { key:"alpha_fenglope",        pal:"Fenglope",         title:"Drifting Cloud",                  lv:25, type:"Neutral",        location:"Open World" },
  { key:"alpha_petallia",        pal:"Petallia",         title:"Lady of the Garden",              lv:28, type:"Grass",          location:"Sealed Realm of Spirits" },
  { key:"alpha_beakon",          pal:"Beakon",           title:"Wings of Thunder",                lv:29, type:"Electric",       location:"Open World" },
  { key:"alpha_broncherry_aqua", pal:"Broncherry Aqua",  title:"Waves of Summer",                 lv:30, type:"Water/Grass",    location:"Open World" },
  { key:"alpha_elphidran",       pal:"Elphidran",        title:"Gentle Sky Dragon",               lv:30, type:"Dragon",         location:"Open World" },
  { key:"alpha_warsect",         pal:"Warsect",          title:"Unyielding Colossus",             lv:30, type:"Grass/Ground",   location:"Sealed Realm of the Stalwart" },
  { key:"alpha_elizabee",        pal:"Elizabee",         title:"Empress of the Hive",             lv:31, type:"Grass",          location:"Open World" },
  { key:"alpha_mossanda_lux",    pal:"Mossanda Lux",     title:"Inheritor of the Storm",          lv:31, type:"Electric",       location:"Eastern Wild Island" },
  { key:"alpha_relaxaurus_lux",  pal:"Relaxaurus Lux",   title:"Gluttonous Thunder Dragon",       lv:31, type:"Electric/Dragon",location:"Sealed Realm of the Thunder Dragon" },
  { key:"alpha_univolt",         pal:"Univolt",          title:"Swift Deity",                     lv:31, type:"Electric",       location:"Sea Breeze Archipelago" },
  { key:"alpha_lunaris",         pal:"Lunaris",          title:"Extraterrestrial",                lv:32, type:"Ice",            location:"Sealed Realm of the Esoteric" },
  { key:"alpha_caprity_noct_palpagos", pal:"Caprity Noct", title:"—",                              lv:23, type:"Dark",           location:"Sealed Realm of the Esoteric" },
  { key:"alpha_verdash",         pal:"Verdash",          title:"Gale of the Forest",              lv:35, type:"Grass",          location:"Sealed Realm of the Swift" },
  { key:"alpha_mammorest",       pal:"Mammorest",        title:"King of the Forest",              lv:38, type:"Grass",          location:"Grassy Behemoth Hills" },
  { key:"alpha_vaelet",          pal:"Vaelet",           title:"Voice of the Violets",            lv:38, type:"Grass",          location:"Sealed Realm of the Guardian" },
  { key:"alpha_wumpo_botan",     pal:"Wumpo Botan",      title:"Guardian of the Grassy Fields",   lv:38, type:"Grass",          location:"Eastern Wild Island" },
  { key:"alpha_sibelyx",         pal:"Sibelyx",          title:"Pallid Lady",                     lv:40, type:"Ice",            location:"Sealed Realm of the Pristine" },
  { key:"alpha_menasting",       pal:"Menasting",        title:"Unstoppable Stinger",             lv:44, type:"Dark/Ground",    location:"Dessicated Desert" },
  { key:"alpha_jormuntide_a",    pal:"Jormuntide (A)",   title:"Emperor of the Sea",              lv:45, type:"Water/Dragon",   location:"East of Verdant Brook" },
  { key:"alpha_jormuntide_b",    pal:"Jormuntide (B)",   title:"Emperor of the Sea",              lv:45, type:"Water/Dragon",   location:"Open World" },
  { key:"alpha_suzaku",          pal:"Suzaku",           title:"Ruler of the Crimson Dawn",       lv:45, type:"Fire",           location:"Southeast of Duneshelter" },
  { key:"alpha_ice_kingpaca",    pal:"Ice Kingpaca",     title:"Azure Fluff Commander",           lv:43, type:"Ice",            location:"Mineshaft" },
  { key:"alpha_anubis",          pal:"Anubis",           title:"Guardian of the Dark Sun",        lv:47, type:"Ground",         location:"Twilight Dunes" },
  { key:"alpha_dinossom_lux",    pal:"Dinossom Lux",     title:"Guardian of Lightning",           lv:47, type:"Electric/Dragon",location:"Open World" },
  { key:"alpha_astegon",         pal:"Astegon",          title:"Ravager of Stars",                lv:48, type:"Dark/Dragon",    location:"Open World" },
  { key:"alpha_blazamut",        pal:"Blazamut",         title:"Cursed Tyrant",                   lv:49, type:"Fire",           location:"Open World" },
  { key:"alpha_lyleen_noct",     pal:"Lyleen Noct",      title:"Empress of the Abyss",            lv:49, type:"Dark",           location:"Mineshaft" },
  { key:"alpha_jetragon",        pal:"Jetragon",         title:"Legendary Celestial Dragon",      lv:50, type:"Dragon",         location:"Northwest of Mt. Obsidian" },
  { key:"alpha_frostallion",     pal:"Frostallion",      title:"Legendary Steed of Ice",          lv:50, type:"Ice",            location:"Frozen Lake" },
  { key:"alpha_paladius",        pal:"Paladius",         title:"Holy Knight of Legend",           lv:50, type:"Neutral",        location:"Deep Sand Dunes" },
  { key:"alpha_necromus",        pal:"Necromus",         title:"Dark Knight of Legend",           lv:50, type:"Dark",           location:"Deep Sand Dunes" },
  // Sakurajima (2)
  { key:"alpha_menasting_terra", pal:"Menasting Terra",  title:"—",                               lv:54, type:"Ground",         location:"Sakurajima" },
  { key:"alpha_knocklem",        pal:"Knocklem",         title:"—",                               lv:55, type:"Ground",         location:"Sakurajima Canyon" },
  // Feybreak (23)
  { key:"alpha_foxparks_cryst",  pal:"Foxparks Cryst",   title:"—",                               lv:52, type:"Ice",            location:"Deserted Ash Plateau" },
  { key:"alpha_dazzi_noct",      pal:"Dazzi Noct",       title:"—",                               lv:53, type:"Dark",           location:"Feybreak Tower NW" },
  { key:"alpha_ribbuny_botan",   pal:"Ribbuny Botan",    title:"—",                               lv:53, type:"Grass",          location:"Mountain Ruins" },
  { key:"alpha_loupmoon_cryst",  pal:"Loupmoon Cryst",   title:"—",                               lv:54, type:"Ice",            location:"Scorched Ashlands" },
  { key:"alpha_caprity_noct",    pal:"Caprity Noct",     title:"—",                               lv:55, type:"Dark",           location:"Feybreak Tower E" },
  { key:"alpha_omascul",         pal:"Omascul",          title:"—",                               lv:55, type:"Neutral",        location:"Frozen Coral Hill" },
  { key:"alpha_prunelia",        pal:"Prunelia",         title:"—",                               lv:55, type:"Grass",          location:"Sealed Realm of the Indigo" },
  { key:"alpha_smokie",          pal:"Smokie",           title:"—",                               lv:55, type:"Fire",           location:"Sealed Realm of the Little Hero" },
  { key:"alpha_faleris_aqua",    pal:"Faleris Aqua",     title:"—",                               lv:56, type:"Water",          location:"Withered Seaside Shores" },
  { key:"alpha_nitemary",        pal:"Nitemary",         title:"—",                               lv:56, type:"Dark",           location:"Sealed Realm of the Soul" },
  { key:"alpha_azurmane",        pal:"Azurmane",         title:"—",                               lv:57, type:"Ice",            location:"Oculus Gate" },
  { key:"alpha_fenglope_lux",    pal:"Fenglope Lux",     title:"—",                               lv:57, type:"Electric",       location:"Stone Pillar Cave" },
  { key:"alpha_kitsun_noct",     pal:"Kitsun Noct",      title:"—",                               lv:57, type:"Dark/Fire",      location:"Dark Flame Tunnel" },
  { key:"alpha_nyafia",          pal:"Nyafia",           title:"—",                               lv:57, type:"Neutral",        location:"Scorched Hill" },
  { key:"alpha_starryon",        pal:"Starryon",         title:"—",                               lv:57, type:"Electric",       location:"Scorched Ashland SE" },
  { key:"alpha_tarantriss",      pal:"Tarantriss",       title:"—",                               lv:57, type:"Dark",           location:"Mesa N of Feybreak Shipwreck" },
  { key:"alpha_cryolinx_terra",  pal:"Cryolinx Terra",   title:"—",                               lv:58, type:"Ice/Ground",     location:"Frozen Coral Hill E" },
  { key:"alpha_gildane",         pal:"Gildane",          title:"—",                               lv:58, type:"Fire",           location:"Emberstone Peak" },
  { key:"alpha_splatterina",     pal:"Splatterina",      title:"—",                               lv:58, type:"Water",          location:"Bloodstained Tunnel" },
  { key:"alpha_silvegis",        pal:"Silvegis",         title:"—",                               lv:59, type:"Ice",            location:"Feybreak Island" },
  { key:"alpha_warsect_terra",   pal:"Warsect Terra",    title:"—",                               lv:59, type:"Ground",         location:"Loess Plains" },
  { key:"alpha_celesidr",        pal:"Celesidr",         title:"—",                               lv:60, type:"Ice",            location:"Crystalized Ancient Tree" },
  { key:"alpha_frostallion_noct",pal:"Frostallion Noct", title:"Legendary Black Pegasus",         lv:60, type:"Dark",           location:"Sealed Realm of the Black Pegasus" },
  // Tides of Terraria (4)
  { key:"alpha_whalaska",        pal:"Whalaska",         title:"—",                               lv:55, type:"Ice/Water",      location:"Astral Mountains Ocean" },
  { key:"alpha_whalaska_ignis",  pal:"Whalaska Ignis",   title:"—",                               lv:58, type:"Ice/Fire",       location:"Mt. Obsidian Ocean" },
  { key:"alpha_eye_cthulhu",     pal:"Eye of Cthulhu",   title:"—",                               lv:45, type:"Dark",           location:"Sealed Realm of Terraria" },
  { key:"alpha_neptilius",       pal:"Neptilius",        title:"—",                               lv:60, type:"Water",          location:"Sealed Realm of the Glacial Core" },
  // Nouveaux alphas 1.0
  { key:"alpha_prixter_lux",    pal:"Prixter Lux",    title:"—", lv:0,  type:"Electric/Ground", location:"Sandstone Gate Isle (-1314,-612)" },
  { key:"alpha_dualith",        pal:"Dualith",        title:"—", lv:0,  type:"Grass/Ground",    location:"Circular Ruins (910,-99)" },
  { key:"alpha_dualith_noct",   pal:"Dualith Noct",   title:"—", lv:0,  type:"Ground/Dark",     location:"Glacial Memento Isle (-1694,-948)" },
  { key:"alpha_pierdon",        pal:"Pierdon",        title:"—", lv:0,  type:"Ground",          location:"Flamepulse Isle (819,467)" },
  { key:"alpha_tetroise",       pal:"Tetroise",       title:"—", lv:0,  type:"Ground",          location:"Dessicated Desert (435,380)" },
  { key:"alpha_tetroise_primo", pal:"Tetroise Primo", title:"—", lv:0,  type:"Neutral",         location:"Dungeon Feybreak (-1082,-1320)" },
  { key:"alpha_ophydia",        pal:"Ophydia",        title:"—", lv:0,  type:"Water/Grass",     location:"Sunreach Islands (-590,-1478)" },
  { key:"alpha_snock",          pal:"Snock",          title:"—", lv:0,  type:"Electric",        location:"Sunreach Islands (-369,-1414)" },
  { key:"alpha_eidrolon",       pal:"Eidrolon",       title:"—", lv:0,  type:"Dark/Dragon",     location:"Sunreach Isle (-489,-1521)" },
  { key:"alpha_dynamoff",       pal:"Dynamoff",       title:"—", lv:0,  type:"Electric",        location:"Sunreach Islands (-308,-1523)" },
  { key:"alpha_flaracle",       pal:"Flaracle",       title:"—", lv:0,  type:"Fire",            location:"Sunreach Islands (-244,-1520)" },
  { key:"alpha_wistella",       pal:"Wistella",       title:"—", lv:0,  type:"Dark",            location:"Sunreach Islands (-232,-1415)" },
  { key:"alpha_slowatt",        pal:"Slowatt",        title:"—", lv:0,  type:"Electric",        location:"Sunreach Islands (-367,-1357)" },
  { key:"alpha_mycora",         pal:"Mycora",         title:"—", lv:0,  type:"Grass",           location:"World Tree (-35,731)" },
  { key:"alpha_moldron_cryst",  pal:"Moldron Cryst",  title:"—", lv:0,  type:"Ice/Ground",      location:"World Tree (-64,816)" },
  { key:"alpha_renjishi",       pal:"Renjishi",       title:"—", lv:0,  type:"Fire",            location:"World Tree (56,838)" },
  { key:"alpha_aegidron",       pal:"Aegidron",       title:"—", lv:0,  type:"Ground/Dragon",   location:"World Tree (-59,756)" },
  { key:"alpha_celesidr_noct",  pal:"Celesidr Noct",  title:"—", lv:0,  type:"Dark",            location:"World Tree (-6,?)" },
];

const ALPHA_REGIONS = {
  "Palpagos": ALPHAS.slice(0, 48).map(a => a.key),
  "Sakurajima": ALPHAS.slice(48, 50).map(a => a.key),
  "Feybreak": ALPHAS.slice(50, 73).map(a => a.key),
  "Tides of Terraria": ALPHAS.slice(73, 77).map(a => a.key),
  "Sunreach": ["alpha_ophydia","alpha_snock","alpha_eidrolon","alpha_dynamoff","alpha_flaracle","alpha_wistella","alpha_slowatt"],
  "World Tree": ["alpha_mycora","alpha_moldron_cryst","alpha_renjishi","alpha_aegidron","alpha_celesidr_noct"],
  "Nouveaux 1.0": ["alpha_prixter_lux","alpha_dualith","alpha_dualith_noct","alpha_pierdon","alpha_tetroise","alpha_tetroise_primo"],
};

const RAID_BOSSES = [
  { key:"raid_blazamut_ryu",     pal:"Blazamut Ryu",      location:"Autel d'invocation" },
  { key:"raid_bellanoir",        pal:"Bellanoir",         location:"Autel d'invocation" },
  { key:"raid_bellanoir_libero", pal:"Bellanoir Libero",  location:"Autel d'invocation" },
  { key:"raid_xenolord",         pal:"Xenolord",          location:"Autel d'invocation" },
  { key:"raid_haltaris",         pal:"Haltaris",          location:"Autel d'invocation" },
];

const COLORS = ["#6366f1","#06b6d4","#ec4899","#f59e0b","#10b981"];

const STAT_COLORS = { level:"#6366f1", pal_count:"#06b6d4", fast_travel_count:"#f59e0b" };

const TOWER_COLORS = ["#6366f1","#06b6d4","#ec4899","#f59e0b","#10b981","#7c3aed","#ef4444","#3b82f6","#eab308"];

const RAID_COLORS = ["#ec4899","#10b981","#ef4444","#3b82f6","#eab308"];

const TYPE_COLORS = {
  "Fire":"#ef4444","Water":"#3b82f6","Electric":"#eab308","Grass":"#22c55e",
  "Ice":"#06b6d4","Ground":"#a16207","Dragon":"#7c3aed","Dark":"#64748b",
  "Neutral":"#6b7280","Water/Dragon":"#3b82f6","Ice/Dragon":"#06b6d4",
  "Grass/Ground":"#22c55e","Dark/Ground":"#64748b","Electric/Dragon":"#eab308",
  "Water/Ice":"#3b82f6","Water/Grass":"#22c55e","Dark/Dragon":"#64748b",
  "Ice/Ground":"#06b6d4","Dark/Fire":"#64748b","Ice/Water":"#06b6d4","Ice/Fire":"#ef4444",
  "Electric/Ground":"#eab308","Ground/Dark":"#64748b","Ground/Dragon":"#7c3aed",
};

// ─── Helpers ──────────────────────────────────────────────────
const Avatar = ({ name, color, size = 28 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.38, fontWeight:600, color:"#fff", flexShrink:0, textTransform:"uppercase" }}>
    {name?.[0] || "?"}
  </div>
);

const Badge = ({ text, color }) => (
  <span style={{ padding:"1px 5px", borderRadius:3, fontSize:10, fontWeight:500, background:color+"22", color:color, border:`0.5px solid ${color}44` }}>
    {text}
  </span>
);

const ProgressBar = ({ value, max, color }) => (
  <div style={{ height:5, borderRadius:3, background:"var(--surface-0)", overflow:"hidden", flex:1, maxWidth:80 }}>
    <div style={{ height:"100%", borderRadius:3, background:color, width:`${Math.round(value/max*100)}%`, transition:"width 0.3s" }} />
  </div>
);

// ─── App ──────────────────────────────────────────────────────
export default function App() {
  const [session,    setSession]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [view,       setView]       = useState("compare");
  const [players,    setPlayers]    = useState([]);
  const [myPlayer,   setMyPlayer]   = useState(null);
  const [history,    setHistory]    = useState([]);
  const [editForm,   setEditForm]   = useState(null);
  const [authForm,   setAuthForm]   = useState({ email:"", password:"" });
  const [authErr,    setAuthErr]    = useState("");
  const [saving,     setSaving]     = useState(false);
  const [alphaTab,   setAlphaTab]   = useState("Palpagos");
  const [alphaSearch,setAlphaSearch]= useState("");

  // Auth
  useEffect(() => {
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const fetchPlayers = useCallback(async () => {
    const { data } = await sb.from("players_full").select("*").order("level", { ascending:false });
    if (data) {
      setPlayers(data);
      if (session?.user) {
        const me = data.find(p => p.user_id === session.user.id);
        setMyPlayer(me || null);
        if (me) setEditForm({ level:me.level, pal_count:me.pal_count, fast_travel_count:me.fast_travel_count });
      }
    }
  }, [session]);

  useEffect(() => { if (session) fetchPlayers(); }, [session, fetchPlayers]);

  const fetchHistory = useCallback(async () => {
    if (!myPlayer) return;
    const { data } = await sb.from("player_history").select("*").eq("player_id", myPlayer.id).order("recorded_at", { ascending:false }).limit(30);
    if (data) setHistory(data);
  }, [myPlayer]);

  useEffect(() => { if (view === "history") fetchHistory(); }, [view, fetchHistory]);

  const handleAuth = async (e) => {
    e.preventDefault(); setAuthErr("");
    const { email, password } = authForm;
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setAuthErr(error.message);
  };

  const saveStats = async () => {
    if (!myPlayer || !editForm) return;
    setSaving(true);
    await sb.from("players").update({ level:Number(editForm.level), pal_count:Number(editForm.pal_count), fast_travel_count:Number(editForm.fast_travel_count), updated_at:new Date().toISOString() }).eq("id", myPlayer.id);
    await fetchPlayers(); setSaving(false);
  };

  const toggleObj = async (key) => {
    if (!myPlayer) return;
    const done = (myPlayer.objectives || []).includes(key);
    if (done) await sb.from("player_objectives").delete().eq("player_id", myPlayer.id).eq("objective_key", key);
    else await sb.from("player_objectives").insert({ player_id:myPlayer.id, objective_key:key });
    await fetchPlayers();
  };

  // ── Écran de connexion ────────────────────────────────────
  if (loading) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", color:"var(--text-secondary)", fontSize:13 }}>Chargement…</div>;

  if (!session) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:"var(--surface-0)" }}>
      <div style={{ width:340, background:"var(--surface-2)", border:"0.5px solid var(--border)", borderRadius:14, padding:28 }}>
        <div style={{ fontSize:20, fontWeight:600, marginBottom:4 }}>Pal<span style={{ color:"#6366f1" }}>Track</span></div>
        <div style={{ fontSize:12, color:"var(--text-secondary)", marginBottom:22 }}>Suivi de progression Palworld 1.0</div>
        <form onSubmit={handleAuth} style={{ display:"flex", flexDirection:"column", gap:10, marginTop:22 }}>
          {["email","password"].map(f => (
            <input key={f} type={f} placeholder={f==="email"?"Email":"Mot de passe"} value={authForm[f]} onChange={e => setAuthForm(p => ({ ...p, [f]:e.target.value }))}
              style={{ padding:"9px 11px", borderRadius:"var(--radius)", border:"0.5px solid var(--border)", background:"var(--surface-1)", color:"var(--text-primary)", fontSize:13, outline:"none" }} />
          ))}
          {authErr && <div style={{ fontSize:11, color:"#ef4444" }}>{authErr}</div>}
          <button type="submit" style={{ padding:"9px 0", borderRadius:"var(--radius)", border:"none", background:"#6366f1", color:"#fff", fontWeight:600, cursor:"pointer", fontSize:13, marginTop:4 }}>
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );

  const maxLevel = Math.max(...players.map(p => p.level), 80);
  const curP = players.find(p => p.user_id === session?.user?.id);

  return (
    <div style={{ fontFamily:"var(--font-sans)", background:"var(--surface-0)", minHeight:"100vh", display:"flex", flexDirection:"column" }}>

      {/* Topbar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 16px", borderBottom:"0.5px solid var(--border)", background:"var(--surface-2)", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:15, fontWeight:600 }}>Pal<span style={{ color:"#6366f1" }}>Track</span></span>
          <div style={{ display:"flex", gap:2 }}>
            {[["compare","Groupe"],["me","Ma fiche"],["history","Historique"]].map(([v,l]) => (
              <button key={v} onClick={() => setView(v)} style={{ padding:"5px 11px", border:"none", borderRadius:"var(--radius)", background:view===v?"var(--surface-1)":"none", color:view===v?"var(--text-primary)":"var(--text-secondary)", fontWeight:view===v?500:400, cursor:"pointer", fontSize:13 }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {curP && <Avatar name={curP.name} color={curP.avatar_color} size={26} />}
          <span style={{ fontSize:13, color:"var(--text-secondary)" }}>{curP?.name || session.user.email}</span>
          <button onClick={() => sb.auth.signOut()} style={{ padding:"4px 9px", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", background:"none", color:"var(--text-muted)", cursor:"pointer", fontSize:11 }}>Déconnexion</button>
        </div>
      </div>

      {/* ── Vue Groupe ── */}
      {view === "compare" && (
        <div style={{ flex:1, overflow:"auto", padding:16 }}>
          {/* Résumé */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
            {[
              ["Tours vaincues (groupe)", `${new Set(players.flatMap(p=>(p.objectives||[]).filter(k=>k.startsWith("tower")))).size}/9`],
              ["Alphas tués (groupe)", `${new Set(players.flatMap(p=>(p.objectives||[]).filter(k=>k.startsWith("alpha")))).size}/${ALPHAS.length}`],
              ["Raids vaincus (groupe)", `${new Set(players.flatMap(p=>(p.objectives||[]).filter(k=>k.startsWith("raid")))).size}/${RAID_BOSSES.length}`],
              ["Niveau moyen", players.length ? Math.round(players.reduce((s,p)=>s+p.level,0)/players.length) : "—"],
            ].map(([l,v]) => (
              <div key={l} style={{ background:"var(--surface-1)", borderRadius:"var(--radius)", padding:"11px 14px" }}>
                <div style={{ fontSize:11, color:"var(--text-secondary)", marginBottom:3 }}>{l}</div>
                <div style={{ fontSize:22, fontWeight:500 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Tableau */}
          <div style={{ background:"var(--surface-2)", borderRadius:12, border:"0.5px solid var(--border)", overflow:"hidden", marginBottom:16 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr>
                  {["Joueur","Niveau","Pals","Fast travel","Tours","Alphas","Raids"].map(h => (
                    <th key={h} style={{ textAlign:"left", padding:"10px 14px", color:"var(--text-secondary)", fontWeight:400, fontSize:11, borderBottom:"0.5px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map((p,i) => {
                  const objs = p.objectives || [];
                  const tD = objs.filter(k=>k.startsWith("tower")).length;
                  const aD = objs.filter(k=>k.startsWith("alpha")).length;
                  const rD = objs.filter(k=>k.startsWith("raid")).length;
                  return (
                    <tr key={p.id}>
                      <td style={{ padding:"11px 14px", borderBottom:"0.5px solid var(--border)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                          <Avatar name={p.name} color={p.avatar_color||COLORS[i%COLORS.length]} size={24} />
                          <span style={{ fontWeight:500 }}>{p.name}</span>
                          {p.user_id===session.user.id && <Badge text="moi" color="#6366f1" />}
                        </div>
                      </td>
                      <td style={{ padding:"11px 14px", borderBottom:"0.5px solid var(--border)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontWeight:600, minWidth:24 }}>{p.level}</span>
                          <ProgressBar value={p.level} max={maxLevel} color={p.avatar_color||COLORS[i%COLORS.length]} />
                        </div>
                      </td>
                      <td style={{ padding:"11px 14px", borderBottom:"0.5px solid var(--border)", fontWeight:500 }}>{p.pal_count}</td>
                      <td style={{ padding:"11px 14px", borderBottom:"0.5px solid var(--border)", fontWeight:500 }}>{p.fast_travel_count}</td>
                      <td style={{ padding:"11px 14px", borderBottom:"0.5px solid var(--border)" }}>
                        <span style={{ fontWeight:500 }}>{tD}</span><span style={{ color:"var(--text-muted)" }}>/9</span>
                        <div style={{ display:"flex", gap:2, marginTop:3 }}>
                          {TOWERS.map(t => (
                            <div key={t.key} title={t.label} style={{ width:7, height:7, borderRadius:1, background:objs.includes(t.key)?(p.avatar_color||COLORS[i%COLORS.length]):"var(--surface-0)", border:"0.5px solid var(--border)" }} />
                          ))}
                        </div>
                      </td>
                      <td style={{ padding:"11px 14px", borderBottom:"0.5px solid var(--border)" }}>
                        <span style={{ fontWeight:500 }}>{aD}</span><span style={{ color:"var(--text-muted)" }}>/{ALPHAS.length}</span>
                        <div style={{ fontSize:10, color:"var(--text-muted)", marginTop:2 }}>
                          {Object.entries(ALPHA_REGIONS).map(([r,keys]) => {
                            const n = keys.filter(k=>objs.includes(k)).length;
                            return n>0 ? <span key={r} style={{ marginRight:6 }}>{r.split(" ")[0]} {n}/{keys.length}</span> : null;
                          })}
                        </div>
                      </td>
                      <td style={{ padding:"11px 14px", borderBottom:"0.5px solid var(--border)" }}>
                        <span style={{ fontWeight:500 }}>{rD}</span><span style={{ color:"var(--text-muted)" }}>/{RAID_BOSSES.length}</span>
                        <div style={{ display:"flex", gap:2, marginTop:3 }}>
                          {RAID_BOSSES.map(r => (
                            <div key={r.key} title={r.pal} style={{ width:7, height:7, borderRadius:1, background:objs.includes(r.key)?(p.avatar_color||COLORS[i%COLORS.length]):"var(--surface-0)", border:"0.5px solid var(--border)" }} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Détail tours */}
          <div style={{ background:"var(--surface-2)", border:"0.5px solid var(--border)", borderRadius:12, padding:14 }}>
            <div style={{ fontSize:11, fontWeight:500, color:"var(--text-secondary)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Tours — progression groupe</div>
            {TOWERS.map(t => {
              const done = players.filter(p=>(p.objectives||[]).includes(t.key));
              const pct = Math.round(done.length/Math.max(players.length,1)*100);
              return (
                <div key={t.key} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                    <span style={{ fontSize:12 }}>{t.label} <span style={{ color:"var(--text-muted)", fontSize:11 }}>niv.{t.lv}</span></span>
                    <div style={{ display:"flex", gap:4 }}>
                      {players.map((p,i) => (
                        <div key={p.id} title={p.name} style={{ width:16, height:16, borderRadius:"50%", background:(p.objectives||[]).includes(t.key)?(p.avatar_color||COLORS[i%COLORS.length]):"var(--surface-0)", border:`1.5px solid ${(p.objectives||[]).includes(t.key)?(p.avatar_color||COLORS[i%COLORS.length]):"var(--border)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, color:"#fff", fontWeight:600 }}>
                          {(p.objectives||[]).includes(t.key)?p.name[0]:""}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height:3, borderRadius:2, background:"var(--surface-0)", overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:2, background:"#6366f1", width:pct+"%", transition:"width 0.3s" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Détail raids */}
          <div style={{ background:"var(--surface-2)", border:"0.5px solid var(--border)", borderRadius:12, padding:14, marginTop:16 }}>
            <div style={{ fontSize:11, fontWeight:500, color:"var(--text-secondary)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Raids — progression groupe</div>
            {RAID_BOSSES.map(r => {
              const done = players.filter(p=>(p.objectives||[]).includes(r.key));
              const pct = Math.round(done.length/Math.max(players.length,1)*100);
              return (
                <div key={r.key} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                    <span style={{ fontSize:12 }}>{r.pal}</span>
                    <div style={{ display:"flex", gap:4 }}>
                      {players.map((p,i) => (
                        <div key={p.id} title={p.name} style={{ width:16, height:16, borderRadius:"50%", background:(p.objectives||[]).includes(r.key)?(p.avatar_color||COLORS[i%COLORS.length]):"var(--surface-0)", border:`1.5px solid ${(p.objectives||[]).includes(r.key)?(p.avatar_color||COLORS[i%COLORS.length]):"var(--border)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, color:"#fff", fontWeight:600 }}>
                          {(p.objectives||[]).includes(r.key)?p.name[0]:""}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height:3, borderRadius:2, background:"var(--surface-0)", overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:2, background:"#ec4899", width:pct+"%", transition:"width 0.3s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Ma fiche ── */}
      {view === "me" && (
        <div style={{ flex:1, overflow:"auto", padding:16, maxWidth:720, margin:"0 auto", width:"100%" }}>
          {!myPlayer ? (
            <div style={{ background:"var(--surface-2)", border:"0.5px solid var(--border)", borderRadius:12, padding:20 }}>
              <div style={{ fontSize:14, fontWeight:500, marginBottom:14 }}>Créer mon profil</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <input placeholder="Nom affiché" id="pname" style={{ padding:"9px 11px", borderRadius:"var(--radius)", border:"0.5px solid var(--border)", background:"var(--surface-1)", color:"var(--text-primary)", fontSize:13, outline:"none" }} />
                <div style={{ display:"flex", gap:8 }}>
                  {COLORS.map(c => (
                    <div key={c} data-c={c} className="colbtn" onClick={() => document.querySelectorAll(".colbtn").forEach(b=>b.style.outline=b.dataset.c===c?`3px solid ${c}`:"none")}
                      style={{ width:28, height:28, borderRadius:"50%", background:c, cursor:"pointer" }} />
                  ))}
                </div>
                <button onClick={async () => {
                  const name = document.getElementById("pname").value.trim();
                  if (!name) return;
                  const color = [...document.querySelectorAll(".colbtn")].find(b=>b.style.outline)?.dataset.c || COLORS[0];
                  await sb.from("players").insert({ user_id:session.user.id, name, avatar_color:color });
                  fetchPlayers();
                }} style={{ padding:"9px 0", borderRadius:"var(--radius)", border:"none", background:"#6366f1", color:"#fff", fontWeight:600, cursor:"pointer", fontSize:13 }}>
                  Créer le profil
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

              {/* Stats */}
              <div style={{ background:"var(--surface-2)", border:"0.5px solid var(--border)", borderRadius:12, padding:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <Avatar name={myPlayer.name} color={myPlayer.avatar_color} size={36} />
                  <div>
                    <div style={{ fontWeight:600, fontSize:15 }}>{myPlayer.name}</div>
                    <div style={{ fontSize:11, color:"var(--text-secondary)" }}>Mis à jour {new Date(myPlayer.updated_at).toLocaleDateString("fr-FR")}</div>
                  </div>
                </div>
                {editForm && (
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {[["Niveau","level",1,80],["Pals capturés (total)","pal_count",0,2000],["Points de voyage rapide","fast_travel_count",0,200]].map(([label,field,min,max]) => (
                      <div key={field}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                          <span style={{ width:7, height:7, borderRadius:"50%", background:STAT_COLORS[field], flexShrink:0 }} />
                          <span style={{ fontSize:11, color:"var(--text-secondary)" }}>{label}</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <input type="number" min={min} max={max} value={editForm[field]}
                            onChange={e => setEditForm(f=>({...f,[field]:e.target.value}))}
                            style={{ width:80, padding:"7px 10px", borderRadius:"var(--radius)", border:`0.5px solid ${STAT_COLORS[field]}55`, background:"var(--surface-1)", color:STAT_COLORS[field], fontSize:14, fontWeight:600, outline:"none" }} />
                          <div style={{ flex:1, height:5, borderRadius:3, background:"var(--surface-0)", overflow:"hidden" }}>
                            <div style={{ height:"100%", borderRadius:3, background:STAT_COLORS[field], width:`${Math.round(Number(editForm[field])/max*100)}%`, transition:"width 0.1s" }} />
                          </div>
                          <span style={{ fontSize:11, color:"var(--text-muted)", minWidth:30 }}>{max}</span>
                        </div>
                      </div>
                    ))}
                    <button onClick={saveStats} disabled={saving} style={{ padding:"9px 0", borderRadius:"var(--radius)", border:"none", background:saving?"var(--surface-1)":"#6366f1", color:saving?"var(--text-muted)":"#fff", fontWeight:600, cursor:saving?"not-allowed":"pointer", fontSize:13, marginTop:4 }}>
                      {saving?"Enregistrement…":"Sauvegarder"}
                    </button>
                  </div>
                )}
              </div>

              {/* Tours */}
              <div style={{ background:"var(--surface-2)", border:"0.5px solid var(--border)", borderRadius:12, padding:16 }}>
                <div style={{ fontSize:11, fontWeight:500, color:"var(--text-secondary)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>
                  Tours — {(myPlayer.objectives||[]).filter(k=>k.startsWith("tower")).length}/9
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {TOWERS.map((t,i) => {
                    const done = (myPlayer.objectives||[]).includes(t.key);
                    const tc = TOWER_COLORS[i%TOWER_COLORS.length];
                    return (
                      <div key={t.key} onClick={()=>toggleObj(t.key)} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:8, cursor:"pointer", background:done?"rgba(34,197,94,0.08)":"var(--surface-1)", border:`0.5px solid ${done?"rgba(34,197,94,0.3)":"var(--border)"}`, borderLeftWidth:3, borderLeftColor:tc, borderLeftStyle:"solid" }}>
                        <div style={{ width:18, height:18, borderRadius:4, background:done?"#22c55e":"var(--surface-0)", border:done?"none":"0.5px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff", flexShrink:0 }}>{done?"✓":""}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, fontWeight:500 }}>{t.label}</div>
                          <div style={{ fontSize:11, color:"var(--text-secondary)" }}>{t.boss} · {t.zone}</div>
                        </div>
                        <Badge text={`niv.${t.lv}`} color={tc} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Raids */}
              <div style={{ background:"var(--surface-2)", border:"0.5px solid var(--border)", borderRadius:12, padding:16 }}>
                <div style={{ fontSize:11, fontWeight:500, color:"var(--text-secondary)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>
                  Raids — {(myPlayer.objectives||[]).filter(k=>k.startsWith("raid")).length}/{RAID_BOSSES.length}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {RAID_BOSSES.map((r,i) => {
                    const done = (myPlayer.objectives||[]).includes(r.key);
                    const rc = RAID_COLORS[i%RAID_COLORS.length];
                    return (
                      <div key={r.key} onClick={()=>toggleObj(r.key)} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:8, cursor:"pointer", background:done?"rgba(34,197,94,0.08)":"var(--surface-1)", border:`0.5px solid ${done?"rgba(34,197,94,0.3)":"var(--border)"}`, borderLeftWidth:3, borderLeftColor:rc, borderLeftStyle:"solid" }}>
                        <div style={{ width:18, height:18, borderRadius:4, background:done?"#22c55e":"var(--surface-0)", border:done?"none":"0.5px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff", flexShrink:0 }}>{done?"✓":""}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, fontWeight:500 }}>{r.pal}</div>
                          <div style={{ fontSize:11, color:"var(--text-secondary)" }}>{r.location}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Alphas */}
              <div style={{ background:"var(--surface-2)", border:"0.5px solid var(--border)", borderRadius:12, padding:16 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                  <div style={{ fontSize:11, fontWeight:500, color:"var(--text-secondary)", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                    Alphas — {(myPlayer.objectives||[]).filter(k=>k.startsWith("alpha")).length}/{ALPHAS.length}
                  </div>
                  <input placeholder="Rechercher…" value={alphaSearch} onChange={e=>setAlphaSearch(e.target.value)}
                    style={{ padding:"4px 8px", borderRadius:"var(--radius)", border:"0.5px solid var(--border)", background:"var(--surface-1)", color:"var(--text-primary)", fontSize:11, outline:"none", width:140 }} />
                </div>

                {/* Onglets région */}
                <div style={{ display:"flex", gap:4, marginBottom:12, flexWrap:"wrap" }}>
                  {Object.entries(ALPHA_REGIONS).map(([r,keys]) => {
                    const n = keys.filter(k=>(myPlayer.objectives||[]).includes(k)).length;
                    return (
                      <button key={r} onClick={()=>setAlphaTab(r)} style={{ padding:"4px 10px", border:`0.5px solid ${alphaTab===r?"#6366f1":"var(--border)"}`, borderRadius:"var(--radius)", background:alphaTab===r?"rgba(99,102,241,0.15)":"none", color:alphaTab===r?"#a5b4fc":"var(--text-secondary)", cursor:"pointer", fontSize:11, fontWeight:alphaTab===r?500:400 }}>
                        {r} <span style={{ color:"var(--text-muted)" }}>{n}/{keys.length}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Liste alphas */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
                  {ALPHAS
                    .filter(a => ALPHA_REGIONS[alphaTab]?.includes(a.key))
                    .filter(a => !alphaSearch || a.pal.toLowerCase().includes(alphaSearch.toLowerCase()) || a.location.toLowerCase().includes(alphaSearch.toLowerCase()))
                    .map(a => {
                      const done = (myPlayer.objectives||[]).includes(a.key);
                      const typeColor = TYPE_COLORS[a.type] || "#6b7280";
                      return (
                        <div key={a.key} onClick={()=>toggleObj(a.key)} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 9px", borderRadius:8, cursor:"pointer", background:done?"rgba(34,197,94,0.08)":"var(--surface-1)", border:`0.5px solid ${done?"rgba(34,197,94,0.3)":"var(--border)"}`, borderLeftWidth:3, borderLeftColor:typeColor, borderLeftStyle:"solid" }}>
                          <div style={{ width:14, height:14, borderRadius:"50%", background:done?"#22c55e":"var(--surface-0)", border:done?"none":"0.5px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", flexShrink:0 }}>{done?"✓":""}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:12, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{a.pal}</div>
                            <div style={{ fontSize:10, color:"var(--text-muted)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{a.location}</div>
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2, flexShrink:0 }}>
                            <span style={{ fontSize:10, color:"var(--text-muted)" }}>niv.{a.lv}</span>
                            <span style={{ fontSize:9, padding:"1px 4px", borderRadius:3, background:typeColor+"22", color:typeColor, border:`0.5px solid ${typeColor}44`, whiteSpace:"nowrap" }}>{a.type.split("/")[0]}</span>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ── Historique ── */}
      {view === "history" && (
        <div style={{ flex:1, overflow:"auto", padding:16, maxWidth:560, margin:"0 auto", width:"100%" }}>
          <div style={{ background:"var(--surface-2)", border:"0.5px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
            <div style={{ padding:"12px 14px", borderBottom:"0.5px solid var(--border)", fontSize:13, fontWeight:500 }}>Mon historique de progression</div>
            {history.length === 0 ? (
              <div style={{ padding:20, fontSize:13, color:"var(--text-secondary)", textAlign:"center" }}>Aucun historique — sauvegardez vos stats pour commencer.</div>
            ) : (
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr>
                    {["Date","Niveau","Pals","Fast travel"].map(h => (
                      <th key={h} style={{ textAlign:"left", padding:"8px 14px", color:"var(--text-secondary)", fontWeight:400, fontSize:11, borderBottom:"0.5px solid var(--border)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((h,i) => (
                    <tr key={h.id} style={{ background:i===0?"rgba(99,102,241,0.04)":"none" }}>
                      <td style={{ padding:"9px 14px", borderBottom:"0.5px solid var(--border)", color:"var(--text-secondary)", fontSize:11 }}>
                        {new Date(h.recorded_at).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}
                        {i===0&&<span style={{ marginLeft:6, fontSize:9, padding:"1px 4px", borderRadius:3, background:"rgba(99,102,241,0.2)", color:"#a5b4fc" }}>Dernier</span>}
                      </td>
                      <td style={{ padding:"9px 14px", borderBottom:"0.5px solid var(--border)", fontWeight:500 }}>{h.level}</td>
                      <td style={{ padding:"9px 14px", borderBottom:"0.5px solid var(--border)", fontWeight:500 }}>{h.pal_count}</td>
                      <td style={{ padding:"9px 14px", borderBottom:"0.5px solid var(--border)", fontWeight:500 }}>{h.fast_travel_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
