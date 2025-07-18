// Função para montar a tabela com dados (array de objetos {name, link})
function montarTabela(dados) {
  const tbody = document.getElementById("qr-table-body");
  tbody.innerHTML = "";
  if (!dados || dados.length === 0) {
    document.getElementById("erro-msg").style.display = "block";
    return;
  } else {
    document.getElementById("erro-msg").style.display = "none";
  }
  dados.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>QR ${i + 1}</td><td><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.link}</a></td>`;
    tbody.appendChild(tr);
  });
}

// Converte dataURL em Image
function dataUrlToImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// Extrai ImageData do Image para leitura do QR
function getImageData(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// Escaneia os QRs das imagens/canvas passados, retorna array de {name, link}
async function scanQRCodes(imageEntries) {
  // Mapear cada imagem para uma Promise que tenta decodificar o QR
  const promises = imageEntries.map(async (entry) => {
    try {
      const img = await dataUrlToImage(entry.src);
      const imageData = getImageData(img);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code && code.data) {
        return { name: "", link: code.data };
      }
      return null;
    } catch {
      return null; // ignora erros
    }
  });

  const results = await Promise.all(promises);
  // Filtra resultados válidos (não nulos)
  return results.filter(r => r !== null);
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isFixed = urlParams.get("fixed") === "true";

  if (isFixed) {
    document.getElementById("btn-fixar-janela").style.display = "none";
    chrome.storage.local.get(["qrCodes"], (result) => {
      montarTabela(result.qrCodes || []);
    });
  } else {
    const btnFixar = document.getElementById("btn-fixar-janela");
    btnFixar.addEventListener("click", async () => {
      const rows = [];
      const trs = document.querySelectorAll("#qr-table-body tr");
      trs.forEach(tr => {
        const link = tr.querySelector("td:nth-child(2) a")?.href || "";
        if (link) rows.push({ name: "", link });
      });
      await chrome.storage.local.set({ qrCodes: rows });

      chrome.windows.create({
        url: chrome.runtime.getURL("index.html?fixed=true"),
        type: "popup",
        width: 600,
        height: 700
      });
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          function getElementPosition(el) {
            const rect = el.getBoundingClientRect();
            return { top: rect.top, left: rect.left };
          }
          const images = Array.from(document.images)
            .filter(img => img.complete && img.naturalWidth > 0)
            .map(img => ({
              src: img.src,
              ...getElementPosition(img)
            }));
          const canvases = Array.from(document.querySelectorAll("canvas"))
            .map(canvas => ({
              src: canvas.toDataURL("image/png"),
              ...getElementPosition(canvas)
            }));
          return images.concat(canvases).sort((a, b) => {
            if (Math.abs(a.top - b.top) > 20) return a.top - b.top;
            return a.left - b.left;
          });
        }
      }, async (results) => {
        const imageEntries = results[0]?.result || [];
        const qrCodes = await scanQRCodes(imageEntries);
        montarTabela(qrCodes);

        if (qrCodes.length === 0) {
          document.getElementById("erro-msg").style.display = "block";
        }
      });
    });
  }
});
