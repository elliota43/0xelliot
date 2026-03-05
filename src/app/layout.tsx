import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/contexts/theme-context";
import { SettingsPanel } from "@/components/settings-panel";
import { SearchModal } from "@/components/search-modal";
import { getAllArticles, getAllSnippets } from "@/lib/mdx";
import type { SearchItem } from "@/lib/search";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Elliot Anderson",
    template: "%s · Elliot Anderson",
  },
  description:
    "Software engineer building things at the intersection of systems programming, developer tooling, and the web.",
  authors: [{ name: "Elliot Anderson" }],
  creator: "Elliot Anderson",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Elliot Anderson",
    title: "Elliot Anderson",
    description:
      "Software engineer building things at the intersection of systems programming, developer tooling, and the web.",
  },
};

// Inline script to prevent flash of default theme before React hydrates.
// Reads the saved theme from localStorage and applies CSS variables immediately.
const antiFOUCScript = `(function(){try{var t=localStorage.getItem('site-theme');if(t){var themes={
'catppuccin-mocha':['#1e1e2e','#181825','#11111b','#313244','#45475a','#585b70','#6c7086','#7f849c','#a6adc8','#bac2de','#cdd6f4','#fab387','#a6e3a1','#89b4fa','#b4befe','#cba6f7','#f38ba8','#f9e2af','#94e2d5','#f5e0dc','#f2cdcd'],
'catppuccin-macchiato':['#24273a','#1e2030','#181926','#363a4f','#494d64','#5b6078','#6e738d','#8087a2','#a5adcb','#b8c0e0','#cad3f5','#f5a97f','#a6da95','#8aadf4','#b7bdf8','#c6a0f6','#ed8796','#eed49f','#8bd5ca','#f4dbd6','#f0c6c6'],
'catppuccin-frappe':['#303446','#292c3c','#232634','#414559','#51576d','#626880','#737994','#838ba7','#a5adce','#b5bfe2','#c6d0f5','#ef9f76','#a6d189','#8caaee','#babbf1','#ca9ee6','#e78284','#e5c890','#81c8be','#f2d5cf','#eebebe'],
'catppuccin-latte':['#eff1f5','#e6e9ef','#dce0e8','#ccd0da','#bcc0cc','#acb0be','#9ca0b0','#8c8fa1','#6c6f85','#5c5f77','#4c4f69','#fe640b','#40a02b','#1e66f5','#7287fd','#8839ef','#d20f39','#df8e1d','#179299','#dc8a78','#dd7878'],
'gruvbox-dark':['#282828','#1d2021','#141617','#3c3836','#504945','#665c54','#7c6f64','#928374','#a89984','#bdae93','#ebdbb2','#fe8019','#b8bb26','#83a598','#d3869b','#d3869b','#fb4934','#fabd2f','#8ec07c','#d65d0e','#cc241d'],
'gruvbox-light':['#fbf1c7','#f2e5bc','#ebdbb2','#d5c4a1','#bdae93','#a89984','#928374','#7c6f64','#665c54','#504945','#3c3836','#af3a03','#79740e','#076678','#8f3f71','#8f3f71','#9d0006','#b57614','#427b58','#d65d0e','#cc241d'],
'tokyonight-storm':['#24283b','#1f2335','#1a1b26','#292e42','#3b4261','#414868','#565f89','#737aa2','#a9b1d6','#c0caf5','#c0caf5','#ff9e64','#9ece6a','#7aa2f7','#bb9af7','#bb9af7','#f7768e','#e0af68','#73daca','#ff9e64','#ff757f'],
'tokyonight-moon':['#222436','#1e2030','#191926','#2f334d','#444a73','#3b4261','#636da6','#737aa2','#828bb8','#a9b8e8','#c8d3f5','#ff966c','#c3e88d','#82aaff','#c099ff','#c099ff','#ff757f','#ffc777','#4fd6be','#ff98a4','#ff6183'],
'tokyonight-night':['#1a1b26','#16161e','#13131a','#1f2335','#292e42','#3b4261','#414868','#565f89','#9aa5ce','#a9b1d6','#c0caf5','#ff9e64','#9ece6a','#7aa2f7','#bb9af7','#bb9af7','#f7768e','#e0af68','#73daca','#ff9e64','#ff757f'],
'tokyonight-day':['#e1e2e7','#d5d6db','#c8c9ce','#cacbcf','#bbbcc2','#a1a2a8','#888994','#737480','#5e6173','#4e505e','#3760bf','#b15c00','#587539','#2e7de9','#7847bd','#7847bd','#f52a65','#8c6c3e','#007197','#b15c00','#f52a65'],
'onedark-dark':['#282c34','#21252b','#1c1e24','#2c313c','#353b45','#3e4452','#4b5263','#5c6370','#828997','#9da5b4','#abb2bf','#e5c07b','#98c379','#61afef','#c678dd','#c678dd','#e06c75','#e5c07b','#56b6c2','#d19a66','#e06c75'],
'onedark-light':['#fafafa','#f0f0f0','#e8e8e8','#e5e5e6','#d4d4d4','#c2c2c2','#a0a1a7','#8e919a','#6e7681','#545862','#383a42','#c18401','#50a14f','#0184bc','#a626a4','#a626a4','#e45649','#c18401','#0997b3','#986801','#ca1243'],
'github-dark':['#0d1117','#090c10','#040507','#161b22','#21262d','#30363d','#3d444d','#656d76','#848d97','#9198a1','#e6edf3','#ffa657','#7ee787','#79c0ff','#d2a8ff','#d2a8ff','#ff7b72','#e3b341','#39d353','#ffa657','#ff7b72'],
'github-light':['#ffffff','#f6f8fa','#eaeef2','#f0f3f6','#d0d7de','#b6bfc8','#9198a1','#6e7781','#57606a','#424a53','#1f2328','#bc4c00','#116329','#0969da','#8250df','#8250df','#cf222e','#9a6700','#1a7f37','#bc4c00','#cf222e'],
'github-dark-dimmed':['#22272e','#1c2128','#161b22','#2d333b','#373e47','#444c56','#545d68','#768390','#909dab','#adbac7','#cdd9e5','#e2973e','#6bc46d','#6cb6ff','#b083f0','#b083f0','#e5534b','#daaa3f','#56d364','#e2973e','#e5534b'],
'github-dark-colorblind':['#0d1117','#090c10','#040507','#161b22','#21262d','#30363d','#3d444d','#656d76','#848d97','#9198a1','#e6edf3','#f78166','#57ab5a','#6cb6ff','#dcbdfb','#dcbdfb','#f47067','#c69026','#2dba4e','#f78166','#f47067'],
'github-dark-high-contrast':['#010409','#000002','#000000','#0d1117','#161b22','#21262d','#30363d','#656d76','#9198a1','#adbac7','#f0f3f6','#ffb757','#7ee787','#79c0ff','#e2c5ff','#e2c5ff','#ff9492','#f2e388','#56d364','#ffb757','#ff9492'],
'github-light-high-contrast':['#ffffff','#f6f8fa','#eaeef2','#f0f3f6','#d0d7de','#b6bfc8','#9198a1','#6e7781','#24292f','#1c2128','#0e1116','#7d2500','#004500','#00359d','#3e0094','#3e0094','#6e011a','#4b2200','#003300','#7d2500','#6e011a'],
'cyberdream':['#16181a','#0e1012','#0a0c0d','#1e2124','#282d31','#3c4248','#4a5159','#5b6370','#9ba3ad','#b7bec8','#ffffff','#ff6e5e','#5eff6c','#5ea1ff','#bd5eff','#bd5eff','#ff6e5e','#f1ff5e','#5ef1ff','#ff6e5e','#ff6e5e'],
'nightfox':['#192330','#131a24','#0e1319','#212e3f','#29394f','#3e5274','#587589','#738094','#aeafb0','#cdcecf','#cdcecf','#c9a554','#81b29a','#719cd6','#9d79d6','#9d79d6','#c94f6d','#dbc074','#63cdcf','#d67ad2','#e18dae'],
'carbonfox':['#161616','#101010','#0a0a0a','#282828','#393939','#525252','#6f6f6f','#8d8d8d','#a8a8a8','#c6c6c6','#f2f4f8','#3ddbd9','#25be6a','#78a9ff','#be95ff','#be95ff','#ee5396','#08bdba','#3ddbd9','#ee5396','#be95ff'],
'dawnfox':['#faf4ed','#fffaf3','#f2e9de','#f4ede8','#e4dfda','#d4cfc7','#9893a5','#797593','#575279','#3e3d5e','#575279','#d7827a','#56949f','#286983','#907aa9','#907aa9','#b4637a','#ea9d34','#d7827a','#d7827a','#b4637a'],
'duskfox':['#232136','#1f1d2e','#191726','#2d2b40','#403d52','#59546e','#817c9c','#9893a5','#e0def4','#f4dbd6','#e0def4','#f6c177','#3e8fb0','#9ccfd8','#c4a7e7','#c4a7e7','#eb6f92','#f6c177','#9ccfd8','#f6c177','#eb6f92'],
'dayfox':['#fff8f0','#f5e8d5','#ecdec7','#e4d4bd','#d0bfa5','#bca88b','#9c8770','#896b53','#643f1e','#4d3010','#643f1e','#a440b5','#396292','#4d688e','#a440b5','#a440b5','#a440b5','#6e5a30','#396292','#a440b5','#a440b5'],
'terafox':['#152528','#0f1c1e','#0a1315','#1e3234','#264244','#2e5254','#527175','#6a8f93','#8fb4b8','#adbdbe','#e6eaea','#ff8349','#9fe3b6','#5faf78','#8fd4c2','#c0a4a2','#e85c51','#ffc552','#8fd4c2','#ff8349','#e85c51'],
'nordfox':['#2e3440','#293241','#232b38','#3b4252','#434c5e','#4c566a','#616e88','#697898','#9099ab','#9099ab','#eceff4','#d08770','#a3be8c','#81a1c1','#b48ead','#b48ead','#bf616a','#ebcb8b','#8fbcbb','#d08770','#bf616a'],
'molokai':['#1b1d1e','#151617','#0f1011','#293739','#3a3a3a','#4e4e4e','#5c5c5c','#808080','#8f8f8f','#bcbcbc','#f8f8f2','#fd971f','#a6e22e','#66d9e8','#ae81ff','#ae81ff','#f92672','#e6db74','#66d9e8','#fd971f','#f92672'],
'monokai':['#272822','#1e1f1c','#191a17','#313129','#3e3d32','#49483e','#75715e','#908b80','#a59f85','#c0bca1','#f8f8f2','#fd971f','#a6e22e','#66d9e8','#ae81ff','#ae81ff','#f92672','#e6db74','#66d9e8','#fd971f','#f92672'],
'solarized-dark':['#002b36','#00212b','#001a21','#073642','#194a54','#1c5461','#586e75','#657b83','#839496','#93a1a1','#fdf6e3','#cb4b16','#859900','#268bd2','#6c71c4','#d33682','#dc322f','#b58900','#2aa198','#cb4b16','#dc322f'],
'solarized-light':['#fdf6e3','#f5efdb','#ede9d2','#eee8d5','#e7e1cb','#ddd8c5','#839496','#657b83','#586e75','#073642','#657b83','#cb4b16','#859900','#268bd2','#6c71c4','#d33682','#dc322f','#b58900','#2aa198','#cb4b16','#dc322f'],
'jellybeans':['#1c1c1c','#161616','#111111','#2b2b2b','#333333','#484848','#606060','#777777','#888888','#aaaaaa','#e8e8d3','#e5786d','#8ac6f2','#7e8aa2','#8197bf','#d18aff','#cf6a4c','#fad07a','#99ad6a','#e5786d','#cf6a4c'],
'zenburn':['#3f3f3f','#333333','#2a2a2a','#4f4f4f','#5f5f5f','#6c6c6c','#7f7f7f','#9f9f9f','#bdbdbd','#c3bf9f','#dcdccc','#dfaf8f','#7f9f7f','#8cd0d3','#dc8cc3','#dc8cc3','#cc9393','#f0dfaf','#93e0e3','#dfaf8f','#cc9393'],
'tomorrow-night':['#1d1f21','#161819','#111213','#282a2e','#373b41','#444a4d','#5b6268','#737373','#8e8e8e','#969896','#c5c8c6','#de935f','#b5bd68','#81a2be','#b294bb','#b294bb','#cc6666','#f0c674','#8abeb7','#de935f','#cc6666'],
'tomorrow-night-bright':['#000000','#0a0a0a','#050505','#1a1a1a','#2a2a2a','#3a3a3a','#555555','#666666','#777777','#999999','#eaeaea','#e9c062','#a8ff60','#96cbfe','#ff73fd','#ff73fd','#ff6c60','#ffffb6','#96cbfe','#e9c062','#ff6c60'],
'tomorrow-night-eighties':['#2d2d2d','#242424','#1c1c1c','#393939','#515151','#616161','#6f6f6f','#999999','#a8a8a8','#b8b8b8','#cccccc','#f99157','#99cc99','#6699cc','#cc99cc','#cc99cc','#f2777a','#ffcc66','#66cccc','#f99157','#f2777a'],
'railscasts':['#2b2b2b','#232323','#1c1c1c','#323232','#424242','#555555','#6c6c6c','#808080','#a5c261','#c8c8c8','#e6e1dc','#e67e22','#a5c261','#6fa8dc','#da4c4c','#da4c4c','#da4c4c','#ffc66d','#509aad','#e67e22','#da4c4c'],
'badwolf':['#1c1b1a','#16151a','#111011','#242321','#35322d','#45433e','#666462','#857f78','#a59f96','#c2c0ba','#f8f6f2','#ff9eb8','#aeee00','#0a9dff','#e3aaa6','#ff2c4b','#ff2c4b','#fade3e','#0a9dff','#ff9eb8','#ff2c4b'],
'hybrid':['#212121','#1a1a1a','#141414','#303030','#404040','#515151','#616161','#808080','#9e9e9e','#c1c1c1','#e8e8d3','#cc6666','#b5bd68','#81a2be','#b294bb','#b294bb','#cc6666','#f0c674','#8abeb7','#de935f','#cc6666'],
'mustang':['#1c1c1c','#161616','#111111','#2b2b2b','#3c3c3c','#4c4c4c','#606060','#7a7a7a','#8a8a8a','#afafaf','#eeeeee','#ce8800','#8dbd4e','#48bde0','#a97bc5','#a97bc5','#e35c4a','#e8b71a','#50bbe6','#ce8800','#e35c4a'],
'twilight':['#1e1e1e','#171717','#111111','#303030','#404040','#505050','#5a5a5a','#777777','#8a8a8a','#a8a8a8','#f8f8f8','#cda869','#8cde7c','#88a7c5','#9b859d','#9b859d','#cf6a4c','#f9ee98','#afc4db','#cda869','#cf6a4c'],
'ir-black':['#000000','#0a0a0a','#050505','#161616','#1e1e1e','#2e2e2e','#424242','#595959','#6c6c6c','#8b8b8b','#f6f3e8','#ff9800','#a8ff60','#96cbfe','#ff73fd','#ff73fd','#ff6c60','#fafac2','#96cbfe','#ff9800','#ff6c60'],
'inkpot':['#1f1f2f','#191929','#141422','#2d2d4e','#3c3c5e','#4b4b70','#5e5e78','#808080','#9090a8','#afafb8','#cfbfad','#ff8900','#b8d168','#88b8f6','#cd8b00','#8080ff','#ff4444','#ffd700','#a8ff60','#ff8900','#ff4444'],
'wombat':['#242424','#1c1c1c','#161616','#333333','#454545','#545454','#656565','#888888','#9e9e9e','#bbbbbb','#f6f3e8','#e5c17c','#95e454','#8ac6f2','#c6b7f5','#c6b7f5','#e5786d','#cae682','#8ac6f2','#e5c17c','#e5786d'],
'distinguished':['#1b1b1b','#141414','#0e0e0e','#2a2a2a','#3a3a3a','#4a4a4a','#5a5a5a','#747474','#959595','#c4c4c4','#eeeeee','#f8a02a','#7fc1ca','#5fa8d0','#d7a5ff','#d7a5ff','#ea3d3d','#ffd024','#7fc1ca','#f8a02a','#ea3d3d'],
'xoria256':['#262626','#1c1c1c','#121212','#303030','#3a3a3a','#4e4e4e','#626262','#767676','#8a8a8a','#b2b2b2','#d0d0d0','#afaf87','#87af5f','#5f87af','#af87af','#af87af','#af5f5f','#d7d787','#5faf87','#afaf87','#af5f5f'],
'desert':['#333333','#282828','#1e1e1e','#3e3e3e','#4e4e4e','#5e5e5e','#6e6e6e','#888888','#999999','#b8b8b8','#ffffcc','#f08040','#95e454','#8acccf','#e5786d','#e5786d','#e5786d','#cae682','#8acccf','#f08040','#e5786d'],
'slate':['#262626','#1e1e1e','#161616','#363636','#454545','#555555','#666666','#878787','#9a9a9a','#bbbbbb','#dddddd','#97bd5f','#97bd5f','#7696a7','#97bd5f','#97bd5f','#e97070','#cfb980','#7696a7','#97bd5f','#e97070'],
'elflord':['#1a1a2e','#141424','#0e0e1e','#16213e','#1f3461','#2e4080','#3c5488','#5a7ab8','#7a9ad0','#9ab8e0','#cccccc','#00ffff','#00ff00','#00ffff','#00ffff','#ff00ff','#ff0000','#ffff00','#00ffff','#00ffff','#ff00ff'],
'delek':['#d4d0c8','#c8c4bc','#bcb8b0','#b8b4ac','#aca8a0','#a0a098','#808080','#606060','#404040','#2e2e2e','#000000','#800000','#006400','#000080','#800080','#800080','#800000','#808000','#008080','#800000','#800000'],
'pyte':['#ffffff','#f5f5f5','#ebebeb','#e0e0e0','#cccccc','#b5b5b5','#999999','#7f7f7f','#555555','#333333','#000000','#005f87','#00875f','#005f87','#875f87','#875f87','#870000','#875f00','#005f5f','#005f87','#870000'],
'vividchalk':['#1c1c1c','#161616','#111111','#2a2a2a','#3a3a3a','#4a4a4a','#606060','#808080','#9a9a9a','#c0c0c0','#ffffff','#ff9800','#99cc33','#6699cc','#ff6699','#ff6699','#ff6666','#ffcc33','#00ccff','#ff9800','#ff6666']
};
var keys=['--color-base','--color-mantle','--color-crust','--color-surface-0','--color-surface-1','--color-surface-2','--color-overlay-0','--color-overlay-1','--color-subtext-0','--color-subtext-1','--color-text','--color-peach','--color-green','--color-blue','--color-lavender','--color-mauve','--color-red','--color-yellow','--color-teal','--color-rosewater','--color-flamingo'];
var lightThemes=['catppuccin-latte','gruvbox-light','tokyonight-day','onedark-light','github-light','github-light-high-contrast','dawnfox','dayfox','solarized-light','pyte','delek'];
var vals=themes[t];if(vals){var el=document.documentElement;for(var i=0;i<keys.length;i++)el.style.setProperty(keys[i],vals[i]);el.setAttribute('data-theme',t);el.setAttribute('data-color-mode',lightThemes.indexOf(t)>=0?'light':'dark');}}}catch(e){}})();`;

