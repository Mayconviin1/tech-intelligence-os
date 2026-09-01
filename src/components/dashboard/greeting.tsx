function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

function getDateLabel(): string {
  const now = new Date();
  const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

export function Greeting() {
  return (
    <div className="mb-16">
      <p className="text-xs font-medium uppercase tracking-widest text-text-muted mb-3">
        {getDateLabel()}
      </p>
      <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
        {getGreeting()}, Maycon
      </h1>
      <p className="text-sm text-text-secondary">
        Veja o que está acontecendo no mundo da tecnologia.
      </p>
    </div>
  );
}
