import React from "react";
import DashboardModule from "./DashboardModule";
import RelatoriosModule from "./RelatoriosModule";
import PomodoroModule from "./PomodoroModule";

export class ModuloState {
  renderizar() {
    return null;
  }

  carregarDados() {
    return Promise.resolve();
  }
}

export class ModuloDashboard extends ModuloState {
  renderizar() {
    return <DashboardModule />;
  }

  async carregarDados() {
    console.log("Carregando dados do Dashboard...");
    return Promise.resolve();
  }
}

export class ModuloRelatorios extends ModuloState {
  renderizar() {
    return <RelatoriosModule />;
  }

  async carregarDados() {
    console.log("Carregando relatórios...");
    return Promise.resolve();
  }
}

export class ModuloPomodoro extends ModuloState {
  renderizar() {
    return <PomodoroModule />;
  }

  async carregarDados() {
    console.log("Carregando preferências do Pomodoro...");
    return Promise.resolve();
  }
}

export const modulosDisponiveis = [
  { id: "dashboard", label: "Dashboard", state: new ModuloDashboard() },
  { id: "relatorios", label: "Relatórios", state: new ModuloRelatorios() },
  { id: "pomodoro", label: "Pomodoro", state: new ModuloPomodoro() },
];
