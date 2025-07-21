(function () {
  let painelInjetado = false;

  function urlEhPermitida() {
    return window.location.href.includes("/folha-rosto");
  }

  function injetarPainel() {
    if (document.getElementById("injected-panel")) return;

    const style = document.createElement("style");
    style.textContent = `
      .iframe {
        height: 120px;
        width: 0px;
        position: fixed;
        z-index: 9990;
        border-left: 10px solid #071D41;
        top: 40%;
        right: 5px;
        transition: width 0.6s ease;
        background-color: #f0f8ff;
        padding-left: 10px;
        overflow: hidden;
        display: flex;
      }
      .iframe-content {
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease 0.3s;
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        font-family: 'Lucida Sans', sans-serif;
      }
      .iframe.iframeClick, .iframe:hover {
        width: 135px;
      }
      .iframe.iframeClick .iframe-content, .iframe:hover .iframe-content {
        opacity: 1;
        visibility: visible;
      }
    `;
    document.head.appendChild(style);

    const container = document.createElement("div");
    container.className = "iframe";
    container.id = "injected-panel";
    container.innerHTML = `
      <div class="iframe-content">
        <span>Imprimir Folha de Rosto</span>
        <div id="downlaoad-icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#EA3323">
            <path d="M280-280h400v-60H280v60Zm197-126 158-157-42-42-85 84v-199h-60v199l-85-84-42 42 156 157Zm3 326q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/>
          </svg>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    container.addEventListener("click", (e) => {
      container.classList.toggle("iframeClick");
      e.stopPropagation();
    });

    document.getElementById("downlaoad-icon").addEventListener("click", (e) => {
      container.classList.toggle("downlaoad-icon");
      const url = window.location.href;
      const partes = url.split("/");
      const index = partes.indexOf("folha-rosto");
      const code = partes[index - 1];

      try {
        const headers = new Headers();
        if(url.includes("lista-atendimento")) {
          headers.append("medicalRecordId", code);
        } else {
          headers.append("citizenCode", code);
        }

        fetch("https://localhost:8080/citizen", {
          headers: headers,
          method: "GET",
        }).then((response) => {
          if (!response.ok) throw new Error("Erro ao buscar PDF");
            return response.blob();
          })
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = "folha_rosto.pdf";
          a.click();
        })
       
      } catch (error) {
        console.log(error);
      }

      e.stopPropagation();
    });

    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) {
        container.classList.remove("iframeClick");
      }
    });
  }

  function removerPainel() {
    const painel = document.getElementById("injected-panel");
    if (painel) painel.remove();
  }

  function verificarUrlPeriodicamente() {
    let urlAnterior = "";

    setInterval(() => {
      const urlAtual = window.location.href;
      if (urlAtual !== urlAnterior) {
        urlAnterior = urlAtual;

        if (urlEhPermitida()) {
          if (!painelInjetado) {
            injetarPainel();
            painelInjetado = true;
          }
        } else {
          if (painelInjetado) {
            removerPainel();
            painelInjetado = false;
          }
        }
      }
    }, 100);
  }

  verificarUrlPeriodicamente();
})();
