document.addEventListener('DOMContentLoaded', () => {
  const botoes = document.querySelectorAll('.icone-div[data-section]');
  const secoes = document.querySelectorAll('main section');

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      botoes.forEach(b => b.classList.remove('selecionado'));
      secoes.forEach(s => s.classList.remove('ativo'));

      botao.classList.add('selecionado');
      const idSecao = botao.getAttribute('data-section');
      document.getElementById(idSecao).classList.add('ativo');
    });
  });


  document.getElementById('sair').addEventListener('click', () => {
    const alerta = document.getElementById('alerta-desconectado');
    alerta.style.display = 'block';

    setTimeout(() => {
      alerta.style.display = 'none';
      window.location.href = 'http://127.0.0.1:5500/SiteEscola/TelaLogin.html';
    }, 3000);
  });


    const calendario = document.querySelector("#calendario");
    const nomeMes = document.querySelector("#nome-mes");
    const dias = document.querySelector(".dias");
    const diaSelecionadoSpan = document.querySelector("#dia-selecionado");
    const listaEventos = document.querySelector("#lista-eventos");
    const mostrarAdicionarEventoBtn = document.querySelector("#mostrar-adicionar-evento-btn");
    const modalEvento = document.getElementById('modalEvento')
    const adicionarEventoContainer = document.querySelector("#adicionar-evento-container");
    const novoEventoTexto = document.querySelector("#novo-evento-inline-texto");
    const adicionarEventoBtn = document.querySelector("#adicionar-evento-inline-btn");
    const avisoErro = document.querySelector("#aviso-erro");
    const mesLeft = document.querySelector("#mes-left");
    const mesRight = document.querySelector("#mes-right");

    let dataAtual = new Date();
    let mesAtual = dataAtual.getMonth();
    let anoAtual = dataAtual.getFullYear();
    let diaSelecionadoCalendario = null; 

    let eventosCalendarioModal = JSON.parse(localStorage.getItem("eventosCalendario")) || {};

    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril",
      "Maio", "Junho", "Julho", "Agosto",
      "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    function atualizarCalendario(mes, ano) {
      nomeMes.textContent = meses[mes] + " " + ano;
      dias.innerHTML = "";
      const primeiroDia = new Date(ano, mes, 1);
      const ultimoDia = new Date(ano, mes + 1, 0);
      const primeiroDiaSemana = primeiroDia.getDay();

      let offset = primeiroDiaSemana; 
      for (let i = 0; i < offset; i++) {
        const diaVazio = document.createElement("div");
        diaVazio.classList.add("dia");
        diaVazio.style.visibility = "hidden"; 
        dias.appendChild(diaVazio);
      }

      for (let i = 1; i <= ultimoDia.getDate(); i++) {
        const diaElemento = document.createElement("div");
        diaElemento.classList.add("dia");
        diaElemento.textContent = i;

        const dataFormatada = formatarDataParaStorageModal(ano, mes + 1, i);

        const isHoje = ano === dataAtual.getFullYear() && mes === dataAtual.getMonth() && i === dataAtual.getDate();
if (isHoje) {
  diaElemento.classList.add("atual");
}

if (eventosCalendarioModal[dataFormatada] && eventosCalendarioModal[dataFormatada].length > 0) {
  diaElemento.classList.add("tem-evento");
  if (isHoje) {
    diaElemento.classList.add("atual-com-evento"); 
  } else {
    diaElemento.style.backgroundColor = "#fff59d"; 
    diaElemento.style.color = "#000";
  }
}

        if (diaSelecionadoCalendario === i && mes === dataAtual.getMonth() && ano === dataAtual.getFullYear()) {
          diaElemento.classList.add("selecionado");
        }


        diaElemento.addEventListener("click", () => {
          diaSelecionadoCalendario = i;
          const dataMostrar = formatarDataParaStorageModal(ano, mes + 1, diaSelecionadoCalendario);
          mostrarEventosDoDiaModal(dataMostrar, i); 
          mostrarAdicionarEventoBtn.style.display = "inline-block";
          atualizarCalendario(mes, ano);
        });

        dias.appendChild(diaElemento);
      }
    }

    function mostrarEventosDoDiaModal(data, dia) {
      const listaEventosModal = document.getElementById("lista-eventos");
      const diaSelecionadoSpanElement = document.getElementById("dia-selecionado");
      listaEventosModal.innerHTML = "";

      if (dia) {
        diaSelecionadoSpanElement.textContent = `${dia}/${mesAtual + 1}/${anoAtual}`;
      } else {
        diaSelecionadoSpanElement.textContent = "";
      }

      const eventosSalvos = JSON.parse(localStorage.getItem("eventosCalendario")) || {};
function salvarEventos() {
  localStorage.setItem('eventosCalendario', JSON.stringify(eventos));
}
      if (eventosSalvos[data] && eventosSalvos[data].length > 0) {
        eventosSalvos[data].forEach((evento, idx) => {
          const li = document.createElement("li");
          const spanEvento = document.createElement("span");
          spanEvento.textContent = `${evento.titulo} (${evento.tipo}): ${evento.descricao}`;
          li.appendChild(spanEvento);

          const editarBtn = document.createElement("button");
          editarBtn.innerHTML = `<i class="bi bi-pencil-square"></i>`;
          editarBtn.style.marginLeft = "10px";
          editarBtn.style.background = "transparent";
          editarBtn.style.border = "none";
          editarBtn.style.color = "#ffeb39";
          editarBtn.style.cursor = "pointer";
          editarBtn.title = "Editar evento";
          editarBtn.addEventListener("click", () => {
            const novoTexto = prompt("Editar evento:", `${evento.titulo} (${evento.tipo}): ${evento.descricao}`);
            if (novoTexto && novoTexto.trim()) {
              const partes = novoTexto.split(':');
              const tituloTipo = partes[0].trim().split('(');
              const novoTitulo = tituloTipo[0].trim();
              const novoTipo = tituloTipo[1] ? tituloTipo[1].replace(')', '').trim() : evento.tipo;
              const novaDescricao = partes[1] ? partes[1].trim() : evento.descricao;

              eventosCalendarioModal[data][idx] = { titulo: novoTitulo, tipo: novoTipo, descricao: novaDescricao };
              salvarEventosModal();
              mostrarEventosDoDiaModal(data, dia);
              atualizarCalendario(mesAtual, anoAtual);
            }
          });
          li.appendChild(editarBtn);

          const excluirBtn = document.createElement("button");
          excluirBtn.textContent = "❌";
          excluirBtn.style.marginLeft = "10px";
          excluirBtn.style.background = "transparent";
          excluirBtn.style.border = "none";
          excluirBtn.style.cursor = "pointer";
          excluirBtn.style.color = "#ffeb39";
          excluirBtn.title = "Excluir evento";
          excluirBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            eventosCalendarioModal[data].splice(idx, 1);
            if (eventosCalendarioModal[data].length === 0) {
              delete eventosCalendarioModal[data];
            }
            salvarEventosModal();
            mostrarEventosDoDiaModal(data, dia);
            atualizarCalendario(mesAtual, anoAtual);
          });
          li.appendChild(excluirBtn);

          listaEventosModal.appendChild(li);
        });
      } else {
        const li = document.createElement("li");
        li.textContent = "Nenhum evento para este dia.";
        listaEventosModal.appendChild(li);
      }
    }

    function salvarEventosModal() {
      localStorage.setItem("eventosCalendario", JSON.stringify(eventosCalendarioModal));
    }

    function atualizarMarcadoresModal() {
      const diasElementos = document.querySelectorAll(".dia");
      const eventosSalvos = JSON.parse(localStorage.getItem("eventosCalendario")) || {};
      const anoCalendario = new Date(anoAtual, mesAtual).getFullYear();
      const mesCalendario = new Date(anoAtual, mesAtual).getMonth() + 1;

      diasElementos.forEach(diaElemento => {
        const dia = parseInt(diaElemento.textContent);
        if (!isNaN(dia)) {
          const dataFormatada = formatarDataParaStorageModal(anoCalendario, mesCalendario, dia);
          if (eventosSalvos[dataFormatada] && eventosSalvos[dataFormatada].length > 0) {
            diaElemento.classList.add("tem-evento");
          } else {
            diaElemento.classList.remove("tem-evento");
          }
        }
      });
    }

    function formatarDataParaStorageModal(ano, mes, dia) {
      const mesStr = mes < 10 ? '0' + mes : mes;
      const diaStr = dia < 10 ? '0' + dia : dia;
      return `${ano}-${mesStr}-${diaStr}`;
    }

    const modal = document.getElementById("modalEvento");
    const abrirBtn = document.getElementById("mostrar-adicionar-evento-btn");
    const fecharBtnModalElement = document.querySelector(".fechar-modal");
    const cancelarBtnModalElement = document.querySelector(".cancelar");
    const salvarBtnModalElement = document.querySelector(".salvar"); 

    if (abrirBtn) {
      abrirBtn.addEventListener("click", () => {
        modal.style.display = "flex";

        if (diaSelecionadoCalendario !== null) {
          const mesFormato = (mesAtual + 1) < 10 ? '0' + (mesAtual + 1) : (mesAtual + 1);
          const diaFormato = diaSelecionadoCalendario < 10 ? '0' + diaSelecionadoCalendario : diaSelecionadoCalendario;
          document.getElementById("dataEvento").value = `${anoAtual}-${mesFormato}-${diaFormato}`;
        }
      });
    }

    if (fecharBtnModalElement) {
      fecharBtnModalElement.addEventListener("click", () => modal.style.display = "none");
    }

    if (cancelarBtnModalElement) {
      cancelarBtnModalElement.addEventListener("click", () => modal.style.display = "none");
    }

    if (modal) {
      window.addEventListener("click", e => {
        if (e.target === modal) modal.style.display = "none";
      });
    }

    if (salvarBtnModalElement) {
       salvarBtnModalElement.addEventListener("click", () => {
        const titulo = document.getElementById("titulo").value.trim();
        const dataEventoModalInput = document.getElementById("dataEvento").value; 
        const tipo = document.getElementById("tipo").value;
        const descricao = document.getElementById("descricao").value.trim();

        if (!titulo || !dataEventoModalInput || !descricao) {
          alert("Preencha todos os campos.");
          return;
        }

        const dataFormatadaModal = dataEventoModalInput;

        if (!eventosCalendarioModal[dataFormatadaModal]) {
          eventosCalendarioModal[dataFormatadaModal] = [];
        }

        eventosCalendarioModal[dataFormatadaModal].push({
          titulo: titulo,
          tipo: tipo,
          descricao: descricao
        });

        salvarEventosModal();
        atualizarMarcadoresModal();
        mostrarEventosDoDiaModal(dataFormatadaModal, new Date(dataEventoModalInput).getDate()); 
        atualizarCalendario(mesAtual, anoAtual);
        modal.style.display = "none";
      });
    } else {
      console.log('Botão "Salvar Modal" não encontrado.');
    }

    atualizarCalendario(mesAtual, anoAtual);
    const hojeFormatado = formatarDataParaStorageModal(anoAtual, mesAtual + 1, dataAtual.getDate());
    mostrarEventosDoDiaModal(hojeFormatado, dataAtual.getDate());
    mostrarAdicionarEventoBtn.style.display = "inline-block"; 
    const adicionarEventoContainerElement = document.getElementById("adicionar-evento-container");
    if (adicionarEventoContainerElement) {
        adicionarEventoContainerElement.style.display = "none"; 
    }

    atualizarMarcadoresModal();


    const diasContainer = document.querySelector(".dias");
    if (diasContainer) {
        diasContainer.addEventListener("click", (event) => {
            if (event.target.classList.contains("dia") && !event.target.classList.contains("hidden")) {
                const diaSelecionado = parseInt(event.target.textContent);
                if (!isNaN(diaSelecionado)) {
                    diaSelecionadoCalendario = diaSelecionado;
                    const dataMostrar = formatarDataParaStorageModal(anoAtual, mesAtual + 1, diaSelecionado);
                    mostrarEventosDoDiaModal(dataMostrar, diaSelecionado);
                    document.querySelectorAll('.dia').forEach(d => d.classList.remove('selecionado'));
                    event.target.classList.add('selecionado');
                }
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const nomeMesSpan = document.getElementById('nome-mes');
    const diasDiv = document.querySelector('.dias');
    const mesLeftBtn = document.getElementById('mes-left');
    const mesRightBtn = document.getElementById('mes-right');

    let dataAtual = new Date(); 
    let currentMonth = dataAtual.getMonth(); 
    let currentYear = dataAtual.getFullYear(); 

    const nomesDosMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    function renderCalendar() {
        diasDiv.innerHTML = '';

        nomeMesSpan.textContent = `${nomesDosMeses[currentMonth]} ${currentYear}`;

        const primeiroDiaMes = new Date(currentYear, currentMonth, 1).getDay();
        const ultimoDiaMes = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < primeiroDiaMes; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('dia', 'vazio'); 
            diasDiv.appendChild(emptyDiv);
        }

        // Adiciona os dias do mês
        for (let i = 1; i <= ultimoDiaMes; i++) {
            const diaDiv = document.createElement('div');
            diaDiv.classList.add('dia');
            diaDiv.textContent = i;

            if (i === dataAtual.getDate() && currentMonth === dataAtual.getMonth() && currentYear === dataAtual.getFullYear()) {
                diaDiv.classList.add('atual');
            }

            diaDiv.addEventListener('click', () => {
                document.querySelectorAll('.dia').forEach(d => d.classList.remove('selecionado'));
                diaDiv.classList.add('selecionado');
                document.getElementById('dia-selecionado').textContent = i;
                document.getElementById('adicionar-evento-container').style.display = 'block';
            });

            diasDiv.appendChild(diaDiv);
        }
    }

    mesLeftBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    mesRightBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
});
 const btnsTrimestre = document.querySelectorAll('.btn-trimestre');
    const materiasContainer = document.getElementById('materias-container');
    const detalhesMateriaView = document.getElementById('detalhes-materia-view');
    const detalhesMateriaConteudo = document.getElementById('detalhes-materia-conteudo');
    const btnVoltar = document.getElementById('btn-voltar');
    const detalhesTrimestreInfo = document.getElementById('detalhes-trimestre-info');

    const dadosDasNotas = {
      '1-tri': [
        {
          id: 'matematica',
          nome: 'Matemática',
          icon: 'bi-calculator',
          nota: 8.5,
          status: 'Aprovado',
          corCard: '#e8f5e9', 
          corStatus: '#2e7d32', 
          detalhes: {
            media: 8.2,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Prova: Parcial', conteudo: 'Equações, razão e proporção', nota: 7.5, peso: 4 },
              { tipo: 'Trabalho: Geometria', conteudo: 'Geometria plana', nota: 9.0, peso: 2 },
              { tipo: 'Atividade: Lista', conteudo: 'Operações com frações', nota: 10.0, peso: 1 },
              { tipo: 'Prova: Final', conteudo: 'Todo conteúdo do trimestre', nota: 8.0, peso: 3 },
            ]
          }
        },
        {
          id: 'portugues',
          nome: 'Português',
          icon: 'bi-book',
          nota: 7.2,
          status: 'Aprovado',
          corCard: '#e8f5e9',
          corStatus: '#2e7d32',
          detalhes: {
            media: 7.2,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Trabalho: Redação', conteudo: 'Texto dissertativo-argumentativo', nota: 7.0, peso: 3 },
              { tipo: 'Prova: Gramática', conteudo: 'Concordância verbal e nominal', nota: 7.5, peso: 2 },
              { tipo: 'Atividade: Leitura', conteudo: 'Contos brasileiros', nota: 7.0, peso: 1 },
            ]
          }
        },
        {
          id: 'historia',
          nome: 'História',
          icon: 'bi-hourglass-split',
          nota: 6.8,
          status: 'Recuperação',
          corCard: '#fffde7', 
          corStatus: '#f9a825', 
          detalhes: {
            media: 6.8,
            status: 'Recuperação',
            avaliacoes: [
              { tipo: 'Prova: Clássica', conteudo: 'Grécia e Roma', nota: 6.5, peso: 3 },
              { tipo: 'Trabalho: Pesquisa', conteudo: 'Império Romano', nota: 7.0, peso: 2 },
              { tipo: 'Atividade: Debates', conteudo: 'Direitos Humanos', nota: 7.0, peso: 1 },
            ]
          }
        },
        {
          id: 'geografia',
          nome: 'Geografia',
          icon: 'bi-geo-alt',
          nota: 9.0,
          status: 'Aprovado',
          corCard: '#e8f5e9',
          corStatus: '#2e7d32',
          detalhes: {
            media: 9.0,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Prova: Clima e Vegetação', conteudo: 'Biomas brasileiros', nota: 9.0, peso: 4 },
              { tipo: 'Trabalho: Cartografia', conteudo: 'Leitura de mapas', nota: 9.5, peso: 2 },
            ]
          }
        },
        {
          id: 'ciencias',
          nome: 'Ciências',
          icon: 'bi-lightbulb',
          nota: 7.5,
          status: 'Aprovado',
          corCard: '#e8f5e9',
          corStatus: '#2e7d32',
          detalhes: {
            media: 7.5,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Prova: Biologia Celular', conteudo: 'Mitocôndrias e Cloroplastos', nota: 7.5, peso: 3 },
              { tipo: 'Atividade: Experimento', conteudo: 'Reações químicas', nota: 8.0, peso: 2 },
            ]
          }
        },
        {
          id: 'educacao-fisica',
          nome: 'Educação Física',
          icon: 'bi-award',
          nota: 10.0,
          status: 'Aprovado',
          corCard: '#e8f5e9',
          corStatus: '#2e7d32',
          detalhes: {
            media: 10.0,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Avaliação Prática', conteudo: 'Desempenho em atividades', nota: 10.0, peso: 5 },
              { tipo: 'Trabalho: Regras', conteudo: 'Olimpíadas', nota: 10.0, peso: 2 },
            ]
          }
        },
        {
          id: 'artes',
          nome: 'Artes',
          icon: 'bi-palette',
          nota: 8.0,
          status: 'Aprovado',
          corCard: '#e8f5e9',
          corStatus: '#2e7d32',
          detalhes: {
            media: 8.0,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Trabalho: Desenho', conteudo: 'Desenho livre', nota: 8.0, peso: 4 },
              { tipo: 'Atividade: Apreciação', conteudo: 'Movimentos artísticos', nota: 8.0, peso: 2 },
            ]
          }
        },
        {
          id: 'ingles',
          nome: 'Inglês',
          icon: 'bi-translate',
          nota: 7.0,
          status: 'Aprovado',
          corCard: '#e8f5e9',
          corStatus: '#2e7d32',
          detalhes: {
            media: 7.0,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Prova: Gramática', conteudo: 'Verbos irregulares', nota: 7.0, peso: 3 },
              { tipo: 'Atividade: Conversação', conteudo: 'Diálogos simples', nota: 7.0, peso: 2 },
            ]
          }
        },
      ],
      '2-tri': [
        {
          id: 'matematica',
          nome: 'Matemática',
          icon: 'bi-calculator',
          nota: 7.8,
          status: 'Aprovado',
          corCard: '#e8f5e9',
          corStatus: '#2e7d32',
          detalhes: {
            media: 7.8,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Prova: Álgebra', conteudo: 'Sistemas de equações', nota: 7.5, peso: 4 },
              { tipo: 'Trabalho: Geometria Espacial', conteudo: 'Cálculo de volume', nota: 8.0, peso: 3 },
            ]
          }
        },
        {
          id: 'portugues',
          nome: 'Português',
          icon: 'bi-book',
          nota: 6.5,
          status: 'Recuperação',
          corCard: '#fffde7',
          corStatus: '#f9a825',
          detalhes: {
            media: 6.5,
            status: 'Recuperação',
            avaliacoes: [
              { tipo: 'Prova: Interpretação', conteudo: 'Poesias', nota: 6.0, peso: 3 },
              { tipo: 'Trabalho: Análise Literária', conteudo: 'Romantismo', nota: 7.0, peso: 2 },
            ]
          }
        },
        {
          id: 'historia',
          nome: 'História',
          icon: 'bi-hourglass-split',
          nota: 7.0,
          status: 'Aprovado',
          corCard: '#e8f5e9',
          corStatus: '#2e7d32',
          detalhes: {
            media: 7.0,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Prova: Idade Média', conteudo: 'Feudalismo e Cruzadas', nota: 7.0, peso: 4 },
              { tipo: 'Atividade: Documentário', conteudo: 'Revolução Francesa', nota: 7.0, peso: 2 },
            ]
          }
        },
        {
          id: 'geografia',
          nome: 'Geografia',
          icon: 'bi-geo-alt',
          nota: 8.2,
          status: 'Aprovado',
          corCard: '#e8f5e9',
          corStatus: '#2e7d32',
          detalhes: {
            media: 8.2,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Prova: Hidrografia', conteudo: 'Bacias hidrográficas', nota: 8.0, peso: 4 },
              { tipo: 'Trabalho: Globalização', conteudo: 'Impactos no mundo', nota: 8.5, peso: 2 },
            ]
          }
        },
        {
          id: 'ciencias',
          nome: 'Ciências',
          icon: 'bi-lightbulb',
          nota: 8.0,
          status: 'Aprovado',
          corCard: '#e8f5e9',
          corStatus: '#2e7d32',
          detalhes: {
            media: 8.0,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Prova: Sistema Circulatório', conteudo: 'Coração e vasos', nota: 8.0, peso: 3 },
              { tipo: 'Atividade: Ciclo da Água', conteudo: 'Evaporação e condensação', nota: 8.0, peso: 2 },
            ]
          }
        },
        {
          id: 'educacao-fisica',
          nome: 'Educação Física',
          icon: 'bi-award',
          nota: 9.5,
          status: 'Aprovado',
          corCard: '#e8f5e9',
          corStatus: '#2e7d32',
          detalhes: {
            media: 9.5,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Avaliação Prática', conteudo: 'Jogos e esportes', nota: 9.5, peso: 5 },
              { tipo: 'Trabalho: Regras', conteudo: 'Olimpíadas', nota: 9.5, peso: 2 },
            ]
          }
        },
        {
          id: 'artes',
          nome: 'Artes',
          icon: 'bi-palette',
          nota: 7.5,
          status: 'Aprovado',
          corCard: '#e8f5e9',
          corStatus: '#2e7d32',
          detalhes: {
            media: 7.5,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Trabalho: Escultura', conteudo: 'Modelagem com argila', nota: 7.5, peso: 4 },
              { tipo: 'Atividade: Música', conteudo: 'Ritmo e Melodia', nota: 7.5, peso: 2 },
            ]
          }
        },
        {
          id: 'ingles',
          nome: 'Inglês',
          icon: 'bi-translate',
          nota: 8.0,
          status: 'Aprovado',
          corCard: '#e8f5e9',
          corStatus: '#2e7d32',
          detalhes: {
            media: 8.0,
            status: 'Aprovado',
            avaliacoes: [
              { tipo: 'Prova: Compreensão Oral', conteudo: 'Diálogo em inglês', nota: 8.0, peso: 3 },
              { tipo: 'Atividade: Escrita', conteudo: 'Carta para um amigo', nota: 8.0, peso: 2 },
            ]
          }
        },
      ],
      '3-tri': [
        {
          id: 'matematica',
          nome: 'Matemática',
          icon: 'bi-calculator',
          nota: '-',
          status: 'Não Lançado',
          corCard: '#f0f0f0', 
          corStatus: '#757575', 
          detalhes: {
            media: '-',
            status: 'Não Lançado',
            avaliacoes: [
              { tipo: 'Aguardando Lançamento', conteudo: 'Em breve...', nota: '-', peso: '-' },
            ]
          }
        },
        {
          id: 'portugues',
          nome: 'Português',
          icon: 'bi-book',
          nota: '-',
          status: 'Não Lançado',
          corCard: '#f0f0f0',
          corStatus: '#757575',
          detalhes: {
            media: '-',
            status: 'Não Lançado',
            avaliacoes: [
              { tipo: 'Aguardando Lançamento', conteudo: 'Em breve...', nota: '-', peso: '-' },
            ]
          }
        },
        {
          id: 'historia',
          nome: 'História',
          icon: 'bi-hourglass-split',
          nota: '-',
          status: 'Não Lançado',
          corCard: '#f0f0f0',
          corStatus: '#757575',
          detalhes: {
            media: '-',
            status: 'Não Lançado',
            avaliacoes: [
              { tipo: 'Aguardando Lançamento', conteudo: 'Em breve...', nota: '-', peso: '-' },
            ]
          }
        },
        {
          id: 'geografia',
          nome: 'Geografia',
          icon: 'bi-geo-alt',
          nota: '-',
          status: 'Não Lançado',
          corCard: '#f0f0f0',
          corStatus: '#757575',
          detalhes: {
            media: '-',
            status: 'Não Lançado',
            avaliacoes: [
              { tipo: 'Aguardando Lançamento', conteudo: 'Em breve...', nota: '-', peso: '-' },
            ]
          }
        },
        {
          id: 'ciencias',
          nome: 'Ciências',
          icon: 'bi-lightbulb',
          nota: '-',
          status: 'Não Lançado',
          corCard: '#f0f0f0',
          corStatus: '#757575',
          detalhes: {
            media: '-',
            status: 'Não Lançado',
            avaliacoes: [
              { tipo: 'Aguardando Lançamento', conteudo: 'Em breve...', nota: '-', peso: '-' },
            ]
          }
        },
        {
          id: 'educacao-fisica',
          nome: 'Educação Física',
          icon: 'bi-award',
          nota: '-',
          status: 'Não Lançado',
          corCard: '#f0f0f0',
          corStatus: '#757575',
          detalhes: {
            media: '-',
            status: 'Não Lançado',
            avaliacoes: [
              { tipo: 'Aguardando Lançamento', conteudo: 'Em breve...', nota: '-', peso: '-' },
            ]
          }
        },
        {
          id: 'artes',
          nome: 'Artes',
          icon: 'bi-palette',
          nota: '-',
          status: 'Não Lançado',
          corCard: '#f0f0f0',
          corStatus: '#757575',
          detalhes: {
            media: '-',
            status: 'Não Lançado',
            avaliacoes: [
              { tipo: 'Aguardando Lançamento', conteudo: 'Em breve...', nota: '-', peso: '-' },
            ]
          }
        },
        {
          id: 'ingles',
          nome: 'Inglês',
          icon: 'bi-translate',
          nota: '-',
          status: 'Não Lançado',
          corCard: '#f0f0f0',
          corStatus: '#757575',
          detalhes: {
            media: '-',
            status: 'Não Lançado',
            avaliacoes: [
              { tipo: 'Aguardando Lançamento', conteudo: 'Em breve...', nota: '-', peso: '-' },
            ]
          }
        },
      ]
    };

    let trimestreAtivo = '1-tri'; 

    function renderizarMaterias(trimestre) {
      materiasContainer.innerHTML = ''; 
      const materias = dadosDasNotas[trimestre];

      materias.forEach(materia => {
        const card = document.createElement('a'); 
        card.href = `#`; 
        card.classList.add('materia-card');
        card.style.backgroundColor = materia.corCard; 
        card.style.borderColor = materia.corCard; 

        card.innerHTML = `
          <div class="materia-card-header">
            <i class="bi ${materia.icon}"></i>
            <h3>${materia.nome}</h3>
          </div>
          <div class="materia-card-details">
            Média: ${materia.detalhes.media}
          </div>
          <div class="materia-card-footer">
            <span class="materia-card-nota" style="color: ${materia.corStatus};">${materia.nota}</span>
            <span class="materia-card-status" style="background-color: ${materia.corCard}; color: ${materia.corStatus};">${materia.status}</span>
          </div>
        `;
        card.addEventListener('click', (event) => {
          event.preventDefault(); 
          mostrarDetalhesMateria(materia, trimestre);
        });
        materiasContainer.appendChild(card);
      });
    }

    function mostrarDetalhesMateria(materia, trimestre) {
      materiasContainer.style.display = 'none'; 
      detalhesMateriaView.classList.add('ativo');
      document.querySelector('.select-tri').style.display = 'none'; 
      document.querySelector('.page-title').style.display = 'none'; 

      detalhesTrimestreInfo.textContent = `${trimestre.replace('-tri', ' Trimestre').replace('1', '1º').replace('2', '2º').replace('3', '3º')}`;

      let avaliacoesHtml = '';
      materia.detalhes.avaliacoes.forEach(avaliacao => {
        avaliacoesHtml += `
          <div class="avaliacao-item">
            <div class="avaliacao-info">
              <h4>${avaliacao.tipo}</h4>
              <p>Conteúdo: ${avaliacao.conteudo}</p>
            </div>
            <div class="avaliacao-nota-peso">
              <span class="avaliacao-nota" style="color: ${materia.corStatus};">${avaliacao.nota}</span>
              <span class="avaliacao-peso">Peso: ${avaliacao.peso}</span>
            </div>
          </div>
        `;
      });

      detalhesMateriaConteudo.innerHTML = `
        <div class="detalhes-materia-info">
          <h2><i class="bi ${materia.icon}"></i> ${materia.nome}</h2>
          <p>Média do Trimestre: <strong>${materia.detalhes.media}</strong></p>
          <span class="detalhes-materia-status" style="background-color: ${materia.corCard}; color: ${materia.corStatus};">
            ${materia.detalhes.status}
          </span>
        </div>
        <div class="avaliacoes-list">
          <h3>Avaliações</h3>
          ${avaliacoesHtml}
        </div>
      `;
    }

    function voltarParaMaterias() {
      materiasContainer.style.display = 'grid'; 
      detalhesMateriaView.classList.remove('ativo'); 
      document.querySelector('.select-tri').style.display = 'flex'; 
      document.querySelector('.page-title').style.display = 'block'; 
    }

    btnsTrimestre.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsTrimestre.forEach(b => b.classList.remove('selecionado'));
        btn.classList.add('selecionado');

        trimestreAtivo = btn.id.replace('btn-', ''); 
        renderizarMaterias(trimestreAtivo); 
      });
    });

    // Event Listener para o botão voltar
    btnVoltar.addEventListener('click', voltarParaMaterias);

    document.getElementById('btn-1-tri').click(); 

    function mostrarAlerta(mensagem, tipo) {
      const alerta = document.createElement("div");
      alerta.classList.add("alerta", tipo);
      alerta.innerHTML = `
        <span class="msg">${mensagem}</span>
        <i class="bi bi-x" onclick="fecharAlerta(this)"></i>
      `;

      document.getElementById("alert-container").appendChild(alerta);

      setTimeout(() => {
        alerta.classList.add("remover");
        setTimeout(() => alerta.remove(), 500); 
      }, 5000);
    }

    function fecharAlerta(icon) {
      const alerta = icon.parentElement;
      alerta.classList.add("remover");
      setTimeout(() => alerta.remove(), 500);
    }
    document.getElementById('sairDoSistema').addEventListener('click', () => {
            const alerta = document.getElementById('alerta-desconectado');


            alerta.style.display = 'flex'; 

            setTimeout(() => {
                alerta.style.display = 'none';
                window.location.href = 'http://127.0.0.1:5500/SiteEscola2.0.html/TelaLogin.html'; 
            }, 3000);
        });
        document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.icone-div');
    const sections = document.querySelectorAll('main section');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(nav => nav.classList.remove('selecionado'));
            this.classList.add('selecionado');

            const targetSectionId = this.dataset.section;

            sections.forEach(section => {
                if (section.id === targetSectionId) {
                    section.classList.add('ativo');
                    section.style.animation = 'none'; 
                    section.offsetHeight; 
                    section.style.animation = ''; 
                } else {
                    section.classList.remove('ativo');
                }
            });
        });
    });

   
    const sairDoSistemaBtn = document.getElementById('sairDoSistema');
    if (sairDoSistemaBtn) { 
        sairDoSistemaBtn.addEventListener('click', () => {
            const alerta = document.getElementById('alerta-desconectado');

            alerta.style.display = 'flex';

            setTimeout(() => {
                alerta.style.display = 'none';
                window.location.href = 'http://127.0.0.1:5500/SiteEscola/TelaLogin.html'; 
            }, 3000);
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    const avisos = document.querySelectorAll('.aviso-item');
    const avisosListContainer = document.querySelector('.avisos-list');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;

            avisos.forEach(aviso => {
                aviso.style.display = 'none'; 
            });
            if (category === 'todos') {
                avisos.forEach(aviso => {
                    aviso.style.display = 'block'; 
                });
            } else {
                avisos.forEach(aviso => {
                    if (aviso.classList.contains(category)) {
                        aviso.style.display = 'block'; 
                    }
                });
            }
        });
    });

    const btnCriarAviso = document.getElementById('btn-criar-aviso');
    const modalCriarAviso = document.getElementById('modalCriarAviso');
    const fecharModalAviso = document.querySelector('.fechar-modal-aviso');
    const cancelarAvisoBtn = document.querySelector('.modal-criar-aviso .cancelar-aviso');
    const salvarAvisoBtn = document.querySelector('.modal-criar-aviso .salvar-aviso');

    btnCriarAviso.addEventListener('click', () => {
        modalCriarAviso.style.display = 'flex'; 
    });

    fecharModalAviso.addEventListener('click', () => {
        modalCriarAviso.style.display = 'none'; 
    });

    cancelarAvisoBtn.addEventListener('click', () => {
        modalCriarAviso.style.display = 'none'; 
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target == modalCriarAviso) {
            modalCriarAviso.style.display = 'none';
        }
    });

    salvarAvisoBtn.addEventListener('click', () => {
        const titulo = document.getElementById('tituloAviso').value;
        const data = document.getElementById('dataAviso').value;
        const hora = document.getElementById('horaAviso').value;
        const categoria = document.getElementById('categoriaAviso').value;
        const descricao = document.getElementById('descricaoAviso').value;

        if (titulo && data && categoria && descricao) {
            const newAviso = document.createElement('div');
            newAviso.classList.add('aviso-item', categoria);

            let iconClass = '';
            if (categoria === 'evento') iconClass = 'bi-calendar-event';
            else if (categoria === 'informativo') iconClass = 'bi-info-circle';
            else if (categoria === 'academico') iconClass = 'bi-mortarboard';
            else if (categoria === 'urgente') iconClass = 'bi-exclamation-triangle';

            newAviso.innerHTML = `
                <div class="aviso-meta">
                    <i class="bi ${iconClass}"></i>
                    <span>${titulo}</span>
                    <span class="date">${new Date(data).toLocaleDateString('pt-BR')} ${hora}</span>
                </div>
                <p class="aviso-text">${descricao}</p>
            `;

            avisosListContainer.prepend(newAviso);

            document.getElementById('tituloAviso').value = '';
            document.getElementById('dataAviso').value = '';
            document.getElementById('horaAviso').value = '';
            document.getElementById('categoriaAviso').value = 'evento';
            document.getElementById('descricaoAviso').value = '';
            modalCriarAviso.style.display = 'none';

            document.querySelector('.filter-btn.active').click();

        } else {
            alert('Por favor, preencha todos os campos do aviso.');
        }
    });
});