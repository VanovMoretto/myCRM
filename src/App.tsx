import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar as CalendarIcon,
  BarChart3,
  Bell,
  Plus,
  UserPlus,
  TrendingUp,
  DollarSign,
  UserCheck,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { ClientEvent, ProposalStatus } from "./types/crm";
import "./App.css";

// Dados simulados distribuídos em Outubro e Novembro de 2026 para testar o filtro mensal e calendário
const INITIAL_EVENTS: ClientEvent[] = [
  {
    id: "EVT-001",
    clientName: "Mariana Souza",
    companyName: "TechSul Inovação",
    isReturningClient: true,
    contactDate: "2026-10-02",
    origin: "Cliente Recorrente",
    proposalSentDate: "2026-10-03",
    proposalDeadline: "2026-10-10",
    eventDate: "2026-10-15",
    paymentDeadline: "2026-10-12",
    roomName: "Salão Nobre NH",
    status: "Realizado",
    sectors: {
      eventRoom: 4500,
      lodging: 6200,
      coffeeBreak: 2800,
      food: 5100,
      parking: 900,
    },
    totalValue: 19500,
    amountPaid: 19500,
    invoiceSent: false,
  },
  {
    id: "EVT-002",
    clientName: "Carlos Eduardo",
    companyName: "Grupo Calçados Vale",
    isReturningClient: false,
    contactDate: "2026-10-08",
    origin: "Prospecção Ativa",
    proposalSentDate: "2026-10-09",
    proposalDeadline: "2026-10-18",
    eventDate: "2026-10-24",
    paymentDeadline: "2026-10-20",
    roomName: "Sala Executiva I",
    status: "Confirmado",
    sectors: {
      eventRoom: 2500,
      lodging: 0,
      coffeeBreak: 1800,
      food: 3200,
      parking: 500,
    },
    totalValue: 8000,
    amountPaid: 5600, // 70% pago
    invoiceSent: false,
  },
  {
    id: "EVT-003",
    clientName: "Fernanda Lima",
    companyName: "Associação Médica RS",
    isReturningClient: false,
    contactDate: "2026-10-16",
    origin: "Google / Site",
    proposalSentDate: "2026-10-17",
    proposalDeadline: "2026-10-22",
    eventDate: "2026-10-28",
    roomName: "Auditório Principal",
    status: "Em Negociação",
    sectors: {
      eventRoom: 6000,
      lodging: 8400,
      coffeeBreak: 3500,
      food: 6800,
      parking: 1300,
    },
    totalValue: 26000,
    amountPaid: 0,
    invoiceSent: false,
  },
  {
    id: "EVT-004",
    clientName: "Roberto Alves",
    companyName: "Consultoria Horizonte",
    isReturningClient: false,
    contactDate: "2026-10-05",
    origin: "Instagram",
    proposalSentDate: "2026-10-06",
    proposalDeadline: "2026-10-12",
    eventDate: "2026-10-29",
    roomName: "Sala Executiva II",
    status: "Cancelado",
    sectors: {
      eventRoom: 1800,
      lodging: 0,
      coffeeBreak: 950,
      food: 0,
      parking: 250,
    },
    totalValue: 3000,
    amountPaid: 0,
    invoiceSent: false,
    refusalReason: "Orçamento de A&B acima do budget",
    feedback:
      "Achou o valor do coffee break acima do budget liberado pela diretoria.",
  },
  {
    id: "EVT-005",
    clientName: "Patrícia Gomes",
    companyName: "Congresso Odonto Sul",
    isReturningClient: true,
    contactDate: "2026-10-18",
    origin: "Indicação",
    proposalSentDate: "2026-10-19",
    proposalDeadline: "2026-11-04",
    eventDate: "2026-11-18",
    paymentDeadline: "2026-11-10",
    roomName: "Auditório Principal",
    status: "Confirmado",
    sectors: {
      eventRoom: 8000,
      lodging: 12000,
      coffeeBreak: 4500,
      food: 9000,
      parking: 1500,
    },
    totalValue: 35000,
    amountPaid: 17500, // 50% pago
    invoiceSent: false,
  },
];

