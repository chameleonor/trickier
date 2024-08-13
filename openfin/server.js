const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

app.get("/dos", (req, res) => {
  res.json({
    desktopSettings: {
      securedAPIDefaultPermission: "allow",
      lrsUrl: "http://localhost:3000/services",
      cleanUnusedRuntimes: true,
      unusedRuntimeExpirationInMinutes: 43200,
      enableDesktopShortcut: true,
      enableStartMenuShortcut: true,
      enableStartupShortcut: true,
      disableShortcutCreation: false,
      network: {
        readTimeout: 30000,
        sendTimeout: 30000,
        receiveTimeout: 30000,
        connectTimeout: 30000,
      },
      applicationLogging: {
        maxAppLogFileSizeMB: 10000,
        maxAppLogFiles: 10,
      },
    },
  });
});

// Rota para receber registros de licença do OpenFin
app.post("/services/licensing", (req, res) => {
  const licenseData = req.body; // Dados da licença enviados no corpo da requisição
  console.log("Registro de Licença Recebido:", licenseData);

  // Aqui você pode adicionar lógica para validar ou armazenar a licença, por exemplo

  //   res.send("Licença registrada com sucesso! https://dl.openfin.co/");
});

app.get("/openfin-app", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "openfin-app.html"));
});

app.get("/analyser", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "analyser.html"));
});

app.get("/manifest.json", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "manifest.json"));
});

app.get("/fallback.json", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "fallback.json"));
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/runscript", (req, res) => {
  const scriptPath = path.join(__dirname, "public", "health_check.ps1"); // Caminho para o arquivo PowerShell

  // Envia o arquivo PowerShell para download
  res.download(scriptPath, (err) => {
    if (err) {
      console.error(`Erro ao enviar o arquivo: ${err.message}`);
      res.status(500).send(`Erro ao enviar o arquivo: ${err.message}`);
    } else {
      console.log(`Arquivo enviado com sucesso: ${scriptPath}`);
    }
  });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor executando em http://localhost:${port}`);
});