// Build search index at build time (runs server-side only)
function buildSearchIndex(): SearchItem[] {
  const articles = getAllArticles();
  const snippets = getAllSnippets();

  const items: SearchItem[] = [
    ...articles.map((a) => ({
      type: "article" as const,
      title: a.frontmatter.title,
      description: a.frontmatter.description,
      href: `/articles/${a.slug}`,
      tags: a.frontmatter.tags ?? [],
      meta: a.frontmatter.date,
    })),
    ...snippets.map((s) => ({
      type: "snippet" as const,
      title: s.frontmatter.title,
      description: s.frontmatter.description,
      href: `/snippets/${s.slug}`,
      tags: s.frontmatter.tags ?? [],
      meta: s.frontmatter.language,
    })),
    // Projects (static list — mirrors projects-client.tsx)
    {
      type: "project",
      title: "git clone in go",
      description:
        "implements git init, add, commit, log, push, and clone from scratch. parses pack files, resolves delta chains, implements the http smart protocol.",
      href: "/projects",
      tags: ["go", "systems", "git internals", "networking"],
      meta: "go",
    },
    {
      type: "project",
      title: "vim-style text editor in rust",
      description:
        "modal text editor using raw terminal i/o with no external tui libraries. normal, insert, and visual modes. gap buffer for O(1) local edits.",
      href: "/projects",
      tags: ["rust", "tui", "data structures", "tree-sitter"],
      meta: "rust",
    },
    {
      type: "project",
      title: "lox vm in c",
      description:
        "complete bytecode virtual machine for the lox language. mark-and-sweep garbage collection, closures with upvalue capture, single-pass compiler.",
      href: "/projects",
      tags: ["c", "compilers", "vm", "gc"],
      meta: "c",
    },
    {
      type: "project",
      title: "declarative laravel migrations",
      description:
        "laravel package to define your database schema declaratively. auto-generates necessary migrations. eliminates migration drift.",
      href: "/projects",
      tags: ["php", "laravel", "developer tooling", "mysql"],
      meta: "php",
    },
  ];

  return items;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchItems = buildSearchIndex();

  return (
    <html lang="en" className={geistMono.variable}>
      <head>
        {/* Anti-FOUC: apply saved theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: antiFOUCScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <SettingsPanel />
          <SearchModal items={searchItems} />
        </ThemeProvider>
      </body>
    </html>
  );
}
