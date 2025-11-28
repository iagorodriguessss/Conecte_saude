document.addEventListener("DOMContentLoaded", () => {
  const KEY = "hubSaude_trilhas";
  const qs = (s) => document.querySelector(s);

  const defaultTrilhas = [
    {
      id: 1,
      nome: "Atenção Primária à Saúde",
      descricao:
        "Aprenda os fundamentos e a importância da APS no sistema de saúde.",
      objetivo: "Dominar conceitos de APS",
      modulos: [
        "Introdução à APS",
        "Modelos de Atenção",
        "Equipe Multiprofissional",
      ],
    },
    {
      id: 2,
      nome: "Enfermagem no Cuidado Intensivo",
      descricao:
        "Desenvolva habilidades essenciais para o ambiente de terapia intensiva.",
      objetivo: "Atuar em UTIs com segurança",
      modulos: [
        "Monitorização Hemodinâmica",
        "Ventilação Mecânica",
        "Farmacologia Aplicada",
      ],
    },
    {
      id: 3,
      nome: "Fisioterapia Respiratória Pediátrica",
      descricao:
        "Técnicas e abordagens para o tratamento respiratório em crianças.",
      objetivo: "Aplicar técnicas em pediatria",
      modulos: [
        "Avaliação do Lactente",
        "Técnicas de Desobstrução",
        "Casos Clínicos",
      ],
    },
  ];

  const save = (v) => localStorage.setItem(KEY, JSON.stringify(v));
  const load = () => {
    const s = localStorage.getItem(KEY);
    return s ? JSON.parse(s) : null;
  };

  let trilhas = load();
  if (!trilhas) {
    trilhas = defaultTrilhas.slice();
    save(trilhas);
  }

  const listaTrilhasDiv = qs("#lista-trilhas");

  function carregarTrilhas() {
    if (!listaTrilhasDiv) return;
    listaTrilhasDiv.innerHTML = "";
    if (!trilhas || trilhas.length === 0) {
      listaTrilhasDiv.innerHTML = "<p>Nenhuma trilha cadastrada ainda.</p>";
      return;
    }
    trilhas.forEach((t) => {
      const card = document.createElement("div");
      card.className = "card-trilha";
      card.dataset.id = t.id;
      card.innerHTML = `\n        <h3>${t.nome}</h3>\n        <p>${t.descricao}</p>\n        <p><strong>Objetivo:</strong> ${t.objetivo}</p>\n        <div class="card-buttons">\n          <button class="btn-ver-trilha">Ver Trilha</button>\n          <button class="btn-excluir-trilha" data-id="${t.id}">Excluir</button>\n        </div>`;

      card.querySelector(".btn-ver-trilha").addEventListener("click", () => {
        alert(
          `Você selecionou a trilha: ${t.nome}. Em breve, uma página de detalhes será implementada!`
        );
      });

      card
        .querySelector(".btn-excluir-trilha")
        .addEventListener("click", (e) => {
          const id = Number(e.target.dataset.id);
          if (confirm(`Tem certeza que deseja excluir a trilha "${t.nome}"?`)) {
            excluirTrilha(id);
          }
        });

      listaTrilhasDiv.appendChild(card);
    });
  }

  function excluirTrilha(id) {
    trilhas = trilhas.filter((t) => t.id !== id);
    save(trilhas);
    carregarTrilhas();
    alert("Trilha excluída com sucesso!");
  }

  // Form
  const formCadastroTrilha = qs("#form-cadastro-trilha");
  if (formCadastroTrilha) {
    formCadastroTrilha.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = qs("#nome-trilha").value.trim();
      const descricao = qs("#descricao-trilha").value.trim();
      const objetivo = qs("#objetivo-trilha").value.trim();
      const modulos = qs("#modulos-trilha")
        .value.split(",")
        .map((m) => m.trim())
        .filter(Boolean);

      if (!nome || !objetivo)
        return alert(
          "Por favor, preencha pelo menos o nome e o objetivo da trilha."
        );
      if (trilhas.some((t) => t.nome.toLowerCase() === nome.toLowerCase()))
        return alert("Já existe uma trilha com este nome!");

      const nova = {
        id: trilhas.length ? Math.max(...trilhas.map((x) => x.id)) + 1 : 1,
        nome,
        descricao,
        objetivo,
        modulos,
      };
      trilhas.push(nova);
      save(trilhas);
      alert("Trilha cadastrada com sucesso!");
      formCadastroTrilha.reset();
      const trilhasSection = qs("#trilhas-disponiveis");
      if (trilhasSection)
        trilhasSection.scrollIntoView({ behavior: "smooth", block: "start" });
      carregarTrilhas();
    });
  }

  // Inicializa se necessário
  if (listaTrilhasDiv) carregarTrilhas();
});
