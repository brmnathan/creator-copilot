import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  ScanLine,
  ListChecks,
  WandSparkles,
  ChartNoAxesCombined,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ArrowUpRight,
  Bell,
  Check,
  Rocket,
  RotateCcw,
  UserPen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCopilot } from "./store";
import { DemoBadge } from "./shared";
const navigation = [
  { to: "/" as const, name: "Visão geral", icon: LayoutDashboard },
  { to: "/diagnostico" as const, name: "Meu diagnóstico", icon: ScanLine },
  { to: "/plano" as const, name: "Plano de ação", icon: ListChecks },
  { to: "/criador" as const, name: "Criador de conteúdo", icon: WandSparkles },
  { to: "/progresso" as const, name: "Meu progresso", icon: ChartNoAxesCombined },
];
export function CopilotShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { diagnosis, resetDemo } = useCopilot();
  const navigate = useNavigate();
  const [resetOpen, setResetOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const active = navigation.find((item) => item.to === pathname);
  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      {mobileOpen && <div className="mobile-shade" onClick={() => setMobileOpen(false)} />}
      <aside className={`app-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-symbol">
            <Sparkles size={23} strokeWidth={2.2} />
          </span>
          <span className="brand-name">
            creator
            <span>
              copilot<span className="brand-period">.</span>
            </span>
          </span>
        </Link>
        <div className="sidebar-label">SEU ESPAÇO DE CRIAÇÃO</div>
        <nav aria-label="Navegação principal">
          {navigation.map((item) => (
            <Button
              asChild
              variant="navigation"
              key={item.to}
              title={collapsed ? item.name : undefined}
            >
              <Link
                to={item.to}
                className={pathname === item.to ? "nav-active" : ""}
                aria-current={pathname === item.to ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={19} />
                <span>{item.name}</span>
                {item.to === "/criador" && <span className="nav-new">IA</span>}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon">
              <Rocket size={20} />
            </span>
            <h3>
              Grandes resultados.
              <br />
              Pequenos passos.
            </h3>
            <p>Sua primeira venda começa com a próxima ação.</p>
            <Button asChild variant="lime" size="sm">
              <Link to="/plano" onClick={() => setMobileOpen(false)}>
                Ver meu plano
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <div className="sidebar-demo">
            <span className="live-dot" />
            Ambiente de demonstração
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="profile w-full text-left"
              aria-label="Abrir menu do perfil"
            >
              <span className="avatar">{diagnosis.name.trim().charAt(0).toUpperCase() || "C"}</span>
              <span className="profile-text">
                <strong>{diagnosis.name || "Criador"}</strong>
                <small>{diagnosis.experience}</small>
              </span>
              <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56">
              <DropdownMenuItem
                onSelect={() => {
                  setMobileOpen(false);
                  void navigate({ to: "/diagnostico" });
                }}
              >
                <UserPen />
                Editar diagnóstico
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-muted-foreground"
                onSelect={() => setResetOpen(true)}
              >
                <RotateCcw />
                Reiniciar demonstração
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reiniciar demonstração?</AlertDialogTitle>
                <AlertDialogDescription>
                  Seu diagnóstico, plano, tarefas concluídas e último conteúdo gerado serão apagados
                  deste navegador. Você começará um novo diagnóstico do zero.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    resetDemo();
                    setMobileOpen(false);
                    toast.success("Demonstração reiniciada. Comece seu novo diagnóstico.");
                    void navigate({ to: "/diagnostico" });
                  }}
                >
                  Reiniciar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <Button
          className="mobile-close"
          variant="ghost"
          size="icon"
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
        >
          <X />
        </Button>
      </aside>
      <div className="app-body">
        <header className="app-header">
          <div className="header-left">
            <Button
              variant="ghost"
              size="icon"
              className="desktop-toggle"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
              title={collapsed ? "Expandir menu" : "Recolher menu"}
            >
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu />
            </Button>
            <span className="header-breadcrumb">
              Meu espaço<span>/</span>
              <strong>{active?.name}</strong>
            </span>
          </div>
          <div className="header-right">
            <DemoBadge />
            <div className="notification-wrap">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notificações"
                onClick={() => setNotifications(!notifications)}
              >
                <Bell size={19} />
                <span className="notification-dot" />
              </Button>
              {notifications && (
                <div className="notification-popover">
                  <h3>Suas novidades</h3>
                  <p>
                    <Check size={17} />
                    Seu plano de demonstração está pronto.
                  </p>
                  <p>
                    <Sparkles size={17} />
                    Um novo conteúdo pode ser seu próximo passo.
                  </p>
                  <small>Exemplos de notificações · demonstração</small>
                </div>
              )}
            </div>
            <Link to="/diagnostico" className="header-avatar" aria-label="Editar meu perfil">
              {diagnosis.name.trim().charAt(0).toUpperCase() || "C"}
            </Link>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>
            Creator Copilot <span>·</span> Seu próximo passo começa aqui.
          </span>
          <span>
            Feito para quem cria <span className="footer-spark">✦</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