const AVAILABLE_MONTHS = [
  {
    value: "2026-10",
    label: "Outubro de 2026",
    daysInMonth: 31,
    startWeekday: 4,
  }, // 1º Out 2026 = Quinta (4)
  {
    value: "2026-11",
    label: "Novembro de 2026",
    daysInMonth: 30,
    startWeekday: 0,
  }, // 1º Nov 2026 = Domingo (0)
];

export function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-10");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(3); // Semana do dia 18 a 24
  const [events] = useState<ClientEvent[]>(INITIAL_EVENTS);

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const calculatePaymentPercentage = (paid: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((paid / total) * 100);
  };

  // 1. Filtra os eventos pelo MÊS SELECIONADO para que todas as métricas sejam mensais
  const monthEvents = events.filter((ev) =>
    ev.eventDate.startsWith(selectedMonth),
  );

  // Eventos fechados no mês (Confirmado ou Realizado)
  const confirmedMonthEvents = monthEvents.filter(
    (ev) => ev.status === "Confirmado" || ev.status === "Realizado",
  );

  // Receita confirmada do mês
  const confirmedRevenue = confirmedMonthEvents.reduce(
    (acc, ev) => acc + ev.totalValue,
    0,
  );

  // Receita em negociação no mês
  const negotiatingRevenue = monthEvents
    .filter((ev) => ev.status === "Em Negociação")
    .reduce((acc, ev) => acc + ev.totalValue, 0);

  // Cancelados no mês
  const canceledMonthEvents = monthEvents.filter(
    (ev) => ev.status === "Cancelado" || ev.status === "Recusado",
  );

  // Taxa de fechamento mensal
  const conversionRate =
    monthEvents.length > 0
      ? Math.round((confirmedMonthEvents.length / monthEvents.length) * 100)
      : 0;

  // Soma de gastos por setor APENAS do mês selecionado
  const sectorTotals = confirmedMonthEvents.reduce(
    (acc, ev) => ({
      eventRoom: acc.eventRoom + ev.sectors.eventRoom,
      lodging: acc.lodging + ev.sectors.lodging,
      coffeeBreak: acc.coffeeBreak + ev.sectors.coffeeBreak,
      food: acc.food + ev.sectors.food,
      parking: acc.parking + ev.sectors.parking,
    }),
    { eventRoom: 0, lodging: 0, coffeeBreak: 0, food: 0, parking: 0 },
  );

  // Eventos da tabela filtrados pelo mês selecionado + botão de status
  const filteredTableEvents =
    statusFilter === "Todos"
      ? monthEvents
      : monthEvents.filter(
          (ev) => ev.status === (statusFilter as ProposalStatus),
        );

  // 2. Lógica de Construção do Calendário (Show Month vs Show Week)
  const currentMonthMeta =
    AVAILABLE_MONTHS.find((m) => m.value === selectedMonth) ||
    AVAILABLE_MONTHS[0];

  // Gera todas as células do mês (incluindo espaços vazios antes do dia 1)
  const buildCalendarCells = () => {
    const cells: Array<{ day: number | null; dateStr: string | null }> = [];
    for (let i = 0; i < currentMonthMeta.startWeekday; i++) {
      cells.push({ day: null, dateStr: null });
    }
    for (let d = 1; d <= currentMonthMeta.daysInMonth; d++) {
      const dayFormatted = String(d).padStart(2, "0");
      cells.push({ day: d, dateStr: `${selectedMonth}-${dayFormatted}` });
    }
    return cells;
  };

  const allMonthCells = buildCalendarCells();
  const totalWeeks = Math.ceil(allMonthCells.length / 7);

  // Se estiver em 'week', pega apenas os 7 dias da semana selecionada
  const visibleCells =
    calendarView === "month"
      ? allMonthCells
      : allMonthCells.slice(selectedWeekIndex * 7, selectedWeekIndex * 7 + 7);

  return (
    <div className="app-container">
      {/* ================= HEADER ================= */}
      <header className="crm-header">
        <div className="brand-area">
          <div className="brand-logo">mC</div>
          <div>
            <span className="brand-title">myCRM</span>
            <span className="brand-subtitle">
              Gestão Comercial de Eventos &amp; Hotelaria
            </span>
          </div>
        </div>

        <nav className="header-nav">
          <button
            className={`nav-btn ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <LayoutDashboard size={17} />
            Visão Geral
          </button>
          <button
            className={`nav-btn ${activeTab === "clients" ? "active" : ""}`}
            onClick={() => setActiveTab("clients")}
          >
            <Users size={17} />
            Prospecções &amp; Clientes
          </button>
          <button
            className={`nav-btn ${activeTab === "rooms" ? "active" : ""}`}
            onClick={() => setActiveTab("rooms")}
          >
            <Building2 size={17} />
            Salas &amp; Setores
          </button>
          <button
            className={`nav-btn ${activeTab === "calendar" ? "active" : ""}`}
            onClick={() => setActiveTab("calendar")}
          >
            <CalendarIcon size={17} />
            Calendário
          </button>
          <button
            className={`nav-btn ${activeTab === "metrics" ? "active" : ""}`}
            onClick={() => setActiveTab("metrics")}
          >
            <BarChart3 size={17} />
            Métricas &amp; Perdas
          </button>
        </nav>

        <div className="header-actions">
          <button className="notification-btn" title="Notificações de Deadline">
            <Bell size={18} />
            <span className="notification-badge">2</span>
          </button>

          {/* Botão Rápido: Novo Cliente (Hierarquia Secundária) */}
          <button className="btn-secondary">
            <UserPlus size={17} />
            Novo Cliente
          </button>

          {/* Botão Rápido: Nova Proposta (Hierarquia Primária) */}
          <button className="btn-primary">
            <Plus size={17} />
            Nova Proposta
          </button>
        </div>
      </header>

      {/* ================= CONTEÚDO PRINCIPAL (100% DA TELA) ================= */}
      <main className="main-content">
        {/* Barra de Controle Mensal */}
        <section className="top-control-bar">
          <div className="month-selector">
            <CalendarIcon size={20} color="#1E3A8A" />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              Período de Análise:
            </span>
            <select
              className="month-select-input"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedWeekIndex(0);
              }}
            >
              {AVAILABLE_MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: "0.85rem", color: "#475569" }}>
            Exibindo indicadores, rateio de setores e agenda de{" "}
            <strong>{currentMonthMeta.label}</strong>
          </div>
        </section>

        {/* Cards de KPIs do Mês Selecionado */}
        <section className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span>Receita Fechada ({currentMonthMeta.label})</span>
              <DollarSign size={18} color="#2563EB" />
            </div>
            <div className="kpi-value">{formatCurrency(confirmedRevenue)}</div>
            <div className="kpi-footer">
              {confirmedMonthEvents.length} evento(s) Confirmado(s) /
              Realizado(s)
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span>Em Negociação no Mês</span>
              <TrendingUp size={18} color="#D97706" />
            </div>
            <div className="kpi-value">
              {formatCurrency(negotiatingRevenue)}
            </div>
            <div className="kpi-footer">
              Propostas aguardando resposta no prazo
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span>Conversão do Mês</span>
              <UserCheck size={18} color="#15803D" />
            </div>
            <div className="kpi-value">{conversionRate}%</div>
            <div className="kpi-footer">
              {confirmedMonthEvents.length} fechados de {monthEvents.length}{" "}
              propostas no mês
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span>Cancelados no Mês</span>
              <XCircle size={18} color="#B91C1C" />
            </div>
            <div className="kpi-value">{canceledMonthEvents.length}</div>
            <div className="kpi-footer">
              {canceledMonthEvents[0]?.refusalReason ||
                "Nenhum cancelamento no período"}
            </div>
          </div>
        </section>

        {/* Grid Meio: Receita por Setor (Mensal) + Calendário (Show Month / Show Week) */}
        <section className="middle-grid">
          {/* Coluna Esquerda: Rateio por Setor do Mês */}
          <div className="section-card">
            <h2 className="section-title">Receita Mensal por Setor</h2>
            <p className="section-subtitle">
              Quanto cada centro de custo gerou em {currentMonthMeta.label}
            </p>

            <div className="sector-list">
              {[
                {
                  label: "Sala de Evento (Locação)",
                  val: sectorTotals.eventRoom,
                },
                { label: "Hospedagem", val: sectorTotals.lodging },
                { label: "Alimentação (A&B)", val: sectorTotals.food },
                { label: "Coffee Break", val: sectorTotals.coffeeBreak },
                { label: "Estacionamento", val: sectorTotals.parking },
              ].map((sector) => {
                const pct =
                  confirmedRevenue > 0
                    ? Math.round((sector.val / confirmedRevenue) * 100)
                    : 0;
                return (
                  <div className="sector-item" key={sector.label}>
                    <div className="sector-info">
                      <span>{sector.label}</span>
                      <span>
                        {formatCurrency(sector.val)} ({pct}%)
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coluna Direita: Calendário Integrado com Toggle Show Month / Show Week */}
          <div className="section-card">
            <div className="calendar-top-bar">
              <div>
                <h2 className="section-title">
                  Agenda de Eventos &amp; Vencimentos
                </h2>
                <p className="section-subtitle" style={{ marginBottom: 0 }}>
                  Eventos confirmados, deadlines de propostas e limites de
                  pagamento
                </p>
              </div>

              <div className="calendar-controls">
                {calendarView === "week" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <button
                      className="filter-chip"
                      disabled={selectedWeekIndex === 0}
                      onClick={() =>
                        setSelectedWeekIndex((prev) => Math.max(0, prev - 1))
                      }
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                      Semana {selectedWeekIndex + 1}/{totalWeeks}
                    </span>
                    <button
                      className="filter-chip"
                      disabled={selectedWeekIndex >= totalWeeks - 1}
                      onClick={() =>
                        setSelectedWeekIndex((prev) =>
                          Math.min(totalWeeks - 1, prev + 1),
                        )
                      }
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}

                <div className="view-toggle">
                  <button
                    className={`toggle-btn ${calendarView === "month" ? "active" : ""}`}
                    onClick={() => setCalendarView("month")}
                  >
                    Show Month
                  </button>
                  <button
                    className={`toggle-btn ${calendarView === "week" ? "active" : ""}`}
                    onClick={() => setCalendarView("week")}
                  >
                    Show Week
                  </button>
                </div>
              </div>
            </div>

            <div className="calendar-weekdays">
              <span>Dom</span>
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
            </div>

            <div className="calendar-grid">
              {visibleCells.map((cell, idx) => {
                if (!cell.day || !cell.dateStr) {
                  return (
                    <div key={`empty-${idx}`} className="calendar-cell empty" />
                  );
                }

                // Busca eventos confirmados/realizados nesta data
                const dayConfirmedEvents = events.filter(
                  (e) =>
                    e.eventDate === cell.dateStr &&
                    (e.status === "Confirmado" || e.status === "Realizado"),
                );

                // Busca deadlines de propostas em aberto nesta data
                const dayProposalDeadlines = events.filter(
                  (e) =>
                    e.proposalDeadline === cell.dateStr &&
                    e.status === "Em Negociação",
                );

                // Busca datas limites de pagamento de eventos confirmados (ainda não 100% pagos)
                const dayPaymentDeadlines = events.filter(
                  (e) =>
                    e.paymentDeadline === cell.dateStr &&
                    e.status === "Confirmado" &&
                    e.amountPaid < e.totalValue,
                );

                return (
                  <div
                    key={cell.dateStr}
                    className={`calendar-cell ${calendarView === "week" ? "week-mode" : ""}`}
                  >
                    <span className="calendar-day-number">{cell.day}</span>

                    {dayConfirmedEvents.map((ev) => (
                      <div
                        key={`ev-${ev.id}`}
                        className="cal-pill pill-event"
                        title={`Evento: ${ev.companyName} (${ev.roomName})`}
                      >
                        📅 {ev.companyName}
                      </div>
                    ))}

                    {dayProposalDeadlines.map((ev) => (
                      <div
                        key={`dl-${ev.id}`}
                        className="cal-pill pill-deadline"
                        title={`Deadline Proposta: ${ev.companyName}`}
                      >
                        ⏳ Prop: {ev.companyName}
                      </div>
                    ))}

                    {dayPaymentDeadlines.map((ev) => (
                      <div
                        key={`pay-${ev.id}`}
                        className="cal-pill pill-payment"
                        title={`Limite Pagamento: ${ev.companyName}`}
                      >
                        💲 Pagto: {ev.companyName}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="calendar-legend">
              <div className="legend-item">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: "#2563EB" }}
                />
                <span>Dia do Evento (Confirmado/Realizado)</span>
              </div>
              <div className="legend-item">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: "#D97706" }}
                />
                <span>Deadline de Proposta</span>
              </div>
              <div className="legend-item">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: "#16A34A" }}
                />
                <span>Limite para Quitação de Pagamento</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tabela de Fluxo Comercial do Mês */}
        <section className="section-card">
          <div className="table-header-bar">
            <div>
              <h2 className="section-title">
                Propostas e Eventos de {currentMonthMeta.label}
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Controle de status, percentual pago e motivos de cancelamento
              </p>
            </div>

            <div className="filter-group">
              {[
                "Todos",
                "Em Negociação",
                "Confirmado",
                "Realizado",
                "Recusado",
                "Cancelado",
              ].map((status) => (
                <button
                  key={status}
                  className={`filter-chip ${statusFilter === status ? "active" : ""}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="crm-table-wrapper">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Cliente / Empresa</th>
                  <th>Origem &amp; 1º Contato</th>
                  <th>Sala &amp; Data Evento</th>
                  <th>Deadline Proposta</th>
                  <th>Status</th>
                  <th>Valor Total</th>
                  <th>Pagamento (%)</th>
                  <th>Motivo Cancelamento / Feedback</th>
                </tr>
              </thead>
              <tbody>
                {filteredTableEvents.map((item) => {
                  const payPct = calculatePaymentPercentage(
                    item.amountPaid,
                    item.totalValue,
                  );

                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>
                          {item.companyName}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#64748B" }}>
                          {item.clientName}{" "}
                          {item.isReturningClient && "• (Retorno)"}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.origin}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                          Contato: {item.contactDate}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.roomName}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                          Evento: {item.eventDate}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {item.proposalDeadline}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                          Enviada: {item.proposalSentDate}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge-status ${
                            item.status === "Confirmado" ||
                            item.status === "Realizado"
                              ? "badge-success"
                              : item.status === "Em Negociação"
                                ? "badge-warning"
                                : "badge-danger"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {formatCurrency(item.totalValue)}
                      </td>
                      <td>
                        {item.status === "Cancelado" ||
                        item.status === "Recusado" ? (
                          <span style={{ color: "#94A3B8" }}>—</span>
                        ) : (
                          <div>
                            <span
                              className={`badge-status ${
                                payPct === 100
                                  ? "badge-success"
                                  : payPct > 0
                                    ? "badge-warning"
                                    : "badge-neutral"
                              }`}
                            >
                              {payPct}% Pago
                            </span>
                            <div
                              style={{
                                fontSize: "0.72rem",
                                color: "#64748B",
                                marginTop: "2px",
                              }}
                            >
                              {formatCurrency(item.amountPaid)}
                            </div>
                          </div>
                        )}
                      </td>
                      <td style={{ maxWidth: "280px", fontSize: "0.78rem" }}>
                        {item.status === "Cancelado" ||
                        item.status === "Recusado" ? (
                          <div>
                            <strong style={{ color: "#B91C1C" }}>
                              {item.refusalReason}
                            </strong>
                            <div style={{ color: "#64748B" }}>
                              {item.feedback}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: "#64748B" }}>
                            {item.paymentDeadline
                              ? `Limite quitação: ${item.paymentDeadline}`
                              : "Aguardando definição"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="crm-footer">
        <div>
          <strong>myCRM v0.2.0</strong> — Gestão de Eventos, Salas e Centros de
          Custo
        </div>
        <div>
          Visualização em Tela Cheia (Full-Width) • Filtro Mensal Ativo (
          {currentMonthMeta.label})
        </div>
      </footer>
    </div>
  );
}

export default App;
