# Limpador de RAM 🚀

Um aplicativo desktop leve e eficiente criado com **Electron.js** e **Node.js** para realizar a limpeza da memória RAM (Standby List) no Windows. Este projeto possui uma interface gráfica fácil de usar que permite aos usuários otimizar o uso de memória do sistema rapidamente.

## 💻 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Electron.js](https://www.electronjs.org/)
- HTML / CSS / JavaScript (Frontend)

## 📦 Como Instalar e Rodar Localmente

Para rodar o projeto localmente na sua máquina, certifique-se de ter o Node.js instalado e siga os passos abaixo:

1. Clone este repositório (ou baixe a pasta):
   ```bash
   git clone https://github.com/ThierrySant0007/Memory-cache-cleaner.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd "Limpador de RAM"
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Inicie o aplicativo em modo de desenvolvimento:
   ```bash
   npm start
   ```

## 🛠️ Como Gerar o Instalador (.exe)

O projeto está configurado com o `electron-builder` para gerar um instalador para Windows. Para criar o seu arquivo `.exe`, basta rodar o seguinte comando:

```bash
npm run build
```

O instalador e o executável gerados estarão disponíveis dentro da pasta `dist/`.

## 📜 Licença

Este projeto está sob a licença [ISC](https://opensource.org/licenses/ISC).
