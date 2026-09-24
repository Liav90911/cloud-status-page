const STATUS_CONFIG = {
  operational: { label: "Operational", badgeClass: "badge-operational", dotClass: "operational" },
  degraded: { label: "Degraded", badgeClass: "badge-degraded", dotClass: "degraded" },
  maintenance: { label: "Maintenance", badgeClass: "badge-maintenance", dotClass: "maintenance" },
  outage: { label: "Outage", badgeClass: "badge-outage", dotClass: "outage" },
};

async function fetchServices() {
  const response = await fetch("services.json");
  return response.json();
}

function createStatusCard(service) {
  const config = STATUS_CONFIG[service.status] || STATUS_CONFIG.operational;
  const card = document.createElement("div");
  card.className = "status-card";
  card.innerHTML = `
    <div class="status-card-header">
      <h3>${service.name}</h3>
      <span class="status-indicator ${config.dotClass}"></span>
    </div>
    <p>${service.description}</p>
    <div class="uptime">Uptime: ${service.uptime || "N/A"}</div>
    <div style="margin-top: 0.6rem;">
      <span class="status-badge ${config.badgeClass}">${config.label}</span>
    </div>
  `;
  return card;
}

function computeOverallStatus(services) {
  const statuses = services.map((s) => s.status);
  if (statuses.includes("outage")) return { text: "System Outage", badgeClass: "badge-outage" };
  if (statuses.includes("maintenance")) return { text: "Partial Maintenance", badgeClass: "badge-maintenance" };
  if (statuses.includes("degraded")) return { text: "Partial Degradation", badgeClass: "badge-degraded" };
  return { text: "All Systems Operational", badgeClass: "badge-operational" };
}

function updateTimestamp() {
  const now = new Date();
  document.getElementById("last-updated").textContent =
    "Last updated: " + now.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

async function render() {
  const grid = document.getElementById("status-grid");
  grid.innerHTML = '<div class="loading">Loading service statuses...</div>';

  const services = await fetchServices();
  grid.innerHTML = "";
  services.forEach((service) => {
    grid.appendChild(createStatusCard(service));
  });

  const overall = computeOverallStatus(services);
  const overallBadge = document.getElementById("overall-badge");
  overallBadge.textContent = overall.text;
  overallBadge.className = "overall-badge status-badge " + overall.badgeClass;

  updateTimestamp();
}

document.getElementById("refresh-btn").addEventListener("click", render);
render();
